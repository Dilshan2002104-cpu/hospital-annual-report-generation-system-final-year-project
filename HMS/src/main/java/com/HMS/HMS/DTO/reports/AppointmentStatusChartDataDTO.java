package com.HMS.HMS.DTO.reports;

public class AppointmentStatusChartDataDTO {
    private String status;
    private long count;
    private double percentage;
    private String color; // For chart styling
    private String description;

    public AppointmentStatusChartDataDTO() {}

    public AppointmentStatusChartDataDTO(String status, long count, double percentage, String color, String description) {
        this.status = status;
        this.count = count;
        this.percentage = percentage;
        this.color = color;
        this.description = description;
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}