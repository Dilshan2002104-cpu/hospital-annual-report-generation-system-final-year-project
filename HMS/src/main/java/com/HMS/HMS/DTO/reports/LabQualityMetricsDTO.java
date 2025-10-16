package com.HMS.HMS.DTO.reports;

import java.math.BigDecimal;

/**
 * DTO for Laboratory Quality Metrics
 */
public class LabQualityMetricsDTO {
    private BigDecimal overallQualityScore;
    private Double errorRate;
    private Double repeatTestRate;
    private Double sampleRejectionRate;
    private Long criticalValueAlerts;
    private Double accuracyScore;
    private Double precisionScore;
    private Long qualityControlTests;
    private Long calibrationEvents;
    private String qualityTrend;
    
    // Constructor
    public LabQualityMetricsDTO() {}
    
    public LabQualityMetricsDTO(BigDecimal overallQualityScore, Double errorRate, Double repeatTestRate, Double sampleRejectionRate) {
        this.overallQualityScore = overallQualityScore;
        this.errorRate = errorRate;
        this.repeatTestRate = repeatTestRate;
        this.sampleRejectionRate = sampleRejectionRate;
    }
    
    // Getters and Setters
    public BigDecimal getOverallQualityScore() {
        return overallQualityScore;
    }
    
    public void setOverallQualityScore(BigDecimal overallQualityScore) {
        this.overallQualityScore = overallQualityScore;
    }
    
    public Double getErrorRate() {
        return errorRate;
    }
    
    public void setErrorRate(Double errorRate) {
        this.errorRate = errorRate;
    }
    
    public Double getRepeatTestRate() {
        return repeatTestRate;
    }
    
    public void setRepeatTestRate(Double repeatTestRate) {
        this.repeatTestRate = repeatTestRate;
    }
    
    public Double getSampleRejectionRate() {
        return sampleRejectionRate;
    }
    
    public void setSampleRejectionRate(Double sampleRejectionRate) {
        this.sampleRejectionRate = sampleRejectionRate;
    }
    
    public Long getCriticalValueAlerts() {
        return criticalValueAlerts;
    }
    
    public void setCriticalValueAlerts(Long criticalValueAlerts) {
        this.criticalValueAlerts = criticalValueAlerts;
    }
    
    public Double getAccuracyScore() {
        return accuracyScore;
    }
    
    public void setAccuracyScore(Double accuracyScore) {
        this.accuracyScore = accuracyScore;
    }
    
    public Double getPrecisionScore() {
        return precisionScore;
    }
    
    public void setPrecisionScore(Double precisionScore) {
        this.precisionScore = precisionScore;
    }
    
    public Long getQualityControlTests() {
        return qualityControlTests;
    }
    
    public void setQualityControlTests(Long qualityControlTests) {
        this.qualityControlTests = qualityControlTests;
    }
    
    public Long getCalibrationEvents() {
        return calibrationEvents;
    }
    
    public void setCalibrationEvents(Long calibrationEvents) {
        this.calibrationEvents = calibrationEvents;
    }
    
    public String getQualityTrend() {
        return qualityTrend;
    }
    
    public void setQualityTrend(String qualityTrend) {
        this.qualityTrend = qualityTrend;
    }
}