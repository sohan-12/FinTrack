package com.fintrack.controller;

import com.fintrack.dto.AiChatRequest;
import com.fintrack.dto.AiChatResponse;
import com.fintrack.dto.AiInsightsResponse;
import com.fintrack.security.AuthenticatedUser;
import com.fintrack.service.AiService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AI REST Controller for financial assistant chat and dashboard automated insights.
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    private AuthenticatedUser getAuthUser(HttpServletRequest request) {
        return (AuthenticatedUser) request.getAttribute("authenticatedUser");
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest requestBody, HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        AiChatResponse response = aiService.chat(authUser.getId(), requestBody.getMessage());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/insights")
    public ResponseEntity<AiInsightsResponse> getDashboardInsights(HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        AiInsightsResponse response = aiService.getDashboardInsights(authUser.getId());
        return ResponseEntity.ok(response);
    }
}
