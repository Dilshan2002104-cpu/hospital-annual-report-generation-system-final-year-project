package com.HMS.HMS.service;

import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionRequestDTO;
import com.HMS.HMS.model.Patient.Patient;
import com.HMS.HMS.model.Medication.Medication;
import com.HMS.HMS.model.Prescription.ClinicPrescription;
import com.HMS.HMS.model.Prescription.ClinicPrescriptionItem;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import com.HMS.HMS.repository.ClinicPrescriptionRepository;
import com.HMS.HMS.repository.PatientRepository;
import com.HMS.HMS.repository.MedicationRepository;
import com.HMS.HMS.websocket.PrescriptionNotificationService;
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

@Service
@Transactional
public class ClinicPrescriptionService {

    @Autowired
    private ClinicPrescriptionRepository clinicPrescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private PrescriptionNotificationService notificationService;

    // Create a new clinic prescription
    public ClinicPrescription createClinicPrescription(PrescriptionRequestDTO requestDTO) {
        try {
            // Validate patient exists
            Patient patient = patientRepository.findByNationalId(requestDTO.getPatientNationalId());
            if (patient == null) {
                throw new RuntimeException("Patient not found with National ID: " + 
                    requestDTO.getPatientNationalId());
            }

            // Generate unique prescription ID
            String prescriptionId = generatePrescriptionId();

            // Create clinic prescription
            ClinicPrescription clinicPrescription = new ClinicPrescription(
                prescriptionId,
                patient,
                requestDTO.getPrescribedBy(),
                requestDTO.getStartDate(),
                LocalDateTime.now()
            );

            // Set optional fields
            if (requestDTO.getEndDate() != null) {
                clinicPrescription.setEndDate(requestDTO.getEndDate());
            }
            if (requestDTO.getPrescriptionNotes() != null) {
                clinicPrescription.setPrescriptionNotes(requestDTO.getPrescriptionNotes());
            }

            // Set clinic-specific fields
            clinicPrescription.setClinicName("Outpatient Clinic");
            clinicPrescription.setVisitType("Consultation");
            clinicPrescription.setStatus(PrescriptionStatus.PENDING);

            // Save the prescription first to get the ID
            clinicPrescription = clinicPrescriptionRepository.save(clinicPrescription);

            // Process prescription items
            if (requestDTO.getPrescriptionItems() != null && !requestDTO.getPrescriptionItems().isEmpty()) {
                for (var itemDTO : requestDTO.getPrescriptionItems()) {
                    // Find medication
                    Medication medication = medicationRepository.findById(itemDTO.getMedicationId())
                        .orElseThrow(() -> new RuntimeException("Medication not found with ID: " + 
                            itemDTO.getMedicationId()));

                    // Create prescription item
                    ClinicPrescriptionItem prescriptionItem = new ClinicPrescriptionItem(
                        clinicPrescription,
                        medication,
                        itemDTO.getDose(),
                        itemDTO.getFrequency(),
                        itemDTO.getQuantity()
                    );

                    // Set optional fields
                    if (itemDTO.getQuantityUnit() != null) {
                        prescriptionItem.setQuantityUnit(itemDTO.getQuantityUnit());
                    }
                    if (itemDTO.getInstructions() != null) {
                        prescriptionItem.setInstructions(itemDTO.getInstructions());
                    }
                    if (itemDTO.getRoute() != null) {
                        prescriptionItem.setRoute(itemDTO.getRoute());
                    }
                    if (itemDTO.getIsUrgent() != null) {
                        prescriptionItem.setIsUrgent(itemDTO.getIsUrgent());
                    }
                    if (itemDTO.getNotes() != null) {
                        prescriptionItem.setNotes(itemDTO.getNotes());
                    }

                    // Add item to prescription
                    clinicPrescription.addPrescriptionItem(prescriptionItem);
                }
            }

            // Update total medications count
            clinicPrescription.setTotalMedications(clinicPrescription.getPrescriptionItems().size());

            // Save the updated prescription with items
            clinicPrescription = clinicPrescriptionRepository.save(clinicPrescription);

            // Send WebSocket notification to pharmacy
            notificationService.notifyClinicPrescriptionCreated(clinicPrescription);

            return clinicPrescription;

        } catch (Exception e) {
            throw new RuntimeException("Failed to create clinic prescription: " + e.getMessage(), e);
        }
    }

    // Generate unique prescription ID
    private String generatePrescriptionId() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = String.valueOf((int) (Math.random() * 1000));
        return "CP" + timestamp + randomSuffix; // CP for Clinic Prescription
    }

    // Get all clinic prescriptions with pagination
    public Page<ClinicPrescription> getAllClinicPrescriptions(Pageable pageable) {
        return clinicPrescriptionRepository.findAll(pageable);
    }

    // Get clinic prescription by ID
    public Optional<ClinicPrescription> getClinicPrescriptionById(Long id) {
        return clinicPrescriptionRepository.findById(id);
    }

    // Get clinic prescription by prescription ID
    public Optional<ClinicPrescription> getClinicPrescriptionByPrescriptionId(String prescriptionId) {
        return clinicPrescriptionRepository.findByPrescriptionId(prescriptionId);
    }

    // Get clinic prescriptions by patient
    public Page<ClinicPrescription> getClinicPrescriptionsByPatient(String patientNationalId, Pageable pageable) {
        return clinicPrescriptionRepository.findByPatient_NationalIdOrderByPrescribedDateDesc(
            patientNationalId, pageable);
    }

    // Get clinic prescriptions by status
    public Page<ClinicPrescription> getClinicPrescriptionsByStatus(PrescriptionStatus status, Pageable pageable) {
        return clinicPrescriptionRepository.findByStatusOrderByPrescribedDateDesc(status, pageable);
    }

    // Get active clinic prescriptions for a patient
    public List<ClinicPrescription> getActiveClinicPrescriptionsByPatient(String patientNationalId) {
        return clinicPrescriptionRepository.findActiveByPatientNationalId(patientNationalId);
    }

    // Search clinic prescriptions
    public Page<ClinicPrescription> searchClinicPrescriptions(String searchTerm, Pageable pageable) {
        return clinicPrescriptionRepository.searchByPatientNameOrPrescriptionId(searchTerm, pageable);
    }

    // Update clinic prescription status
    public ClinicPrescription updateClinicPrescriptionStatus(Long id, PrescriptionStatus status) {
        ClinicPrescription prescription = clinicPrescriptionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Clinic prescription not found with ID: " + id));
        
        prescription.setStatus(status);
        prescription = clinicPrescriptionRepository.save(prescription);

        // Send notification for status changes
        notificationService.notifyClinicPrescriptionStatusChanged(prescription);

        return prescription;
    }

    // Get pending prescriptions for pharmacy
    public List<ClinicPrescription> getPendingPrescriptionsForPharmacy() {
        return clinicPrescriptionRepository.findPendingForPharmacy();
    }

    // Get recent prescriptions (last 7 days)
    public List<ClinicPrescription> getRecentClinicPrescriptions() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return clinicPrescriptionRepository.findRecentPrescriptions(sevenDaysAgo);
    }

    // Get prescriptions requiring follow-up
    public List<ClinicPrescription> getPrescrip­tionsRequiringFollowUp() {
        LocalDate today = LocalDate.now();
        LocalDate followUpDate = today.plusDays(7); // 7 days from now
        return clinicPrescriptionRepository.findRequiringFollowUp(today, followUpDate);
    }

    // Dashboard statistics
    public long getClinicPrescriptionCount() {
        return clinicPrescriptionRepository.count();
    }

    public long getClinicPrescriptionCountByStatus(PrescriptionStatus status) {
        return clinicPrescriptionRepository.countByStatus(status);
    }

    public long getClinicPrescriptionCountByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return clinicPrescriptionRepository.countByDateRange(startDate, endDate);
    }

    // Delete clinic prescription (soft delete by changing status)
    public void deleteClinicPrescription(Long id) {
        ClinicPrescription prescription = clinicPrescriptionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Clinic prescription not found with ID: " + id));
        
        prescription.setStatus(PrescriptionStatus.DISCONTINUED);
        clinicPrescriptionRepository.save(prescription);
    }
}