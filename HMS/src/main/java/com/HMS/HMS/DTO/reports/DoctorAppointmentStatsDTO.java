package com.HMS.HMS.DTO.reports;

public class DoctorAppointmentStatsDTO {
    private Long doctorId;
    private String doctorName;
    private String specialization;
    private long totalAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
    private double completionRate;
    private double averageAppointmentsPerDay;
    private String mostBusyDay;
    private int patientSatisfactionScore; // Optional, if available

    public DoctorAppointmentStatsDTO() {}

    public DoctorAppointmentStatsDTO(Long doctorId, String doctorName, String specialization,
                                   long totalAppointments, long completedAppointments,
                                   long cancelledAppointments) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.specialization = specialization;
        this.totalAppointments = totalAppointments;
        this.completedAppointments = completedAppointments;
        this.cancelledAppointments = cancelledAppointments;
        this.completionRate = totalAppointments > 0 ? (double) completedAppointments / totalAppointments * 100 : 0;
    }

    // Getters and Setters
    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
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

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public double getAverageAppointmentsPerDay() {
        return averageAppointmentsPerDay;
    }

    public void setAverageAppointmentsPerDay(double averageAppointmentsPerDay) {
        this.averageAppointmentsPerDay = averageAppointmentsPerDay;
    }

    public String getMostBusyDay() {
        return mostBusyDay;
    }

    public void setMostBusyDay(String mostBusyDay) {
        this.mostBusyDay = mostBusyDay;
    }

    public int getPatientSatisfactionScore() {
        return patientSatisfactionScore;
    }

    public void setPatientSatisfactionScore(int patientSatisfactionScore) {
        this.patientSatisfactionScore = patientSatisfactionScore;
    }
}