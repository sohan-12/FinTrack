package com.fintrack.repository;

import com.fintrack.model.Category;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

/**
 * Category Repository for querying and managing spending and earning categories.
 */
@Repository
public class CategoryRepository {

    private final JdbcTemplate jdbcTemplate;

    public CategoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Category> categoryRowMapper = (rs, rowNum) -> new Category(
            rs.getLong("id"),
            rs.getString("name")
    );

    public Category save(Category category) {
        String sql = "INSERT INTO categories (name) VALUES (?) RETURNING id";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, category.getName().trim());
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            category.setId(keyHolder.getKey().longValue());
        }
        return category;
    }

    public List<Category> findAll() {
        String sql = "SELECT id, name FROM categories ORDER BY name ASC";
        return jdbcTemplate.query(sql, categoryRowMapper);
    }

    public Optional<Category> findById(Long id) {
        String sql = "SELECT id, name FROM categories WHERE id = ?";
        try {
            Category category = jdbcTemplate.queryForObject(sql, categoryRowMapper, id);
            return Optional.ofNullable(category);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<Category> findByName(String name) {
        String sql = "SELECT id, name FROM categories WHERE LOWER(name) = LOWER(?)";
        try {
            Category category = jdbcTemplate.queryForObject(sql, categoryRowMapper, name.trim());
            return Optional.ofNullable(category);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM categories";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0L;
    }
}
