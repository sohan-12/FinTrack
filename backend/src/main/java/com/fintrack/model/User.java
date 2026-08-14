package com.fintrack.model;

import java.time.LocalDateTime;

/**
 * User Entity representing an authenticated platform user or admin.
 * Follows Java OOP encapsulation principles with private fields,
 * constructors, and standard getters/setters.
 */
public class User {
    private Long id;
    private String name;
    private String email;
    private String password;
    private Role role;
    private LocalDateTime createdAt;

    public User() {
    }

    public User(Long id, String name, String email, String password, Role role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role != null ? role : Role.USER;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public User(String name, String email, String password, Role role) {
        this(null, name, email, password, role, LocalDateTime.now());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", createdAt=" + createdAt +
                '}';
    }
}
