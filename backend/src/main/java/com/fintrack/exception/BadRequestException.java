package com.fintrack.exception;

/**
 * Exception thrown when validation fails or request parameters are invalid.
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
