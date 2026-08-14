package com.fintrack.dto;

import java.math.BigDecimal;

/**
 * Financial Summary Response DTO containing high-level dashboard metrics.
 */
public class FinancialSummaryResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal currentBalance;
    private long transactionCount;
    private BigDecimal largestExpense;
    private String topSpendingCategory;

    public FinancialSummaryResponse() {
        this.totalIncome = BigDecimal.ZERO;
        this.totalExpenses = BigDecimal.ZERO;
        this.currentBalance = BigDecimal.ZERO;
        this.transactionCount = 0;
        this.largestExpense = BigDecimal.ZERO;
        this.topSpendingCategory = "None";
    }

    public FinancialSummaryResponse(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal currentBalance,
                                    long transactionCount, BigDecimal largestExpense, String topSpendingCategory) {
        this.totalIncome = totalIncome != null ? totalIncome : BigDecimal.ZERO;
        this.totalExpenses = totalExpenses != null ? totalExpenses : BigDecimal.ZERO;
        this.currentBalance = currentBalance != null ? currentBalance : BigDecimal.ZERO;
        this.transactionCount = transactionCount;
        this.largestExpense = largestExpense != null ? largestExpense : BigDecimal.ZERO;
        this.topSpendingCategory = topSpendingCategory != null ? topSpendingCategory : "None";
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(BigDecimal currentBalance) {
        this.currentBalance = currentBalance;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public BigDecimal getLargestExpense() {
        return largestExpense;
    }

    public void setLargestExpense(BigDecimal largestExpense) {
        this.largestExpense = largestExpense;
    }

    public String getTopSpendingCategory() {
        return topSpendingCategory;
    }

    public void setTopSpendingCategory(String topSpendingCategory) {
        this.topSpendingCategory = topSpendingCategory;
    }
}
