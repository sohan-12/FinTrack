package com.fintrack.dto;

import java.math.BigDecimal;

/**
 * UPI Payment Request DTO for sending money / merchant payment.
 */
public class UpiPaymentRequest {
    private String recipientUpiId;
    private String recipientName;
    private BigDecimal amount;
    private String category;
    private String note;
    private String senderUpiId;
    private String pin;

    public UpiPaymentRequest() {
    }

    public UpiPaymentRequest(String recipientUpiId, String recipientName, BigDecimal amount,
                             String category, String note, String senderUpiId, String pin) {
        this.recipientUpiId = recipientUpiId;
        this.recipientName = recipientName;
        this.amount = amount;
        this.category = category;
        this.note = note;
        this.senderUpiId = senderUpiId;
        this.pin = pin;
    }

    public String getRecipientUpiId() {
        return recipientUpiId;
    }

    public void setRecipientUpiId(String recipientUpiId) {
        this.recipientUpiId = recipientUpiId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getSenderUpiId() {
        return senderUpiId;
    }

    public void setSenderUpiId(String senderUpiId) {
        this.senderUpiId = senderUpiId;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }
}
