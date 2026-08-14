package com.fintrack.security;

import com.fintrack.model.Role;
import com.fintrack.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT Utility class for creating, signing, parsing, and validating JSON Web Tokens.
 */
@Component
public class JwtUtil {

    private final Key signingKey;
    private final long expirationMs;

    public JwtUtil(@Value("${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}") String secret,
                   @Value("${jwt.expiration-ms:86400000}") long expirationMs) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    /**
     * Generate a signed JWT token containing user identity and role.
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("name", user.getName());
        claims.put("role", user.getRole().name());

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extract all claims from a JWT token.
     */
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Extract user ID from token claims.
     */
    public Long extractUserId(String token) {
        Claims claims = extractClaims(token);
        Object userIdObj = claims.get("userId");
        if (userIdObj instanceof Number) {
            return ((Number) userIdObj).longValue();
        } else if (userIdObj instanceof String) {
            return Long.parseLong((String) userIdObj);
        }
        return null;
    }

    /**
     * Extract email from token.
     */
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    /**
     * Extract user Role from token claims.
     */
    public Role extractRole(String token) {
        Claims claims = extractClaims(token);
        String roleStr = (String) claims.get("role");
        return roleStr != null ? Role.valueOf(roleStr) : Role.USER;
    }

    /**
     * Validate whether the token is correctly signed and not expired.
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = extractClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
