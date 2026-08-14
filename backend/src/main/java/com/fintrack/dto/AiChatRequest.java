package com.fintrack.dto;

/**
 * AI Chat Request DTO carrying the user's natural language question.
 */
public class AiChatRequest {
    private String message;

    public AiChatRequest() {
    }

    public AiChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
