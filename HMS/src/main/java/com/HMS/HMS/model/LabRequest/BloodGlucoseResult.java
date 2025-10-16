package com.HMS.HMS.model.LabRequest;

import jakarta.persistence.*;

@Entity
@Table(name = "blood_glucose_results")
public class BloodGlucoseResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "test_result_id", nullable = false, unique = true)
    private TestResult testResult;
    
    @Column(name = "glucose_level")
    private Double glucoseLevel;
    
    @Column(name = "test_type")
    private String testType; // fasting, random, postprandial
    
    // Constructors
    public BloodGlucoseResult() {}
    
    public BloodGlucoseResult(TestResult testResult, Double glucoseLevel, String testType) {
        this.testResult = testResult;
        this.glucoseLevel = glucoseLevel;
        this.testType = testType;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public TestResult getTestResult() {
        return testResult;
    }
    
    public void setTestResult(TestResult testResult) {
        this.testResult = testResult;
    }
    
    public Double getGlucoseLevel() {
        return glucoseLevel;
    }
    
    public void setGlucoseLevel(Double glucoseLevel) {
        this.glucoseLevel = glucoseLevel;
    }
    
    public String getTestType() {
        return testType;
    }
    
    public void setTestType(String testType) {
        this.testType = testType;
    }
}