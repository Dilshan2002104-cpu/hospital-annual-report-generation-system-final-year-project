package com.HMS.HMS.repository;

import com.HMS.HMS.model.Pharmacy.MedicineDispenseRequest;
import com.HMS.HMS.model.Prescription.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineDispenseRequestRepository extends JpaRepository<MedicineDispenseRequest, Long> {

    // Find by request ID
    Optional<MedicineDispenseRequest> findByRequestId(String requestId);

    // Find by prescription
    List<MedicineDispenseRequest> findByPrescription(Prescription prescription);
    
    List<MedicineDispenseRequest> findByPrescriptionId(Long prescriptionId);

    // Find by status
    List<MedicineDispenseRequest> findByStatus(MedicineDispenseRequest.DispenseStatus status);
    
    Page<MedicineDispenseRequest> findByStatus(MedicineDispenseRequest.DispenseStatus status, Pageable pageable);

    // Find by urgency level
    List<MedicineDispenseRequest> findByUrgencyLevel(MedicineDispenseRequest.UrgencyLevel urgencyLevel);
    
    Page<MedicineDispenseRequest> findByUrgencyLevel(MedicineDispenseRequest.UrgencyLevel urgencyLevel, Pageable pageable);

    // Find by requested by (ward staff)
    List<MedicineDispenseRequest> findByRequestedBy(String requestedBy);
    
    Page<MedicineDispenseRequest> findByRequestedBy(String requestedBy, Pageable pageable);

    // Find by delivery location
    List<MedicineDispenseRequest> findByDeliveryLocation(String deliveryLocation);

    // Find by ward location
    List<MedicineDispenseRequest> findByWardLocation(String wardLocation);

    // Find by processed by (pharmacy staff)
    List<MedicineDispenseRequest> findByProcessedBy(String processedBy);

    // Find pending requests (for pharmacy dashboard)
    @Query("SELECT dr FROM MedicineDispenseRequest dr WHERE dr.status IN :statuses ORDER BY dr.urgencyLevel DESC, dr.createdAt ASC")
    List<MedicineDispenseRequest> findPendingRequests(@Param("statuses") List<MedicineDispenseRequest.DispenseStatus> statuses);
    
    @Query("SELECT dr FROM MedicineDispenseRequest dr WHERE dr.status IN :statuses ORDER BY dr.urgencyLevel DESC, dr.createdAt ASC")
    Page<MedicineDispenseRequest> findPendingRequests(@Param("statuses") List<MedicineDispenseRequest.DispenseStatus> statuses, Pageable pageable);

    // Find urgent requests
    @Query("SELECT dr FROM MedicineDispenseRequest dr WHERE dr.urgencyLevel IN ('URGENT', 'EMERGENCY') AND dr.status NOT IN ('DELIVERED', 'CANCELLED') ORDER BY dr.urgencyLevel DESC, dr.createdAt ASC")
    List<MedicineDispenseRequest> findUrgentRequests();

    // Find requests by date range
    @Query("SELECT dr FROM MedicineDispenseRequest dr WHERE dr.createdAt BETWEEN :startDate AND :endDate ORDER BY dr.createdAt DESC")
    List<MedicineDispenseRequest> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT dr FROM MedicineDispenseRequest dr WHERE dr.createdAt BETWEEN :startDate AND :endDate ORDER BY dr.createdAt DESC")
    Page<MedicineDispenseRequest> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);

    // Complex search query
    @Query("SELECT dr FROM MedicineDispenseRequest dr " +
           "WHERE (:status IS NULL OR dr.status = :status) " +
           "AND (:urgencyLevel IS NULL OR dr.urgencyLevel = :urgencyLevel) " +
           "AND (:wardLocation IS NULL OR dr.wardLocation LIKE %:wardLocation%) " +
           "AND (:requestedBy IS NULL OR dr.requestedBy LIKE %:requestedBy%) " +
           "ORDER BY dr.urgencyLevel DESC, dr.createdAt ASC")
    Page<MedicineDispenseRequest> findBySearchCriteria(
        @Param("status") MedicineDispenseRequest.DispenseStatus status,
        @Param("urgencyLevel") MedicineDispenseRequest.UrgencyLevel urgencyLevel,
        @Param("wardLocation") String wardLocation,
        @Param("requestedBy") String requestedBy,
        Pageable pageable
    );

    // Count by status
    long countByStatus(MedicineDispenseRequest.DispenseStatus status);

    // Count urgent requests
    @Query("SELECT COUNT(dr) FROM MedicineDispenseRequest dr WHERE dr.urgencyLevel IN ('URGENT', 'EMERGENCY') AND dr.status NOT IN ('DELIVERED', 'CANCELLED')")
    long countUrgentRequests();

    // Find requests that need attention (overdue)
    @Query("SELECT dr FROM MedicineDispenseRequest dr WHERE dr.status = 'PENDING' AND dr.createdAt < :cutoffTime ORDER BY dr.urgencyLevel DESC, dr.createdAt ASC")
    List<MedicineDispenseRequest> findOverdueRequests(@Param("cutoffTime") LocalDateTime cutoffTime);

    // Find requests by patient (through prescription)
    @Query("SELECT dr FROM MedicineDispenseRequest dr WHERE dr.prescription.patient.nationalId = :patientId ORDER BY dr.createdAt DESC")
    List<MedicineDispenseRequest> findByPatientId(@Param("patientId") String patientId);
    
    @Query("SELECT dr FROM MedicineDispenseRequest dr WHERE dr.prescription.patient.nationalId = :patientId ORDER BY dr.createdAt DESC")
    Page<MedicineDispenseRequest> findByPatientId(@Param("patientId") String patientId, Pageable pageable);
}