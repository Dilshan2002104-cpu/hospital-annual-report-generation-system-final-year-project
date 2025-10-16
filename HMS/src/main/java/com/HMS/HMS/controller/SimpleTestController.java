package com.HMS.HMS.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/simple-test")
@CrossOrigin(origins = "*")
public class SimpleTestController {

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello from Spring Boot Backend!");
    }

    @PostMapping("/echo")
    public ResponseEntity<String> echo(@RequestBody String message) {
        try {
            return ResponseEntity.ok("Echo: " + message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
}