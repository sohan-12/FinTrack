package com.fintrack.exception;

/**
 * Exception thrown when a resource already exists (e.g. duplicate email during registration).
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
