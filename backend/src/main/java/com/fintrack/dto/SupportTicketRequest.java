package com.fintrack.dto;

import java.time.LocalDateTime;

/**
 * Support Ticket Request DTO.
 */
public class SupportTicketRequest {
    private String subject;
    private String category;
    private String priority;
    private String message;

    public SupportTicketRequest() {
    }

    public SupportTicketRequest(String subject, String category, String priority, String message) {
        this.subject = subject;
        this.category = category;
        this.priority = priority;
        this.message = message;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
