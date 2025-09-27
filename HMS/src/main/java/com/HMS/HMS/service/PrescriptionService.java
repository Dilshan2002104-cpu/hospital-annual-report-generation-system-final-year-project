package com.HMS.HMS.service;

import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionRequestDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionResponseDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionItemDTO;
import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionUpdateDTO;
import com.HMS.HMS.model.Prescription.Prescription;
import com.HMS.HMS.model.Prescription.PrescriptionItem;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import com.HMS.HMS.repository.PrescriptionRepository;
import com.HMS.HMS.repository.PrescriptionItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                             PrescriptionItemRepository prescriptionItemRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionItemRepository = prescriptionItemRepository;
    }

    /**
     * Create a new prescription with multiple medications
     */
    public PrescriptionResponseDTO createPrescription(PrescriptionRequestDTO requestDTO) {
        // Generate unique prescription ID
        String prescriptionId = generatePrescriptionId();

        // Validate prescription items
        if (requestDTO.getPrescriptionItems() == null || requestDTO.getPrescriptionItems().isEmpty()) {
            throw new IllegalArgumentException("Prescription must contain at least one medication");
        }

        // Check for duplicate active prescriptions for same drugs
        for (PrescriptionItemDTO itemDTO : requestDTO.getPrescriptionItems()) {
            if (prescriptionItemRepository.hasActiveItemForDrug(
                    requestDTO.getPatientNationalId(),
                    itemDTO.getDrugName(),
                    PrescriptionStatus.ACTIVE)) {
                throw new IllegalStateException(
                    "Patient already has an active prescription for " + itemDTO.getDrugName());
            }
        }

        // Create prescription container entity
        Prescription prescription = new Prescription();
        prescription.setPrescriptionId(prescriptionId);
        prescription.setPatientNationalId(requestDTO.getPatientNationalId());
        prescription.setPatientName(requestDTO.getPatientName());
        prescription.setAdmissionId(requestDTO.getAdmissionId());
        prescription.setStartDate(requestDTO.getStartDate());
        prescription.setEndDate(requestDTO.getEndDate());
        prescription.setPrescribedBy(requestDTO.getPrescribedBy());
        prescription.setPrescribedDate(LocalDateTime.now());
        prescription.setWardName(requestDTO.getWardName());
        prescription.setBedNumber(requestDTO.getBedNumber());
        prescription.setPrescriptionNotes(requestDTO.getPrescriptionNotes());
        prescription.setStatus(PrescriptionStatus.ACTIVE);
        prescription.setTotalMedications(requestDTO.getPrescriptionItems().size());

        // Save prescription container first
        Prescription savedPrescription = prescriptionRepository.save(prescription);

        // Create and save prescription items
        for (PrescriptionItemDTO itemDTO : requestDTO.getPrescriptionItems()) {
            PrescriptionItem item = new PrescriptionItem();
            item.setPrescription(savedPrescription);
            item.setDrugName(itemDTO.getDrugName());
            item.setDose(itemDTO.getDose());
            item.setFrequency(itemDTO.getFrequency());
            item.setQuantity(itemDTO.getQuantity());
            item.setQuantityUnit(itemDTO.getQuantityUnit());
            item.setInstructions(itemDTO.getInstructions());
            item.setRoute(itemDTO.getRoute());
            item.setIsUrgent(itemDTO.getIsUrgent() != null ? itemDTO.getIsUrgent() : false);
            item.setItemStatus(PrescriptionStatus.ACTIVE);
            item.setDosageForm(itemDTO.getDosageForm());
            item.setGenericName(itemDTO.getGenericName());
            item.setManufacturer(itemDTO.getManufacturer());
            item.setNotes(itemDTO.getNotes());

            prescriptionItemRepository.save(item);
            savedPrescription.addPrescriptionItem(item);
        }

        return convertToResponseDTO(savedPrescription);
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
        return prescriptionRepository.findByAdmissionIdOrderByPrescribedDateDesc(admissionId)
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

        // Check for duplicate drug
        if (prescriptionItemRepository.hasActiveItemForDrug(
                prescription.getPatientNationalId(),
                itemDTO.getDrugName(),
                PrescriptionStatus.ACTIVE)) {
            throw new IllegalStateException(
                "Patient already has an active prescription for " + itemDTO.getDrugName());
        }

        // Create new prescription item
        PrescriptionItem item = new PrescriptionItem();
        item.setPrescription(prescription);
        item.setDrugName(itemDTO.getDrugName());
        item.setDose(itemDTO.getDose());
        item.setFrequency(itemDTO.getFrequency());
        item.setQuantity(itemDTO.getQuantity());
        item.setQuantityUnit(itemDTO.getQuantityUnit());
        item.setInstructions(itemDTO.getInstructions());
        item.setRoute(itemDTO.getRoute());
        item.setIsUrgent(itemDTO.getIsUrgent() != null ? itemDTO.getIsUrgent() : false);
        item.setItemStatus(PrescriptionStatus.ACTIVE);
        item.setDosageForm(itemDTO.getDosageForm());
        item.setGenericName(itemDTO.getGenericName());
        item.setManufacturer(itemDTO.getManufacturer());
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
                case ACTIVE -> stats.setActiveCount(count.intValue());
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

        // Get today's prescription count to generate sequence
        long todayCount = prescriptionRepository.countPrescriptionsByDateRangeAndStatus(
                LocalDateTime.now().withHour(0).withMinute(0).withSecond(0),
                LocalDateTime.now().withHour(23).withMinute(59).withSecond(59),
                PrescriptionStatus.ACTIVE) + 1;

        return String.format("%s%s%03d", prefix, datePart, todayCount);
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
}