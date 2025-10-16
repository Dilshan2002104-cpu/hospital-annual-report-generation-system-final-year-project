package com.HMS.HMS.model.LabRequest;

import jakarta.persistence.*;

@Entity
@Table(name = "complete_blood_count_results")
public class CompleteBloodCountResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "test_result_id", nullable = false, unique = true)
    private TestResult testResult;
    
    @Column(name = "wbc")
    private Double wbc; // White Blood Cells (× 10³/μL)
    
    @Column(name = "rbc")
    private Double rbc; // Red Blood Cells (× 10⁶/μL)
    
    @Column(name = "hemoglobin")
    private Double hemoglobin; // g/dL
    
    @Column(name = "platelets")
    private Integer platelets; // × 10³/μL
    
    // Constructors
    public CompleteBloodCountResult() {}
    
    public CompleteBloodCountResult(TestResult testResult, Double wbc, Double rbc, 
                                  Double hemoglobin, Integer platelets) {
        this.testResult = testResult;
        this.wbc = wbc;
        this.rbc = rbc;
        this.hemoglobin = hemoglobin;
        this.platelets = platelets;
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
    
    public Double getWbc() {
        return wbc;
    }
    
    public void setWbc(Double wbc) {
        this.wbc = wbc;
    }
    
    public Double getRbc() {
        return rbc;
    }
    
    public void setRbc(Double rbc) {
        this.rbc = rbc;
    }
    
    public Double getHemoglobin() {
        return hemoglobin;
    }
    
    public void setHemoglobin(Double hemoglobin) {
        this.hemoglobin = hemoglobin;
    }
    
    public Integer getPlatelets() {
        return platelets;
    }
    
    public void setPlatelets(Integer platelets) {
        this.platelets = platelets;
    }
}