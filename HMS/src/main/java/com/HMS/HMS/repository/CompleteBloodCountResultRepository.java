package com.HMS.HMS.repository;

import com.HMS.HMS.model.LabRequest.CompleteBloodCountResult;
import com.HMS.HMS.model.LabRequest.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompleteBloodCountResultRepository extends JpaRepository<CompleteBloodCountResult, Long> {
    
    @Query("SELECT cbcr FROM CompleteBloodCountResult cbcr WHERE cbcr.testResult.id = :testResultId")
    CompleteBloodCountResult findByTestResultId(@Param("testResultId") Long testResultId);
    
    CompleteBloodCountResult findByTestResult(TestResult testResult);
}