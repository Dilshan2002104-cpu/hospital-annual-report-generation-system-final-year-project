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
            
            // Reload the prescription with all related data to ensure prescription items and medications are loaded
            ClinicPrescription reloadedPrescription = clinicPrescriptionService
                .getClinicPrescriptionByPrescriptionId(prescription.getPrescriptionId())
                .orElse(prescription);
            
            // Create a custom response with essential fields to avoid serialization issues
            Map<String, Object> response = new HashMap<>();
            response.put("id", reloadedPrescription.getId());
            response.put("prescriptionId", reloadedPrescription.getPrescriptionId());
            response.put("patientName", reloadedPrescription.getPatientName());
            response.put("patientNationalId", reloadedPrescription.getPatientNationalId());
            response.put("patientId", reloadedPrescription.getPatientId());
            response.put("prescribedBy", reloadedPrescription.getPrescribedBy());
            response.put("startDate", reloadedPrescription.getStartDate());
            response.put("endDate", reloadedPrescription.getEndDate());
            response.put("prescribedDate", reloadedPrescription.getPrescribedDate());
            response.put("lastModified", reloadedPrescription.getLastModified());
            response.put("status", reloadedPrescription.getStatus());
            response.put("clinicName", reloadedPrescription.getClinicName());
            response.put("visitType", reloadedPrescription.getVisitType());
            response.put("totalMedications", reloadedPrescription.getTotalMedications());
            response.put("prescriptionNotes", reloadedPrescription.getPrescriptionNotes());
            response.put("prescriptionItems", reloadedPrescription.getPrescriptionItems());
            response.put("createdAt", reloadedPrescription.getCreatedAt());
            
            System.out.println("📋 Prescription items count: " + reloadedPrescription.getPrescriptionItems().size());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
    public ResponseEntity<?> getAllClinicPrescriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "prescribedDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ClinicPrescription> prescriptions = clinicPrescriptionService.getAllClinicPrescriptions(pageable);
        
        // Debug logging
        System.out.println("🔍 Returning " + prescriptions.getTotalElements() + " clinic prescriptions");
        
        // Transform prescriptions to include medication details explicitly
        List<Map<String, Object>> transformedPrescriptions = prescriptions.getContent().stream()
            .map(prescription -> {
                System.out.println("📋 Processing prescription " + prescription.getPrescriptionId() + 
                                 " with " + prescription.getPrescriptionItems().size() + " items");
                
                Map<String, Object> prescriptionMap = new HashMap<>();
                prescriptionMap.put("id", prescription.getId());
                prescriptionMap.put("prescriptionId", prescription.getPrescriptionId());
                prescriptionMap.put("patientName", prescription.getPatientName());
                prescriptionMap.put("patientNationalId", prescription.getPatientNationalId());
                prescriptionMap.put("patientId", prescription.getPatientId());
                prescriptionMap.put("prescribedBy", prescription.getPrescribedBy());
                prescriptionMap.put("startDate", prescription.getStartDate());
                prescriptionMap.put("endDate", prescription.getEndDate());
                prescriptionMap.put("prescribedDate", prescription.getPrescribedDate());
                prescriptionMap.put("lastModified", prescription.getLastModified());
                prescriptionMap.put("status", prescription.getStatus());
                prescriptionMap.put("clinicName", prescription.getClinicName());
                prescriptionMap.put("visitType", prescription.getVisitType());
                prescriptionMap.put("totalMedications", prescription.getTotalMedications());
                prescriptionMap.put("prescriptionNotes", prescription.getPrescriptionNotes());
                prescriptionMap.put("createdAt", prescription.getCreatedAt());
                
                // Transform prescription items with medication details
                List<Map<String, Object>> itemsList = prescription.getPrescriptionItems().stream()
                    .map(item -> {
                        Map<String, Object> itemMap = new HashMap<>();
                        itemMap.put("id", item.getId());
                        itemMap.put("dose", item.getDose());
                        itemMap.put("frequency", item.getFrequency());
                        itemMap.put("quantity", item.getQuantity());
                        itemMap.put("quantityUnit", item.getQuantityUnit());
                        itemMap.put("instructions", item.getInstructions());
                        itemMap.put("route", item.getRoute());
                        itemMap.put("isUrgent", item.getIsUrgent());
                        itemMap.put("notes", item.getNotes());
                        itemMap.put("itemStatus", item.getItemStatus());
                        
                        // Add medication details explicitly
                        if (item.getMedication() != null) {
                            itemMap.put("drugName", item.getMedication().getDrugName());
                            itemMap.put("genericName", item.getMedication().getGenericName());
                            itemMap.put("dosageForm", item.getMedication().getDosageForm());
                            itemMap.put("manufacturer", item.getMedication().getManufacturer());
                            System.out.println("  💊 Added medication: " + item.getMedication().getDrugName());
                        } else {
                            System.out.println("  ⚠️ No medication found for item " + item.getId());
                        }
                        
                        return itemMap;
                    })
                    .collect(java.util.stream.Collectors.toList());
                
                prescriptionMap.put("prescriptionItems", itemsList);
                return prescriptionMap;
            })
            .collect(java.util.stream.Collectors.toList());
        
        // Create response with pagination info
        Map<String, Object> response = new HashMap<>();
        response.put("content", transformedPrescriptions);
        response.put("totalElements", prescriptions.getTotalElements());
        response.put("totalPages", prescriptions.getTotalPages());
        response.put("size", prescriptions.getSize());
        response.put("number", prescriptions.getNumber());
        response.put("first", prescriptions.isFirst());
        response.put("last", prescriptions.isLast());
        
        return ResponseEntity.ok(response);
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
            Optional<ClinicPrescription> prescriptionOpt = 
                clinicPrescriptionService.getClinicPrescriptionByPrescriptionId(prescriptionId);
            
            if (prescriptionOpt.isPresent()) {
                ClinicPrescription prescription = prescriptionOpt.get();
                
                System.out.println("📋 Returning individual prescription " + prescription.getPrescriptionId() + 
                                 " with " + prescription.getPrescriptionItems().size() + " items");
                
                // Transform prescription to include medication details explicitly (same as getAllClinicPrescriptions)
                Map<String, Object> prescriptionMap = new HashMap<>();
                prescriptionMap.put("id", prescription.getId());
                prescriptionMap.put("prescriptionId", prescription.getPrescriptionId());
                prescriptionMap.put("patientName", prescription.getPatientName());
                prescriptionMap.put("patientNationalId", prescription.getPatientNationalId());
                prescriptionMap.put("patientId", prescription.getPatientId());
                prescriptionMap.put("prescribedBy", prescription.getPrescribedBy());
                prescriptionMap.put("startDate", prescription.getStartDate());
                prescriptionMap.put("endDate", prescription.getEndDate());
                prescriptionMap.put("prescribedDate", prescription.getPrescribedDate());
                prescriptionMap.put("lastModified", prescription.getLastModified());
                prescriptionMap.put("status", prescription.getStatus());
                prescriptionMap.put("clinicName", prescription.getClinicName());
                prescriptionMap.put("visitType", prescription.getVisitType());
                prescriptionMap.put("totalMedications", prescription.getTotalMedications());
                prescriptionMap.put("prescriptionNotes", prescription.getPrescriptionNotes());
                prescriptionMap.put("createdAt", prescription.getCreatedAt());
                
                // Transform prescription items with medication details
                List<Map<String, Object>> itemsList = prescription.getPrescriptionItems().stream()
                    .map(item -> {
                        Map<String, Object> itemMap = new HashMap<>();
                        itemMap.put("id", item.getId());
                        itemMap.put("dose", item.getDose());
                        itemMap.put("frequency", item.getFrequency());
                        itemMap.put("quantity", item.getQuantity());
                        itemMap.put("quantityUnit", item.getQuantityUnit());
                        itemMap.put("instructions", item.getInstructions());
                        itemMap.put("route", item.getRoute());
                        itemMap.put("isUrgent", item.getIsUrgent());
                        itemMap.put("notes", item.getNotes());
                        itemMap.put("itemStatus", item.getItemStatus());
                        
                        // Add medication details explicitly
                        if (item.getMedication() != null) {
                            itemMap.put("drugName", item.getMedication().getDrugName());
                            itemMap.put("genericName", item.getMedication().getGenericName());
                            itemMap.put("dosageForm", item.getMedication().getDosageForm());
                            itemMap.put("manufacturer", item.getMedication().getManufacturer());
                            System.out.println("  💊 Added medication: " + item.getMedication().getDrugName());
                        } else {
                            System.out.println("  ⚠️ No medication found for item " + item.getId());
                        }
                        
                        return itemMap;
                    })
                    .collect(java.util.stream.Collectors.toList());
                
                prescriptionMap.put("prescriptionItems", itemsList);
                
                return ResponseEntity.ok(prescriptionMap);
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
            clinicPrescriptionService.getPrescriptionsRequiringFollowUp();
        
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

    // Dispense clinic prescription by prescription ID
    @PostMapping("/prescription/{prescriptionId}/dispense")
    public ResponseEntity<?> dispenseClinicPrescription(
            @PathVariable String prescriptionId,
            @RequestBody(required = false) Map<String, Object> dispensingData) {
        try {
            ClinicPrescription prescription = 
                clinicPrescriptionService.dispenseClinicPrescription(prescriptionId, dispensingData);
            
            return ResponseEntity.ok(Map.of(
                "message", "Clinic prescription dispensed successfully",
                "prescription", prescription
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to dispense clinic prescription", "message", e.getMessage()));
        }
    }

    // Cancel clinic prescription by prescription ID
    @PutMapping("/prescription/{prescriptionId}/cancel")
    public ResponseEntity<?> cancelClinicPrescription(
            @PathVariable String prescriptionId,
            @RequestBody Map<String, String> cancellationData) {
        try {
            String reason = cancellationData.getOrDefault("reason", "Cancelled by pharmacist");
            ClinicPrescription prescription = 
                clinicPrescriptionService.cancelClinicPrescription(prescriptionId, reason);
            
            return ResponseEntity.ok(Map.of(
                "message", "Clinic prescription cancelled successfully", 
                "prescription", prescription
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to cancel clinic prescription", "message", e.getMessage()));
        }
    }

    // Download clinic prescription as PDF (alternative direct route)
    @GetMapping("/{prescriptionId}/pdf")
    public ResponseEntity<byte[]> downloadClinicPrescriptionPDFDirect(@PathVariable String prescriptionId) {
        return downloadClinicPrescriptionPDF(prescriptionId);
    }

    // Download clinic prescription as PDF
    @GetMapping("/prescription/{prescriptionId}/pdf")
    public ResponseEntity<byte[]> downloadClinicPrescriptionPDF(@PathVariable String prescriptionId) {
        try {
            byte[] pdfBytes = clinicPrescriptionService.generateClinicPrescriptionPDF(prescriptionId);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "ClinicPrescription_" + prescriptionId + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new org.springframework.http.ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
        }
    }
}