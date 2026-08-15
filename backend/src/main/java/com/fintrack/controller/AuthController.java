package com.fintrack.controller;

import com.fintrack.dto.AuthRequest;
import com.fintrack.dto.AuthResponse;
import com.fintrack.dto.GoogleAuthRequest;
import com.fintrack.dto.RegisterRequest;
import com.fintrack.dto.UserResponse;
import com.fintrack.security.AuthenticatedUser;
import com.fintrack.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication REST Controller.
 * Handles standard registration, credential login, Google OAuth 2.0, and session verification.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<java.util.Map<String, String>> sendOtp(@RequestBody java.util.Map<String, String> body) {
        String email = body.get("email");
        String otp = authService.generateRegistrationOtp(email);
        java.util.Map<String, String> res = new java.util.HashMap<>();
        res.put("message", "A 6-digit verification code has been sent to " + email);
        res.put("sandboxOtp", otp);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
        AuthResponse response = authService.googleLogin(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(HttpServletRequest request) {
        AuthenticatedUser authUser = (AuthenticatedUser) request.getAttribute("authenticatedUser");
        if (authUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserResponse user = authService.getCurrentUser(authUser.getId());
        return ResponseEntity.ok(user);
    }

    @org.springframework.web.bind.annotation.PutMapping("/password")
    public ResponseEntity<java.util.Map<String, String>> updatePassword(@RequestBody java.util.Map<String, String> body, HttpServletRequest request) {
        AuthenticatedUser authUser = (AuthenticatedUser) request.getAttribute("authenticatedUser");
        if (authUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String newPassword = body.get("password");
        authService.updatePassword(authUser.getId(), newPassword);
        java.util.Map<String, String> res = new java.util.HashMap<>();
        res.put("message", "Password updated successfully! You can now sign in using either Google OAuth or your Email & Password.");
        return ResponseEntity.ok(res);
    }
}
