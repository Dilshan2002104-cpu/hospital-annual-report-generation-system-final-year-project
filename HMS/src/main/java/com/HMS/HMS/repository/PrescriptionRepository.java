package com.HMS.HMS.repository;

import com.HMS.HMS.model.Prescription.Prescription;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    // Find by prescription ID
    Optional<Prescription> findByPrescriptionId(String prescriptionId);

    // Find prescriptions by patient
    @Query("SELECT p FROM Prescription p WHERE p.patient.nationalId = :nationalId ORDER BY p.prescribedDate DESC")
    List<Prescription> findByPatientNationalIdOrderByPrescribedDateDesc(@Param("nationalId") String patientNationalId);

    @Query("SELECT p FROM Prescription p WHERE p.patient.nationalId = :nationalId ORDER BY p.prescribedDate DESC")
    Page<Prescription> findByPatientNationalIdOrderByPrescribedDateDesc(@Param("nationalId") String patientNationalId, Pageable pageable);

    @Query("SELECT p FROM Prescription p WHERE p.patient.nationalId = :nationalId ORDER BY p.prescribedDate DESC")
    List<Prescription> findByPatient(@Param("nationalId") String nationalId);

    // Find prescriptions by admission
    @Query("SELECT p FROM Prescription p WHERE p.admission.admissionId = :admissionId ORDER BY p.prescribedDate DESC")
    List<Prescription> findByAdmission(@Param("admissionId") Long admissionId);

    Page<Prescription> findByAdmissionAdmissionIdOrderByPrescribedDateDesc(Long admissionId, Pageable pageable);

    // Find prescriptions by status
    List<Prescription> findByStatusOrderByPrescribedDateDesc(PrescriptionStatus status);
    Page<Prescription> findByStatusOrderByPrescribedDateDesc(PrescriptionStatus status, Pageable pageable);

    // Find active prescriptions for a patient
    @Query("SELECT p FROM Prescription p WHERE p.patient.nationalId = :patientNationalId AND p.status = :status ORDER BY p.prescribedDate DESC")
    List<Prescription> findByPatientNationalIdAndStatusOrderByPrescribedDateDesc(@Param("patientNationalId") String patientNationalId, @Param("status") PrescriptionStatus status);

    @Query("SELECT p FROM Prescription p WHERE p.patient.nationalId = :nationalId AND p.status = :status ORDER BY p.prescribedDate DESC")
    List<Prescription> findActiveByPatient(@Param("nationalId") String nationalId, @Param("status") PrescriptionStatus status);

    // Find active prescriptions for an admission
    @Query("SELECT p FROM Prescription p WHERE p.admission.admissionId = :admissionId AND p.status = :status ORDER BY p.prescribedDate DESC")
    List<Prescription> findActiveByAdmission(@Param("admissionId") Long admissionId, @Param("status") PrescriptionStatus status);

    // Find prescriptions by date range
    List<Prescription> findByPrescribedDateBetweenOrderByPrescribedDateDesc(LocalDateTime startDate, LocalDateTime endDate);
    Page<Prescription> findByPrescribedDateBetweenOrderByPrescribedDateDesc(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // Find prescriptions expiring soon (based on end date)
    @Query("SELECT p FROM Prescription p WHERE p.endDate IS NOT NULL AND p.endDate <= :endDate AND p.status = :status ORDER BY p.endDate ASC")
    List<Prescription> findPrescriptionsExpiringSoon(@Param("endDate") LocalDate endDate, @Param("status") PrescriptionStatus status);

    // Count prescriptions by status
    long countByStatus(PrescriptionStatus status);

    // Count prescriptions for a patient
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.patient.nationalId = :nationalId")
    long countByPatientNationalId(@Param("nationalId") String patientNationalId);

    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.patient.nationalId = :nationalId")
    long countByPatient(@Param("nationalId") String nationalId);

    // Count prescriptions for an admission
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.admission.admissionId = :admissionId")
    long countByAdmission(@Param("admissionId") Long admissionId);

    // Search prescriptions (by patient name, prescription ID, or medication)
    @Query("SELECT DISTINCT p FROM Prescription p " +
           "LEFT JOIN p.prescriptionItems pi " +
           "LEFT JOIN pi.medication m " +
           "WHERE (LOWER(p.patient.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.patient.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.prescriptionId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(m.drugName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY p.prescribedDate DESC")
    Page<Prescription> searchPrescriptions(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Find prescriptions created today
    @Query("SELECT p FROM Prescription p WHERE DATE(p.prescribedDate) = DATE(CURRENT_DATE) ORDER BY p.prescribedDate DESC")
    List<Prescription> findPrescriptionsCreatedToday();

    // Get prescription statistics
    @Query("SELECT p.status, COUNT(p) FROM Prescription p GROUP BY p.status")
    List<Object[]> getPrescriptionStatusStatistics();

    // Find prescriptions by ward
    List<Prescription> findByWardNameOrderByPrescribedDateDesc(String wardName);
    Page<Prescription> findByWardNameOrderByPrescribedDateDesc(String wardName, Pageable pageable);

    // Find prescriptions that need review (active prescriptions older than specified days)
    @Query("SELECT p FROM Prescription p WHERE p.status = :status AND p.prescribedDate <= :reviewDate ORDER BY p.prescribedDate ASC")
    List<Prescription> findPrescriptionsNeedingReview(@Param("status") PrescriptionStatus status, @Param("reviewDate") LocalDateTime reviewDate);

    // Drug-specific checks are now handled by PrescriptionItemRepository

    // Get prescription count by date range and status
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.prescribedDate BETWEEN :startDate AND :endDate AND p.status = :status")
    long countPrescriptionsByDateRangeAndStatus(@Param("startDate") LocalDateTime startDate,
                                              @Param("endDate") LocalDateTime endDate,
                                              @Param("status") PrescriptionStatus status);

    // Get all prescription count by date range (regardless of status) for ID generation
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.prescribedDate BETWEEN :startDate AND :endDate")
    long countPrescriptionsByDateRange(@Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);

    // Check if prescription ID already exists
    boolean existsByPrescriptionId(String prescriptionId);

    // Analytics methods
    long countByPrescribedDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    long countByStatusAndPrescribedDateBetween(PrescriptionStatus status, LocalDateTime startDate, LocalDateTime endDate);

    // Find all prescriptions by created date range
    List<Prescription> findAllByCreatedAtBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);
}