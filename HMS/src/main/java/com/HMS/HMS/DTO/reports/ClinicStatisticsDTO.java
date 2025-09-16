package com.HMS.HMS.DTO.reports;

import java.util.List;

public class ClinicStatisticsDTO {
    private String unitName;
    private String unitDescription;
    private Integer totalPatients;
    private Double monthlyAverage;
    private List<MonthlyVisitDTO> monthlyData;
    private String trendAnalysis;
    private String peakMonth;
    private String lowestMonth;
    private Integer peakValue;
    private Integer lowestValue;

    // Constructors
    public ClinicStatisticsDTO() {}

    public ClinicStatisticsDTO(String unitName, String unitDescription, Integer totalPatients,
                               Double monthlyAverage, List<MonthlyVisitDTO> monthlyData) {
        this.unitName = unitName;
        this.unitDescription = unitDescription;
        this.totalPatients = totalPatients;
        this.monthlyAverage = monthlyAverage;
        this.monthlyData = monthlyData;
    }

    // Getters and Setters
    public String getUnitName() { return unitName; }
    public void setUnitName(String unitName) { this.unitName = unitName; }

    public String getUnitDescription() { return unitDescription; }
    public void setUnitDescription(String unitDescription) { this.unitDescription = unitDescription; }

    public Integer getTotalPatients() { return totalPatients; }
    public void setTotalPatients(Integer totalPatients) { this.totalPatients = totalPatients; }

    public Double getMonthlyAverage() { return monthlyAverage; }
    public void setMonthlyAverage(Double monthlyAverage) { this.monthlyAverage = monthlyAverage; }

    public List<MonthlyVisitDTO> getMonthlyData() { return monthlyData; }
    public void setMonthlyData(List<MonthlyVisitDTO> monthlyData) { this.monthlyData = monthlyData; }

    public String getTrendAnalysis() { return trendAnalysis; }
    public void setTrendAnalysis(String trendAnalysis) { this.trendAnalysis = trendAnalysis; }

    public String getPeakMonth() { return peakMonth; }
    public void setPeakMonth(String peakMonth) { this.peakMonth = peakMonth; }

    public String getLowestMonth() { return lowestMonth; }
    public void setLowestMonth(String lowestMonth) { this.lowestMonth = lowestMonth; }

    public Integer getPeakValue() { return peakValue; }
    public void setPeakValue(Integer peakValue) { this.peakValue = peakValue; }

    public Integer getLowestValue() { return lowestValue; }
    public void setLowestValue(Integer lowestValue) { this.lowestValue = lowestValue; }
}