package com.fintrack.controller;

import com.fintrack.dto.AdminStatsResponse;
import com.fintrack.dto.TransactionResponse;
import com.fintrack.dto.UserResponse;
import com.fintrack.model.Role;
import com.fintrack.security.RequireRole;
import com.fintrack.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin REST Controller for administrative oversight, user inspection, and system metrics.
 * Secured with @RequireRole(Role.ADMIN).
 */
@RestController
@RequestMapping("/api/admin")
@RequireRole(Role.ADMIN)
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}/portfolio")
    public ResponseEntity<Map<String, Object>> getUserPortfolio(@PathVariable Long id) {
        Map<String, Object> portfolio = adminService.getUserPortfolio(id);
        return ResponseEntity.ok(portfolio);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<TransactionResponse> transactions = adminService.getAllTransactions(page, size);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getSystemStats() {
        AdminStatsResponse stats = adminService.getSystemStats();
        return ResponseEntity.ok(stats);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "User and associated records deleted successfully from database.");
        return ResponseEntity.ok(res);
    }
}
