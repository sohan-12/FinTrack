package com.fintrack.repository;

import com.fintrack.dto.CategorySummaryResponse;
import com.fintrack.dto.FinancialSummaryResponse;
import com.fintrack.dto.MonthlySummaryResponse;
import com.fintrack.model.Transaction;
import com.fintrack.model.TransactionType;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * Transaction Repository providing full CRUD, dynamic query filtering,
 * and high-performance financial aggregations using PostgreSQL SQL and JdbcTemplate.
 */
@Repository
public class TransactionRepository {

    private final JdbcTemplate jdbcTemplate;

    public TransactionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Transaction> transactionRowMapper = (rs, rowNum) -> new Transaction(
            rs.getLong("id"),
            rs.getLong("user_id"),
            TransactionType.valueOf(rs.getString("type")),
            rs.getBigDecimal("amount"),
            rs.getString("category"),
            rs.getString("description"),
            rs.getDate("transaction_date") != null ? rs.getDate("transaction_date").toLocalDate() : null,
            rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null
    );

    public Transaction save(Transaction tx) {
        String sql = "INSERT INTO transactions (user_id, type, amount, category, description, transaction_date, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, tx.getUserId());
            ps.setString(2, tx.getType().name());
            ps.setBigDecimal(3, tx.getAmount());
            ps.setString(4, tx.getCategory());
            ps.setString(5, tx.getDescription());
            ps.setDate(6, Date.valueOf(tx.getTransactionDate()));
            ps.setTimestamp(7, Timestamp.valueOf(tx.getCreatedAt()));
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            tx.setId(keyHolder.getKey().longValue());
        }
        return tx;
    }

    public Optional<Transaction> findByIdAndUserId(Long id, Long userId) {
        String sql = "SELECT id, user_id, type, amount, category, description, transaction_date, created_at " +
                     "FROM transactions WHERE id = ? AND user_id = ?";
        try {
            Transaction tx = jdbcTemplate.queryForObject(sql, transactionRowMapper, id, userId);
            return Optional.ofNullable(tx);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<Transaction> findById(Long id) {
        String sql = "SELECT id, user_id, type, amount, category, description, transaction_date, created_at " +
                     "FROM transactions WHERE id = ?";
        try {
            Transaction tx = jdbcTemplate.queryForObject(sql, transactionRowMapper, id);
            return Optional.ofNullable(tx);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public boolean update(Transaction tx) {
        String sql = "UPDATE transactions SET type = ?, amount = ?, category = ?, description = ?, transaction_date = ? " +
                     "WHERE id = ? AND user_id = ?";
        int updatedRows = jdbcTemplate.update(sql,
                tx.getType().name(),
                tx.getAmount(),
                tx.getCategory(),
                tx.getDescription(),
                Date.valueOf(tx.getTransactionDate()),
                tx.getId(),
                tx.getUserId()
        );
        return updatedRows > 0;
    }

    public boolean deleteByIdAndUserId(Long id, Long userId) {
        String sql = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
        int rows = jdbcTemplate.update(sql, id, userId);
        return rows > 0;
    }

    public List<Transaction> findByUserWithFilters(Long userId, TransactionType type, String category,
                                                  LocalDate startDate, LocalDate endDate,
                                                  BigDecimal minAmount, BigDecimal maxAmount,
                                                  String search, String sortBy, String sortDir,
                                                  int limit, int offset) {
        StringBuilder sql = new StringBuilder("SELECT id, user_id, type, amount, category, description, transaction_date, created_at FROM transactions WHERE user_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(userId);

        applyFilters(sql, params, type, category, startDate, endDate, minAmount, maxAmount, search);

        // Sorting
        String validSortBy = "transaction_date";
        if ("amount".equalsIgnoreCase(sortBy)) validSortBy = "amount";
        else if ("category".equalsIgnoreCase(sortBy)) validSortBy = "category";
        else if ("type".equalsIgnoreCase(sortBy)) validSortBy = "type";
        else if ("id".equalsIgnoreCase(sortBy)) validSortBy = "id";

        String validSortDir = "ASC".equalsIgnoreCase(sortDir) ? "ASC" : "DESC";
        sql.append(" ORDER BY ").append(validSortBy).append(" ").append(validSortDir).append(", id DESC");

        // Pagination
        if (limit > 0) {
            sql.append(" LIMIT ? OFFSET ?");
            params.add(limit);
            params.add(offset);
        }

        return jdbcTemplate.query(sql.toString(), transactionRowMapper, params.toArray());
    }

    public long countByUserWithFilters(Long userId, TransactionType type, String category,
                                       LocalDate startDate, LocalDate endDate,
                                       BigDecimal minAmount, BigDecimal maxAmount, String search) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM transactions WHERE user_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(userId);

        applyFilters(sql, params, type, category, startDate, endDate, minAmount, maxAmount, search);

        Long count = jdbcTemplate.queryForObject(sql.toString(), Long.class, params.toArray());
        return count != null ? count : 0L;
    }

    private void applyFilters(StringBuilder sql, List<Object> params, TransactionType type, String category,
                              LocalDate startDate, LocalDate endDate, BigDecimal minAmount,
                              BigDecimal maxAmount, String search) {
        if (type != null) {
            sql.append(" AND type = ?");
            params.add(type.name());
        }
        if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category.trim())) {
            sql.append(" AND LOWER(category) = LOWER(?)");
            params.add(category.trim());
        }
        if (startDate != null) {
            sql.append(" AND transaction_date >= ?");
            params.add(Date.valueOf(startDate));
        }
        if (endDate != null) {
            sql.append(" AND transaction_date <= ?");
            params.add(Date.valueOf(endDate));
        }
        if (minAmount != null) {
            sql.append(" AND amount >= ?");
            params.add(minAmount);
        }
        if (maxAmount != null) {
            sql.append(" AND amount <= ?");
            params.add(maxAmount);
        }
        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (LOWER(description) LIKE ? OR LOWER(category) LIKE ?)");
            String pattern = "%" + search.trim().toLowerCase() + "%";
            params.add(pattern);
            params.add(pattern);
        }
    }

    public FinancialSummaryResponse getFinancialSummary(Long userId) {
        String sql = "SELECT " +
                "COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS total_income, " +
                "COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS total_expenses, " +
                "COUNT(*) AS total_count, " +
                "COALESCE(MAX(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS largest_expense " +
                "FROM transactions WHERE user_id = ?";

        FinancialSummaryResponse summary = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            BigDecimal totalIncome = rs.getBigDecimal("total_income");
            BigDecimal totalExpenses = rs.getBigDecimal("total_expenses");
            BigDecimal balance = totalIncome.subtract(totalExpenses);
            long count = rs.getLong("total_count");
            BigDecimal largestExp = rs.getBigDecimal("largest_expense");
            return new FinancialSummaryResponse(totalIncome, totalExpenses, balance, count, largestExp, "None");
        }, userId);

        if (summary == null) {
            summary = new FinancialSummaryResponse();
        }

        // Get top spending category
        String topCategorySql = "SELECT category FROM transactions WHERE user_id = ? AND type = 'EXPENSE' " +
                "GROUP BY category ORDER BY SUM(amount) DESC LIMIT 1";
        try {
            String topCategory = jdbcTemplate.queryForObject(topCategorySql, String.class, userId);
            if (topCategory != null) {
                summary.setTopSpendingCategory(topCategory);
            }
        } catch (EmptyResultDataAccessException ignored) {
        }

        return summary;
    }

    public List<CategorySummaryResponse> getCategorySummaries(Long userId) {
        String totalExpenseSql = "SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE user_id = ? AND type = 'EXPENSE'";
        BigDecimal totalExpense = jdbcTemplate.queryForObject(totalExpenseSql, BigDecimal.class, userId);
        if (totalExpense == null || totalExpense.compareTo(BigDecimal.ZERO) <= 0) {
            totalExpense = BigDecimal.ZERO;
        }

        String sql = "SELECT category, SUM(amount) AS total_amount, COUNT(*) AS tx_count " +
                     "FROM transactions WHERE user_id = ? AND type = 'EXPENSE' " +
                     "GROUP BY category ORDER BY total_amount DESC";

        final BigDecimal finalTotal = totalExpense;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            String category = rs.getString("category");
            BigDecimal amount = rs.getBigDecimal("total_amount");
            long count = rs.getLong("tx_count");
            double percentage = 0.0;
            if (finalTotal.compareTo(BigDecimal.ZERO) > 0) {
                percentage = amount.divide(finalTotal, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
                percentage = Math.round(percentage * 10.0) / 10.0;
            }
            return new CategorySummaryResponse(category, amount, count, percentage);
        }, userId);
    }

    public List<MonthlySummaryResponse> getMonthlySummaries(Long userId, int limitMonths) {
        String sql = "SELECT TO_CHAR(transaction_date, 'YYYY-MM') AS month_key, " +
                     "COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS monthly_income, " +
                     "COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS monthly_expense " +
                     "FROM transactions WHERE user_id = ? " +
                     "GROUP BY month_key ORDER BY month_key DESC LIMIT ?";

        List<MonthlySummaryResponse> list = jdbcTemplate.query(sql, (rs, rowNum) -> {
            String month = rs.getString("month_key");
            BigDecimal income = rs.getBigDecimal("monthly_income");
            BigDecimal expense = rs.getBigDecimal("monthly_expense");
            BigDecimal savings = income.subtract(expense);
            return new MonthlySummaryResponse(month, income, expense, savings);
        }, userId, limitMonths);

        // Reverse to return in chronological order (oldest to newest)
        Collections.reverse(list);
        return list;
    }

    public List<Transaction> findAllByUserId(Long userId) {
        String sql = "SELECT id, user_id, type, amount, category, description, transaction_date, created_at " +
                     "FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC, id DESC";
        return jdbcTemplate.query(sql, transactionRowMapper, userId);
    }

    public List<Transaction> findAllForAdmin(int limit, int offset) {
        String sql = "SELECT id, user_id, type, amount, category, description, transaction_date, created_at " +
                     "FROM transactions ORDER BY transaction_date DESC, id DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, transactionRowMapper, limit, offset);
    }

    public long countAll() {
        String sql = "SELECT COUNT(*) FROM transactions";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0L;
    }

    public BigDecimal getSystemTotalIncome() {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'INCOME'";
        BigDecimal total = jdbcTemplate.queryForObject(sql, BigDecimal.class);
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getSystemTotalExpenses() {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'EXPENSE'";
        BigDecimal total = jdbcTemplate.queryForObject(sql, BigDecimal.class);
        return total != null ? total : BigDecimal.ZERO;
    }
}
