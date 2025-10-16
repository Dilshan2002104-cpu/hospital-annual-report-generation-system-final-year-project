package com.HMS.HMS.model.LabRequest;

import jakarta.persistence.*;

@Entity
@Table(name = "cholesterol_level_results")
public class CholesterolLevelResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "test_result_id", nullable = false, unique = true)
    private TestResult testResult;
    
    @Column(name = "total_cholesterol")
    private Integer totalCholesterol; // mg/dL
    
    @Column(name = "hdl_cholesterol")
    private Integer hdlCholesterol; // mg/dL
    
    @Column(name = "ldl_cholesterol")
    private Integer ldlCholesterol; // mg/dL
    
    @Column(name = "triglycerides")
    private Integer triglycerides; // mg/dL
    
    // Constructors
    public CholesterolLevelResult() {}
    
    public CholesterolLevelResult(TestResult testResult, Integer totalCholesterol, 
                                 Integer hdlCholesterol, Integer ldlCholesterol, 
                                 Integer triglycerides) {
        this.testResult = testResult;
        this.totalCholesterol = totalCholesterol;
        this.hdlCholesterol = hdlCholesterol;
        this.ldlCholesterol = ldlCholesterol;
        this.triglycerides = triglycerides;
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
    
    public Integer getTotalCholesterol() {
        return totalCholesterol;
    }
    
    public void setTotalCholesterol(Integer totalCholesterol) {
        this.totalCholesterol = totalCholesterol;
    }
    
    public Integer getHdlCholesterol() {
        return hdlCholesterol;
    }
    
    public void setHdlCholesterol(Integer hdlCholesterol) {
        this.hdlCholesterol = hdlCholesterol;
    }
    
    public Integer getLdlCholesterol() {
        return ldlCholesterol;
    }
    
    public void setLdlCholesterol(Integer ldlCholesterol) {
        this.ldlCholesterol = ldlCholesterol;
    }
    
    public Integer getTriglycerides() {
        return triglycerides;
    }
    
    public void setTriglycerides(Integer triglycerides) {
        this.triglycerides = triglycerides;
    }
}