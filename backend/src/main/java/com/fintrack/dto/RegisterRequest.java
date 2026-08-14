package com.fintrack.dto;

/**
 * Registration Request DTO with OTP verification code.
 */
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String confirmPassword;
    private String otp;

    public RegisterRequest() {
    }

    public RegisterRequest(String name, String email, String password, String confirmPassword, String otp) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.otp = otp;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
