package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.PrescriptionDTO.ApiResponse;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionRequestDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionResponseDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionItemDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionUpdateDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.ClinicPrescriptionRequestDTO;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import com.HMS.HMS.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    /**
     * Create a new prescription with multiple medications
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> createPrescription(
            @RequestBody PrescriptionRequestDTO requestDTO) {
        try {
            // Log the incoming request for debugging
            System.out.println("Creating prescription for patient: " + requestDTO.getPatientNationalId());
            System.out.println("Admission ID: " + requestDTO.getAdmissionId());
            System.out.println("Number of medications: " + 
                (requestDTO.getPrescriptionItems() != null ? requestDTO.getPrescriptionItems().size() : 0));

            // Validate that prescription contains medications
            if (requestDTO.getPrescriptionItems() == null || requestDTO.getPrescriptionItems().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Prescription must contain at least one medication"));
            }

            PrescriptionResponseDTO prescription = prescriptionService.createPrescription(requestDTO);

            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(prescription.getId())
                    .toUri();

            ApiResponse<PrescriptionResponseDTO> response =
                    ApiResponse.success("Prescription with " + prescription.getTotalMedications() +
                            " medications created successfully", prescription);

            return ResponseEntity.created(location).body(response);

        } catch (IllegalStateException e) {
            System.err.println("Prescription creation failed - IllegalStateException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Duplicate prescription: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            System.err.println("Prescription creation failed - IllegalArgumentException: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid request: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Prescription creation failed - Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create prescription: " + e.getMessage()));
        }
    }

    /**
     * Get all prescriptions with pagination
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PrescriptionResponseDTO>>> getAllPrescriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "prescribedDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        try {
            // Validate and limit page size
            size = Math.min(size, 100);

            Sort.Direction direction = "asc".equalsIgnoreCase(sortOrder) ?
                    Sort.Direction.ASC : Sort.Direction.DESC;

            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            Page<PrescriptionResponseDTO> prescriptions = prescriptionService.getAllPrescriptions(pageable);

            return ResponseEntity.ok(ApiResponse.success("Prescriptions retrieved successfully", prescriptions));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve prescriptions: " + e.getMessage()));
        }
    }

    /**
     * Get prescription by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> getPrescriptionById(@PathVariable Long id) {
        try {
            Optional<PrescriptionResponseDTO> prescription = prescriptionService.getPrescriptionById(id);

            if (prescription.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Prescription found", prescription.get()));
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve prescription: " + e.getMessage()));
        }
    }

    /**
     * Get prescription by prescription ID
     */
    @GetMapping("/prescription-id/{prescriptionId}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> getPrescriptionByPrescriptionId(
            @PathVariable String prescriptionId) {
        try {
            Optional<PrescriptionResponseDTO> prescription =
                    prescriptionService.getPrescriptionByPrescriptionId(prescriptionId);

            if (prescription.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Prescription found", prescription.get()));
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve prescription: " + e.getMessage()));
        }
    }

    /**
     * Get prescriptions by patient national ID
     */
    @GetMapping("/patient/{patientNationalId}")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getPrescriptionsByPatient(
            @PathVariable String patientNationalId,
            @RequestParam(defaultValue = "false") boolean paginated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            if (paginated) {
                size = Math.min(size, 100);
                Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "prescribedDate"));
                Page<PrescriptionResponseDTO> prescriptions =
                        prescriptionService.getPrescriptionsByPatient(patientNationalId, pageable);

                return ResponseEntity.ok(ApiResponse.success(
                        "Patient prescriptions retrieved successfully", prescriptions.getContent()));
            } else {
                List<PrescriptionResponseDTO> prescriptions =
                        prescriptionService.getPrescriptionsByPatient(patientNationalId);

                return ResponseEntity.ok(ApiResponse.success(
                        "Patient prescriptions retrieved successfully", prescriptions));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve patient prescriptions: " + e.getMessage()));
        }
    }

    /**
     * Get prescriptions by admission ID
     */
    @GetMapping("/admission/{admissionId}")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getPrescriptionsByAdmission(
            @PathVariable Long admissionId) {
        try {
            List<PrescriptionResponseDTO> prescriptions =
                    prescriptionService.getPrescriptionsByAdmission(admissionId);

            return ResponseEntity.ok(ApiResponse.success(
                    "Admission prescriptions retrieved successfully", prescriptions));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve admission prescriptions: " + e.getMessage()));
        }
    }

    /**
     * Get prescriptions by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<Page<PrescriptionResponseDTO>>> getPrescriptionsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            PrescriptionStatus prescriptionStatus;
            try {
                prescriptionStatus = PrescriptionStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid status. Valid values: ACTIVE, COMPLETED, DISCONTINUED, EXPIRED"));
            }

            size = Math.min(size, 100);
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "prescribedDate"));
            Page<PrescriptionResponseDTO> prescriptions =
                    prescriptionService.getPrescriptionsByStatus(prescriptionStatus, pageable);

            return ResponseEntity.ok(ApiResponse.success(
                    "Prescriptions by status retrieved successfully", prescriptions));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve prescriptions by status: " + e.getMessage()));
        }
    }

    /**
     * Get active prescriptions for a patient
     */
    @GetMapping("/patient/{patientNationalId}/active")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getActivePrescriptionsByPatient(
            @PathVariable String patientNationalId) {
        try {
            List<PrescriptionResponseDTO> prescriptions =
                    prescriptionService.getActivePrescriptionsByPatient(patientNationalId);

            return ResponseEntity.ok(ApiResponse.success(
                    "Active patient prescriptions retrieved successfully", prescriptions));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve active patient prescriptions: " + e.getMessage()));
        }
    }

    /**
     * Get urgent prescriptions
     */
    @GetMapping("/urgent")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getUrgentPrescriptions() {
        try {
            List<PrescriptionResponseDTO> prescriptions = prescriptionService.getUrgentPrescriptions();

            return ResponseEntity.ok(ApiResponse.success(
                    "Urgent prescriptions retrieved successfully", prescriptions));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve urgent prescriptions: " + e.getMessage()));
        }
    }

    /**
     * Search prescriptions
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<PrescriptionResponseDTO>>> searchPrescriptions(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Search query cannot be empty"));
            }

            size = Math.min(size, 100);
            Pageable pageable = PageRequest.of(page, size);
            Page<PrescriptionResponseDTO> prescriptions =
                    prescriptionService.searchPrescriptions(query.trim(), pageable);

            return ResponseEntity.ok(ApiResponse.success(
                    "Search results retrieved successfully", prescriptions));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to search prescriptions: " + e.getMessage()));
        }
    }

    /**
     * Update prescription
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> updatePrescription(
            @PathVariable Long id,
            @RequestBody PrescriptionUpdateDTO updateDTO) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.updatePrescription(id, updateDTO);

            return ResponseEntity.ok(ApiResponse.success("Prescription updated successfully", prescription));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update prescription: " + e.getMessage()));
        }
    }

    /**
     * Update prescription status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> updatePrescriptionStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            PrescriptionStatus prescriptionStatus;
            try {
                prescriptionStatus = PrescriptionStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid status. Valid values: ACTIVE, COMPLETED, DISCONTINUED, EXPIRED"));
            }

            PrescriptionResponseDTO prescription =
                    prescriptionService.updatePrescriptionStatus(id, prescriptionStatus);

            return ResponseEntity.ok(ApiResponse.success("Prescription status updated successfully", prescription));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update prescription status: " + e.getMessage()));
        }
    }

    /**
     * Complete prescription
     */
    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> completePrescription(@PathVariable Long id) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.completePrescription(id);

            return ResponseEntity.ok(ApiResponse.success("Prescription completed successfully", prescription));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to complete prescription: " + e.getMessage()));
        }
    }

    /**
     * Discontinue prescription
     */
    @PutMapping("/{id}/discontinue")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> discontinuePrescription(@PathVariable Long id) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.discontinuePrescription(id);

            return ResponseEntity.ok(ApiResponse.success("Prescription discontinued successfully", prescription));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to discontinue prescription: " + e.getMessage()));
        }
    }

    /**
     * Delete prescription (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePrescription(@PathVariable Long id) {
        try {
            prescriptionService.deletePrescription(id);

            return ResponseEntity.ok(ApiResponse.success("Prescription deleted successfully", null));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete prescription: " + e.getMessage()));
        }
    }

    /**
     * Get prescription statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<PrescriptionService.PrescriptionStatistics>> getPrescriptionStatistics() {
        try {
            PrescriptionService.PrescriptionStatistics statistics = prescriptionService.getPrescriptionStatistics();

            return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", statistics));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve statistics: " + e.getMessage()));
        }
    }

    /**
     * Get prescriptions expiring soon
     */
    @GetMapping("/expiring")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getPrescriptionsExpiringSoon(
            @RequestParam(defaultValue = "7") int days) {
        try {
            if (days < 1 || days > 365) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Days must be between 1 and 365"));
            }

            List<PrescriptionResponseDTO> prescriptions =
                    prescriptionService.getPrescriptionsExpiringSoon(days);

            return ResponseEntity.ok(ApiResponse.success(
                    "Expiring prescriptions retrieved successfully", prescriptions));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve expiring prescriptions: " + e.getMessage()));
        }
    }

    /**
     * Add prescription item to existing prescription
     */
    @PostMapping("/{prescriptionId}/items")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> addPrescriptionItem(
            @PathVariable Long prescriptionId,
            @RequestBody PrescriptionItemDTO itemDTO) {
        try {
            PrescriptionResponseDTO prescription =
                    prescriptionService.addPrescriptionItem(prescriptionId, itemDTO);

            return ResponseEntity.ok(ApiResponse.success(
                    "Prescription item added successfully", prescription));

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Duplicate medication: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid request: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to add prescription item: " + e.getMessage()));
        }
    }

    /**
     * Remove prescription item from prescription
     */
    @DeleteMapping("/{prescriptionId}/items/{itemId}")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> removePrescriptionItem(
            @PathVariable Long prescriptionId,
            @PathVariable Long itemId) {
        try {
            PrescriptionResponseDTO prescription =
                    prescriptionService.removePrescriptionItem(prescriptionId, itemId);

            return ResponseEntity.ok(ApiResponse.success(
                    "Prescription item removed successfully", prescription));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid request: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to remove prescription item: " + e.getMessage()));
        }
    }

    /**
     * Get all prescriptions without pagination for pharmacy management
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getAllPrescriptionsWithoutPagination() {
        try {
            List<PrescriptionResponseDTO> prescriptions = prescriptionService.getAllPrescriptionsWithoutPagination();
            return ResponseEntity.ok(ApiResponse.success("All prescriptions retrieved successfully", prescriptions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve prescriptions: " + e.getMessage()));
        }
    }

    // ==================== PHARMACY-SPECIFIC ENDPOINTS ====================

    /**
     * Start processing a prescription (pharmacy workflow) - using prescription ID
     */
    @PutMapping("/prescription-id/{prescriptionId}/process")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> startProcessingPrescriptionByPrescriptionId(
            @PathVariable String prescriptionId,
            @RequestBody(required = false) Map<String, Object> processingData) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.startProcessingPrescriptionByPrescriptionId(prescriptionId, processingData);
            return ResponseEntity.ok(ApiResponse.success("Prescription processing started successfully", prescription));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to start processing prescription: " + e.getMessage()));
        }
    }

    /**
     * Start processing a prescription (pharmacy workflow) - using database ID
     */
    @PutMapping("/{id}/process")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> startProcessingPrescription(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> processingData) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.startProcessingPrescription(id, processingData);
            return ResponseEntity.ok(ApiResponse.success("Prescription processing started successfully", prescription));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to start processing prescription: " + e.getMessage()));
        }
    }

    /**
     * Mark prescription as ready for dispensing - using prescription ID
     */
    @PutMapping("/prescription-id/{prescriptionId}/ready")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> markPrescriptionReadyByPrescriptionId(
            @PathVariable String prescriptionId,
            @RequestBody(required = false) Map<String, Object> readyData) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.markPrescriptionReadyByPrescriptionId(prescriptionId, readyData);
            return ResponseEntity.ok(ApiResponse.success("Prescription marked as ready successfully", prescription));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to mark prescription as ready: " + e.getMessage()));
        }
    }

    /**
     * Mark prescription as ready for dispensing
     */
    @PutMapping("/{id}/ready")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> markPrescriptionReady(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> readyData) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.markPrescriptionReady(id, readyData);
            return ResponseEntity.ok(ApiResponse.success("Prescription marked as ready successfully", prescription));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to mark prescription as ready: " + e.getMessage()));
        }
    }

    /**
     * Dispense medication for a prescription - using database ID
     */
    @PostMapping("/{id}/dispense")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> dispenseMedication(
            @PathVariable Long id,
            @RequestBody Map<String, Object> dispensingData) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.dispenseMedication(id, dispensingData);
            return ResponseEntity.ok(ApiResponse.success("Medication dispensed successfully", prescription));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Cannot dispense medication: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to dispense medication: " + e.getMessage()));
        }
    }

    /**
     * Dispense medication for a prescription - using prescription ID
     */
    @PostMapping("/prescription-id/{prescriptionId}/dispense")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> dispenseMedicationByPrescriptionId(
            @PathVariable String prescriptionId,
            @RequestBody Map<String, Object> dispensingData) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.dispenseMedicationByPrescriptionId(prescriptionId, dispensingData);
            return ResponseEntity.ok(ApiResponse.success("Medication dispensed successfully", prescription));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Cannot dispense medication: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to dispense medication: " + e.getMessage()));
        }
    }

    /**
     * Cancel prescription with reason (pharmacy workflow) - using database ID
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> cancelPrescription(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, Object> cancellationData) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.cancelPrescription(id, cancellationData);
            return ResponseEntity.ok(ApiResponse.success("Prescription cancelled successfully", prescription));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to cancel prescription: " + e.getMessage()));
        }
    }

    /**
     * Cancel prescription with reason (pharmacy workflow) - using prescription ID
     */
    @PutMapping("/prescription-id/{prescriptionId}/cancel")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> cancelPrescriptionByPrescriptionId(
            @PathVariable String prescriptionId,
            @RequestBody(required = false) Map<String, Object> cancellationData) {
        try {
            PrescriptionResponseDTO prescription = prescriptionService.cancelPrescriptionByPrescriptionId(prescriptionId, cancellationData);
            return ResponseEntity.ok(ApiResponse.success("Prescription cancelled successfully", prescription));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to cancel prescription: " + e.getMessage()));
        }
    }

    /**
     * Get prescription details with pharmacy-specific information - using database ID
     */
    @GetMapping("/{id}/pharmacy-details")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> getPrescriptionPharmacyDetails(@PathVariable Long id) {
        try {
            Optional<PrescriptionResponseDTO> prescription = prescriptionService.getPrescriptionWithPharmacyDetails(id);

            if (prescription.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Prescription details retrieved successfully", prescription.get()));
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve prescription details: " + e.getMessage()));
        }
    }

    /**
     * Get prescription details with pharmacy-specific information - using prescription ID
     */
    @GetMapping("/prescription-id/{prescriptionId}/pharmacy-details")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> getPrescriptionPharmacyDetailsByPrescriptionId(@PathVariable String prescriptionId) {
        try {
            Optional<PrescriptionResponseDTO> prescription = prescriptionService.getPrescriptionWithPharmacyDetailsByPrescriptionId(prescriptionId);

            if (prescription.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Prescription details retrieved successfully", prescription.get()));
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve prescription details: " + e.getMessage()));
        }
    }

    /**
     * Check drug interactions for prescription medications - using database ID
     */
    @PostMapping("/{id}/check-interactions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> checkDrugInteractions(@PathVariable Long id) {
        try {
            List<Map<String, Object>> interactions = prescriptionService.checkDrugInteractions(id);
            return ResponseEntity.ok(ApiResponse.success("Drug interactions checked successfully", interactions));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to check drug interactions: " + e.getMessage()));
        }
    }

    /**
     * Check drug interactions for prescription medications - using prescription ID
     */
    @PostMapping("/prescription-id/{prescriptionId}/check-interactions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> checkDrugInteractionsByPrescriptionId(@PathVariable String prescriptionId) {
        try {
            List<Map<String, Object>> interactions = prescriptionService.checkDrugInteractionsByPrescriptionId(prescriptionId);
            return ResponseEntity.ok(ApiResponse.success("Drug interactions checked successfully", interactions));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to check drug interactions: " + e.getMessage()));
        }
    }

    /**
     * Get prescriptions by status for pharmacy dashboard (non-paginated)
     */
    @GetMapping("/pharmacy/status/{status}")
    public ResponseEntity<ApiResponse<List<PrescriptionResponseDTO>>> getPharmacyPrescriptionsByStatus(
            @PathVariable String status) {
        try {
            PrescriptionStatus prescriptionStatus;
            try {
                prescriptionStatus = PrescriptionStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid prescription status: " + status));
            }

            Pageable pageable = PageRequest.of(0, 1000); // Large page size to get all results
            Page<PrescriptionResponseDTO> prescriptionsPage = 
                    prescriptionService.getPrescriptionsByStatus(prescriptionStatus, pageable);
            
            return ResponseEntity.ok(ApiResponse.success(
                    "Prescriptions with status " + status + " retrieved successfully", 
                    prescriptionsPage.getContent()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve prescriptions by status: " + e.getMessage()));
        }
    }

    /**
     * Get pharmacy statistics
     */
    @GetMapping("/pharmacy/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPharmacyStatistics() {
        try {
            Map<String, Object> statistics = prescriptionService.getPharmacyStatistics();
            return ResponseEntity.ok(ApiResponse.success("Pharmacy statistics retrieved successfully", statistics));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve pharmacy statistics: " + e.getMessage()));
        }
    }

    /**
     * Download prescription as PDF
     */
    @GetMapping("/{prescriptionId}/pdf")
    public ResponseEntity<byte[]> downloadPrescriptionPDF(@PathVariable String prescriptionId) {
        try {
            byte[] pdfBytes = prescriptionService.generatePrescriptionPDF(prescriptionId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Prescription_" + prescriptionId + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new clinic prescription (outpatient - no admission required)
     */
    @PostMapping("/clinic")
    public ResponseEntity<ApiResponse<PrescriptionResponseDTO>> createClinicPrescription(
            @RequestBody ClinicPrescriptionRequestDTO requestDTO) {
        try {
            // Log the incoming request for debugging
            System.out.println("Creating clinic prescription for patient: " + requestDTO.getPatientNationalId());
            System.out.println("Prescribed by: " + requestDTO.getPrescribedBy());
            System.out.println("Number of medications: " + 
                (requestDTO.getPrescriptionItems() != null ? requestDTO.getPrescriptionItems().size() : 0));
            System.out.println("Is urgent: " + requestDTO.getIsUrgent());

            // Validate that prescription contains medications
            if (requestDTO.getPrescriptionItems() == null || requestDTO.getPrescriptionItems().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Prescription must contain at least one medication"));
            }

            // Validate required fields
            if (requestDTO.getPatientNationalId() == null || requestDTO.getPatientNationalId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Patient National ID is required"));
            }

            if (requestDTO.getPrescribedBy() == null || requestDTO.getPrescribedBy().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Prescribing doctor name is required"));
            }

            PrescriptionResponseDTO prescription = prescriptionService.createClinicPrescription(requestDTO);

            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(prescription.getId())
                    .toUri();

            ApiResponse<PrescriptionResponseDTO> response =
                    ApiResponse.success("Clinic prescription with " + prescription.getTotalMedications() +
                            " medications created successfully", prescription);

            return ResponseEntity.created(location).body(response);

        } catch (IllegalStateException e) {
            System.err.println("Clinic prescription creation failed - IllegalStateException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Duplicate prescription: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            System.err.println("Clinic prescription creation failed - IllegalArgumentException: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid request: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("Clinic prescription creation failed - Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create clinic prescription: " + e.getMessage()));
        }
    }

    /**
     * Get all clinic prescriptions with pagination
     */
    @GetMapping("/clinic")
    public ResponseEntity<ApiResponse<Page<PrescriptionResponseDTO>>> getClinicPrescriptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "prescribedDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<PrescriptionResponseDTO> prescriptions = prescriptionService.getClinicPrescriptions(pageable);

            return ResponseEntity.ok(
                    ApiResponse.success("Clinic prescriptions retrieved successfully", prescriptions)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve clinic prescriptions: " + e.getMessage()));
        }
    }
}