package com.fintrack.exception;

/**
 * Exception thrown when authentication fails or token is invalid/missing/expired.
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
