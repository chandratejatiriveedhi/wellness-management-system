package com.wellness.management.service;

import com.wellness.management.model.User;
import com.wellness.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getFilteredUsers(String username, String profile, String location) {
        List<User> users = userRepository.findAll();
        
        return users.stream()
            .filter(user -> username == null || user.getUsername().toLowerCase().contains(username.toLowerCase()))
            .filter(user -> profile == null || user.getRole().name().equals(profile))
            .filter(user -> location == null || 
                    (user.getLocation() != null && 
                     user.getLocation().toLowerCase().contains(location.toLowerCase())))
            .collect(Collectors.toList());
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        // Don't update username as it's the unique identifier
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setLocation(userDetails.getLocation());
        
        // Only update password if it's provided in the request
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}