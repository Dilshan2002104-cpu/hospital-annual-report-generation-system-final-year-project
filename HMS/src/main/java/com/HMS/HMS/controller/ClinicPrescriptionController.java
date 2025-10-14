package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionRequestDTO;
import com.HMS.HMS.model.Prescription.ClinicPrescription;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import com.HMS.HMS.service.ClinicPrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clinic/prescriptions")
@CrossOrigin(origins = "*")
public class ClinicPrescriptionController {

    @Autowired
    private ClinicPrescriptionService clinicPrescriptionService;

    // Create a new clinic prescription
    @PostMapping
    public ResponseEntity<?> createClinicPrescription(@RequestBody PrescriptionRequestDTO requestDTO) {
        try {
            System.out.println("📋 Creating clinic prescription for patient: " + requestDTO.getPatientNationalId());
            
            ClinicPrescription prescription = clinicPrescriptionService.createClinicPrescription(requestDTO);
            
            System.out.println("✅ Clinic prescription created successfully: " + prescription.getPrescriptionId());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(prescription);
        } catch (Exception e) {
            System.err.println("❌ Clinic prescription creation failed - Exception: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create clinic prescription");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Get all clinic prescriptions with pagination
    @GetMapping
    public ResponseEntity<Page<ClinicPrescription>> getAllClinicPrescriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "prescribedDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ClinicPrescription> prescriptions = clinicPrescriptionService.getAllClinicPrescriptions(pageable);
        
        return ResponseEntity.ok(prescriptions);
    }

    // Get clinic prescription by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getClinicPrescriptionById(@PathVariable Long id) {
        try {
            Optional<ClinicPrescription> prescription = clinicPrescriptionService.getClinicPrescriptionById(id);
            
            if (prescription.isPresent()) {
                return ResponseEntity.ok(prescription.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Clinic prescription not found with ID: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve clinic prescription", "message", e.getMessage()));
        }
    }

    // Get clinic prescription by prescription ID
    @GetMapping("/prescription/{prescriptionId}")
    public ResponseEntity<?> getClinicPrescriptionByPrescriptionId(@PathVariable String prescriptionId) {
        try {
            Optional<ClinicPrescription> prescription = 
                clinicPrescriptionService.getClinicPrescriptionByPrescriptionId(prescriptionId);
            
            if (prescription.isPresent()) {
                return ResponseEntity.ok(prescription.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Clinic prescription not found with prescription ID: " + prescriptionId));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to retrieve clinic prescription", "message", e.getMessage()));
        }
    }

    // Get clinic prescriptions by patient
    @GetMapping("/patient/{patientNationalId}")
    public ResponseEntity<Page<ClinicPrescription>> getClinicPrescriptionsByPatient(
            @PathVariable String patientNationalId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "prescribedDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ClinicPrescription> prescriptions = 
            clinicPrescriptionService.getClinicPrescriptionsByPatient(patientNationalId, pageable);
        
        return ResponseEntity.ok(prescriptions);
    }

    // Get clinic prescriptions by status
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<ClinicPrescription>> getClinicPrescriptionsByStatus(
            @PathVariable PrescriptionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "prescribedDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ClinicPrescription> prescriptions = 
            clinicPrescriptionService.getClinicPrescriptionsByStatus(status, pageable);
        
        return ResponseEntity.ok(prescriptions);
    }

    // Get active clinic prescriptions for a patient
    @GetMapping("/patient/{patientNationalId}/active")
    public ResponseEntity<List<ClinicPrescription>> getActiveClinicPrescriptionsByPatient(
            @PathVariable String patientNationalId) {
        
        List<ClinicPrescription> prescriptions = 
            clinicPrescriptionService.getActiveClinicPrescriptionsByPatient(patientNationalId);
        
        return ResponseEntity.ok(prescriptions);
    }

    // Search clinic prescriptions
    @GetMapping("/search")
    public ResponseEntity<Page<ClinicPrescription>> searchClinicPrescriptions(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "prescribedDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ClinicPrescription> prescriptions = 
            clinicPrescriptionService.searchClinicPrescriptions(searchTerm, pageable);
        
        return ResponseEntity.ok(prescriptions);
    }

    // Update clinic prescription status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateClinicPrescriptionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            PrescriptionStatus status = PrescriptionStatus.valueOf(statusUpdate.get("status"));
            ClinicPrescription prescription = 
                clinicPrescriptionService.updateClinicPrescriptionStatus(id, status);
            
            return ResponseEntity.ok(prescription);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Invalid status value", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update clinic prescription status", "message", e.getMessage()));
        }
    }

    // Get pending prescriptions for pharmacy
    @GetMapping("/pending")
    public ResponseEntity<List<ClinicPrescription>> getPendingPrescriptionsForPharmacy() {
        List<ClinicPrescription> prescriptions = 
            clinicPrescriptionService.getPendingPrescriptionsForPharmacy();
        
        return ResponseEntity.ok(prescriptions);
    }

    // Get recent prescriptions (last 7 days)
    @GetMapping("/recent")
    public ResponseEntity<List<ClinicPrescription>> getRecentClinicPrescriptions() {
        List<ClinicPrescription> prescriptions = 
            clinicPrescriptionService.getRecentClinicPrescriptions();
        
        return ResponseEntity.ok(prescriptions);
    }

    // Get prescriptions requiring follow-up
    @GetMapping("/follow-up")
    public ResponseEntity<List<ClinicPrescription>> getPrescriptionsRequiringFollowUp() {
        List<ClinicPrescription> prescriptions = 
            clinicPrescriptionService.getPrescrip­tionsRequiringFollowUp();
        
        return ResponseEntity.ok(prescriptions);
    }

    // Dashboard statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getClinicPrescriptionStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("total", clinicPrescriptionService.getClinicPrescriptionCount());
        stats.put("active", clinicPrescriptionService.getClinicPrescriptionCountByStatus(PrescriptionStatus.ACTIVE));
        stats.put("pending", clinicPrescriptionService.getClinicPrescriptionCountByStatus(PrescriptionStatus.PENDING));
        stats.put("completed", clinicPrescriptionService.getClinicPrescriptionCountByStatus(PrescriptionStatus.COMPLETED));
        
        // Today's prescriptions
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        stats.put("today", clinicPrescriptionService.getClinicPrescriptionCountByDateRange(startOfDay, endOfDay));
        
        return ResponseEntity.ok(stats);
    }

    // Delete clinic prescription (soft delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClinicPrescription(@PathVariable Long id) {
        try {
            clinicPrescriptionService.deleteClinicPrescription(id);
            return ResponseEntity.ok(Map.of("message", "Clinic prescription discontinued successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete clinic prescription", "message", e.getMessage()));
        }
    }
}