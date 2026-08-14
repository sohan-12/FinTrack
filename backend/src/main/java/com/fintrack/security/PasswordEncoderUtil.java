package com.fintrack.security;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Component;

/**
 * BCrypt Password Hashing and Verification Utility.
 * Provides slow hashing with automatic salt generation to protect passwords against brute-force attacks.
 */
@Component
public class PasswordEncoderUtil {

    private static final int LOG_ROUNDS = 10;

    /**
     * Hash a raw plaintext password using BCrypt.
     */
    public String encode(String rawPassword) {
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        return BCrypt.hashpw(rawPassword, BCrypt.gensalt(LOG_ROUNDS));
    }

    /**
     * Compare a raw plaintext password against a stored BCrypt hash.
     */
    public boolean matches(String rawPassword, String hashedPassword) {
        if (rawPassword == null || hashedPassword == null) {
            return false;
        }
        try {
            return BCrypt.checkpw(rawPassword, hashedPassword);
        } catch (Exception e) {
            return false;
        }
    }
}
