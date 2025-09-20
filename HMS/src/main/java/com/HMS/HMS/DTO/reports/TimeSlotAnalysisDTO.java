package com.HMS.HMS.DTO.reports;

public class TimeSlotAnalysisDTO {
    private String timeSlot; // e.g., "09:00-10:00"
    private int hour; // 24-hour format
    private long appointmentCount;
    private double utilizationRate;
    private String peakIndicator; // "Peak", "High", "Medium", "Low"
    private String color; // For heat map visualization

    public TimeSlotAnalysisDTO() {}

    public TimeSlotAnalysisDTO(String timeSlot, int hour, long appointmentCount, double utilizationRate) {
        this.timeSlot = timeSlot;
        this.hour = hour;
        this.appointmentCount = appointmentCount;
        this.utilizationRate = utilizationRate;
        this.peakIndicator = calculatePeakIndicator(utilizationRate);
        this.color = getColorForUtilization(utilizationRate);
    }

    private String calculatePeakIndicator(double utilizationRate) {
        if (utilizationRate >= 80) return "Peak";
        else if (utilizationRate >= 60) return "High";
        else if (utilizationRate >= 40) return "Medium";
        else return "Low";
    }

    private String getColorForUtilization(double utilizationRate) {
        if (utilizationRate >= 80) return "#d32f2f"; // Dark red
        else if (utilizationRate >= 60) return "#f57c00"; // Orange
        else if (utilizationRate >= 40) return "#fbc02d"; // Yellow
        else return "#388e3c"; // Green
    }

    // Getters and Setters
    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public int getHour() {
        return hour;
    }

    public void setHour(int hour) {
        this.hour = hour;
    }

    public long getAppointmentCount() {
        return appointmentCount;
    }

    public void setAppointmentCount(long appointmentCount) {
        this.appointmentCount = appointmentCount;
    }

    public double getUtilizationRate() {
        return utilizationRate;
    }

    public void setUtilizationRate(double utilizationRate) {
        this.utilizationRate = utilizationRate;
    }

    public String getPeakIndicator() {
        return peakIndicator;
    }

    public void setPeakIndicator(String peakIndicator) {
        this.peakIndicator = peakIndicator;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}