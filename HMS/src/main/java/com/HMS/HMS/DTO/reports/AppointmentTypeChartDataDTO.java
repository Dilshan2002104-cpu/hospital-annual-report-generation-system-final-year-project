package com.HMS.HMS.DTO.reports;

public class AppointmentTypeChartDataDTO {
    private String appointmentType;
    private long count;
    private double percentage;
    private String color; // For chart styling

    public AppointmentTypeChartDataDTO() {}

    public AppointmentTypeChartDataDTO(String appointmentType, long count, double percentage, String color) {
        this.appointmentType = appointmentType;
        this.count = count;
        this.percentage = percentage;
        this.color = color;
    }

    // Getters and Setters
    public String getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(String appointmentType) {
        this.appointmentType = appointmentType;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}