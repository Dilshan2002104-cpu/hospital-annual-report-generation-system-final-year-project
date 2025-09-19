package com.HMS.HMS.DTO.reports;

import java.util.List;

public class ProcedureDataDTO {
    private String procedureType;
    private long totalCount;
    private double monthlyAverage;
    private String peakMonth;
    private long peakMonthCount;
    private String lowMonth;
    private long lowMonthCount;
    private List<MonthlyVisitDataDTO> monthlyData;

    public ProcedureDataDTO() {}

    public ProcedureDataDTO(String procedureType, long totalCount, double monthlyAverage,
                          String peakMonth, long peakMonthCount, String lowMonth, long lowMonthCount,
                          List<MonthlyVisitDataDTO> monthlyData) {
        this.procedureType = procedureType;
        this.totalCount = totalCount;
        this.monthlyAverage = monthlyAverage;
        this.peakMonth = peakMonth;
        this.peakMonthCount = peakMonthCount;
        this.lowMonth = lowMonth;
        this.lowMonthCount = lowMonthCount;
        this.monthlyData = monthlyData;
    }

    // Getters and Setters
    public String getProcedureType() {
        return procedureType;
    }

    public void setProcedureType(String procedureType) {
        this.procedureType = procedureType;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
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

    public List<MonthlyVisitDataDTO> getMonthlyData() {
        return monthlyData;
    }

    public void setMonthlyData(List<MonthlyVisitDataDTO> monthlyData) {
        this.monthlyData = monthlyData;
    }
}