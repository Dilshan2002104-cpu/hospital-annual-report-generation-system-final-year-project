package com.HMS.HMS.controller;

import com.HMS.HMS.repository.LabRequestRepository;
import com.HMS.HMS.repository.TestResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import javax.sql.DataSource;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*")
public class DebugController {

    @Autowired
    private DataSource dataSource;
    
    @Autowired
    private LabRequestRepository labRequestRepository;
    
    @Autowired
    private TestResultRepository testResultRepository;

    @GetMapping("/database-connection")
    public ResponseEntity<Map<String, Object>> testDatabaseConnection() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Test database connection
            dataSource.getConnection().close();
            response.put("databaseConnection", "SUCCESS");
            
            // Test repository access
            long labRequestCount = labRequestRepository.count();
            response.put("labRequestCount", labRequestCount);
            
            long testResultCount = testResultRepository.count();
            response.put("testResultCount", testResultCount);
            
            response.put("success", true);
            response.put("message", "Database connection and repositories working");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/lab-request/{requestId}")
    public ResponseEntity<Map<String, Object>> testLabRequestFind(@PathVariable String requestId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            var labRequest = labRequestRepository.findByRequestId(requestId);
            
            if (labRequest.isPresent()) {
                response.put("found", true);
                response.put("patientName", labRequest.get().getPatientName());
                response.put("wardName", labRequest.get().getWardName());
            } else {
                response.put("found", false);
                response.put("message", "Lab request not found for ID: " + requestId);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}