package com.fintrack.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Admin Statistics Response DTO providing comprehensive overview for administrator.
 */
public class AdminStatsResponse {
    private long totalUsers;
    private long totalTransactions;
    private BigDecimal totalSystemIncome;
    private BigDecimal totalSystemExpenses;
    private List<UserResponse> recentUsers;
    private List<TransactionResponse> recentTransactions;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalUsers, long totalTransactions, BigDecimal totalSystemIncome,
                              BigDecimal totalSystemExpenses, List<UserResponse> recentUsers,
                              List<TransactionResponse> recentTransactions) {
        this.totalUsers = totalUsers;
        this.totalTransactions = totalTransactions;
        this.totalSystemIncome = totalSystemIncome != null ? totalSystemIncome : BigDecimal.ZERO;
        this.totalSystemExpenses = totalSystemExpenses != null ? totalSystemExpenses : BigDecimal.ZERO;
        this.recentUsers = recentUsers;
        this.recentTransactions = recentTransactions;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public BigDecimal getTotalSystemIncome() {
        return totalSystemIncome;
    }

    public void setTotalSystemIncome(BigDecimal totalSystemIncome) {
        this.totalSystemIncome = totalSystemIncome;
    }

    public BigDecimal getTotalSystemExpenses() {
        return totalSystemExpenses;
    }

    public void setTotalSystemExpenses(BigDecimal totalSystemExpenses) {
        this.totalSystemExpenses = totalSystemExpenses;
    }

    public List<UserResponse> getRecentUsers() {
        return recentUsers;
    }

    public void setRecentUsers(List<UserResponse> recentUsers) {
        this.recentUsers = recentUsers;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionResponse> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}
