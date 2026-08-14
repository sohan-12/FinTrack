package com.fintrack.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * UPI Sync Response DTO for automated import of UPI bank feeds.
 */
public class UpiSyncResponse {
    private int syncedCount;
    private BigDecimal totalAmount;
    private List<TransactionResponse> newTransactions;
    private String message;

    public UpiSyncResponse() {
    }

    public UpiSyncResponse(int syncedCount, BigDecimal totalAmount, List<TransactionResponse> newTransactions, String message) {
        this.syncedCount = syncedCount;
        this.totalAmount = totalAmount;
        this.newTransactions = newTransactions;
        this.message = message;
    }

    public int getSyncedCount() {
        return syncedCount;
    }

    public void setSyncedCount(int syncedCount) {
        this.syncedCount = syncedCount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<TransactionResponse> getNewTransactions() {
        return newTransactions;
    }

    public void setNewTransactions(List<TransactionResponse> newTransactions) {
        this.newTransactions = newTransactions;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
