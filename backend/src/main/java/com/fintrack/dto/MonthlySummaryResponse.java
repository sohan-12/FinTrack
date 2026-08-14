package com.fintrack.dto;

import java.math.BigDecimal;

/**
 * Monthly Summary Response DTO for monthly spending trends and comparisons in bar/line charts.
 */
public class MonthlySummaryResponse {
    private String month;
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal netSavings;

    public MonthlySummaryResponse() {
        this.income = BigDecimal.ZERO;
        this.expense = BigDecimal.ZERO;
        this.netSavings = BigDecimal.ZERO;
    }

    public MonthlySummaryResponse(String month, BigDecimal income, BigDecimal expense, BigDecimal netSavings) {
        this.month = month;
        this.income = income != null ? income : BigDecimal.ZERO;
        this.expense = expense != null ? expense : BigDecimal.ZERO;
        this.netSavings = netSavings != null ? netSavings : BigDecimal.ZERO;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public BigDecimal getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(BigDecimal netSavings) {
        this.netSavings = netSavings;
    }
}
