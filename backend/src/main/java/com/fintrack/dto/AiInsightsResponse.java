package com.fintrack.dto;

import java.util.List;

/**
 * AI Insights Response DTO summarizing key financial highlights and savings suggestions for the dashboard.
 */
public class AiInsightsResponse {
    private String spendingSummary;
    private String topSpendingCategory;
    private List<String> unusualExpenses;
    private List<String> savingsSuggestions;
    private String healthScore;
    private boolean aiGenerated;

    public AiInsightsResponse() {
    }

    public AiInsightsResponse(String spendingSummary, String topSpendingCategory,
                              List<String> unusualExpenses, List<String> savingsSuggestions,
                              String healthScore, boolean aiGenerated) {
        this.spendingSummary = spendingSummary;
        this.topSpendingCategory = topSpendingCategory;
        this.unusualExpenses = unusualExpenses;
        this.savingsSuggestions = savingsSuggestions;
        this.healthScore = healthScore;
        this.aiGenerated = aiGenerated;
    }

    public String getSpendingSummary() {
        return spendingSummary;
    }

    public void setSpendingSummary(String spendingSummary) {
        this.spendingSummary = spendingSummary;
    }

    public String getTopSpendingCategory() {
        return topSpendingCategory;
    }

    public void setTopSpendingCategory(String topSpendingCategory) {
        this.topSpendingCategory = topSpendingCategory;
    }

    public List<String> getUnusualExpenses() {
        return unusualExpenses;
    }

    public void setUnusualExpenses(List<String> unusualExpenses) {
        this.unusualExpenses = unusualExpenses;
    }

    public List<String> getSavingsSuggestions() {
        return savingsSuggestions;
    }

    public void setSavingsSuggestions(List<String> savingsSuggestions) {
        this.savingsSuggestions = savingsSuggestions;
    }

    public String getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(String healthScore) {
        this.healthScore = healthScore;
    }

    public boolean isAiGenerated() {
        return aiGenerated;
    }

    public void setAiGenerated(boolean aiGenerated) {
        this.aiGenerated = aiGenerated;
    }
}
