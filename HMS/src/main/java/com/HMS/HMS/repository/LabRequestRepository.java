package com.HMS.HMS.repository;

import com.HMS.HMS.model.LabRequest.LabRequest;
import com.HMS.HMS.model.LabRequest.LabRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabRequestRepository extends JpaRepository<LabRequest, Long> {
    
    Optional<LabRequest> findByRequestId(String requestId);
    
    List<LabRequest> findByStatus(LabRequestStatus status);
    
    List<LabRequest> findByPatientNationalId(String patientNationalId);
    
    List<LabRequest> findByWardName(String wardName);
    
    @Query("SELECT lr FROM LabRequest lr WHERE lr.status = :status ORDER BY lr.requestDate ASC")
    List<LabRequest> findByStatusOrderByRequestDateAsc(@Param("status") LabRequestStatus status);
    
    @Query("SELECT lr FROM LabRequest lr WHERE lr.status IN :statuses ORDER BY lr.requestDate DESC")
    List<LabRequest> findByStatusInOrderByRequestDateDesc(@Param("statuses") List<LabRequestStatus> statuses);
    
    @Query("SELECT lr FROM LabRequest lr WHERE lr.requestDate BETWEEN :startDate AND :endDate")
    List<LabRequest> findByRequestDateBetween(@Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(lr) FROM LabRequest lr WHERE lr.status = :status")
    Long countByStatus(@Param("status") LabRequestStatus status);
}