package com.HMS.HMS.DTO.reports;

public class SpecializationDataDTO {
    private String specialization;
    private long totalVisits;
    private double averageVisitsPerMonth;
    private double percentageOfTotal;

    public SpecializationDataDTO() {}

    public SpecializationDataDTO(String specialization, long totalVisits, double averageVisitsPerMonth) {
        this.specialization = specialization;
        this.totalVisits = totalVisits;
        this.averageVisitsPerMonth = averageVisitsPerMonth;
    }

    public SpecializationDataDTO(String specialization, long totalVisits, double averageVisitsPerMonth, double percentageOfTotal) {
        this.specialization = specialization;
        this.totalVisits = totalVisits;
        this.averageVisitsPerMonth = averageVisitsPerMonth;
        this.percentageOfTotal = percentageOfTotal;
    }

    // Getters and Setters
    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public long getTotalVisits() {
        return totalVisits;
    }

    public void setTotalVisits(long totalVisits) {
        this.totalVisits = totalVisits;
    }

    public double getAverageVisitsPerMonth() {
        return averageVisitsPerMonth;
    }

    public void setAverageVisitsPerMonth(double averageVisitsPerMonth) {
        this.averageVisitsPerMonth = averageVisitsPerMonth;
    }

    public double getPercentageOfTotal() {
        return percentageOfTotal;
    }

    public void setPercentageOfTotal(double percentageOfTotal) {
        this.percentageOfTotal = percentageOfTotal;
    }
}