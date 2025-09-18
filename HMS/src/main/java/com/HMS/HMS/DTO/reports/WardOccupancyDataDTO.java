package com.HMS.HMS.DTO.reports;

public class WardOccupancyDataDTO {
    private String wardName;
    private String wardType;
    private long totalAdmissions;
    private long activeAdmissions;
    private double occupancyRate;

    public WardOccupancyDataDTO() {}

    public WardOccupancyDataDTO(String wardName, String wardType, long totalAdmissions, long activeAdmissions, double occupancyRate) {
        this.wardName = wardName;
        this.wardType = wardType;
        this.totalAdmissions = totalAdmissions;
        this.activeAdmissions = activeAdmissions;
        this.occupancyRate = occupancyRate;
    }

    // Getters and Setters
    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public String getWardType() {
        return wardType;
    }

    public void setWardType(String wardType) {
        this.wardType = wardType;
    }

    public long getTotalAdmissions() {
        return totalAdmissions;
    }

    public void setTotalAdmissions(long totalAdmissions) {
        this.totalAdmissions = totalAdmissions;
    }

    public long getActiveAdmissions() {
        return activeAdmissions;
    }

    public void setActiveAdmissions(long activeAdmissions) {
        this.activeAdmissions = activeAdmissions;
    }

    public double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }
}