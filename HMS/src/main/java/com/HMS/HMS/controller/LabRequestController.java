package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.LabRequest.LabRequestDTO;
import com.HMS.HMS.model.LabRequest.LabRequest;
import com.HMS.HMS.model.LabRequest.LabRequestStatus;
import com.HMS.HMS.service.LabRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lab-requests")
@CrossOrigin(origins = "*")
public class LabRequestController {
    
    @Autowired
    private LabRequestService labRequestService;
    
    @PostMapping("/create")
    public ResponseEntity<?> createLabRequest(@RequestBody LabRequestDTO labRequestDTO) {
        try {
            LabRequest createdRequest = labRequestService.createLabRequest(labRequestDTO);
            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating lab request: " + e.getMessage());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<LabRequest>> getAllLabRequests() {
        List<LabRequest> requests = labRequestService.getAllLabRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<LabRequest>> getPendingLabRequests() {
        List<LabRequest> requests = labRequestService.getPendingLabRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/in-progress")
    public ResponseEntity<List<LabRequest>> getInProgressLabRequests() {
        List<LabRequest> requests = labRequestService.getInProgressLabRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/completed")
    public ResponseEntity<List<LabRequest>> getCompletedLabRequests() {
        List<LabRequest> requests = labRequestService.getCompletedLabRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/{requestId}")
    public ResponseEntity<?> getLabRequestById(@PathVariable String requestId) {
        Optional<LabRequest> request = labRequestService.getLabRequestById(requestId);
        if (request.isPresent()) {
            return ResponseEntity.ok(request.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{requestId}/status")
    public ResponseEntity<?> updateLabRequestStatus(
            @PathVariable String requestId, 
            @RequestParam LabRequestStatus status) {
        try {
            LabRequest updatedRequest = labRequestService.updateLabRequestStatus(requestId, status);
            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating lab request status: " + e.getMessage());
        }
    }
    
    @GetMapping("/patient/{patientNationalId}")
    public ResponseEntity<List<LabRequest>> getLabRequestsByPatient(@PathVariable String patientNationalId) {
        List<LabRequest> requests = labRequestService.getLabRequestsByPatient(patientNationalId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/ward/{wardName}")
    public ResponseEntity<List<LabRequest>> getLabRequestsByWard(@PathVariable String wardName) {
        List<LabRequest> requests = labRequestService.getLabRequestsByWard(wardName);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/stats/count-by-status")
    public ResponseEntity<?> getLabRequestCountByStatus(@RequestParam LabRequestStatus status) {
        Long count = labRequestService.getLabRequestCountByStatus(status);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<LabRequest>> getRecentLabRequests() {
        List<LabRequest> requests = labRequestService.getRecentLabRequests();
        return ResponseEntity.ok(requests);
    }
}