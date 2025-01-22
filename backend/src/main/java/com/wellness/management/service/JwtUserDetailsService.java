package com.wellness.management.service;

import com.wellness.management.model.User;
import com.wellness.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.UUID;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            new ArrayList<>()
        );
    }

    public void resetPassword(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        // Generate a temporary password
        String temporaryPassword = UUID.randomUUID().toString().substring(0, 8);
        
        // Update user's password
        user.setPassword(passwordEncoder.encode(temporaryPassword));
        userRepository.save(user);
        
        // In a real application, you would want to notify the user of their temporary password
        // For now, we'll just print it to the console for demonstration
        System.out.println("Temporary password for " + username + ": " + temporaryPassword);
    }
}