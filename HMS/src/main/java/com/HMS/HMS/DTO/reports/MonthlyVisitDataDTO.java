package com.HMS.HMS.DTO.reports;

import java.time.Month;

public class MonthlyVisitDataDTO {
    private int month;
    private String monthName;
    private long patientCount;
    private String unitType;
    private long previousYearCount;
    private double changePercentage;

    public MonthlyVisitDataDTO() {}

    public MonthlyVisitDataDTO(int month, long patientCount, String unitType) {
        this.month = month;
        this.monthName = Month.of(month).name();
        this.patientCount = patientCount;
        this.unitType = unitType;
    }

    public MonthlyVisitDataDTO(int month, String monthName, long patientCount, String unitType, long previousYearCount, double changePercentage) {
        this.month = month;
        this.monthName = monthName;
        this.patientCount = patientCount;
        this.unitType = unitType;
        this.previousYearCount = previousYearCount;
        this.changePercentage = changePercentage;
    }

    // Getters and Setters
    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
        this.monthName = Month.of(month).name();
    }

    public String getMonthName() {
        return monthName;
    }

    public void setMonthName(String monthName) {
        this.monthName = monthName;
    }

    public long getPatientCount() {
        return patientCount;
    }

    public void setPatientCount(long patientCount) {
        this.patientCount = patientCount;
    }

    public String getUnitType() {
        return unitType;
    }

    public void setUnitType(String unitType) {
        this.unitType = unitType;
    }

    public long getPreviousYearCount() {
        return previousYearCount;
    }

    public void setPreviousYearCount(long previousYearCount) {
        this.previousYearCount = previousYearCount;
    }

    public double getChangePercentage() {
        return changePercentage;
    }

    public void setChangePercentage(double changePercentage) {
        this.changePercentage = changePercentage;
    }
}