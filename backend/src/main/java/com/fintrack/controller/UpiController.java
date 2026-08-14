package com.fintrack.controller;

import com.fintrack.dto.UpiPaymentRequest;
import com.fintrack.dto.UpiPaymentResponse;
import com.fintrack.dto.UpiSyncResponse;
import com.fintrack.security.AuthenticatedUser;
import com.fintrack.service.UpiService;
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
 * UPI & Banking REST Controller.
 * Exposes endpoints for executing UPI transfers, syncing bank statements,
 * fetching linked accounts, and managing multi-app connections with OTP auth.
 */
@RestController
@RequestMapping("/api/upi")
public class UpiController {

    private final UpiService upiService;

    public UpiController(UpiService upiService) {
        this.upiService = upiService;
    }

    private AuthenticatedUser getAuthUser(HttpServletRequest request) {
        return (AuthenticatedUser) request.getAttribute("authenticatedUser");
    }

    @PostMapping("/pay")
    public ResponseEntity<UpiPaymentResponse> processPayment(@RequestBody UpiPaymentRequest requestBody,
                                                           HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        UpiPaymentResponse response = upiService.processPayment(authUser.getId(), requestBody);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/sync")
    public ResponseEntity<UpiSyncResponse> syncExternalTransactions(HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        UpiSyncResponse response = upiService.syncExternalUpiTransactions(authUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/accounts")
    public ResponseEntity<Map<String, Object>> getLinkedAccounts(HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        Map<String, Object> response = upiService.getLinkedAccounts(authUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/apps")
    public ResponseEntity<List<Map<String, Object>>> getUpiApps(HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        List<Map<String, Object>> apps = upiService.getUpiApps(authUser.getId());
        return ResponseEntity.ok(apps);
    }

    @PostMapping("/apps/connect")
    public ResponseEntity<Map<String, Object>> connectUpiApp(@RequestBody Map<String, String> body,
                                                            HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        String appId = body.get("appId");
        String upiId = body.get("upiId");
        String phone = body.get("phone");
        String otp = body.get("otp");

        Map<String, Object> updatedApp = upiService.connectUpiApp(authUser.getId(), appId, upiId, phone, otp);
        return ResponseEntity.ok(updatedApp);
    }

    @PostMapping("/apps/disconnect")
    public ResponseEntity<Map<String, Object>> disconnectUpiApp(@RequestBody Map<String, String> body,
                                                               HttpServletRequest request) {
        AuthenticatedUser authUser = getAuthUser(request);
        String appId = body.get("appId");

        Map<String, Object> updatedApp = upiService.disconnectUpiApp(authUser.getId(), appId);
        return ResponseEntity.ok(updatedApp);
    }
}
