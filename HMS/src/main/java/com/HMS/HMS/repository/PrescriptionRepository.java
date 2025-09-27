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

    // Find prescriptions by patient national ID
    List<Prescription> findByPatientNationalIdOrderByPrescribedDateDesc(String patientNationalId);
    Page<Prescription> findByPatientNationalIdOrderByPrescribedDateDesc(String patientNationalId, Pageable pageable);

    // Find prescriptions by admission ID
    List<Prescription> findByAdmissionIdOrderByPrescribedDateDesc(Long admissionId);
    Page<Prescription> findByAdmissionIdOrderByPrescribedDateDesc(Long admissionId, Pageable pageable);

    // Find prescriptions by status
    List<Prescription> findByStatusOrderByPrescribedDateDesc(PrescriptionStatus status);
    Page<Prescription> findByStatusOrderByPrescribedDateDesc(PrescriptionStatus status, Pageable pageable);

    // Find active prescriptions for a patient
    List<Prescription> findByPatientNationalIdAndStatusOrderByPrescribedDateDesc(String patientNationalId, PrescriptionStatus status);

    // Find active prescriptions for an admission
    List<Prescription> findByAdmissionIdAndStatusOrderByPrescribedDateDesc(Long admissionId, PrescriptionStatus status);

    // Find prescriptions prescribed by a specific doctor
    List<Prescription> findByPrescribedByOrderByPrescribedDateDesc(String prescribedBy);
    Page<Prescription> findByPrescribedByOrderByPrescribedDateDesc(String prescribedBy, Pageable pageable);

    // Find prescriptions by date range
    List<Prescription> findByPrescribedDateBetweenOrderByPrescribedDateDesc(LocalDateTime startDate, LocalDateTime endDate);
    Page<Prescription> findByPrescribedDateBetweenOrderByPrescribedDateDesc(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // Find prescriptions expiring soon (based on end date)
    @Query("SELECT p FROM Prescription p WHERE p.endDate IS NOT NULL AND p.endDate <= :endDate AND p.status = :status ORDER BY p.endDate ASC")
    List<Prescription> findPrescriptionsExpiringSoon(@Param("endDate") LocalDate endDate, @Param("status") PrescriptionStatus status);

    // Count prescriptions by status
    long countByStatus(PrescriptionStatus status);

    // Count prescriptions for a patient
    long countByPatientNationalId(String patientNationalId);

    // Count prescriptions for an admission
    long countByAdmissionId(Long admissionId);

    // Count prescriptions with urgent items (will be handled via PrescriptionItemRepository)
    // Removed drug-related queries as they now belong to PrescriptionItemRepository

    // Search prescriptions (by patient name or prescription ID)
    @Query("SELECT DISTINCT p FROM Prescription p LEFT JOIN p.prescriptionItems pi WHERE " +
           "(LOWER(p.patientName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.prescriptionId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(pi.drugName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
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
}