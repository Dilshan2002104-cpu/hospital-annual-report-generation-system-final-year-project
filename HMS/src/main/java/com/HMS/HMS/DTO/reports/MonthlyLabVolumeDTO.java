package com.HMS.HMS.DTO.reports;

import java.math.BigDecimal;

/**
 * DTO for Monthly Laboratory Volume Data
 */
public class MonthlyLabVolumeDTO {
    private int month;
    private String monthName;
    private Long testCount;
    private Long patientCount;
    private BigDecimal avgTurnaroundTime;
    private Long urgentTests;
    private Long normalTests;
    private Double qualityScore;
    
    // Constructor
    public MonthlyLabVolumeDTO() {}
    
    public MonthlyLabVolumeDTO(int month, String monthName, Long testCount, Long patientCount) {
        this.month = month;
        this.monthName = monthName;
        this.testCount = testCount;
        this.patientCount = patientCount;
    }
    
    // Getters and Setters
    public int getMonth() {
        return month;
    }
    
    public void setMonth(int month) {
        this.month = month;
    }
    
    public String getMonthName() {
        return monthName;
    }
    
    public void setMonthName(String monthName) {
        this.monthName = monthName;
    }
    
    public Long getTestCount() {
        return testCount;
    }
    
    public void setTestCount(Long testCount) {
        this.testCount = testCount;
    }
    
    public Long getPatientCount() {
        return patientCount;
    }
    
    public void setPatientCount(Long patientCount) {
        this.patientCount = patientCount;
    }
    
    public BigDecimal getAvgTurnaroundTime() {
        return avgTurnaroundTime;
    }
    
    public void setAvgTurnaroundTime(BigDecimal avgTurnaroundTime) {
        this.avgTurnaroundTime = avgTurnaroundTime;
    }
    
    public Long getUrgentTests() {
        return urgentTests;
    }
    
    public void setUrgentTests(Long urgentTests) {
        this.urgentTests = urgentTests;
    }
    
    public Long getNormalTests() {
        return normalTests;
    }
    
    public void setNormalTests(Long normalTests) {
        this.normalTests = normalTests;
    }
    
    public Double getQualityScore() {
        return qualityScore;
    }
    
    public void setQualityScore(Double qualityScore) {
        this.qualityScore = qualityScore;
    }
}