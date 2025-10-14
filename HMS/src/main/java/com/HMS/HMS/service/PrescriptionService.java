package com.HMS.HMS.service;

import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionRequestDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionResponseDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionItemDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionUpdateDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.ClinicPrescriptionRequestDTO;
import com.HMS.HMS.model.Admission.Admission;
import com.HMS.HMS.model.Medication.Medication;
import com.HMS.HMS.model.Patient.Patient;
import com.HMS.HMS.model.Prescription.Prescription;
import com.HMS.HMS.model.Prescription.PrescriptionItem;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import com.HMS.HMS.repository.AdmissionRepository;
import com.HMS.HMS.repository.MedicationRepository;
import com.HMS.HMS.repository.PatientRepository;
import com.HMS.HMS.repository.PrescriptionRepository;
import com.HMS.HMS.repository.PrescriptionItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final PatientRepository patientRepository;
    private final AdmissionRepository admissionRepository;
    private final MedicationRepository medicationRepository;
    private final com.HMS.HMS.websocket.PrescriptionNotificationService notificationService;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                             PrescriptionItemRepository prescriptionItemRepository,
                             PatientRepository patientRepository,
                             AdmissionRepository admissionRepository,
                             MedicationRepository medicationRepository,
                             com.HMS.HMS.websocket.PrescriptionNotificationService notificationService) {
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionItemRepository = prescriptionItemRepository;
        this.patientRepository = patientRepository;
        this.admissionRepository = admissionRepository;
        this.medicationRepository = medicationRepository;
        this.notificationService = notificationService;
    }

    /**
     * Create a new prescription with multiple medications
     */
    public PrescriptionResponseDTO createPrescription(PrescriptionRequestDTO requestDTO) {
        try {
            // Generate unique prescription ID
            String prescriptionId = generatePrescriptionId();

            // Validate prescription items
            if (requestDTO.getPrescriptionItems() == null || requestDTO.getPrescriptionItems().isEmpty()) {
                throw new IllegalArgumentException("Prescription must contain at least one medication");
            }

            // Fetch required entities with better error messages
            Patient patient = patientRepository.findByNationalId(requestDTO.getPatientNationalId());
            if (patient == null) {
                throw new IllegalArgumentException("Patient not found with National ID: " + requestDTO.getPatientNationalId());
            }

            Admission admission = admissionRepository.findById(requestDTO.getAdmissionId())
                    .orElseThrow(() -> new IllegalArgumentException("Admission not found with ID: " + requestDTO.getAdmissionId()));

            // Ensure ward relationship is loaded
            admission.getWard(); // This will trigger lazy loading if not already loaded

            // Create prescription container entity with relationships
            Prescription prescription = new Prescription();
            prescription.setPrescriptionId(prescriptionId);
            prescription.setPatient(patient);
            prescription.setAdmission(admission);
            prescription.setPrescribedBy(requestDTO.getPrescribedBy()); // Use string directly
            prescription.setStartDate(requestDTO.getStartDate());
            prescription.setEndDate(requestDTO.getEndDate());
            prescription.setPrescribedDate(LocalDateTime.now());

            // Set ward name safely - handle potential null ward relationship
            try {
                String wardName = admission.getWard() != null ? admission.getWard().getWardName() : "Unknown Ward";
                prescription.setWardName(wardName);
            } catch (Exception e) {
                prescription.setWardName("Unknown Ward");
            }

            prescription.setBedNumber(admission.getBedNumber());
            prescription.setPrescriptionNotes(requestDTO.getPrescriptionNotes());
            prescription.setStatus(PrescriptionStatus.ACTIVE);
            prescription.setTotalMedications(requestDTO.getPrescriptionItems().size());

            // Save prescription container first
            Prescription savedPrescription = prescriptionRepository.save(prescription);

            // Create and save prescription items with medication relationships
            for (PrescriptionItemDTO itemDTO : requestDTO.getPrescriptionItems()) {
                Medication medication = medicationRepository.findById(itemDTO.getMedicationId())
                        .orElseThrow(() -> new IllegalArgumentException("Medication not found with ID: " + itemDTO.getMedicationId()));

                PrescriptionItem item = new PrescriptionItem();
                item.setPrescription(savedPrescription);
                item.setMedication(medication);
                item.setDose(itemDTO.getDose());
                item.setFrequency(itemDTO.getFrequency());
                item.setQuantity(itemDTO.getQuantity());
                item.setQuantityUnit(itemDTO.getQuantityUnit());
                item.setInstructions(itemDTO.getInstructions());
                item.setRoute(itemDTO.getRoute());
                item.setIsUrgent(itemDTO.getIsUrgent() != null ? itemDTO.getIsUrgent() : false);
                item.setItemStatus(PrescriptionStatus.ACTIVE);
                item.setNotes(itemDTO.getNotes());

                prescriptionItemRepository.save(item);
                savedPrescription.addPrescriptionItem(item);
            }

            // Convert to DTO for response
            PrescriptionResponseDTO responseDTO = convertToResponseDTO(savedPrescription);

            // Send WebSocket notification to pharmacy
            try {
                // Check if any medication is urgent
                boolean hasUrgentMeds = requestDTO.getPrescriptionItems().stream()
                        .anyMatch(item -> item.getIsUrgent() != null && item.getIsUrgent());

                if (hasUrgentMeds) {
                    notificationService.notifyUrgentPrescription(responseDTO);
                } else {
                    notificationService.notifyPrescriptionCreated(responseDTO);
                }
            } catch (Exception e) {
                // Log but don't fail prescription creation if WebSocket fails
                System.err.println("Failed to send WebSocket notification: " + e.getMessage());
            }

            return responseDTO;
            
        } catch (IllegalArgumentException e) {
            // Re-throw validation errors
            throw e;
        } catch (Exception e) {
            // Log and wrap unexpected errors
            throw new RuntimeException("Failed to create prescription: " + e.getMessage(), e);
        }
    }

    /**
     * Get prescription by ID
     */
    @Transactional(readOnly = true)
    public Optional<PrescriptionResponseDTO> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id)
                .map(this::convertToResponseDTO);
    }

    /**
     * Get prescription by prescription ID
     */
    @Transactional(readOnly = true)
    public Optional<PrescriptionResponseDTO> getPrescriptionByPrescriptionId(String prescriptionId) {
        return prescriptionRepository.findByPrescriptionId(prescriptionId)
                .map(this::convertToResponseDTO);
    }

    /**
     * Get all prescriptions with pagination
     */
    @Transactional(readOnly = true)
    public Page<PrescriptionResponseDTO> getAllPrescriptions(Pageable pageable) {
        return prescriptionRepository.findAll(pageable)
                .map(this::convertToResponseDTO);
    }

    /**
     * Get all prescriptions without pagination for pharmacy management
     */
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDTO> getAllPrescriptionsWithoutPagination() {
        return prescriptionRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get prescriptions by patient national ID
     */
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDTO> getPrescriptionsByPatient(String patientNationalId) {
        return prescriptionRepository.findByPatientNationalIdOrderByPrescribedDateDesc(patientNationalId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get prescriptions by patient national ID with pagination
     */
    @Transactional(readOnly = true)
    public Page<PrescriptionResponseDTO> getPrescriptionsByPatient(String patientNationalId, Pageable pageable) {
        return prescriptionRepository.findByPatientNationalIdOrderByPrescribedDateDesc(patientNationalId, pageable)
                .map(this::convertToResponseDTO);
    }

    /**
     * Get prescriptions by admission ID
     */
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDTO> getPrescriptionsByAdmission(Long admissionId) {
        return prescriptionRepository.findByAdmission(admissionId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get prescriptions by status
     */
    @Transactional(readOnly = true)
    public Page<PrescriptionResponseDTO> getPrescriptionsByStatus(PrescriptionStatus status, Pageable pageable) {
        return prescriptionRepository.findByStatusOrderByPrescribedDateDesc(status, pageable)
                .map(this::convertToResponseDTO);
    }

    /**
     * Get active prescriptions for a patient
     */
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDTO> getActivePrescriptionsByPatient(String patientNationalId) {
        return prescriptionRepository.findByPatientNationalIdAndStatusOrderByPrescribedDateDesc(
                patientNationalId, PrescriptionStatus.ACTIVE)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get prescriptions with urgent medications
     */
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDTO> getUrgentPrescriptions() {
        // Get prescription items that are urgent
        List<PrescriptionItem> urgentItems = prescriptionItemRepository.findByIsUrgentTrueAndItemStatusOrderByCreatedAtDesc(PrescriptionStatus.ACTIVE);

        // Get unique prescriptions from urgent items
        return urgentItems.stream()
                .map(PrescriptionItem::getPrescription)
                .distinct()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search prescriptions
     */
    @Transactional(readOnly = true)
    public Page<PrescriptionResponseDTO> searchPrescriptions(String searchTerm, Pageable pageable) {
        return prescriptionRepository.searchPrescriptions(searchTerm, pageable)
                .map(this::convertToResponseDTO);
    }

    /**
     * Update prescription metadata (not individual items)
     */
    public PrescriptionResponseDTO updatePrescription(Long id, PrescriptionUpdateDTO updateDTO) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + id));

        // Update prescription container fields
        if (updateDTO.getStartDate() != null) {
            prescription.setStartDate(updateDTO.getStartDate());
        }
        if (updateDTO.getEndDate() != null) {
            prescription.setEndDate(updateDTO.getEndDate());
        }
        if (updateDTO.getStatus() != null) {
            prescription.setStatus(updateDTO.getStatus());
            // Update all prescription item statuses to match
            for (PrescriptionItem item : prescription.getPrescriptionItems()) {
                item.setItemStatus(updateDTO.getStatus());
                prescriptionItemRepository.save(item);
            }
        }
        if (updateDTO.getPrescriptionNotes() != null) {
            prescription.setPrescriptionNotes(updateDTO.getPrescriptionNotes());
        }

        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return convertToResponseDTO(updatedPrescription);
    }

    /**
     * Add prescription item to existing prescription
     */
    public PrescriptionResponseDTO addPrescriptionItem(Long prescriptionId, PrescriptionItemDTO itemDTO) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + prescriptionId));

        // Fetch Medication entity
        Medication medication = medicationRepository.findById(itemDTO.getMedicationId())
                .orElseThrow(() -> new IllegalArgumentException("Medication not found with ID: " + itemDTO.getMedicationId()));

        // Create new prescription item with medication relationship
        PrescriptionItem item = new PrescriptionItem();
        item.setPrescription(prescription);
        item.setMedication(medication);
        item.setDose(itemDTO.getDose());
        item.setFrequency(itemDTO.getFrequency());
        item.setQuantity(itemDTO.getQuantity());
        item.setQuantityUnit(itemDTO.getQuantityUnit());
        item.setInstructions(itemDTO.getInstructions());
        item.setRoute(itemDTO.getRoute());
        item.setIsUrgent(itemDTO.getIsUrgent() != null ? itemDTO.getIsUrgent() : false);
        item.setItemStatus(PrescriptionStatus.ACTIVE);
        item.setNotes(itemDTO.getNotes());

        prescriptionItemRepository.save(item);
        prescription.addPrescriptionItem(item);
        prescriptionRepository.save(prescription);

        return convertToResponseDTO(prescription);
    }

    /**
     * Remove prescription item from prescription
     */
    public PrescriptionResponseDTO removePrescriptionItem(Long prescriptionId, Long itemId) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + prescriptionId));

        PrescriptionItem item = prescriptionItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription item not found with ID: " + itemId));

        if (!item.getPrescription().getId().equals(prescriptionId)) {
            throw new IllegalArgumentException("Prescription item does not belong to the specified prescription");
        }

        prescription.removePrescriptionItem(item);
        prescriptionItemRepository.delete(item);
        prescriptionRepository.save(prescription);

        return convertToResponseDTO(prescription);
    }

    /**
     * Update prescription status
     */
    public PrescriptionResponseDTO updatePrescriptionStatus(Long id, PrescriptionStatus status) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + id));

        prescription.setStatus(status);
        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        return convertToResponseDTO(updatedPrescription);
    }

    /**
     * Complete prescription
     */
    public PrescriptionResponseDTO completePrescription(Long id) {
        return updatePrescriptionStatus(id, PrescriptionStatus.COMPLETED);
    }

    /**
     * Discontinue prescription
     */
    public PrescriptionResponseDTO discontinuePrescription(Long id) {
        return updatePrescriptionStatus(id, PrescriptionStatus.DISCONTINUED);
    }

    /**
     * Delete prescription (soft delete by changing status)
     */
    public void deletePrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + id));

        prescription.setStatus(PrescriptionStatus.DISCONTINUED);
        prescriptionRepository.save(prescription);
    }

    /**
     * Hard delete prescription (permanent deletion)
     */
    public void hardDeletePrescription(Long id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new IllegalArgumentException("Prescription not found with ID: " + id);
        }
        prescriptionRepository.deleteById(id);
    }

    /**
     * Get prescription statistics
     */
    @Transactional(readOnly = true)
    public PrescriptionStatistics getPrescriptionStatistics() {
        List<Object[]> statusStats = prescriptionRepository.getPrescriptionStatusStatistics();

        PrescriptionStatistics stats = new PrescriptionStatistics();

        for (Object[] stat : statusStats) {
            PrescriptionStatus status = (PrescriptionStatus) stat[0];
            Long count = (Long) stat[1];

            switch (status) {
                case PENDING -> { /* Count as active for now */ stats.setActiveCount(stats.getActiveCount() + count.intValue()); }
                case ACTIVE -> stats.setActiveCount(stats.getActiveCount() + count.intValue());
                case IN_PROGRESS -> { /* Count as active for now */ stats.setActiveCount(stats.getActiveCount() + count.intValue()); }
                case READY -> { /* Count as active for now */ stats.setActiveCount(stats.getActiveCount() + count.intValue()); }
                case COMPLETED -> stats.setCompletedCount(count.intValue());
                case DISCONTINUED -> stats.setDiscontinuedCount(count.intValue());
                case EXPIRED -> stats.setExpiredCount(count.intValue());
            }
        }

        stats.setTotalCount(stats.getActiveCount() + stats.getCompletedCount() +
                          stats.getDiscontinuedCount() + stats.getExpiredCount());

        // Get today's prescription items count
        stats.setTodayCount(prescriptionItemRepository.findItemsCreatedToday().size());

        // Get urgent prescriptions count (from prescription items)
        stats.setUrgentCount((int) prescriptionItemRepository.countByIsUrgentTrueAndItemStatus(PrescriptionStatus.ACTIVE));

        return stats;
    }

    /**
     * Get prescriptions expiring soon
     */
    @Transactional(readOnly = true)
    public List<PrescriptionResponseDTO> getPrescriptionsExpiringSoon(int days) {
        LocalDate endDate = LocalDate.now().plusDays(days);
        return prescriptionRepository.findPrescriptionsExpiringSoon(endDate, PrescriptionStatus.ACTIVE)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Generate unique prescription ID
     */
    private String generatePrescriptionId() {
        String prefix = "RX";
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));

        // Get today's prescription count (all statuses) to generate sequence
        long todayCount = prescriptionRepository.countPrescriptionsByDateRange(
                LocalDateTime.now().withHour(0).withMinute(0).withSecond(0),
                LocalDateTime.now().withHour(23).withMinute(59).withSecond(59)) + 1;

        // Generate ID and ensure it's unique (in case of race conditions)
        String prescriptionId;
        int attempts = 0;
        do {
            prescriptionId = String.format("%s%s%03d", prefix, datePart, todayCount + attempts);
            attempts++;
        } while (prescriptionRepository.existsByPrescriptionId(prescriptionId) && attempts < 100);

        if (attempts >= 100) {
            throw new RuntimeException("Unable to generate unique prescription ID after 100 attempts");
        }

        return prescriptionId;
    }

    /**
     * Convert entity to response DTO
     */
    private PrescriptionResponseDTO convertToResponseDTO(Prescription prescription) {
        // Convert prescription items to DTOs
        List<PrescriptionItemDTO> itemDTOs = prescription.getPrescriptionItems().stream()
                .map(this::convertToPrescriptionItemDTO)
                .collect(Collectors.toList());

        return new PrescriptionResponseDTO(
                prescription.getId(),
                prescription.getPrescriptionId(),
                prescription.getPatientNationalId(),
                prescription.getPatientName(),
                prescription.getAdmissionId(),
                prescription.getStartDate(),
                prescription.getEndDate(),
                prescription.getPrescribedBy(), 
                prescription.getPrescribedDate(),
                prescription.getLastModified(),
                prescription.getStatus(),
                prescription.getCreatedAt(),
                prescription.getWardName(),
                prescription.getBedNumber(),
                prescription.getTotalMedications(),
                prescription.getPrescriptionNotes(),
                itemDTOs
        );
    }

    /**
     * Convert prescription item entity to DTO
     */
    private PrescriptionItemDTO convertToPrescriptionItemDTO(PrescriptionItem item) {
        PrescriptionItemDTO dto = new PrescriptionItemDTO();
        dto.setId(item.getId());
        dto.setDrugName(item.getDrugName());
        dto.setDose(item.getDose());
        dto.setFrequency(item.getFrequency());
        dto.setQuantity(item.getQuantity());
        dto.setQuantityUnit(item.getQuantityUnit());
        dto.setInstructions(item.getInstructions());
        dto.setRoute(item.getRoute());
        dto.setIsUrgent(item.getIsUrgent());
        dto.setItemStatus(item.getItemStatus());
        dto.setDosageForm(item.getDosageForm());
        dto.setGenericName(item.getGenericName());
        dto.setManufacturer(item.getManufacturer());
        dto.setNotes(item.getNotes());
        return dto;
    }

    /**
     * Statistics class for prescription data
     */
    public static class PrescriptionStatistics {
        private int totalCount;
        private int activeCount;
        private int completedCount;
        private int discontinuedCount;
        private int expiredCount;
        private int todayCount;
        private int urgentCount;

        // Getters and Setters
        public int getTotalCount() { return totalCount; }
        public void setTotalCount(int totalCount) { this.totalCount = totalCount; }

        public int getActiveCount() { return activeCount; }
        public void setActiveCount(int activeCount) { this.activeCount = activeCount; }

        public int getCompletedCount() { return completedCount; }
        public void setCompletedCount(int completedCount) { this.completedCount = completedCount; }

        public int getDiscontinuedCount() { return discontinuedCount; }
        public void setDiscontinuedCount(int discontinuedCount) { this.discontinuedCount = discontinuedCount; }

        public int getExpiredCount() { return expiredCount; }
        public void setExpiredCount(int expiredCount) { this.expiredCount = expiredCount; }

        public int getTodayCount() { return todayCount; }
        public void setTodayCount(int todayCount) { this.todayCount = todayCount; }

        public int getUrgentCount() { return urgentCount; }
        public void setUrgentCount(int urgentCount) { this.urgentCount = urgentCount; }
    }

    // ==================== PHARMACY-SPECIFIC METHODS ====================

    /**
     * Start processing a prescription (pharmacy workflow)
     */
    public PrescriptionResponseDTO startProcessingPrescription(Long id, Map<String, Object> processingData) {
        return updatePrescriptionStatus(id, PrescriptionStatus.ACTIVE);
    }

    /**
     * Mark prescription as ready for dispensing
     */
    public PrescriptionResponseDTO markPrescriptionReady(Long id, Map<String, Object> readyData) {
        return updatePrescriptionStatus(id, PrescriptionStatus.ACTIVE);
    }

    /**
     * Dispense medication for a prescription
     */
    public PrescriptionResponseDTO dispenseMedication(Long id, Map<String, Object> dispensingData) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with id: " + id));

        // Validate prescription can be dispensed
        if (prescription.getStatus() != PrescriptionStatus.ACTIVE) {
            throw new IllegalStateException("Prescription must be in ACTIVE status to be dispensed");
        }

        // Update prescription status to completed (dispensed)
        prescription.setStatus(PrescriptionStatus.COMPLETED);
        prescription.setLastModified(LocalDateTime.now());

        // Save pharmacist information if provided (can be enhanced later)
        if (dispensingData != null) {
            // Pharmacist information is available in dispensingData
            // Can be stored in prescription notes or separate tracking entity
        }

        prescription = prescriptionRepository.save(prescription);
        PrescriptionResponseDTO responseDTO = convertToResponseDTO(prescription);

        // Send WebSocket notification to Ward Management
        try {
            notificationService.notifyPrescriptionDispensed(responseDTO);
        } catch (Exception e) {
            System.err.println("Failed to send WebSocket notification for dispensing: " + e.getMessage());
        }

        return responseDTO;
    }

    /**
     * Cancel prescription with reason (pharmacy workflow)
     */
    public PrescriptionResponseDTO cancelPrescription(Long id, Map<String, Object> cancellationData) {
        return updatePrescriptionStatus(id, PrescriptionStatus.DISCONTINUED);
    }

    /**
     * Get prescription details with pharmacy-specific information
     */
    public Optional<PrescriptionResponseDTO> getPrescriptionWithPharmacyDetails(Long id) {
        return getPrescriptionById(id); // Using existing method for now
    }

    /**
     * Check drug interactions for prescription medications
     */
    public List<Map<String, Object>> checkDrugInteractions(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with id: " + id));

        List<Map<String, Object>> interactions = new java.util.ArrayList<>();
        
        // Simple interaction checking logic (can be enhanced)
        List<PrescriptionItem> items = prescription.getPrescriptionItems();
        for (int i = 0; i < items.size(); i++) {
            for (int j = i + 1; j < items.size(); j++) {
                PrescriptionItem item1 = items.get(i);
                PrescriptionItem item2 = items.get(j);
                
                // Example interaction check (replace with actual drug interaction database)
                String drug1 = item1.getDrugName().toLowerCase();
                String drug2 = item2.getDrugName().toLowerCase();
                
                if ((drug1.contains("warfarin") && drug2.contains("aspirin")) ||
                    (drug1.contains("aspirin") && drug2.contains("warfarin"))) {
                    
                    Map<String, Object> interaction = new java.util.HashMap<>();
                    interaction.put("severity", "high");
                    interaction.put("drugs", List.of(item1.getDrugName(), item2.getDrugName()));
                    interaction.put("description", "Increased risk of bleeding when warfarin and aspirin are taken together");
                    interactions.add(interaction);
                }
            }
        }
        
        return interactions;
    }

    /**
     * Get prescriptions by status (non-paginated version for frontend)
     */
    public List<PrescriptionResponseDTO> getPrescriptionsByStatus(PrescriptionStatus status) {
        List<Prescription> prescriptions = prescriptionRepository.findByStatusOrderByPrescribedDateDesc(status);
        return prescriptions.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get pharmacy statistics
     */
    public Map<String, Object> getPharmacyStatistics() {
        PrescriptionStatistics stats = getPrescriptionStatistics();
        
        Map<String, Object> pharmacyStats = new java.util.HashMap<>();
        pharmacyStats.put("totalPrescriptions", stats.getTotalCount());
        pharmacyStats.put("activePrescriptions", stats.getActiveCount());
        pharmacyStats.put("completedPrescriptions", stats.getCompletedCount());
        pharmacyStats.put("discontinuedPrescriptions", stats.getDiscontinuedCount());
        pharmacyStats.put("expiredPrescriptions", stats.getExpiredCount());
        pharmacyStats.put("todayPrescriptions", stats.getTodayCount());
        pharmacyStats.put("urgentPrescriptions", stats.getUrgentCount());
        
        // Additional pharmacy-specific calculations
        pharmacyStats.put("pendingDispensing", stats.getActiveCount());
        pharmacyStats.put("dispensedToday", stats.getCompletedCount()); // Simplified - could be enhanced
        pharmacyStats.put("processingRate", 
            stats.getTotalCount() > 0 ? 
                Math.round(((double) stats.getCompletedCount() / stats.getTotalCount()) * 100) : 0);
        
        return pharmacyStats;
    }

    // ==================== PRESCRIPTION ID-BASED METHODS ====================

    /**
     * Start processing a prescription by prescription ID
     */
    public PrescriptionResponseDTO startProcessingPrescriptionByPrescriptionId(String prescriptionId, Map<String, Object> processingData) {
        Prescription prescription = prescriptionRepository.findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + prescriptionId));
        return startProcessingPrescriptionInternal(prescription, processingData);
    }

    /**
     * Mark prescription as ready by prescription ID
     */
    public PrescriptionResponseDTO markPrescriptionReadyByPrescriptionId(String prescriptionId, Map<String, Object> readyData) {
        Prescription prescription = prescriptionRepository.findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + prescriptionId));
        return markPrescriptionReadyInternal(prescription, readyData);
    }

    /**
     * Dispense medication by prescription ID
     */
    public PrescriptionResponseDTO dispenseMedicationByPrescriptionId(String prescriptionId, Map<String, Object> dispensingData) {
        Prescription prescription = prescriptionRepository.findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + prescriptionId));
        return dispenseMedicationInternal(prescription, dispensingData);
    }

    /**
     * Cancel prescription by prescription ID
     */
    public PrescriptionResponseDTO cancelPrescriptionByPrescriptionId(String prescriptionId, Map<String, Object> cancellationData) {
        Prescription prescription = prescriptionRepository.findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + prescriptionId));
        return cancelPrescriptionInternal(prescription, cancellationData);
    }

    /**
     * Get prescription with pharmacy details by prescription ID
     */
    public Optional<PrescriptionResponseDTO> getPrescriptionWithPharmacyDetailsByPrescriptionId(String prescriptionId) {
        Optional<Prescription> prescription = prescriptionRepository.findByPrescriptionId(prescriptionId);
        return prescription.map(this::convertToResponseDTO);
    }

    /**
     * Check drug interactions by prescription ID
     */
    public List<Map<String, Object>> checkDrugInteractionsByPrescriptionId(String prescriptionId) {
        Prescription prescription = prescriptionRepository.findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + prescriptionId));
        return checkDrugInteractionsInternal(prescription);
    }

    // ==================== INTERNAL HELPER METHODS ====================

    /**
     * Internal method to handle prescription processing logic
     */
    private PrescriptionResponseDTO startProcessingPrescriptionInternal(Prescription prescription, Map<String, Object> processingData) {
        // Validate that prescription can be processed
        if (prescription.getStatus() != PrescriptionStatus.PENDING && 
            prescription.getStatus() != PrescriptionStatus.ACTIVE) {
            throw new IllegalStateException("Prescription cannot be processed in current status: " + prescription.getStatus());
        }

        // Update prescription status
        prescription.setStatus(PrescriptionStatus.IN_PROGRESS);
        prescription.setLastModified(LocalDateTime.now());

        // Add processing notes if provided
        if (processingData != null && processingData.containsKey("notes")) {
            String existingNotes = prescription.getPrescriptionNotes() != null ? prescription.getPrescriptionNotes() : "";
            String newNotes = "Processing started: " + processingData.get("notes");
            prescription.setPrescriptionNotes(existingNotes.isEmpty() ? newNotes : existingNotes + "\\n" + newNotes);
        }

        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return convertToResponseDTO(savedPrescription);
    }

    /**
     * Internal method to handle marking prescription as ready
     */
    private PrescriptionResponseDTO markPrescriptionReadyInternal(Prescription prescription, Map<String, Object> readyData) {
        // Validate that prescription can be marked ready
        if (prescription.getStatus() != PrescriptionStatus.IN_PROGRESS) {
            throw new IllegalStateException("Prescription must be in progress to mark as ready: " + prescription.getStatus());
        }

        prescription.setStatus(PrescriptionStatus.READY);
        prescription.setLastModified(LocalDateTime.now());

        // Add ready notes if provided
        if (readyData != null && readyData.containsKey("notes")) {
            String existingNotes = prescription.getPrescriptionNotes() != null ? prescription.getPrescriptionNotes() : "";
            String newNotes = "Ready for dispensing: " + readyData.get("notes");
            prescription.setPrescriptionNotes(existingNotes.isEmpty() ? newNotes : existingNotes + "\\n" + newNotes);
        }

        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return convertToResponseDTO(savedPrescription);
    }

    /**
     * Internal method to handle medication dispensing
     */
    private PrescriptionResponseDTO dispenseMedicationInternal(Prescription prescription, Map<String, Object> dispensingData) {
        // Validate that prescription can be dispensed
        if (prescription.getStatus() != PrescriptionStatus.ACTIVE &&
            prescription.getStatus() != PrescriptionStatus.READY &&
            prescription.getStatus() != PrescriptionStatus.IN_PROGRESS) {
            throw new IllegalStateException("Prescription cannot be dispensed in current status: " + prescription.getStatus());
        }

        // Update medication inventory - decrease stock for each prescription item
        for (PrescriptionItem item : prescription.getPrescriptionItems()) {
            if (item.getMedication() != null) {
                Medication medication = item.getMedication();
                int quantityToDispense = item.getQuantity();

                // Check if sufficient stock is available
                if (medication.getCurrentStock() < quantityToDispense) {
                    throw new IllegalStateException(
                        "Insufficient stock for medication: " + medication.getDrugName() +
                        ". Available: " + medication.getCurrentStock() +
                        ", Required: " + quantityToDispense
                    );
                }

                // Decrease the stock
                int newStock = medication.getCurrentStock() - quantityToDispense;
                medication.setCurrentStock(newStock);
                medicationRepository.save(medication);

                System.out.println("Inventory updated: " + medication.getDrugName() +
                                 " - Dispensed: " + quantityToDispense +
                                 ", Remaining stock: " + newStock);

                // Send real-time WebSocket notification for inventory update
                try {
                    notificationService.notifyInventoryUpdated(
                        medication.getDrugName(),
                        quantityToDispense,
                        newStock
                    );
                } catch (Exception e) {
                    System.err.println("Failed to send inventory WebSocket notification: " + e.getMessage());
                }
            }
        }

        // Mark prescription as dispensed
        prescription.setStatus(PrescriptionStatus.COMPLETED);
        prescription.setLastModified(LocalDateTime.now());
        // Note: dispensedDate and dispensedBy fields don't exist in the model, storing in notes instead

        // Add dispensing information
        if (dispensingData != null) {
            String existingNotes = prescription.getPrescriptionNotes() != null ? prescription.getPrescriptionNotes() : "";
            String dispensingNote = "Dispensed on: " + LocalDateTime.now();

            if (dispensingData.containsKey("dispensedBy")) {
                dispensingNote += " by " + dispensingData.get("dispensedBy").toString();
            }
            if (dispensingData.containsKey("notes")) {
                dispensingNote += " - " + dispensingData.get("notes");
            }

            prescription.setPrescriptionNotes(existingNotes.isEmpty() ? dispensingNote : existingNotes + "\\n" + dispensingNote);
        }

        Prescription savedPrescription = prescriptionRepository.save(prescription);
        PrescriptionResponseDTO responseDTO = convertToResponseDTO(savedPrescription);

        // Send WebSocket notification to Ward Management
        try {
            notificationService.notifyPrescriptionDispensed(responseDTO);
        } catch (Exception e) {
            System.err.println("Failed to send WebSocket notification for dispensing: " + e.getMessage());
        }

        return responseDTO;
    }

    /**
     * Internal method to handle prescription cancellation
     */
    private PrescriptionResponseDTO cancelPrescriptionInternal(Prescription prescription, Map<String, Object> cancellationData) {
        // Validate that prescription can be cancelled
        if (prescription.getStatus() == PrescriptionStatus.COMPLETED || 
            prescription.getStatus() == PrescriptionStatus.DISCONTINUED) {
            throw new IllegalStateException("Cannot cancel prescription in current status: " + prescription.getStatus());
        }

        prescription.setStatus(PrescriptionStatus.DISCONTINUED);
        prescription.setLastModified(LocalDateTime.now());

        // Add cancellation reason if provided
        if (cancellationData != null && cancellationData.containsKey("reason")) {
            String existingNotes = prescription.getPrescriptionNotes() != null ? prescription.getPrescriptionNotes() : "";
            String cancellationNote = "Cancelled: " + cancellationData.get("reason");
            prescription.setPrescriptionNotes(existingNotes.isEmpty() ? cancellationNote : existingNotes + "\\n" + cancellationNote);
        }

        // Add cancelled by if provided
        if (cancellationData != null && cancellationData.containsKey("cancelledBy")) {
            String existingNotes = prescription.getPrescriptionNotes() != null ? prescription.getPrescriptionNotes() : "";
            String cancelledByNote = "Cancelled by: " + cancellationData.get("cancelledBy");
            prescription.setPrescriptionNotes(existingNotes + "\\n" + cancelledByNote);
        }

        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return convertToResponseDTO(savedPrescription);
    }

    /**
     * Internal method to check drug interactions
     */
    private List<Map<String, Object>> checkDrugInteractionsInternal(Prescription prescription) {
        List<Map<String, Object>> interactions = new java.util.ArrayList<>();

        // Get all medications in this prescription
        List<PrescriptionItem> items = prescription.getPrescriptionItems();

        // Simple interaction checking (this would be enhanced with a real drug interaction database)
        for (int i = 0; i < items.size(); i++) {
            for (int j = i + 1; j < items.size(); j++) {
                PrescriptionItem item1 = items.get(i);
                PrescriptionItem item2 = items.get(j);

                // Simulate drug interaction checking
                Map<String, Object> interaction = checkDrugPairInteraction(
                    item1.getMedication(), item2.getMedication());
                
                if (interaction != null) {
                    interactions.add(interaction);
                }
            }
        }

        return interactions;
    }

    /**
     * Check interaction between two medications (simplified implementation)
     */
    private Map<String, Object> checkDrugPairInteraction(Medication med1, Medication med2) {
        // This is a simplified example. In a real system, you would:
        // 1. Query a drug interaction database
        // 2. Check contraindications
        // 3. Consider dosages and patient conditions
        
        // Example interactions (simplified)
        String med1Name = med1.getDrugName().toLowerCase();
        String med2Name = med2.getDrugName().toLowerCase();

        // Some basic interaction checks
        if ((med1Name.contains("warfarin") && med2Name.contains("aspirin")) ||
            (med1Name.contains("aspirin") && med2Name.contains("warfarin"))) {
            
            Map<String, Object> interaction = new java.util.HashMap<>();
            interaction.put("medication1", med1.getDrugName());
            interaction.put("medication2", med2.getDrugName());
            interaction.put("severity", "HIGH");
            interaction.put("description", "Increased risk of bleeding when warfarin and aspirin are used together");
            interaction.put("recommendation", "Monitor bleeding parameters closely. Consider alternative therapy.");
            return interaction;
        }

        if ((med1Name.contains("lisinopril") && med2Name.contains("potassium")) ||
            (med1Name.contains("potassium") && med2Name.contains("lisinopril"))) {
            
            Map<String, Object> interaction = new java.util.HashMap<>();
            interaction.put("medication1", med1.getDrugName());
            interaction.put("medication2", med2.getDrugName());
            interaction.put("severity", "MODERATE");
            interaction.put("description", "ACE inhibitors can increase potassium levels");
            interaction.put("recommendation", "Monitor serum potassium levels regularly");
            return interaction;
        }

        // No interaction found
        return null;
    }

    /**
     * Generate prescription PDF
     */
    public byte[] generatePrescriptionPDF(String prescriptionId) {
        // Find prescription by prescription ID
        Prescription prescription = prescriptionRepository.findByPrescriptionId(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + prescriptionId));

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Hospital Header
            Paragraph header = new Paragraph("National Institute of Nephrology,\nDialysis and Transplantation")
                    .setFontSize(16)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(header);

            Paragraph title = new Paragraph("PRESCRIPTION")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);

            // Prescription Details
            document.add(new Paragraph("Prescription ID: " + prescription.getPrescriptionId()).setBold());
            document.add(new Paragraph("Date: " + prescription.getPrescribedDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))));
            document.add(new Paragraph(""));

            // Patient Information
            document.add(new Paragraph("PATIENT INFORMATION").setBold().setFontSize(14));
            document.add(new Paragraph("Name: " + prescription.getPatient().getFirstName() + " " + prescription.getPatient().getLastName()));
            document.add(new Paragraph("National ID: " + prescription.getPatient().getNationalId()));
            if (prescription.getWardName() != null) {
                document.add(new Paragraph("Ward: " + prescription.getWardName() + " - Bed: " + prescription.getBedNumber()));
            }
            document.add(new Paragraph(""));

            // Prescription Details
            document.add(new Paragraph("PRESCRIPTION DETAILS").setBold().setFontSize(14));
            document.add(new Paragraph("Prescribed by: " + prescription.getPrescribedBy()));
            document.add(new Paragraph("Start Date: " + prescription.getStartDate()));
            if (prescription.getEndDate() != null) {
                document.add(new Paragraph("End Date: " + prescription.getEndDate()));
            }
            document.add(new Paragraph(""));

            // Medications Table
            document.add(new Paragraph("MEDICATIONS (" + prescription.getTotalMedications() + ")").setBold().setFontSize(14));

            float[] columnWidths = {4, 3, 3, 2, 4};
            Table table = new Table(columnWidths);
            table.setWidth(pdfDoc.getDefaultPageSize().getWidth() - 80);

            // Table Headers
            DeviceRgb headerColor = new DeviceRgb(59, 130, 246);
            table.addHeaderCell(new Cell().add(new Paragraph("Drug Name").setBold().setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(headerColor));
            table.addHeaderCell(new Cell().add(new Paragraph("Dosage").setBold().setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(headerColor));
            table.addHeaderCell(new Cell().add(new Paragraph("Frequency").setBold().setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(headerColor));
            table.addHeaderCell(new Cell().add(new Paragraph("Quantity").setBold().setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(headerColor));
            table.addHeaderCell(new Cell().add(new Paragraph("Instructions").setBold().setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(headerColor));

            // Table Rows
            for (PrescriptionItem item : prescription.getPrescriptionItems()) {
                table.addCell(new Cell().add(new Paragraph(item.getDrugName())));
                table.addCell(new Cell().add(new Paragraph(item.getDose())));
                table.addCell(new Cell().add(new Paragraph(item.getFrequency())));
                table.addCell(new Cell().add(new Paragraph(item.getQuantity() + " " + (item.getQuantityUnit() != null ? item.getQuantityUnit() : ""))));
                table.addCell(new Cell().add(new Paragraph(item.getInstructions() != null ? item.getInstructions() : "")));
            }

            document.add(table);
            document.add(new Paragraph(""));

            // Notes
            if (prescription.getPrescriptionNotes() != null && !prescription.getPrescriptionNotes().isEmpty()) {
                document.add(new Paragraph("NOTES").setBold().setFontSize(14));
                document.add(new Paragraph(prescription.getPrescriptionNotes()));
                document.add(new Paragraph(""));
            }

            // Footer
            document.add(new Paragraph("").setMarginTop(30));
            document.add(new Paragraph("_________________________")
                    .setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph("Pharmacist Signature")
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setFontSize(10));

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
        }
    }

    /**
     * Create a clinic prescription (outpatient - no admission required)
     */
    @Transactional
    public PrescriptionResponseDTO createClinicPrescription(ClinicPrescriptionRequestDTO requestDTO) {
        try {
            // Generate unique prescription ID
            String prescriptionId = generatePrescriptionId();

            // Validate prescription items
            if (requestDTO.getPrescriptionItems() == null || requestDTO.getPrescriptionItems().isEmpty()) {
                throw new IllegalArgumentException("Prescription must contain at least one medication");
            }

            // Fetch patient
            Patient patient = patientRepository.findByNationalId(requestDTO.getPatientNationalId());
            if (patient == null) {
                throw new IllegalArgumentException("Patient not found with National ID: " + requestDTO.getPatientNationalId());
            }

            // Create prescription container entity for clinic (no admission)
            Prescription prescription = new Prescription();
            prescription.setPrescriptionId(prescriptionId);
            prescription.setPatient(patient);
            prescription.setAdmission(null); // No admission for clinic prescriptions
            prescription.setPrescribedBy(requestDTO.getPrescribedBy());
            prescription.setStartDate(requestDTO.getStartDate());
            prescription.setEndDate(requestDTO.getEndDate());
            prescription.setPrescribedDate(LocalDateTime.now());

            // Set clinic-specific fields
            prescription.setWardName("Outpatient Clinic"); // Set as clinic
            prescription.setBedNumber(null); // No bed for outpatient
            prescription.setPrescriptionNotes(requestDTO.getPrescriptionNotes());
            prescription.setStatus(PrescriptionStatus.PENDING); // Start as pending for clinic
            prescription.setTotalMedications(requestDTO.getPrescriptionItems().size());
            
            // Set urgent flag if specified
            if (requestDTO.getIsUrgent() != null && requestDTO.getIsUrgent()) {
                prescription.setPrescriptionNotes(
                    (prescription.getPrescriptionNotes() != null ? prescription.getPrescriptionNotes() + " " : "") + 
                    "[URGENT]"
                );
            }

            // Save prescription container first
            Prescription savedPrescription = prescriptionRepository.save(prescription);

            // Create and save prescription items with medication relationships
            for (PrescriptionItemDTO itemDTO : requestDTO.getPrescriptionItems()) {
                // Find medication by drug name
                Medication medication = medicationRepository.findByDrugName(itemDTO.getDrugName());
                if (medication == null) {
                    // Create a new medication entry if not found (for clinic flexibility)
                    medication = new Medication();
                    medication.setDrugName(itemDTO.getDrugName());
                    medication.setGenericName(itemDTO.getDrugName()); // Use same name as generic
                    medication.setCategory("General");
                    medication.setStrength("Various");
                    medication.setDosageForm("tablet");
                    medication.setManufacturer("Various");
                    medication.setBatchNumber("CLINIC-" + System.currentTimeMillis());
                    medication.setCurrentStock(1000); // Default stock
                    medication.setMinimumStock(10);
                    medication.setMaximumStock(5000);
                    medication.setUnitCost(java.math.BigDecimal.ZERO); // Will be set by pharmacy
                    medication = medicationRepository.save(medication);
                    
                    System.out.println("Created new medication: " + medication.getDrugName());
                }

                // Create prescription item
                PrescriptionItem item = new PrescriptionItem();
                item.setPrescription(savedPrescription);
                item.setMedication(medication);
                item.setDose(itemDTO.getDose());
                item.setFrequency(itemDTO.getFrequency());
                item.setQuantity(itemDTO.getQuantity());
                item.setQuantityUnit(itemDTO.getQuantityUnit());
                item.setRoute(itemDTO.getRoute() != null ? itemDTO.getRoute() : "oral");
                item.setInstructions(itemDTO.getInstructions());
                item.setNotes("Clinic prescription");

                prescriptionItemRepository.save(item);
            }

            // Convert to response DTO
            PrescriptionResponseDTO responseDTO = convertToResponseDTO(savedPrescription);

            // Send WebSocket notification to pharmacy (SAME AS WARD MANAGEMENT)
            try {
                // Check if clinic prescription is urgent
                boolean hasUrgentMeds = requestDTO.getIsUrgent() != null && requestDTO.getIsUrgent();

                if (hasUrgentMeds) {
                    notificationService.notifyUrgentPrescription(responseDTO);
                } else {
                    notificationService.notifyPrescriptionCreated(responseDTO);
                }
                
                System.out.println("✅ WebSocket notification sent for clinic prescription: " + responseDTO.getPrescriptionId());
            } catch (Exception e) {
                // Log but don't fail prescription creation if WebSocket fails
                System.err.println("Failed to send WebSocket notification for clinic prescription: " + e.getMessage());
            }

            return responseDTO;

        } catch (Exception e) {
            System.err.println("Error creating clinic prescription: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Get all clinic prescriptions (outpatient prescriptions)
     */
    public Page<PrescriptionResponseDTO> getClinicPrescriptions(Pageable pageable) {
        try {
            // Find prescriptions where admission is null (clinic prescriptions)
            // or where wardName contains "clinic" or "outpatient"
            Page<Prescription> prescriptions = prescriptionRepository.findClinicPrescriptions(pageable);
            
            return prescriptions.map(this::convertToResponseDTO);
        } catch (Exception e) {
            System.err.println("Error retrieving clinic prescriptions: " + e.getMessage());
            throw new RuntimeException("Failed to retrieve clinic prescriptions", e);
        }
    }
}