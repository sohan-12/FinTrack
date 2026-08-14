package com.fintrack.controller;

import com.fintrack.dto.SupportTicketRequest;
import com.fintrack.dto.SupportTicketResponse;
import com.fintrack.security.AuthenticatedUser;
import com.fintrack.service.HelpSupportService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Help & Support REST Controller.
 * Provides endpoints for creating support tickets, viewing user tickets, and fetching FAQs.
 */
@RestController
@RequestMapping("/api/support")
public class HelpSupportController {

    private final HelpSupportService helpSupportService;

    public HelpSupportController(HelpSupportService helpSupportService) {
        this.helpSupportService = helpSupportService;
    }

    private AuthenticatedUser getAuthUser(HttpServletRequest request) {
        return (AuthenticatedUser) request.getAttribute("authenticatedUser");
    }

    @PostMapping("/tickets")
    public ResponseEntity<SupportTicketResponse> createTicket(@RequestBody SupportTicketRequest requestBody,
                                                             HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        SupportTicketResponse response = helpSupportService.createTicket(authUser.getId(), requestBody);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<SupportTicketResponse>> getUserTickets(HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        List<SupportTicketResponse> tickets = helpSupportService.getUserTickets(authUser.getId());
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/faqs")
    public ResponseEntity<List<Map<String, Object>>> getFaqs() {
        List<Map<String, Object>> faqs = helpSupportService.getFaqs();
        return ResponseEntity.ok(faqs);
    }
}
