package com.fintrack.dto;

import java.math.BigDecimal;

/**
 * Category Summary Response DTO for category-wise breakdown in pie charts and tables.
 */
public class CategorySummaryResponse {
    private String category;
    private BigDecimal totalAmount;
    private long transactionCount;
    private double percentage;

    public CategorySummaryResponse() {
    }

    public CategorySummaryResponse(String category, BigDecimal totalAmount, long transactionCount, double percentage) {
        this.category = category;
        this.totalAmount = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        this.transactionCount = transactionCount;
        this.percentage = percentage;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
