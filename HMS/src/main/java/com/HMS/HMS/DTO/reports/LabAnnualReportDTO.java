package com.HMS.HMS.DTO.reports;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Laboratory Annual Report data
 */
public class LabAnnualReportDTO {
    private int year;
    private LocalDateTime reportGeneratedDate;
    private String reportTitle;
    private LabOverallStatisticsDTO overallStatistics;
    private List<MonthlyLabVolumeDTO> monthlyVolumes;
    private List<TestTypeStatisticsDTO> testTypeStatistics;
    private List<EquipmentUtilizationDTO> equipmentUtilization;
    private List<LabPerformanceMetricsDTO> performanceMetrics;
    private List<WardLabRequestsDTO> wardRequests;
    private LabQualityMetricsDTO qualityMetrics;
    
    // Constructor
    public LabAnnualReportDTO() {}
    
    public LabAnnualReportDTO(int year, LocalDateTime reportGeneratedDate, String reportTitle) {
        this.year = year;
        this.reportGeneratedDate = reportGeneratedDate;
        this.reportTitle = reportTitle;
    }
    
    // Getters and Setters
    public int getYear() {
        return year;
    }
    
    public void setYear(int year) {
        this.year = year;
    }
    
    public LocalDateTime getReportGeneratedDate() {
        return reportGeneratedDate;
    }
    
    public void setReportGeneratedDate(LocalDateTime reportGeneratedDate) {
        this.reportGeneratedDate = reportGeneratedDate;
    }
    
    public String getReportTitle() {
        return reportTitle;
    }
    
    public void setReportTitle(String reportTitle) {
        this.reportTitle = reportTitle;
    }
    
    public LabOverallStatisticsDTO getOverallStatistics() {
        return overallStatistics;
    }
    
    public void setOverallStatistics(LabOverallStatisticsDTO overallStatistics) {
        this.overallStatistics = overallStatistics;
    }
    
    public List<MonthlyLabVolumeDTO> getMonthlyVolumes() {
        return monthlyVolumes;
    }
    
    public void setMonthlyVolumes(List<MonthlyLabVolumeDTO> monthlyVolumes) {
        this.monthlyVolumes = monthlyVolumes;
    }
    
    public List<TestTypeStatisticsDTO> getTestTypeStatistics() {
        return testTypeStatistics;
    }
    
    public void setTestTypeStatistics(List<TestTypeStatisticsDTO> testTypeStatistics) {
        this.testTypeStatistics = testTypeStatistics;
    }
    
    public List<EquipmentUtilizationDTO> getEquipmentUtilization() {
        return equipmentUtilization;
    }
    
    public void setEquipmentUtilization(List<EquipmentUtilizationDTO> equipmentUtilization) {
        this.equipmentUtilization = equipmentUtilization;
    }
    
    public List<LabPerformanceMetricsDTO> getPerformanceMetrics() {
        return performanceMetrics;
    }
    
    public void setPerformanceMetrics(List<LabPerformanceMetricsDTO> performanceMetrics) {
        this.performanceMetrics = performanceMetrics;
    }
    
    public List<WardLabRequestsDTO> getWardRequests() {
        return wardRequests;
    }
    
    public void setWardRequests(List<WardLabRequestsDTO> wardRequests) {
        this.wardRequests = wardRequests;
    }
    
    public LabQualityMetricsDTO getQualityMetrics() {
        return qualityMetrics;
    }
    
    public void setQualityMetrics(LabQualityMetricsDTO qualityMetrics) {
        this.qualityMetrics = qualityMetrics;
    }
}