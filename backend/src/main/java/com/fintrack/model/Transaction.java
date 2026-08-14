package com.fintrack.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Transaction Entity representing an income or expense record.
 * Demonstrates OOP Encapsulation and strong typing.
 */
public class Transaction {
    private Long id;
    private Long userId;
    private TransactionType type;
    private BigDecimal amount;
    private String category;
    private String description;
    private LocalDate transactionDate;
    private LocalDateTime createdAt;

    public Transaction() {
    }

    public Transaction(Long id, Long userId, TransactionType type, BigDecimal amount,
                       String category, String description, LocalDate transactionDate, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.transactionDate = transactionDate != null ? transactionDate : LocalDate.now();
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public Transaction(Long userId, TransactionType type, BigDecimal amount,
                       String category, String description, LocalDate transactionDate) {
        this(null, userId, type, amount, category, description, transactionDate, LocalDateTime.now());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "id=" + id +
                ", userId=" + userId +
                ", type=" + type +
                ", amount=" + amount +
                ", category='" + category + '\'' +
                ", description='" + description + '\'' +
                ", transactionDate=" + transactionDate +
                ", createdAt=" + createdAt +
                '}';
    }
}
