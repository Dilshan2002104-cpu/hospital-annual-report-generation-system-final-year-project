package com.HMS.HMS.DTO.reports;

public class MonthlyAppointmentTrendDTO {
    private int month;
    private String monthName;
    private long totalAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
    private long scheduledAppointments;
    private double completionRate;
    private double growthRate; // Month-over-month growth

    public MonthlyAppointmentTrendDTO() {}

    public MonthlyAppointmentTrendDTO(int month, String monthName, long totalAppointments,
                                    long completedAppointments, long cancelledAppointments,
                                    long scheduledAppointments) {
        this.month = month;
        this.monthName = monthName;
        this.totalAppointments = totalAppointments;
        this.completedAppointments = completedAppointments;
        this.cancelledAppointments = cancelledAppointments;
        this.scheduledAppointments = scheduledAppointments;
        this.completionRate = totalAppointments > 0 ? (double) completedAppointments / totalAppointments * 100 : 0;
    }

    // Getters and Setters
    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public String getMonthName() {
        return monthName;
    }

    public void setMonthName(String monthName) {
        this.monthName = monthName;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getCompletedAppointments() {
        return completedAppointments;
    }

    public void setCompletedAppointments(long completedAppointments) {
        this.completedAppointments = completedAppointments;
    }

    public long getCancelledAppointments() {
        return cancelledAppointments;
    }

    public void setCancelledAppointments(long cancelledAppointments) {
        this.cancelledAppointments = cancelledAppointments;
    }

    public long getScheduledAppointments() {
        return scheduledAppointments;
    }

    public void setScheduledAppointments(long scheduledAppointments) {
        this.scheduledAppointments = scheduledAppointments;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public double getGrowthRate() {
        return growthRate;
    }

    public void setGrowthRate(double growthRate) {
        this.growthRate = growthRate;
    }
}