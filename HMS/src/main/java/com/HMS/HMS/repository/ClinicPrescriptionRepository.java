package com.HMS.HMS.repository;

import com.HMS.HMS.model.Prescription.ClinicPrescription;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClinicPrescriptionRepository extends JpaRepository<ClinicPrescription, Long> {
    
    // Find by prescription ID (with patient information)
    @EntityGraph(attributePaths = {"patient", "prescriptionItems", "prescriptionItems.medication"})
    Optional<ClinicPrescription> findByPrescriptionId(String prescriptionId);
    
    // Find all with patient information for pharmacy
    @EntityGraph(attributePaths = {"patient", "prescriptionItems", "prescriptionItems.medication"})
    Page<ClinicPrescription> findAllByOrderByPrescribedDateDesc(Pageable pageable);
    
    // Find by patient national ID
    Page<ClinicPrescription> findByPatient_NationalIdOrderByPrescribedDateDesc(
        String patientNationalId, Pageable pageable);
    
    // Find by patient and status
    Page<ClinicPrescription> findByPatient_NationalIdAndStatusOrderByPrescribedDateDesc(
        String patientNationalId, PrescriptionStatus status, Pageable pageable);
    
    // Find by status
    Page<ClinicPrescription> findByStatusOrderByPrescribedDateDesc(
        PrescriptionStatus status, Pageable pageable);
    
    // Find by prescribed by (doctor)
    Page<ClinicPrescription> findByPrescribedByContainingIgnoreCaseOrderByPrescribedDateDesc(
        String doctorName, Pageable pageable);
    
    // Find by date range
    Page<ClinicPrescription> findByPrescribedDateBetweenOrderByPrescribedDateDesc(
        LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    // Find by start date
    Page<ClinicPrescription> findByStartDateOrderByPrescribedDateDesc(
        LocalDate startDate, Pageable pageable);
    
    // Find active prescriptions for a patient
    @Query("SELECT cp FROM ClinicPrescription cp WHERE cp.patient.nationalId = :patientNationalId " +
           "AND cp.status = 'ACTIVE' ORDER BY cp.prescribedDate DESC")
    List<ClinicPrescription> findActiveByPatientNationalId(@Param("patientNationalId") String patientNationalId);
    
    // Find prescriptions by clinic name
    Page<ClinicPrescription> findByClinicNameContainingIgnoreCaseOrderByPrescribedDateDesc(
        String clinicName, Pageable pageable);
    
    // Find prescriptions by visit type
    Page<ClinicPrescription> findByVisitTypeOrderByPrescribedDateDesc(
        String visitType, Pageable pageable);
    
    // Count prescriptions by status
    long countByStatus(PrescriptionStatus status);
    
    // Count prescriptions for a patient
    long countByPatient_NationalId(String patientNationalId);
    
    // Find recent prescriptions (last 7 days)
    @Query("SELECT cp FROM ClinicPrescription cp WHERE cp.prescribedDate >= :sevenDaysAgo " +
           "ORDER BY cp.prescribedDate DESC")
    List<ClinicPrescription> findRecentPrescriptions(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo);
    
    // Find prescriptions needing pharmacy attention (PENDING status)
    @Query("SELECT cp FROM ClinicPrescription cp WHERE cp.status = 'PENDING' " +
           "ORDER BY cp.prescribedDate ASC")
    List<ClinicPrescription> findPendingForPharmacy();
    
    // Search prescriptions by patient name or prescription ID
    @Query("SELECT cp FROM ClinicPrescription cp " +
           "WHERE LOWER(CONCAT(cp.patient.firstName, ' ', cp.patient.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(cp.prescriptionId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY cp.prescribedDate DESC")
    Page<ClinicPrescription> searchByPatientNameOrPrescriptionId(
        @Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Find prescriptions with specific medication
    @Query("SELECT DISTINCT cp FROM ClinicPrescription cp " +
           "JOIN cp.prescriptionItems pi " +
           "WHERE pi.medication.id = :medicationId " +
           "ORDER BY cp.prescribedDate DESC")
    List<ClinicPrescription> findByMedicationId(@Param("medicationId") Long medicationId);
    
    // Dashboard statistics - count by date range
    @Query("SELECT COUNT(cp) FROM ClinicPrescription cp " +
           "WHERE cp.prescribedDate BETWEEN :startDate AND :endDate")
    long countByDateRange(@Param("startDate") LocalDateTime startDate, 
                         @Param("endDate") LocalDateTime endDate);
    
    // Find prescriptions requiring follow-up (ending soon)
    @Query("SELECT cp FROM ClinicPrescription cp " +
           "WHERE cp.endDate BETWEEN :today AND :followUpDate " +
           "AND cp.status = 'ACTIVE' " +
           "ORDER BY cp.endDate ASC")
    List<ClinicPrescription> findRequiringFollowUp(@Param("today") LocalDate today, 
                                                   @Param("followUpDate") LocalDate followUpDate);
}