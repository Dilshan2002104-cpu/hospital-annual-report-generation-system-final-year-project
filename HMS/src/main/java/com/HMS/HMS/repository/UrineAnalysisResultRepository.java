package com.HMS.HMS.repository;

import com.HMS.HMS.model.LabRequest.UrineAnalysisResult;
import com.HMS.HMS.model.LabRequest.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UrineAnalysisResultRepository extends JpaRepository<UrineAnalysisResult, Long> {
    
    @Query("SELECT uar FROM UrineAnalysisResult uar WHERE uar.testResult.id = :testResultId")
    UrineAnalysisResult findByTestResultId(@Param("testResultId") Long testResultId);
    
    UrineAnalysisResult findByTestResult(TestResult testResult);
}