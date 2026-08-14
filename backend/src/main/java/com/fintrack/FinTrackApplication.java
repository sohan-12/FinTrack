package com.fintrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * FinTrack Application Entry Point.
 * Main class bootstrapping Spring Boot backend.
 */
@SpringBootApplication
public class FinTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinTrackApplication.class, args);
    }
}
