package com.fintrack.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Single Page Application (SPA) Forward Controller.
 * Routes all React client-side paths to index.html while letting /api/** routes hit REST controllers.
 */
@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/",
            "/login",
            "/register",
            "/dashboard",
            "/upi-banking",
            "/transactions",
            "/add-transaction",
            "/ai-assistant",
            "/help-support",
            "/profile",
            "/admin"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
