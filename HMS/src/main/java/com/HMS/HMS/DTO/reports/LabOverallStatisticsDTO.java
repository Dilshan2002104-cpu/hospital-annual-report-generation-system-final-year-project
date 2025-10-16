package com.HMS.HMS.DTO.reports;

import java.math.BigDecimal;

/**
 * DTO for Laboratory Overall Statistics
 */
public class LabOverallStatisticsDTO {
    private Long totalTests;
    private Long totalPatients;
    private BigDecimal avgTurnaroundTime; // in hours
    private Double qualityScore;
    private Long urgentTests;
    private Long normalTests;
    private Long equipmentCount;
    private Double equipmentUptime;
    private Long testsCancelled;
    private Long testsRepeated;
    
    // Constructor
    public LabOverallStatisticsDTO() {}
    
    public LabOverallStatisticsDTO(Long totalTests, Long totalPatients, BigDecimal avgTurnaroundTime, Double qualityScore) {
        this.totalTests = totalTests;
        this.totalPatients = totalPatients;
        this.avgTurnaroundTime = avgTurnaroundTime;
        this.qualityScore = qualityScore;
    }
    
    // Getters and Setters
    public Long getTotalTests() {
        return totalTests;
    }
    
    public void setTotalTests(Long totalTests) {
        this.totalTests = totalTests;
    }
    
    public Long getTotalPatients() {
        return totalPatients;
    }
    
    public void setTotalPatients(Long totalPatients) {
        this.totalPatients = totalPatients;
    }
    
    public BigDecimal getAvgTurnaroundTime() {
        return avgTurnaroundTime;
    }
    
    public void setAvgTurnaroundTime(BigDecimal avgTurnaroundTime) {
        this.avgTurnaroundTime = avgTurnaroundTime;
    }
    
    public Double getQualityScore() {
        return qualityScore;
    }
    
    public void setQualityScore(Double qualityScore) {
        this.qualityScore = qualityScore;
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
    
    public Long getEquipmentCount() {
        return equipmentCount;
    }
    
    public void setEquipmentCount(Long equipmentCount) {
        this.equipmentCount = equipmentCount;
    }
    
    public Double getEquipmentUptime() {
        return equipmentUptime;
    }
    
    public void setEquipmentUptime(Double equipmentUptime) {
        this.equipmentUptime = equipmentUptime;
    }
    
    public Long getTestsCancelled() {
        return testsCancelled;
    }
    
    public void setTestsCancelled(Long testsCancelled) {
        this.testsCancelled = testsCancelled;
    }
    
    public Long getTestsRepeated() {
        return testsRepeated;
    }
    
    public void setTestsRepeated(Long testsRepeated) {
        this.testsRepeated = testsRepeated;
    }
}