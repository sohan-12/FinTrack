package com.fintrack.repository;

import com.fintrack.model.Role;
import com.fintrack.model.User;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface implementation using Spring JdbcTemplate.
 * Executes raw SQL queries and maps result sets directly to User objects.
 */
@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> new User(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getString("email"),
            rs.getString("password"),
            Role.valueOf(rs.getString("role")),
            rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null
    );

    public User save(User user) {
        String sql = "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?) RETURNING id";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail().toLowerCase().trim());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getRole().name());
            ps.setTimestamp(5, Timestamp.valueOf(user.getCreatedAt()));
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            user.setId(keyHolder.getKey().longValue());
        }
        return user;
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT id, name, email, password, role, created_at FROM users WHERE id = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<User> findByEmail(String email) {
        String sql = "SELECT id, name, email, password, role, created_at FROM users WHERE LOWER(email) = LOWER(?)";
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, email.trim());
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE LOWER(email) = LOWER(?)";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email.trim());
        return count != null && count > 0;
    }

    public List<User> findAll() {
        String sql = "SELECT id, name, email, password, role, created_at FROM users ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    public List<User> findRecent(int limit) {
        String sql = "SELECT id, name, email, password, role, created_at FROM users ORDER BY created_at DESC LIMIT ?";
        return jdbcTemplate.query(sql, userRowMapper, limit);
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM users";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0L;
    }
}
