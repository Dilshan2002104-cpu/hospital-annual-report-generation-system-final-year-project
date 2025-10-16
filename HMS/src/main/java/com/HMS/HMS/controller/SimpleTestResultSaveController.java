package com.HMS.HMS.controller;

import com.HMS.HMS.model.LabRequest.TestResult;
import com.HMS.HMS.repository.TestResultRepository;
import com.HMS.HMS.repository.LabRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/test-simple")
@CrossOrigin(origins = "*")
public class SimpleTestResultSaveController {

    @Autowired
    private TestResultRepository testResultRepository;
    
    @Autowired
    private LabRequestRepository labRequestRepository;

    @PostMapping("/save-basic")
    public ResponseEntity<Map<String, Object>> saveBasicTestResult(@RequestBody Map<String, Object> requestData) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String requestId = (String) requestData.get("requestId");
            System.out.println("=== Testing basic test result save ===");
            System.out.println("Request ID: " + requestId);
            
            // Check if lab request exists
            var labRequestOpt = labRequestRepository.findByRequestId(requestId);
            if (!labRequestOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Lab request not found for ID: " + requestId);
                return ResponseEntity.badRequest().body(response);
            }
            
            var labRequest = labRequestOpt.get();
            System.out.println("Found lab request for: " + labRequest.getPatientName());
            
            // Create a simple test result
            TestResult testResult = new TestResult(
                requestId,
                "Basic Test",
                labRequest.getPatientNationalId(),
                labRequest.getPatientName(),
                labRequest.getWardName(),
                "Lab Staff",
                LocalDateTime.now(),
                "Basic test result entry"
            );
            
            System.out.println("Attempting to save test result...");
            testResult = testResultRepository.save(testResult);
            System.out.println("Test result saved with ID: " + testResult.getId());
            
            response.put("success", true);
            response.put("message", "Basic test result saved successfully");
            response.put("testResultId", testResult.getId());
            response.put("patientName", testResult.getPatientName());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error saving basic test result: " + e.getMessage());
            e.printStackTrace();
            
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}