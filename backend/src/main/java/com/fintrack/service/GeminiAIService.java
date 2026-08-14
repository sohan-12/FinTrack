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

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Gemini AI Service communicating directly with Google Generative AI REST API.
 * Uses structured JSON requests and parses Gemini model responses.
 */
@Service
public class GeminiAIService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiAIService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String apiUrl;

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

        try {
            String fullUrl = apiUrl + "?key=" + apiKey.trim();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct Gemini Payload
            Map<String, Object> part = new HashMap<>();
            String combinedPrompt = (systemInstruction != null && !systemInstruction.isEmpty())
                    ? systemInstruction + "\n\n" + prompt
                    : prompt;
            part.put("text", combinedPrompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(content));

            // Set generation config for concise, structured financial responses
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.7);
            generationConfig.put("maxOutputTokens", 800);
            requestBody.put("generationConfig", generationConfig);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

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
            logger.warn("Failed to reach Gemini API: {}. Falling back to rule-based analysis.", e.getMessage());
        }

        return null;
    }

    public boolean isApiKeyAvailable() {
        return apiKey != null && !apiKey.trim().isEmpty() && !"your_gemini_api_key_here".equalsIgnoreCase(apiKey.trim());
    }
}
