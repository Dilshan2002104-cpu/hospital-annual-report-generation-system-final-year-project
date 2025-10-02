package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.PharmacyDTO.MedicineDispenseRequestDTO;
import com.HMS.HMS.DTO.PharmacyDTO.MedicineDispenseResponseDTO;
import com.HMS.HMS.model.Pharmacy.MedicineDispenseRequest;
import com.HMS.HMS.service.PharmacyService.MedicineDispenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pharmacy/dispense")
@CrossOrigin(origins = "*")
public class PharmacyDispenseController {

    @Autowired
    private MedicineDispenseService medicineDispenseService;

    // Create new dispense request
    @PostMapping("/request")
    public ResponseEntity<?> createDispenseRequest(@RequestBody MedicineDispenseRequestDTO requestDTO) {
        try {
            MedicineDispenseResponseDTO response = medicineDispenseService.createDispenseRequest(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Dispense request created successfully",
                "data", response
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Failed to create dispense request: " + e.getMessage()
            ));
        }
    }

    // Get dispense request status by request ID
    @GetMapping("/status/{requestId}")
    public ResponseEntity<?> getDispenseStatus(@PathVariable String requestId) {
        try {
            Optional<MedicineDispenseResponseDTO> response = medicineDispenseService.getDispenseRequestByRequestId(requestId);
            if (response.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", response.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "Dispense request not found with ID: " + requestId
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Error retrieving dispense status: " + e.getMessage()
            ));
        }
    }

    // Get dispense requests by prescription ID
    @GetMapping("/prescription/{prescriptionId}")
    public ResponseEntity<?> getDispenseRequestsByPrescription(@PathVariable Long prescriptionId) {
        try {
            List<MedicineDispenseResponseDTO> responses = medicineDispenseService.getDispenseRequestsByPrescriptionId(prescriptionId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", responses
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Error retrieving dispense requests: " + e.getMessage()
            ));
        }
    }

    // Get pending requests for pharmacy (paginated)
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "urgencyLevel,desc") String[] sort) {
        try {
            Sort sortSpec = Sort.by(
                (sort.length == 2) 
                ? new Sort.Order(Sort.Direction.fromString(sort[1]), sort[0])
                : Sort.Order.desc("urgencyLevel")
            );
            
            Pageable pageable = PageRequest.of(page, size, sortSpec);
            Page<MedicineDispenseResponseDTO> responses = medicineDispenseService.getPendingRequests(pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", responses
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Error retrieving pending requests: " + e.getMessage()
            ));
        }
    }

    // Get urgent requests
    @GetMapping("/urgent")
    public ResponseEntity<?> getUrgentRequests() {
        try {
            List<MedicineDispenseResponseDTO> responses = medicineDispenseService.getUrgentRequests();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", responses
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Error retrieving urgent requests: " + e.getMessage()
            ));
        }
    }

    // Update dispense request status
    @PutMapping("/{requestId}/status")
    public ResponseEntity<?> updateDispenseStatus(
            @PathVariable Long requestId,
            @RequestBody Map<String, Object> statusUpdate) {
        try {
            String statusStr = (String) statusUpdate.get("status");
            String processedBy = (String) statusUpdate.get("processedBy");
            String pharmacyNotes = (String) statusUpdate.get("pharmacyNotes");

            MedicineDispenseRequest.DispenseStatus newStatus = MedicineDispenseRequest.DispenseStatus.valueOf(statusStr);
            
            MedicineDispenseResponseDTO response = medicineDispenseService.updateDispenseStatus(
                requestId, newStatus, processedBy, pharmacyNotes);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Status updated successfully",
                "data", response
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Failed to update status: " + e.getMessage()
            ));
        }
    }

    // Dispense medications
    @PostMapping("/{requestId}/dispense")
    public ResponseEntity<?> dispenseMedications(
            @PathVariable Long requestId,
            @RequestBody Map<String, Object> dispenseData) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> itemIds = (List<Long>) dispenseData.get("itemIds");
            @SuppressWarnings("unchecked")
            List<Integer> quantities = (List<Integer>) dispenseData.get("quantities");
            String processedBy = (String) dispenseData.get("processedBy");

            MedicineDispenseResponseDTO response = medicineDispenseService.dispenseMedications(
                requestId, itemIds, quantities, processedBy);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Medications dispensed successfully",
                "data", response
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Failed to dispense medications: " + e.getMessage()
            ));
        }
    }

    // Cancel dispense request
    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<?> cancelDispenseRequest(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> cancelData) {
        try {
            String reason = cancelData.get("reason");
            
            MedicineDispenseResponseDTO response = medicineDispenseService.cancelDispenseRequest(requestId, reason);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Dispense request cancelled successfully",
                "data", response
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Failed to cancel request: " + e.getMessage()
            ));
        }
    }

    // Get requests by status
    @GetMapping("/status")
    public ResponseEntity<?> getRequestsByStatus(
            @RequestParam String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            MedicineDispenseRequest.DispenseStatus dispenseStatus = MedicineDispenseRequest.DispenseStatus.valueOf(status);
            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            
            Page<MedicineDispenseResponseDTO> responses = medicineDispenseService.getRequestsByStatus(dispenseStatus, pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", responses
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Error retrieving requests: " + e.getMessage()
            ));
        }
    }

    // Search requests with filters
    @GetMapping("/search")
    public ResponseEntity<?> searchRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String urgencyLevel,
            @RequestParam(required = false) String wardLocation,
            @RequestParam(required = false) String requestedBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            MedicineDispenseRequest.DispenseStatus dispenseStatus = status != null ? 
                MedicineDispenseRequest.DispenseStatus.valueOf(status) : null;
            MedicineDispenseRequest.UrgencyLevel urgency = urgencyLevel != null ? 
                MedicineDispenseRequest.UrgencyLevel.valueOf(urgencyLevel) : null;
                
            Pageable pageable = PageRequest.of(page, size, Sort.by("urgencyLevel").descending().and(Sort.by("createdAt")));
            
            Page<MedicineDispenseResponseDTO> responses = medicineDispenseService.searchRequests(
                dispenseStatus, urgency, wardLocation, requestedBy, pageable);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", responses
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "success", false,
                "message", "Error searching requests: " + e.getMessage()
            ));
        }
    }

    // Get request details by ID
    @GetMapping("/{requestId}")
    public ResponseEntity<?> getRequestDetails(@PathVariable Long requestId) {
        try {
            Optional<MedicineDispenseResponseDTO> response = medicineDispenseService.getDispenseRequestById(requestId);
            if (response.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", response.get()
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "Dispense request not found with ID: " + requestId
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "Error retrieving request details: " + e.getMessage()
            ));
        }
    }
}