package com.fintrack.exception;

/**
 * Exception thrown when a requested resource (Transaction, User, Category) cannot be found.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
