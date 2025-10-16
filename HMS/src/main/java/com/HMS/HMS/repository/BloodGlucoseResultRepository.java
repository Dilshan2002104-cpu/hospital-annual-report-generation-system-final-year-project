package com.HMS.HMS.repository;

import com.HMS.HMS.model.LabRequest.BloodGlucoseResult;
import com.HMS.HMS.model.LabRequest.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodGlucoseResultRepository extends JpaRepository<BloodGlucoseResult, Long> {
    
    @Query("SELECT bgr FROM BloodGlucoseResult bgr WHERE bgr.testResult.id = :testResultId")
    BloodGlucoseResult findByTestResultId(@Param("testResultId") Long testResultId);
    
    BloodGlucoseResult findByTestResult(TestResult testResult);
}