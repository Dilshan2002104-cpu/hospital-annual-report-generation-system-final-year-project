package com.HMS.HMS.DTO.reports;

import java.math.BigDecimal;

/**
 * DTO for Laboratory Performance Metrics
 */
public class LabPerformanceMetricsDTO {
    private String metricName;
    private String metricCategory;
    private BigDecimal value;
    private String unit;
    private BigDecimal targetValue;
    private BigDecimal previousValue;
    private String trend; // "increasing", "decreasing", "stable"
    private String status; // "good", "warning", "critical"
    
    // Constructor
    public LabPerformanceMetricsDTO() {}
    
    public LabPerformanceMetricsDTO(String metricName, String metricCategory, BigDecimal value, String unit) {
        this.metricName = metricName;
        this.metricCategory = metricCategory;
        this.value = value;
        this.unit = unit;
    }
    
    // Getters and Setters
    public String getMetricName() {
        return metricName;
    }
    
    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }
    
    public String getMetricCategory() {
        return metricCategory;
    }
    
    public void setMetricCategory(String metricCategory) {
        this.metricCategory = metricCategory;
    }
    
    public BigDecimal getValue() {
        return value;
    }
    
    public void setValue(BigDecimal value) {
        this.value = value;
    }
    
    public String getUnit() {
        return unit;
    }
    
    public void setUnit(String unit) {
        this.unit = unit;
    }
    
    public BigDecimal getTargetValue() {
        return targetValue;
    }
    
    public void setTargetValue(BigDecimal targetValue) {
        this.targetValue = targetValue;
    }
    
    public BigDecimal getPreviousValue() {
        return previousValue;
    }
    
    public void setPreviousValue(BigDecimal previousValue) {
        this.previousValue = previousValue;
    }
    
    public String getTrend() {
        return trend;
    }
    
    public void setTrend(String trend) {
        this.trend = trend;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}