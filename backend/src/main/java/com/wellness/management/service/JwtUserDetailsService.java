package com.wellness.management.service;

import com.wellness.management.model.User;
import com.wellness.management.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public JwtUserDetailsService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Create authorities list with user's role
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
    
        authorities.add(new SimpleGrantedAuthority(user.getRole().toString())); // Add user's role as authority
        
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            authorities // Pass the authorities list instead of empty ArrayList
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