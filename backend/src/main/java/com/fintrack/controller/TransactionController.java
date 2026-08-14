package com.fintrack.controller;

import com.fintrack.dto.CategorySummaryResponse;
import com.fintrack.dto.FinancialSummaryResponse;
import com.fintrack.dto.MessageResponse;
import com.fintrack.dto.MonthlySummaryResponse;
import com.fintrack.dto.TransactionRequest;
import com.fintrack.dto.TransactionResponse;
import com.fintrack.model.TransactionType;
import com.fintrack.security.AuthenticatedUser;
import com.fintrack.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Transaction REST Controller for user financial transaction management.
 */
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    private AuthenticatedUser getAuthUser(HttpServletRequest request) {
        return (AuthenticatedUser) request.getAttribute("authenticatedUser");
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@RequestBody TransactionRequest requestBody,
                                                               HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        TransactionResponse response = transactionService.createTransaction(authUser.getId(), requestBody);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTransactions(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "transaction_date") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        AuthenticatedUser authUser = getAuthUser(request);
        List<TransactionResponse> transactions = transactionService.getTransactions(
                authUser.getId(), type, category, startDate, endDate, minAmount, maxAmount, search, sortBy, sortDir, page, size
        );
        long totalElements = transactionService.countTransactions(
                authUser.getId(), type, category, startDate, endDate, minAmount, maxAmount, search
        );
        int totalPages = (int) Math.ceil((double) totalElements / size);

        Map<String, Object> response = new HashMap<>();
        response.put("content", transactions);
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", totalElements);
        response.put("totalPages", totalPages);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable Long id,
                                                                 HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        TransactionResponse tx = transactionService.getTransactionById(id, authUser.getId());
        return ResponseEntity.ok(tx);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(@PathVariable Long id,
                                                                 @RequestBody TransactionRequest requestBody,
                                                                 HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        TransactionResponse updated = transactionService.updateTransaction(id, authUser.getId(), requestBody);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteTransaction(@PathVariable Long id,
                                                             HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        transactionService.deleteTransaction(id, authUser.getId());
        return ResponseEntity.ok(new MessageResponse("Transaction deleted successfully"));
    }

    @GetMapping("/summary")
    public ResponseEntity<FinancialSummaryResponse> getFinancialSummary(HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        FinancialSummaryResponse summary = transactionService.getFinancialSummary(authUser.getId());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/category-summary")
    public ResponseEntity<List<CategorySummaryResponse>> getCategorySummary(HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        List<CategorySummaryResponse> list = transactionService.getCategorySummaries(authUser.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<List<MonthlySummaryResponse>> getMonthlySummary(HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        List<MonthlySummaryResponse> list = transactionService.getMonthlySummaries(authUser.getId());
        return ResponseEntity.ok(list);
    }
}
