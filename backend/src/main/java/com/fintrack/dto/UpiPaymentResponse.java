package com.fintrack.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * UPI Payment Response DTO confirming execution of a UPI transaction.
 */
public class UpiPaymentResponse {
    private String status;
    private String upiRefId;
    private Long transactionId;
    private BigDecimal amount;
    private String recipientName;
    private String recipientUpiId;
    private String category;
    private LocalDateTime timestamp;
    private BigDecimal remainingBalance;
    private String message;

    public UpiPaymentResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public UpiPaymentResponse(String status, String upiRefId, Long transactionId, BigDecimal amount,
                              String recipientName, String recipientUpiId, String category,
                              BigDecimal remainingBalance, String message) {
        this.status = status;
        this.upiRefId = upiRefId;
        this.transactionId = transactionId;
        this.amount = amount;
        this.recipientName = recipientName;
        this.recipientUpiId = recipientUpiId;
        this.category = category;
        this.remainingBalance = remainingBalance;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUpiRefId() {
        return upiRefId;
    }

    public void setUpiRefId(String upiRefId) {
        this.upiRefId = upiRefId;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientUpiId() {
        return recipientUpiId;
    }

    public void setRecipientUpiId(String recipientUpiId) {
        this.recipientUpiId = recipientUpiId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public BigDecimal getRemainingBalance() {
        return remainingBalance;
    }

    public void setRemainingBalance(BigDecimal remainingBalance) {
        this.remainingBalance = remainingBalance;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
