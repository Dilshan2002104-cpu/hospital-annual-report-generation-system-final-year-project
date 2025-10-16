package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.LabRequest.TestResultSubmissionDTO;
import com.HMS.HMS.DTO.LabRequest.TestResultResponseDTO;
import com.HMS.HMS.service.TestResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test-results")
@CrossOrigin(origins = "*")
public class TestResultController {
    
    @Autowired
    private TestResultService testResultService;
    
    /**
     * Save test results for a lab request
     */
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> saveTestResults(@RequestBody TestResultSubmissionDTO submissionDTO) {
        try {
            Map<String, Object> response = testResultService.saveTestResults(submissionDTO);
            
            if ((Boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Failed to save test results: " + e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get test results by patient national ID
     */
    @GetMapping("/patient/{patientNationalId}")
    public ResponseEntity<List<TestResultResponseDTO>> getTestResultsByPatient(
            @PathVariable String patientNationalId) {
        try {
            List<TestResultResponseDTO> results = testResultService.getTestResultsByPatient(patientNationalId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    /**
     * Get recent test results by patient (last 30 days)
     */
    @GetMapping("/patient/{patientNationalId}/recent")
    public ResponseEntity<List<TestResultResponseDTO>> getRecentTestResultsByPatient(
            @PathVariable String patientNationalId) {
        try {
            List<TestResultResponseDTO> results = testResultService.getRecentTestResultsByPatient(patientNationalId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    /**
     * Get test results by request ID
     */
    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<TestResultResponseDTO>> getTestResultsByRequestId(
            @PathVariable String requestId) {
        try {
            List<TestResultResponseDTO> results = testResultService.getTestResultsByRequestId(requestId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}