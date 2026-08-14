package com.fintrack.security;

import com.fintrack.model.Role;

/**
 * Context object holding authenticated user identity for the current request.
 */
public class AuthenticatedUser {
    private Long id;
    private String email;
    private Role role;

    public AuthenticatedUser() {
    }

    public AuthenticatedUser(Long id, String email, Role role) {
        this.id = id;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isAdmin() {
        return Role.ADMIN.equals(this.role);
    }
}
