package com.fintrack.service;

import com.fintrack.dto.AuthRequest;
import com.fintrack.dto.AuthResponse;
import com.fintrack.dto.GoogleAuthRequest;
import com.fintrack.dto.RegisterRequest;
import com.fintrack.dto.UserResponse;
import com.fintrack.exception.BadRequestException;
import com.fintrack.exception.DuplicateResourceException;
import com.fintrack.exception.ResourceNotFoundException;
import com.fintrack.exception.UnauthorizedException;
import com.fintrack.model.Role;
import com.fintrack.model.User;
import com.fintrack.repository.UserRepository;
import com.fintrack.security.JwtUtil;
import com.fintrack.security.PasswordEncoderUtil;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Authentication and User Service implementing standard registration, login,
 * Google OAuth 2.0 provisioning, and JWT token issuance.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoderUtil passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoderUtil passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        if (req.getName() == null || req.getName().trim().isEmpty()) {
            throw new BadRequestException("Full name is required.");
        }
        if (req.getEmail() == null || !req.getEmail().contains("@")) {
            throw new BadRequestException("A valid email address is required.");
        }
        if (req.getPassword() == null || req.getPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long.");
        }
        if (req.getConfirmPassword() != null && !req.getPassword().equals(req.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match.");
        }

        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with email '" + email + "' already exists.");
        }

        String hashedPassword = passwordEncoder.encode(req.getPassword());
        User user = new User(req.getName().trim(), email, hashedPassword, Role.USER);
        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser);
        UserResponse userResponse = toUserResponse(savedUser);

        return new AuthResponse(token, userResponse, "Registration successful!");
    }

    public AuthResponse login(AuthRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            throw new BadRequestException("Email and password are required.");
        }

        String email = req.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        String token = jwtUtil.generateToken(user);
        UserResponse userResponse = toUserResponse(user);

        return new AuthResponse(token, userResponse, "Login successful!");
    }

    public AuthResponse googleLogin(GoogleAuthRequest req) {
        if (req.getEmail() == null || !req.getEmail().contains("@")) {
            throw new BadRequestException("Valid Google account email is required.");
        }

        String email = req.getEmail().trim().toLowerCase();
        String name = req.getName() != null && !req.getName().trim().isEmpty()
                ? req.getName().trim()
                : email.split("@")[0];

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            // Auto-provision Google user account
            String randomSecurePassword = UUID.randomUUID().toString();
            String hashedPassword = passwordEncoder.encode(randomSecurePassword);
            User newUser = new User(name, email, hashedPassword, Role.USER);
            return userRepository.save(newUser);
        });

        String token = jwtUtil.generateToken(user);
        UserResponse userResponse = toUserResponse(user);

        return new AuthResponse(token, userResponse, "Signed in with Google successfully!");
    }

    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return toUserResponse(user);
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
