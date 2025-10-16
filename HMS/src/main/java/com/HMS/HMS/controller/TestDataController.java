package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.AdmissionDTO.AdmissionRequestDTO;
import com.HMS.HMS.service.AdmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test-data")
@CrossOrigin(origins = "*")
public class TestDataController {
    
    @Autowired
    private AdmissionService admissionService;
    
    /**
     * Create sample admissions for testing bed management
     */
    @PostMapping("/create-sample-admissions")
    public ResponseEntity<Map<String, Object>> createSampleAdmissions() {
        try {
            List<String> createdAdmissions = new ArrayList<>();
            
            // Create sample admissions for different wards and beds
            String[][] testAdmissions = {
                // {patientId, wardId, bedNumber}
                {"123456789", "1", "01"}, // Ward 1, Bed 01
                {"987654321", "1", "05"}, // Ward 1, Bed 05
                {"555666777", "2", "03"}, // Ward 2, Bed 03
                {"111222333", "2", "08"}, // Ward 2, Bed 08
                {"444555666", "3", "02"}, // Ward 3, Bed 02
            };
            
            for (String[] admission : testAdmissions) {
                try {
                    AdmissionRequestDTO request = new AdmissionRequestDTO();
                    request.setPatientNationalId(admission[0]);
                    request.setWardId(Long.parseLong(admission[1]));
                    request.setBedNumber(admission[2]);
                    
                    admissionService.admitPatient(request);
                    createdAdmissions.add("Patient " + admission[0] + " admitted to Ward " + admission[1] + " Bed " + admission[2]);
                } catch (Exception e) {
                    // Skip if patient already admitted or bed occupied
                    createdAdmissions.add("Skipped: " + e.getMessage());
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Sample admissions created successfully",
                "admissions", createdAdmissions,
                "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Failed to create sample admissions: " + e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }
}