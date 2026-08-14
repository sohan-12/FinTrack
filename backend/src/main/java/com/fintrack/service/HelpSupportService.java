package com.fintrack.service;

import com.fintrack.dto.SupportTicketRequest;
import com.fintrack.dto.SupportTicketResponse;
import com.fintrack.exception.BadRequestException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Help & Customer Support Service.
 * Manages user support tickets, categorized FAQs, and automated resolution bots.
 */
@Service
public class HelpSupportService {

    private final Random random = new Random();
    private final Map<Long, List<SupportTicketResponse>> userTicketsRegistry = new ConcurrentHashMap<>();

    public SupportTicketResponse createTicket(Long userId, SupportTicketRequest req) {
        if (req.getSubject() == null || req.getSubject().trim().isEmpty()) {
            throw new BadRequestException("Ticket subject is required.");
        }
        if (req.getMessage() == null || req.getMessage().trim().isEmpty()) {
            throw new BadRequestException("Ticket message details are required.");
        }

        String ticketId = "FT-" + (1000 + random.nextInt(9000));
        String category = req.getCategory() != null && !req.getCategory().isEmpty() ? req.getCategory() : "General";
        String priority = req.getPriority() != null && !req.getPriority().isEmpty() ? req.getPriority() : "Medium";

        String autoReply = generateIntelligentSupportReply(req.getSubject(), req.getMessage(), category);

        SupportTicketResponse ticket = new SupportTicketResponse(
                ticketId,
                req.getSubject().trim(),
                category,
                priority,
                "RESOLVED",
                req.getMessage().trim(),
                autoReply,
                LocalDateTime.now()
        );

        userTicketsRegistry.computeIfAbsent(userId, id -> new ArrayList<>()).add(0, ticket);
        return ticket;
    }

    public List<SupportTicketResponse> getUserTickets(Long userId) {
        List<SupportTicketResponse> tickets = userTicketsRegistry.get(userId);
        if (tickets == null || tickets.isEmpty()) {
            // Seed 1 default sample ticket
            List<SupportTicketResponse> initial = new ArrayList<>();
            initial.add(new SupportTicketResponse(
                    "FT-8921",
                    "How do I sync my Google Pay & PhonePe transactions?",
                    "UPI & Banking",
                    "Medium",
                    "RESOLVED",
                    "I want to know how the automatic bank feed synchronization works.",
                    "Hi! You can navigate to the 'UPI & Banking' tab and click 'Sync All Connected Apps Now' to instantly fetch your latest statements. You can also connect Paytm, CRED, and Amazon Pay with 4-digit SMS OTP verification.",
                    LocalDateTime.now().minusDays(1)
            ));
            userTicketsRegistry.put(userId, initial);
            return initial;
        }
        return tickets;
    }

    public List<Map<String, Object>> getFaqs() {
        List<Map<String, Object>> faqs = new ArrayList<>();

        Map<String, Object> f1 = new HashMap<>();
        f1.put("id", 1);
        f1.put("category", "UPI & Banking");
        f1.put("question", "How does FinTrack connect with UPI apps like Google Pay and PhonePe?");
        f1.put("answer", "FinTrack simulates an RBI-approved Account Aggregator protocol. You can link apps using your mobile number and 4-digit SMS OTP to automatically fetch and categorize all transactions.");
        faqs.add(f1);

        Map<String, Object> f2 = new HashMap<>();
        f2.put("id", 2);
        f2.put("category", "AI Financial Advisor");
        f2.put("question", "How does FinTrack AI calculate whether I can afford a car or career break?");
        f2.put("answer", "FinTrack AI queries your live PostgreSQL database to calculate your liquid balance, essential burn rate (rent + food + utilities), and applies the 20/4/10 rule for vehicles and 3-month emergency fund protection.");
        faqs.add(f2);

        Map<String, Object> f3 = new HashMap<>();
        f3.put("id", 3);
        f3.put("category", "Data Security");
        f3.put("question", "Is my financial transaction data secure?");
        f3.put("answer", "Yes. All requests are authenticated via stateless HMAC-SHA256 JWT tokens. Passwords are encrypted using BCrypt, and all database queries are isolated strictly by your user ID.");
        faqs.add(f3);

        Map<String, Object> f4 = new HashMap<>();
        f4.put("id", 4);
        f4.put("category", "Exports & Reports");
        f4.put("question", "Can I export my transactions for tax filing or spreadsheets?");
        f4.put("answer", "Yes! Go to the 'Transactions' page and click 'Export CSV' to download your complete transaction ledger as an Excel-compatible spreadsheet.");
        faqs.add(f4);

        return faqs;
    }

    private String generateIntelligentSupportReply(String subject, String message, String category) {
        String combined = (subject + " " + message + " " + category).toLowerCase();
        if (combined.contains("upi") || combined.contains("payment") || combined.contains("gpay") || combined.contains("phonepe") || combined.contains("paytm")) {
            return "Thank you for reaching out. For UPI issues, ensure your UPI ID contains a valid VPA handle (e.g. name@okhdfcbank). You can manage app connections and re-authenticate via the UPI & Banking tab.";
        }
        if (combined.contains("delete") || combined.contains("edit") || combined.contains("transaction")) {
            return "You can edit or delete any transaction anytime by navigating to 'Transactions' or 'Dashboard' and clicking the orange Edit or red Delete icons in the Actions column.";
        }
        if (combined.contains("ai") || combined.contains("advisor") || combined.contains("chat")) {
            return "FinTrack AI is trained on 25+ financial scenarios. Ask specific questions like 'Can I buy a car now?', 'How much can I manage if I quit my job for 3 months?', or 'Give me a 50/30/20 budget breakdown'.";
        }
        return "Thank you for submitting ticket. Our automated FinTrack Support System has verified your request and logged your feedback. If further assistance is needed, our support team is available 24/7 at support@fintrack.com.";
    }
}
