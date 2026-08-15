package com.fintrack.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Universal Multi-Channel Email Dispatch Service for FinTrack.
 * Supports:
 * 1. Google Apps Script Webhook (GMAIL_WEBHOOK_URL) - Sends directly from personal Gmail to ANY email over HTTPS Port 443 (Zero Domain Required, 500 emails/day free)
 * 2. Brevo HTTPS REST API (BREVO_API_KEY) - Sends to ANY email over HTTPS Port 443 (300 emails/day free)
 * 3. Resend HTTPS REST API (RESEND_API_KEY) - Sends to owner email over HTTPS Port 443
 * 4. Direct SMTP (JavaMailSender) - Active on localhost and unrestricted cloud hosts
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${GMAIL_WEBHOOK_URL:}")
    private String gmailWebhookUrl;

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${RESEND_API_KEY:}")
    private String resendApiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(8))
            .followRedirects(HttpClient.Redirect.ALWAYS)
            .build();

    public void sendVerificationOtpEmail(String toEmail, String otp) {
        logger.info("====================================================");
        logger.info("✉️ [EMAIL VERIFICATION DISPATCH] Recipient: {}", toEmail);
        logger.info("🔑 [6-DIGIT SECURITY OTP CODE]: {}", otp);
        logger.info("====================================================");

        String htmlContent = "<div style=\"font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px;\">"
                + "<div style=\"text-align: center; margin-bottom: 24px;\">"
                + "<h1 style=\"color: #FF6B00; font-size: 26px; font-weight: 800; margin: 0;\">FinTrack</h1>"
                + "<p style=\"color: #64748B; font-size: 14px; margin-top: 4px;\">AI-Powered Personal Wealth & Financial Management</p>"
                + "</div>"
                + "<div style=\"padding: 20px; background-color: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 12px; margin-bottom: 24px;\">"
                + "<p style=\"color: #1E293B; font-size: 15px; font-weight: 600; margin: 0 0 10px 0;\">Verify your email address</p>"
                + "<p style=\"color: #475569; font-size: 14px; margin: 0; line-height: 1.5;\">Use the 6-digit security code below to complete your FinTrack account registration:</p>"
                + "</div>"
                + "<div style=\"text-align: center; margin: 28px 0;\">"
                + "<div style=\"display: inline-block; background-color: #0F172A; color: #FFFFFF; font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 14px 28px; border-radius: 10px; font-family: monospace;\">"
                + otp
                + "</div>"
                + "</div>"
                + "<p style=\"color: #64748B; font-size: 13px; text-align: center; margin-top: 24px;\">This security code will expire in <strong>10 minutes</strong>. If you did not request this, please safely ignore this email.</p>"
                + "<hr style=\"border: none; border-top: 1px solid #F1F5F9; margin: 24px 0;\" />"
                + "<p style=\"color: #94A3B8; font-size: 11px; text-align: center; margin: 0;\">© 2026 FinTrack Inc. Secure Financial Platform</p>"
                + "</div>";

        // 1. Channel 1: Google Apps Script Webhook (Port 443 HTTPS - Sends from personal Gmail to ANY recipient worldwide)
        if (gmailWebhookUrl != null && !gmailWebhookUrl.trim().isEmpty()) {
            try {
                String payload = "{"
                        + "\"to\":\"" + toEmail + "\","
                        + "\"subject\":\"🔐 " + otp + " is your FinTrack Email Verification Code\","
                        + "\"html\":\"" + htmlContent.replace("\"", "\\\"") + "\","
                        + "\"otp\":\"" + otp + "\""
                        + "}";

                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create(gmailWebhookUrl.trim()))
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(10))
                        .POST(HttpRequest.BodyPublishers.ofString(payload))
                        .build();

                HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
                if (res.statusCode() >= 200 && res.statusCode() < 400) {
                    logger.info("✅ Real email delivered via Google Apps Script Webhook to {}", toEmail);
                    return;
                } else {
                    logger.warn("Google Apps Script response {}: {}", res.statusCode(), res.body());
                }
            } catch (Exception e) {
                logger.warn("Google Apps Script dispatch failed: {}", e.getMessage());
            }
        }

        // 2. Channel 2: Brevo HTTPS REST API (Port 443 HTTPS - Sends to ANY recipient)
        if (brevoApiKey != null && !brevoApiKey.trim().isEmpty()) {
            try {
                String senderEmail = (fromEmail != null && !fromEmail.isEmpty()) ? fromEmail : "noreply@fintrack.com";
                String payload = "{"
                        + "\"sender\":{\"name\":\"FinTrack Security\",\"email\":\"" + senderEmail + "\"},"
                        + "\"to\":[{\"email\":\"" + toEmail + "\"}],"
                        + "\"subject\":\"🔐 " + otp + " is your FinTrack Verification Code\","
                        + "\"htmlContent\":\"" + htmlContent.replace("\"", "\\\"") + "\""
                        + "}";

                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                        .header("api-key", brevoApiKey.trim())
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(8))
                        .POST(HttpRequest.BodyPublishers.ofString(payload))
                        .build();

                HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
                if (res.statusCode() >= 200 && res.statusCode() < 300) {
                    logger.info("✅ Real email delivered via Brevo HTTPS API to {}", toEmail);
                    return;
                } else {
                    logger.warn("Brevo API response {}: {}", res.statusCode(), res.body());
                }
            } catch (Exception e) {
                logger.warn("Brevo HTTPS API attempt failed: {}", e.getMessage());
            }
        }

        // 3. Channel 3: Resend HTTPS REST API (Port 443 HTTPS)
        if (resendApiKey != null && !resendApiKey.trim().isEmpty()) {
            try {
                String payload = "{"
                        + "\"from\":\"FinTrack Security <onboarding@resend.dev>\","
                        + "\"to\":[\"" + toEmail + "\"],"
                        + "\"subject\":\"🔐 " + otp + " is your FinTrack Verification Code\","
                        + "\"html\":\"" + htmlContent.replace("\"", "\\\"") + "\""
                        + "}";

                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.resend.com/emails"))
                        .header("Authorization", "Bearer " + resendApiKey.trim())
                        .header("Content-Type", "application/json")
                        .timeout(Duration.ofSeconds(8))
                        .POST(HttpRequest.BodyPublishers.ofString(payload))
                        .build();

                HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
                if (res.statusCode() >= 200 && res.statusCode() < 300) {
                    logger.info("✅ Real email delivered via Resend HTTPS API to {}", toEmail);
                    return;
                } else {
                    logger.warn("Resend API response {}: {}", res.statusCode(), res.body());
                }
            } catch (Exception e) {
                logger.warn("Resend HTTPS API attempt failed: {}", e.getMessage());
            }
        }

        // 4. Channel 4: Direct SMTP (Port 465 / 587 - Works on localhost & open clouds)
        if (mailSender != null && fromEmail != null && !fromEmail.trim().isEmpty()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail, "FinTrack Security");
                helper.setTo(toEmail);
                helper.setSubject("🔐 " + otp + " is your FinTrack Email Verification Code");

                String plainText = "FinTrack Security Verification Code\n\nYour 6-digit verification code is: " + otp + "\n\nThis code will expire in 10 minutes. If you did not request this code, please ignore this message.\n\n© 2026 FinTrack Inc.";
                helper.setText(plainText, htmlContent);

                message.setHeader("X-Priority", "1");
                message.setHeader("Importance", "high");

                mailSender.send(message);
                logger.info("✅ Real email delivered via SMTP to {}", toEmail);
            } catch (Exception e) {
                logger.warn("⚠️ SMTP Socket blocked on cloud host ({}). OTP [{}] is registered in memory.", e.getMessage(), otp);
            }
        }
    }
}
