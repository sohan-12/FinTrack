package com.fintrack.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Gemini AI Service communicating directly with Google Generative AI REST API.
 * Supports auto-fallback across Gemini model endpoints for maximum reliability.
 */
@Service
public class GeminiAIService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiAIService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final List<String> modelEndpoints = Arrays.asList(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    );

    public GeminiAIService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Call the Gemini API with the given prompt.
     * Returns the text response, or null if API key is not configured or an error occurs.
     */
    public String generateContent(String systemInstruction, String prompt) {
        if (apiKey == null || apiKey.trim().isEmpty() || "your_gemini_api_key_here".equalsIgnoreCase(apiKey.trim())) {
            logger.info("GEMINI_API_KEY is not configured. Using rule-based financial advisor engine.");
            return null;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> part = new HashMap<>();
        String combinedPrompt = (systemInstruction != null && !systemInstruction.isEmpty())
                ? systemInstruction + "\n\n" + prompt
                : prompt;
        part.put("text", combinedPrompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(part));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(content));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("maxOutputTokens", 800);
        requestBody.put("generationConfig", generationConfig);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        for (String endpoint : modelEndpoints) {
            try {
                String fullUrl = endpoint + "?key=" + apiKey.trim();
                ResponseEntity<String> response = restTemplate.postForEntity(fullUrl, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && candidates.size() > 0) {
                        JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                        if (!textNode.isMissingNode()) {
                            return textNode.asText();
                        }
                    }
                }
            } catch (Exception e) {
                logger.debug("Attempt with endpoint {} returned: {}", endpoint, e.getMessage());
            }
        }

        logger.warn("Could not reach Gemini model endpoints. Falling back to rule-based analysis.");
        return null;
    }

    public boolean isApiKeyAvailable() {
        return apiKey != null && !apiKey.trim().isEmpty() && !"your_gemini_api_key_here".equalsIgnoreCase(apiKey.trim());
    }
}
