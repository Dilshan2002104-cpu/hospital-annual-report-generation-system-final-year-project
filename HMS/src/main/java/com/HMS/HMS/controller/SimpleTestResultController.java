package com.HMS.HMS.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/test-results-simple")
@CrossOrigin(origins = "*")
public class SimpleTestResultController {

    @PostMapping("/test-save")
    public ResponseEntity<Map<String, Object>> testSave(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Just return the received data for now
            response.put("success", true);
            response.put("message", "Data received successfully");
            response.put("receivedData", requestData);
            
            System.out.println("Received test result data: " + requestData);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/test-get")
    public ResponseEntity<Map<String, Object>> testGet() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Simple test result controller is working");
        return ResponseEntity.ok(response);
    }
}