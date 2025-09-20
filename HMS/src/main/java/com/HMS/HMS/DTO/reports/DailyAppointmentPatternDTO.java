package com.HMS.HMS.DTO.reports;

public class DailyAppointmentPatternDTO {
    private String dayOfWeek;
    private int dayNumber; // 1-7 (Monday-Sunday)
    private long appointmentCount;
    private double averageAppointments;
    private String peakTimeSlot;
    private double utilizationRate;

    public DailyAppointmentPatternDTO() {}

    public DailyAppointmentPatternDTO(String dayOfWeek, int dayNumber, long appointmentCount,
                                    double averageAppointments, String peakTimeSlot) {
        this.dayOfWeek = dayOfWeek;
        this.dayNumber = dayNumber;
        this.appointmentCount = appointmentCount;
        this.averageAppointments = averageAppointments;
        this.peakTimeSlot = peakTimeSlot;
    }

    // Getters and Setters
    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public int getDayNumber() {
        return dayNumber;
    }

    public void setDayNumber(int dayNumber) {
        this.dayNumber = dayNumber;
    }

    public long getAppointmentCount() {
        return appointmentCount;
    }

    public void setAppointmentCount(long appointmentCount) {
        this.appointmentCount = appointmentCount;
    }

    public double getAverageAppointments() {
        return averageAppointments;
    }

    public void setAverageAppointments(double averageAppointments) {
        this.averageAppointments = averageAppointments;
    }

    public String getPeakTimeSlot() {
        return peakTimeSlot;
    }

    public void setPeakTimeSlot(String peakTimeSlot) {
        this.peakTimeSlot = peakTimeSlot;
    }

    public double getUtilizationRate() {
        return utilizationRate;
    }

    public void setUtilizationRate(double utilizationRate) {
        this.utilizationRate = utilizationRate;
    }
}