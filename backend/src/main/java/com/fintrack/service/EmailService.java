package com.fintrack.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Real Email Dispatch Service for FinTrack.
 * Sends rich HTML verification emails with 6-digit security codes.
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendVerificationOtpEmail(String toEmail, String otp) {
        logger.info("====================================================");
        logger.info("✉️ DISPATCHING OTP EMAIL TO: {}", toEmail);
        logger.info("🔑 6-DIGIT SECURITY CODE: {}", otp);
        logger.info("====================================================");

        if (mailSender == null || fromEmail == null || fromEmail.trim().isEmpty()) {
            logger.info("SMTP configuration not provided in .env. To send real emails via Gmail, configure MAIL_USERNAME and MAIL_PASSWORD.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "FinTrack Security");
            helper.setTo(toEmail);
            helper.setSubject("🔐 " + otp + " is your FinTrack Email Verification Code");

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

            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("✅ Email successfully delivered to {}", toEmail);
        } catch (MessagingException e) {
            logger.error("❌ Failed to send verification email to {}: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            logger.error("❌ Unexpected error while sending email: {}", e.getMessage());
        }
    }
}
