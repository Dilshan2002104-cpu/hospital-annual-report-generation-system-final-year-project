package com.HMS.HMS.model.LabRequest;

import jakarta.persistence.*;

@Entity
@Table(name = "urine_analysis_results")
public class UrineAnalysisResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "test_result_id", nullable = false, unique = true)
    private TestResult testResult;
    
    @Column(name = "protein")
    private String protein; // negative, trace, 1+, 2+, 3+, 4+
    
    @Column(name = "urine_glucose")
    private String urineGlucose; // negative, positive
    
    @Column(name = "specific_gravity")
    private Double specificGravity; // 1.003-1.030
    
    @Column(name = "ph")
    private Double ph; // 4.6-8.0
    
    // Constructors
    public UrineAnalysisResult() {}
    
    public UrineAnalysisResult(TestResult testResult, String protein, String urineGlucose, 
                              Double specificGravity, Double ph) {
        this.testResult = testResult;
        this.protein = protein;
        this.urineGlucose = urineGlucose;
        this.specificGravity = specificGravity;
        this.ph = ph;
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
    
    public String getProtein() {
        return protein;
    }
    
    public void setProtein(String protein) {
        this.protein = protein;
    }
    
    public String getUrineGlucose() {
        return urineGlucose;
    }
    
    public void setUrineGlucose(String urineGlucose) {
        this.urineGlucose = urineGlucose;
    }
    
    public Double getSpecificGravity() {
        return specificGravity;
    }
    
    public void setSpecificGravity(Double specificGravity) {
        this.specificGravity = specificGravity;
    }
    
    public Double getPh() {
        return ph;
    }
    
    public void setPh(Double ph) {
        this.ph = ph;
    }
}