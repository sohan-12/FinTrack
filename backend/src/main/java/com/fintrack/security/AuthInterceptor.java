package com.fintrack.security;

import com.fintrack.exception.UnauthorizedException;
import com.fintrack.model.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Spring MVC HandlerInterceptor to intercept protected API requests,
 * validate JWT Bearer tokens, inject AuthenticatedUser context, and enforce Role permissions.
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public AuthInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Allow CORS pre-flight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String uri = request.getRequestURI();
        if (uri.endsWith("/api/auth/login") || uri.endsWith("/api/auth/register") || uri.endsWith("/api/auth/google") || uri.endsWith("/api/auth/send-otp")) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Authentication required. Please provide a valid Bearer token in the Authorization header.");
        }

        String token = authHeader.substring(7).trim();
        if (!jwtUtil.validateToken(token)) {
            throw new UnauthorizedException("Invalid or expired session token. Please log in again.");
        }

        Long userId = jwtUtil.extractUserId(token);
        String email = jwtUtil.extractEmail(token);
        Role role = jwtUtil.extractRole(token);

        AuthenticatedUser authenticatedUser = new AuthenticatedUser(userId, email, role);
        request.setAttribute("authenticatedUser", authenticatedUser);

        // Check for @RequireRole annotation on controller method or class
        if (handler instanceof HandlerMethod handlerMethod) {
            RequireRole requireRole = handlerMethod.getMethodAnnotation(RequireRole.class);
            if (requireRole == null) {
                requireRole = handlerMethod.getBeanType().getAnnotation(RequireRole.class);
            }

            if (requireRole != null) {
                Role required = requireRole.value();
                if (required == Role.ADMIN && role != Role.ADMIN) {
                    throw new UnauthorizedException("Access denied. You do not have the required administrator privileges.");
                }
            }
        }

        return true;
    }
}
