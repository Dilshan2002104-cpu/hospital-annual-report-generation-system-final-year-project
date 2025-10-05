package com.HMS.HMS.repository;

import com.HMS.HMS.model.Prescription.PrescriptionItem;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {

    // Find items by prescription ID
    List<PrescriptionItem> findByPrescriptionIdOrderByCreatedAtAsc(Long prescriptionId);
    Page<PrescriptionItem> findByPrescriptionIdOrderByCreatedAtAsc(Long prescriptionId, Pageable pageable);

    // Find items by prescription and status
    List<PrescriptionItem> findByPrescriptionIdAndItemStatusOrderByCreatedAtAsc(Long prescriptionId, PrescriptionStatus status);

    // Find items by drug name (now through medication relationship)
    @Query("SELECT pi FROM PrescriptionItem pi WHERE LOWER(pi.medication.drugName) LIKE LOWER(CONCAT('%', :drugName, '%')) ORDER BY pi.createdAt DESC")
    List<PrescriptionItem> findByDrugNameContainingIgnoreCaseOrderByCreatedAtDesc(@Param("drugName") String drugName);

    @Query("SELECT pi FROM PrescriptionItem pi WHERE LOWER(pi.medication.drugName) LIKE LOWER(CONCAT('%', :drugName, '%')) ORDER BY pi.createdAt DESC")
    Page<PrescriptionItem> findByDrugNameContainingIgnoreCaseOrderByCreatedAtDesc(@Param("drugName") String drugName, Pageable pageable);

    // Find urgent items
    List<PrescriptionItem> findByIsUrgentTrueAndItemStatusOrderByCreatedAtDesc(PrescriptionStatus status);

    // Find items by status
    List<PrescriptionItem> findByItemStatusOrderByCreatedAtDesc(PrescriptionStatus status);
    Page<PrescriptionItem> findByItemStatusOrderByCreatedAtDesc(PrescriptionStatus status, Pageable pageable);

    // Find items by prescription and drug name (to check for duplicates)
    @Query("SELECT pi FROM PrescriptionItem pi WHERE pi.prescription.id = :prescriptionId AND LOWER(pi.medication.drugName) = LOWER(:drugName)")
    List<PrescriptionItem> findByPrescriptionIdAndDrugNameIgnoreCase(@Param("prescriptionId") Long prescriptionId, @Param("drugName") String drugName);

    // Count items by status
    long countByItemStatus(PrescriptionStatus status);

    // Count items by prescription
    long countByPrescriptionId(Long prescriptionId);

    // Count urgent items
    long countByIsUrgentTrueAndItemStatus(PrescriptionStatus status);

    // Find items created between dates
    List<PrescriptionItem> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);
    Page<PrescriptionItem> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // Find items by prescription patient national ID (through prescription relationship)
    @Query("SELECT pi FROM PrescriptionItem pi WHERE pi.prescription.patient.nationalId = :patientNationalId ORDER BY pi.createdAt DESC")
    List<PrescriptionItem> findByPatientNationalId(@Param("patientNationalId") String patientNationalId);

    @Query("SELECT pi FROM PrescriptionItem pi WHERE pi.prescription.patient.nationalId = :patientNationalId ORDER BY pi.createdAt DESC")
    Page<PrescriptionItem> findByPatientNationalId(@Param("patientNationalId") String patientNationalId, Pageable pageable);

    // Find active items by patient
    @Query("SELECT pi FROM PrescriptionItem pi WHERE pi.prescription.patient.nationalId = :patientNationalId AND pi.itemStatus = :status ORDER BY pi.createdAt DESC")
    List<PrescriptionItem> findActiveByPatientNationalId(@Param("patientNationalId") String patientNationalId, @Param("status") PrescriptionStatus status);

    // Search items by drug name, generic name, or notes
    @Query("SELECT pi FROM PrescriptionItem pi WHERE " +
           "(LOWER(pi.medication.drugName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(pi.medication.genericName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(pi.notes) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY pi.createdAt DESC")
    Page<PrescriptionItem> searchPrescriptionItems(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Get medication usage statistics
    @Query("SELECT pi.medication.drugName, COUNT(pi) FROM PrescriptionItem pi WHERE pi.createdAt >= :fromDate GROUP BY pi.medication.drugName ORDER BY COUNT(pi) DESC")
    List<Object[]> getMedicationUsageStatistics(@Param("fromDate") LocalDateTime fromDate);

    // Get items by prescription status and item status
    @Query("SELECT pi FROM PrescriptionItem pi WHERE pi.prescription.status = :prescriptionStatus AND pi.itemStatus = :itemStatus ORDER BY pi.createdAt DESC")
    List<PrescriptionItem> findByPrescriptionStatusAndItemStatus(@Param("prescriptionStatus") PrescriptionStatus prescriptionStatus, @Param("itemStatus") PrescriptionStatus itemStatus);

    // Get items by ward name
    @Query("SELECT pi FROM PrescriptionItem pi WHERE pi.prescription.wardName = :wardName ORDER BY pi.createdAt DESC")
    List<PrescriptionItem> findByWardName(@Param("wardName") String wardName);

    @Query("SELECT pi FROM PrescriptionItem pi WHERE pi.prescription.wardName = :wardName ORDER BY pi.createdAt DESC")
    Page<PrescriptionItem> findByWardName(@Param("wardName") String wardName, Pageable pageable);

    // Find items that need review (active items older than specified days)
    @Query("SELECT pi FROM PrescriptionItem pi WHERE pi.itemStatus = :status AND pi.createdAt <= :reviewDate ORDER BY pi.createdAt ASC")
    List<PrescriptionItem> findItemsNeedingReview(@Param("status") PrescriptionStatus status, @Param("reviewDate") LocalDateTime reviewDate);

    // Check if patient has active item for same drug
    @Query("SELECT COUNT(pi) > 0 FROM PrescriptionItem pi WHERE pi.prescription.patient.nationalId = :patientNationalId " +
           "AND LOWER(pi.medication.drugName) = LOWER(:drugName) AND pi.itemStatus = :status")
    boolean hasActiveItemForDrug(@Param("patientNationalId") String patientNationalId,
                                @Param("drugName") String drugName,
                                @Param("status") PrescriptionStatus status);

    // Get items with specific dosage form
    @Query("SELECT pi FROM PrescriptionItem pi WHERE LOWER(pi.medication.dosageForm) = LOWER(:dosageForm)")
    List<PrescriptionItem> findByDosageFormIgnoreCase(@Param("dosageForm") String dosageForm);

    // Get items by manufacturer
    @Query("SELECT pi FROM PrescriptionItem pi WHERE LOWER(pi.medication.manufacturer) LIKE LOWER(CONCAT('%', :manufacturer, '%'))")
    List<PrescriptionItem> findByManufacturerContainingIgnoreCase(@Param("manufacturer") String manufacturer);

    // Delete items by prescription ID (for cascade operations)
    void deleteByPrescriptionId(Long prescriptionId);

    // Get item status statistics
    @Query("SELECT pi.itemStatus, COUNT(pi) FROM PrescriptionItem pi GROUP BY pi.itemStatus")
    List<Object[]> getItemStatusStatistics();

    // Get items created today
    @Query("SELECT pi FROM PrescriptionItem pi WHERE DATE(pi.createdAt) = DATE(CURRENT_DATE) ORDER BY pi.createdAt DESC")
    List<PrescriptionItem> findItemsCreatedToday();

    // Get count by date range and status
    @Query("SELECT COUNT(pi) FROM PrescriptionItem pi WHERE pi.createdAt BETWEEN :startDate AND :endDate AND pi.itemStatus = :status")
    long countByDateRangeAndStatus(@Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate,
                                  @Param("status") PrescriptionStatus status);
                                  
    // Analytics methods
    long countByIsUrgentTrueAndCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}