package com.fintrack.dto;

import java.time.LocalDateTime;

/**
 * Support Ticket Response DTO.
 */
public class SupportTicketResponse {
    private String ticketId;
    private String subject;
    private String category;
    private String priority;
    private String status;
    private String message;
    private String responseMessage;
    private LocalDateTime createdAt;

    public SupportTicketResponse() {
        this.createdAt = LocalDateTime.now();
    }

    public SupportTicketResponse(String ticketId, String subject, String category, String priority,
                                 String status, String message, String responseMessage, LocalDateTime createdAt) {
        this.ticketId = ticketId;
        this.subject = subject;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.message = message;
        this.responseMessage = responseMessage;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
