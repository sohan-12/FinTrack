package com.fintrack.dto;

import com.fintrack.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Transaction Request DTO for creating and updating transactions.
 */
public class TransactionRequest {
    private TransactionType type;
    private BigDecimal amount;
    private String category;
    private String description;
    private LocalDate transactionDate;

    public TransactionRequest() {
    }

    public TransactionRequest(TransactionType type, BigDecimal amount, String category,
                              String description, LocalDate transactionDate) {
        this.type = type;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.transactionDate = transactionDate;
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
}
