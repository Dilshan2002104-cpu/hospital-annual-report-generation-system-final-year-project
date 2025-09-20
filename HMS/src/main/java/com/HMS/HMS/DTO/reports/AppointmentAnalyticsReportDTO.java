package com.HMS.HMS.DTO.reports;

import java.time.LocalDateTime;
import java.util.List;

public class AppointmentAnalyticsReportDTO {
    private int year;
    private int month; // Optional, for monthly reports
    private String hospitalName;
    private LocalDateTime reportGeneratedDate;

    // Summary statistics
    private long totalAppointments;
    private long completedAppointments;
    private long cancelledAppointments;
    private long scheduledAppointments;
    private double completionRate;
    private double cancellationRate;

    // Chart data
    private List<AppointmentTypeChartDataDTO> appointmentTypeDistribution;
    private List<AppointmentStatusChartDataDTO> appointmentStatusDistribution;
    private List<MonthlyAppointmentTrendDTO> monthlyTrends;
    private List<DailyAppointmentPatternDTO> dailyPatterns;
    private List<DoctorAppointmentStatsDTO> doctorPerformance;
    private List<TimeSlotAnalysisDTO> timeSlotAnalysis;
    private List<WeeklyPatternDTO> weeklyPatterns;

    // Analysis text
    private String executiveSummary;
    private String trendsAnalysis;
    private String recommendationsText;

    public AppointmentAnalyticsReportDTO() {
        this.reportGeneratedDate = LocalDateTime.now();
        this.hospitalName = "National Institute for Nephrology, Dialysis & Transplantation";
    }

    // Getters and Setters
    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public LocalDateTime getReportGeneratedDate() {
        return reportGeneratedDate;
    }

    public void setReportGeneratedDate(LocalDateTime reportGeneratedDate) {
        this.reportGeneratedDate = reportGeneratedDate;
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

    public double getCancellationRate() {
        return cancellationRate;
    }

    public void setCancellationRate(double cancellationRate) {
        this.cancellationRate = cancellationRate;
    }

    public List<AppointmentTypeChartDataDTO> getAppointmentTypeDistribution() {
        return appointmentTypeDistribution;
    }

    public void setAppointmentTypeDistribution(List<AppointmentTypeChartDataDTO> appointmentTypeDistribution) {
        this.appointmentTypeDistribution = appointmentTypeDistribution;
    }

    public List<AppointmentStatusChartDataDTO> getAppointmentStatusDistribution() {
        return appointmentStatusDistribution;
    }

    public void setAppointmentStatusDistribution(List<AppointmentStatusChartDataDTO> appointmentStatusDistribution) {
        this.appointmentStatusDistribution = appointmentStatusDistribution;
    }

    public List<MonthlyAppointmentTrendDTO> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyAppointmentTrendDTO> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }

    public List<DailyAppointmentPatternDTO> getDailyPatterns() {
        return dailyPatterns;
    }

    public void setDailyPatterns(List<DailyAppointmentPatternDTO> dailyPatterns) {
        this.dailyPatterns = dailyPatterns;
    }

    public List<DoctorAppointmentStatsDTO> getDoctorPerformance() {
        return doctorPerformance;
    }

    public void setDoctorPerformance(List<DoctorAppointmentStatsDTO> doctorPerformance) {
        this.doctorPerformance = doctorPerformance;
    }

    public List<TimeSlotAnalysisDTO> getTimeSlotAnalysis() {
        return timeSlotAnalysis;
    }

    public void setTimeSlotAnalysis(List<TimeSlotAnalysisDTO> timeSlotAnalysis) {
        this.timeSlotAnalysis = timeSlotAnalysis;
    }

    public List<WeeklyPatternDTO> getWeeklyPatterns() {
        return weeklyPatterns;
    }

    public void setWeeklyPatterns(List<WeeklyPatternDTO> weeklyPatterns) {
        this.weeklyPatterns = weeklyPatterns;
    }

    public String getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(String executiveSummary) {
        this.executiveSummary = executiveSummary;
    }

    public String getTrendsAnalysis() {
        return trendsAnalysis;
    }

    public void setTrendsAnalysis(String trendsAnalysis) {
        this.trendsAnalysis = trendsAnalysis;
    }

    public String getRecommendationsText() {
        return recommendationsText;
    }

    public void setRecommendationsText(String recommendationsText) {
        this.recommendationsText = recommendationsText;
    }
}