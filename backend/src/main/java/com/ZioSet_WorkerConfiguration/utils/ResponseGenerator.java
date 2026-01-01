package com.ZioSet_WorkerConfiguration.utils;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class ResponseGenerator {
    // Generates a response with custom message, HTTP status, and response data
    public static ResponseEntity<Object> generateResponse(
            String message,
            HttpStatus status,
            Object responseObj) {
        Map<String, Object> map = new HashMap<>();
        map.put("message", message);
        map.put("data", responseObj);

        return new ResponseEntity<>(map, status);
    }

    public static ResponseEntity<Object> generate(
            String message,
            HttpStatus status,
            Object responseObj) {
        Map<String, Object> map = new HashMap<>();
        map.put("message", message);
        map.put("data", responseObj);

        return new ResponseEntity<>(map, status);
    }

    public static ResponseEntity<Object> generateErrorResponse(String message, HttpStatus status) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", null);
        response.put("message", message);
        return new ResponseEntity<>(response, status);
    }

    // Generates a default OK (200) response with message and data
    public static ResponseEntity<Object> generateResponse(String message, Object responseObj) {
        return generateResponse(message, HttpStatus.OK, responseObj);
    }
}
