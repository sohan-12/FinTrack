package com.fintrack.dto;

import java.time.LocalDateTime;

/**
 * AI Chat Response DTO returning Gemini's generated response to the user.
 */
public class AiChatResponse {
    private String reply;
    private LocalDateTime timestamp;
    private boolean aiGenerated;

    public AiChatResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public AiChatResponse(String reply, boolean aiGenerated) {
        this.reply = reply;
        this.aiGenerated = aiGenerated;
        this.timestamp = LocalDateTime.now();
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isAiGenerated() {
        return aiGenerated;
    }

    public void setAiGenerated(boolean aiGenerated) {
        this.aiGenerated = aiGenerated;
    }
}
