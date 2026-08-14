package com.fintrack.service;

import com.fintrack.dto.CategorySummaryResponse;
import com.fintrack.dto.FinancialSummaryResponse;
import com.fintrack.dto.MonthlySummaryResponse;
import com.fintrack.dto.TransactionRequest;
import com.fintrack.dto.TransactionResponse;
import com.fintrack.exception.BadRequestException;
import com.fintrack.exception.ResourceNotFoundException;
import com.fintrack.model.Transaction;
import com.fintrack.model.TransactionType;
import com.fintrack.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Transaction Service containing business logic for income and expense transactions.
 */
@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public TransactionResponse createTransaction(Long userId, TransactionRequest req) {
        validateTransactionRequest(req);

        Transaction tx = new Transaction(
                userId,
                req.getType(),
                req.getAmount(),
                req.getCategory().trim(),
                req.getDescription() != null ? req.getDescription().trim() : "",
                req.getTransactionDate() != null ? req.getTransactionDate() : LocalDate.now()
        );

        Transaction savedTx = transactionRepository.save(tx);
        return toTransactionResponse(savedTx);
    }

    public List<TransactionResponse> getTransactions(Long userId, TransactionType type, String category,
                                                    LocalDate startDate, LocalDate endDate,
                                                    BigDecimal minAmount, BigDecimal maxAmount,
                                                    String search, String sortBy, String sortDir,
                                                    int page, int size) {
        int offset = Math.max(0, page) * size;
        List<Transaction> list = transactionRepository.findByUserWithFilters(
                userId, type, category, startDate, endDate, minAmount, maxAmount, search, sortBy, sortDir, size, offset
        );

        return list.stream().map(this::toTransactionResponse).collect(Collectors.toList());
    }

    public long countTransactions(Long userId, TransactionType type, String category,
                                 LocalDate startDate, LocalDate endDate,
                                 BigDecimal minAmount, BigDecimal maxAmount, String search) {
        return transactionRepository.countByUserWithFilters(userId, type, category, startDate, endDate, minAmount, maxAmount, search);
    }

    public TransactionResponse getTransactionById(Long id, Long userId) {
        Transaction tx = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return toTransactionResponse(tx);
    }

    public TransactionResponse updateTransaction(Long id, Long userId, TransactionRequest req) {
        validateTransactionRequest(req);

        Transaction existing = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        existing.setType(req.getType());
        existing.setAmount(req.getAmount());
        existing.setCategory(req.getCategory().trim());
        existing.setDescription(req.getDescription() != null ? req.getDescription().trim() : "");
        existing.setTransactionDate(req.getTransactionDate() != null ? req.getTransactionDate() : existing.getTransactionDate());

        boolean updated = transactionRepository.update(existing);
        if (!updated) {
            throw new BadRequestException("Failed to update transaction with id: " + id);
        }

        return toTransactionResponse(existing);
    }

    public void deleteTransaction(Long id, Long userId) {
        boolean deleted = transactionRepository.deleteByIdAndUserId(id, userId);
        if (!deleted) {
            throw new ResourceNotFoundException("Transaction not found with id: " + id);
        }
    }

    public FinancialSummaryResponse getFinancialSummary(Long userId) {
        return transactionRepository.getFinancialSummary(userId);
    }

    public List<CategorySummaryResponse> getCategorySummaries(Long userId) {
        return transactionRepository.getCategorySummaries(userId);
    }

    public List<MonthlySummaryResponse> getMonthlySummaries(Long userId) {
        return transactionRepository.getMonthlySummaries(userId, 12);
    }

    private void validateTransactionRequest(TransactionRequest req) {
        if (req.getType() == null) {
            throw new BadRequestException("Transaction type (INCOME or EXPENSE) is required.");
        }
        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than 0.");
        }
        if (req.getCategory() == null || req.getCategory().trim().isEmpty()) {
            throw new BadRequestException("Category is required.");
        }
        if (req.getTransactionDate() == null) {
            req.setTransactionDate(LocalDate.now());
        }
    }

    public TransactionResponse toTransactionResponse(Transaction tx) {
        return new TransactionResponse(
                tx.getId(),
                tx.getUserId(),
                tx.getType(),
                tx.getAmount(),
                tx.getCategory(),
                tx.getDescription(),
                tx.getTransactionDate(),
                tx.getCreatedAt() != null ? tx.getCreatedAt() : LocalDateTime.now()
        );
    }
}
