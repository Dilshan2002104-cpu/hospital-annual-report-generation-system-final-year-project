package com.HMS.HMS.DTO.reports;

import java.util.List;

public class ClinicStatisticsDTO {
    private String unitName;
    private Long totalPatients;
    private Double monthlyAverage;
    private List<MonthlyVisitDTO> monthlyVisits;

    public ClinicStatisticsDTO() {}

    public ClinicStatisticsDTO(String unitName, Long totalPatients, Double monthlyAverage, List<MonthlyVisitDTO> monthlyVisits) {
        this.unitName = unitName;
        this.totalPatients = totalPatients;
        this.monthlyAverage = monthlyAverage;
        this.monthlyVisits = monthlyVisits;
    }

    // Getters and Setters
    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

    public Long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(Long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public Double getMonthlyAverage() {
        return monthlyAverage;
    }

    public void setMonthlyAverage(Double monthlyAverage) {
        this.monthlyAverage = monthlyAverage;
    }

    public List<MonthlyVisitDTO> getMonthlyVisits() {
        return monthlyVisits;
    }

    public void setMonthlyVisits(List<MonthlyVisitDTO> monthlyVisits) {
        this.monthlyVisits = monthlyVisits;
    }
}