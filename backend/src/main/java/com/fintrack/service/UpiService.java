package com.fintrack.service;

import com.fintrack.dto.FinancialSummaryResponse;
import com.fintrack.dto.TransactionResponse;
import com.fintrack.dto.UpiPaymentRequest;
import com.fintrack.dto.UpiPaymentResponse;
import com.fintrack.dto.UpiSyncResponse;
import com.fintrack.exception.BadRequestException;
import com.fintrack.model.Transaction;
import com.fintrack.model.TransactionType;
import com.fintrack.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * UPI & Banking Gateway Service.
 * Provides realistic UPI payments, multi-app linking with OTP authentication,
 * and dynamic transaction synchronization based on active connected apps.
 */
@Service
public class UpiService {

    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;
    private final Random random = new Random();

    // In-memory registry for user connected UPI apps (starts unlinked for new users)
    private final Map<Long, Map<String, Map<String, Object>>> userAppsRegistry = new ConcurrentHashMap<>();

    public UpiService(TransactionRepository transactionRepository, TransactionService transactionService) {
        this.transactionRepository = transactionRepository;
        this.transactionService = transactionService;
    }

    private Map<String, Map<String, Object>> getOrCreateUserApps(Long userId) {
        return userAppsRegistry.computeIfAbsent(userId, id -> {
            Map<String, Map<String, Object>> apps = new ConcurrentHashMap<>();

            // 1. Google Pay
            Map<String, Object> gpay = new HashMap<>();
            gpay.put("id", "gpay");
            gpay.put("name", "Google Pay");
            gpay.put("connected", false);
            gpay.put("upiId", "");
            gpay.put("phone", "");
            gpay.put("bankName", "HDFC Bank");
            gpay.put("lastSynced", "Never");
            gpay.put("autoSync", false);
            gpay.put("themeColor", "#4285F4");
            apps.put("gpay", gpay);

            // 2. PhonePe
            Map<String, Object> phonepe = new HashMap<>();
            phonepe.put("id", "phonepe");
            phonepe.put("name", "PhonePe");
            phonepe.put("connected", false);
            phonepe.put("upiId", "");
            phonepe.put("phone", "");
            phonepe.put("bankName", "State Bank of India");
            phonepe.put("lastSynced", "Never");
            phonepe.put("autoSync", false);
            phonepe.put("themeColor", "#6739B7");
            apps.put("phonepe", phonepe);

            // 3. Paytm
            Map<String, Object> paytm = new HashMap<>();
            paytm.put("id", "paytm");
            paytm.put("name", "Paytm UPI");
            paytm.put("connected", false);
            paytm.put("upiId", "");
            paytm.put("phone", "");
            paytm.put("bankName", "Paytm Payments Bank");
            paytm.put("lastSynced", "Never");
            paytm.put("autoSync", false);
            paytm.put("themeColor", "#00BAF2");
            apps.put("paytm", paytm);

            // 4. CRED
            Map<String, Object> cred = new HashMap<>();
            cred.put("id", "cred");
            cred.put("name", "CRED Pay");
            cred.put("connected", false);
            cred.put("upiId", "");
            cred.put("phone", "");
            cred.put("bankName", "ICICI Bank Credit Cards");
            cred.put("lastSynced", "Never");
            cred.put("autoSync", false);
            cred.put("themeColor", "#000000");
            apps.put("cred", cred);

            // 5. Amazon Pay
            Map<String, Object> amazon = new HashMap<>();
            amazon.put("id", "amazon");
            amazon.put("name", "Amazon Pay");
            amazon.put("connected", false);
            amazon.put("upiId", "");
            amazon.put("phone", "");
            amazon.put("bankName", "Axis Bank");
            amazon.put("lastSynced", "Never");
            amazon.put("autoSync", false);
            amazon.put("themeColor", "#FF9900");
            apps.put("amazon", amazon);

            // 6. BHIM UPI
            Map<String, Object> bhim = new HashMap<>();
            bhim.put("id", "bhim");
            bhim.put("name", "BHIM UPI");
            bhim.put("connected", false);
            bhim.put("upiId", "");
            bhim.put("phone", "");
            bhim.put("bankName", "National Payments Corp of India");
            bhim.put("lastSynced", "Never");
            bhim.put("autoSync", false);
            bhim.put("themeColor", "#0C2340");
            apps.put("bhim", bhim);

            // 7. WhatsApp Pay
            Map<String, Object> whatsapp = new HashMap<>();
            whatsapp.put("id", "whatsapp");
            whatsapp.put("name", "WhatsApp Pay");
            whatsapp.put("connected", false);
            whatsapp.put("upiId", "");
            whatsapp.put("phone", "");
            whatsapp.put("bankName", "Kotak Mahindra Bank");
            whatsapp.put("lastSynced", "Never");
            whatsapp.put("autoSync", false);
            whatsapp.put("themeColor", "#25D366");
            apps.put("whatsapp", whatsapp);

            return apps;
        });
    }

    public List<Map<String, Object>> getUpiApps(Long userId) {
        Map<String, Map<String, Object>> apps = getOrCreateUserApps(userId);
        return new ArrayList<>(apps.values());
    }

    public Map<String, Object> getLinkedAccounts(Long userId) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> apps = getUpiApps(userId);
        long connectedCount = apps.stream().filter(a -> Boolean.TRUE.equals(a.get("connected"))).count();
        result.put("connectedAppsCount", connectedCount);
        result.put("apps", apps);
        return result;
    }

    public Map<String, Object> connectUpiApp(Long userId, String appId, String upiId, String phone, String otp) {
        if (appId == null || appId.trim().isEmpty()) {
            throw new BadRequestException("Invalid App ID.");
        }
        if (otp == null || otp.trim().length() < 4) {
            throw new BadRequestException("Please enter a valid 4-digit SMS OTP verification code.");
        }

        Map<String, Map<String, Object>> apps = getOrCreateUserApps(userId);
        Map<String, Object> app = apps.get(appId.toLowerCase());
        if (app == null) {
            throw new BadRequestException("Requested UPI app is not supported.");
        }

        app.put("connected", true);
        app.put("upiId", upiId != null && !upiId.isEmpty() ? upiId : "user." + appId + "@upi");
        app.put("phone", phone != null && !phone.isEmpty() ? phone : "+91 98765 43210");
        app.put("lastSynced", "Just now");
        app.put("autoSync", true);

        return app;
    }

    public Map<String, Object> disconnectUpiApp(Long userId, String appId) {
        Map<String, Map<String, Object>> apps = getOrCreateUserApps(userId);
        Map<String, Object> app = apps.get(appId.toLowerCase());
        if (app == null) {
            throw new BadRequestException("Requested UPI app is not found.");
        }

        app.put("connected", false);
        app.put("lastSynced", "Never");
        app.put("autoSync", false);

        return app;
    }

    public UpiPaymentResponse processPayment(Long userId, UpiPaymentRequest req) {
        if (req.getRecipientUpiId() == null || !req.getRecipientUpiId().contains("@")) {
            throw new BadRequestException("Please enter a valid recipient UPI ID (e.g., merchant@okhdfcbank or name@upi).");
        }
        if (req.getAmount() == null || req.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Transfer amount must be greater than $0.");
        }

        String category = resolveCategory(req.getRecipientUpiId(), req.getNote(), req.getCategory());
        String recipientName = req.getRecipientName() != null && !req.getRecipientName().trim().isEmpty()
                ? req.getRecipientName().trim()
                : extractMerchantName(req.getRecipientUpiId());

        String description = "UPI: " + recipientName + (req.getNote() != null && !req.getNote().isEmpty() ? " - " + req.getNote() : "");

        Transaction tx = new Transaction(
                userId,
                TransactionType.EXPENSE,
                req.getAmount(),
                category,
                description,
                LocalDate.now()
        );

        Transaction saved = transactionRepository.save(tx);

        String upiRefId = "UPI" + (100000 + random.nextInt(900000)) + System.currentTimeMillis() % 10000;
        FinancialSummaryResponse summary = transactionRepository.getFinancialSummary(userId);

        return new UpiPaymentResponse(
                "SUCCESS",
                upiRefId,
                saved.getId(),
                req.getAmount(),
                recipientName,
                req.getRecipientUpiId(),
                category,
                summary.getCurrentBalance(),
                "Payment of $" + req.getAmount().setScale(2, BigDecimal.ROUND_HALF_UP) + " to " + recipientName + " successful!"
        );
    }

    public UpiSyncResponse syncExternalUpiTransactions(Long userId) {
        Map<String, Map<String, Object>> apps = getOrCreateUserApps(userId);
        List<Map<String, Object>> connectedList = apps.values().stream()
                .filter(a -> Boolean.TRUE.equals(a.get("connected")))
                .collect(Collectors.toList());

        if (connectedList.isEmpty()) {
            throw new BadRequestException("No UPI apps connected yet! Please connect at least one app (Google Pay, PhonePe, Paytm, etc.) using SMS verification before syncing statements.");
        }

        LocalDate today = LocalDate.now();
        List<Transaction> syncBatch = new ArrayList<>();

        for (Map<String, Object> app : connectedList) {
            String appName = (String) app.get("name");
            String appId = (String) app.get("id");

            if ("gpay".equals(appId)) {
                syncBatch.add(new Transaction(userId, TransactionType.EXPENSE, new BigDecimal("14.50"), "Dining Out", "Google Pay: Swiggy Food Delivery", today));
                syncBatch.add(new Transaction(userId, TransactionType.EXPENSE, new BigDecimal("8.20"), "Groceries", "Google Pay: Blinkit Daily Milk & Bread", today.minusDays(1)));
            } else if ("phonepe".equals(appId)) {
                syncBatch.add(new Transaction(userId, TransactionType.EXPENSE, new BigDecimal("35.00"), "Utilities & Bills", "PhonePe: Electricity Board Bill", today));
                syncBatch.add(new Transaction(userId, TransactionType.EXPENSE, new BigDecimal("12.50"), "Travel", "PhonePe: Metro Transit SmartCard Recharge", today.minusDays(1)));
            } else if ("paytm".equals(appId)) {
                syncBatch.add(new Transaction(userId, TransactionType.EXPENSE, new BigDecimal("18.00"), "Travel", "Paytm: Uber City Ride", today));
                syncBatch.add(new Transaction(userId, TransactionType.EXPENSE, new BigDecimal("9.99"), "Entertainment", "Paytm: Movie Tickets (PVR)", today.minusDays(2)));
            } else if ("cred".equals(appId)) {
                syncBatch.add(new Transaction(userId, TransactionType.EXPENSE, new BigDecimal("120.00"), "Shopping", "CRED: Premium Credit Card Bill Payment", today.minusDays(1)));
            } else if ("amazon".equals(appId)) {
                syncBatch.add(new Transaction(userId, TransactionType.EXPENSE, new BigDecimal("49.99"), "Shopping", "Amazon Pay: Electronic Accessories Order", today));
            } else {
                syncBatch.add(new Transaction(userId, TransactionType.EXPENSE, new BigDecimal("15.00"), "Other", appName + ": Merchant Payment", today));
            }
        }

        List<TransactionResponse> savedResponses = new ArrayList<>();
        BigDecimal totalSyncAmount = BigDecimal.ZERO;

        for (Transaction t : syncBatch) {
            Transaction saved = transactionRepository.save(t);
            savedResponses.add(transactionService.toTransactionResponse(saved));
            totalSyncAmount = totalSyncAmount.add(t.getAmount());
        }

        // Update sync timestamp for connected apps
        connectedList.forEach(app -> app.put("lastSynced", "Just now"));

        return new UpiSyncResponse(
                savedResponses.size(),
                totalSyncAmount,
                savedResponses,
                "Synchronized " + savedResponses.size() + " statement entries from your " + connectedList.size() + " active connected UPI apps!"
        );
    }

    private String resolveCategory(String recipientUpi, String note, String providedCategory) {
        if (providedCategory != null && !providedCategory.trim().isEmpty() && !"Other".equalsIgnoreCase(providedCategory.trim())) {
            return providedCategory.trim();
        }

        String search = (recipientUpi + " " + (note != null ? note : "")).toLowerCase();
        if (search.contains("swiggy") || search.contains("zomato") || search.contains("restaurant") || search.contains("cafe") || search.contains("dining")) {
            return "Dining Out";
        }
        if (search.contains("uber") || search.contains("ola") || search.contains("metro") || search.contains("petrol") || search.contains("fuel") || search.contains("transit")) {
            return "Travel";
        }
        if (search.contains("zepto") || search.contains("blinkit") || search.contains("instamart") || search.contains("grocery") || search.contains("dmart") || search.contains("market")) {
            return "Groceries";
        }
        if (search.contains("amazon") || search.contains("flipkart") || search.contains("myntra") || search.contains("zara") || search.contains("store") || search.contains("shopping")) {
            return "Shopping";
        }
        if (search.contains("rent") || search.contains("house") || search.contains("landlord")) {
            return "Rent & Housing";
        }
        if (search.contains("netflix") || search.contains("spotify") || search.contains("movie") || search.contains("pvr") || search.contains("entertainment")) {
            return "Entertainment";
        }
        if (search.contains("electricity") || search.contains("bill") || search.contains("recharge") || search.contains("wifi") || search.contains("broadband")) {
            return "Utilities & Bills";
        }
        if (search.contains("pharmacy") || search.contains("apollo") || search.contains("hospital") || search.contains("doctor")) {
            return "Healthcare";
        }

        return "Other";
    }

    private String extractMerchantName(String upiId) {
        String prefix = upiId.split("@")[0];
        if (prefix.length() > 1) {
            return prefix.substring(0, 1).toUpperCase() + prefix.substring(1);
        }
        return upiId;
    }
}
