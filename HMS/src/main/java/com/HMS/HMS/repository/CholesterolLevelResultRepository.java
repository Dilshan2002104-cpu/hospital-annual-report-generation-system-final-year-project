package com.HMS.HMS.repository;

import com.HMS.HMS.model.LabRequest.CholesterolLevelResult;
import com.HMS.HMS.model.LabRequest.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CholesterolLevelResultRepository extends JpaRepository<CholesterolLevelResult, Long> {
    
    @Query("SELECT clr FROM CholesterolLevelResult clr WHERE clr.testResult.id = :testResultId")
    CholesterolLevelResult findByTestResultId(@Param("testResultId") Long testResultId);
    
    CholesterolLevelResult findByTestResult(TestResult testResult);
}