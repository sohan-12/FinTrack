package com.fintrack.service;

import com.fintrack.dto.AdminStatsResponse;
import com.fintrack.dto.FinancialSummaryResponse;
import com.fintrack.dto.TransactionResponse;
import com.fintrack.dto.UserResponse;
import com.fintrack.exception.ResourceNotFoundException;
import com.fintrack.model.Transaction;
import com.fintrack.model.User;
import com.fintrack.repository.TransactionRepository;
import com.fintrack.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Admin Service providing system analytics, user management data, and individual user portfolio drilldown.
 */
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final AuthService authService;
    private final TransactionService transactionService;

    public AdminService(UserRepository userRepository, TransactionRepository transactionRepository,
                        AuthService authService, TransactionService transactionService) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.authService = authService;
        this.transactionService = transactionService;
    }

    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(authService::toUserResponse).collect(Collectors.toList());
    }

    public List<TransactionResponse> getAllTransactions(int page, int size) {
        int offset = Math.max(0, page) * size;
        List<Transaction> transactions = transactionRepository.findAllForAdmin(size, offset);
        return transactions.stream().map(transactionService::toTransactionResponse).collect(Collectors.toList());
    }

    public AdminStatsResponse getSystemStats() {
        long totalUsers = userRepository.count();
        long totalTransactions = transactionRepository.countAll();
        BigDecimal totalIncome = transactionRepository.getSystemTotalIncome();
        BigDecimal totalExpenses = transactionRepository.getSystemTotalExpenses();

        List<UserResponse> recentUsers = userRepository.findRecent(5)
                .stream().map(authService::toUserResponse).collect(Collectors.toList());

        List<TransactionResponse> recentTransactions = transactionRepository.findAllForAdmin(10, 0)
                .stream().map(transactionService::toTransactionResponse).collect(Collectors.toList());

        return new AdminStatsResponse(
                totalUsers,
                totalTransactions,
                totalIncome,
                totalExpenses,
                recentUsers,
                recentTransactions
        );
    }

    public Map<String, Object> getUserPortfolio(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        FinancialSummaryResponse summary = transactionService.getFinancialSummary(userId);
        List<TransactionResponse> transactions = transactionService.getTransactions(
                userId, null, null, null, null, null, null, null, "transactionDate", "DESC", 0, 50
        );

        Map<String, Object> result = new HashMap<>();
        result.put("user", authService.toUserResponse(user));
        result.put("summary", summary);
        result.put("transactions", transactions);
        return result;
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
