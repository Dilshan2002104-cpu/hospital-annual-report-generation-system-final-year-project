package com.HMS.HMS.DTO.reports;

public class ClinicUnitDataDTO {
    private String unitName;
    private String unitType;
    private long totalPatients;
    private double monthlyAverage;
    private String peakMonth;
    private long peakMonthCount;
    private String lowMonth;
    private long lowMonthCount;

    public ClinicUnitDataDTO() {}

    public ClinicUnitDataDTO(String unitName, String unitType, long totalPatients,
                           double monthlyAverage, String peakMonth, long peakMonthCount,
                           String lowMonth, long lowMonthCount) {
        this.unitName = unitName;
        this.unitType = unitType;
        this.totalPatients = totalPatients;
        this.monthlyAverage = monthlyAverage;
        this.peakMonth = peakMonth;
        this.peakMonthCount = peakMonthCount;
        this.lowMonth = lowMonth;
        this.lowMonthCount = lowMonthCount;
    }

    // Getters and Setters
    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

    public String getUnitType() {
        return unitType;
    }

    public void setUnitType(String unitType) {
        this.unitType = unitType;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public double getMonthlyAverage() {
        return monthlyAverage;
    }

    public void setMonthlyAverage(double monthlyAverage) {
        this.monthlyAverage = monthlyAverage;
    }

    public String getPeakMonth() {
        return peakMonth;
    }

    public void setPeakMonth(String peakMonth) {
        this.peakMonth = peakMonth;
    }

    public long getPeakMonthCount() {
        return peakMonthCount;
    }

    public void setPeakMonthCount(long peakMonthCount) {
        this.peakMonthCount = peakMonthCount;
    }

    public String getLowMonth() {
        return lowMonth;
    }

    public void setLowMonth(String lowMonth) {
        this.lowMonth = lowMonth;
    }

    public long getLowMonthCount() {
        return lowMonthCount;
    }

    public void setLowMonthCount(long lowMonthCount) {
        this.lowMonthCount = lowMonthCount;
    }
}