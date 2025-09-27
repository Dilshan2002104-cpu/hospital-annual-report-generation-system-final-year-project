package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.PrescriptionDTO.ApiResponse;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionRequestDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionResponseDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionItemDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionUpdateDTO;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import com.HMS.HMS.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
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
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Duplicate prescription: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid request: " + e.getMessage()));
        } catch (Exception e) {
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
}