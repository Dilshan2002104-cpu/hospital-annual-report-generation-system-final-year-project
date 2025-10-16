package com.HMS.HMS.repository;

import com.HMS.HMS.model.LabRequest.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    
    // Find test results by request ID
    List<TestResult> findByRequestId(String requestId);
    
    // Find test results by patient national ID
    List<TestResult> findByPatientNationalIdOrderByCompletedAtDesc(String patientNationalId);
    
    // Find test results by ward name
    List<TestResult> findByWardNameOrderByCompletedAtDesc(String wardName);
    
    // Find test results by test name
    List<TestResult> findByTestNameOrderByCompletedAtDesc(String testName);
    
    // Find test results by patient and date range
    @Query("SELECT tr FROM TestResult tr WHERE tr.patientNationalId = :patientId " +
           "AND tr.completedAt BETWEEN :startDate AND :endDate " +
           "ORDER BY tr.completedAt DESC")
    List<TestResult> findByPatientAndDateRange(@Param("patientId") String patientId,
                                             @Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate);
    
    // Find recent test results by patient (last 30 days)
    @Query("SELECT tr FROM TestResult tr WHERE tr.patientNationalId = :patientId " +
           "AND tr.completedAt >= :thirtyDaysAgo " +
           "ORDER BY tr.completedAt DESC")
    List<TestResult> findRecentTestResultsByPatient(@Param("patientId") String patientId,
                                                   @Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);
}