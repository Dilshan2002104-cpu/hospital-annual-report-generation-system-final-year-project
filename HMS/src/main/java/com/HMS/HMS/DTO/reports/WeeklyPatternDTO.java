package com.HMS.HMS.DTO.reports;

public class WeeklyPatternDTO {
    private int weekNumber;
    private String weekRange; // e.g., "Jan 1-7, 2023"
    private long totalAppointments;
    private long completedAppointments;
    private double completionRate;
    private String busiestDay;
    private String quietestDay;
    private double weekOverWeekGrowth;

    public WeeklyPatternDTO() {}

    public WeeklyPatternDTO(int weekNumber, String weekRange, long totalAppointments,
                          long completedAppointments, String busiestDay, String quietestDay) {
        this.weekNumber = weekNumber;
        this.weekRange = weekRange;
        this.totalAppointments = totalAppointments;
        this.completedAppointments = completedAppointments;
        this.busiestDay = busiestDay;
        this.quietestDay = quietestDay;
        this.completionRate = totalAppointments > 0 ? (double) completedAppointments / totalAppointments * 100 : 0;
    }

    // Getters and Setters
    public int getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(int weekNumber) {
        this.weekNumber = weekNumber;
    }

    public String getWeekRange() {
        return weekRange;
    }

    public void setWeekRange(String weekRange) {
        this.weekRange = weekRange;
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

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public String getBusiestDay() {
        return busiestDay;
    }

    public void setBusiestDay(String busiestDay) {
        this.busiestDay = busiestDay;
    }

    public String getQuietestDay() {
        return quietestDay;
    }

    public void setQuietestDay(String quietestDay) {
        this.quietestDay = quietestDay;
    }

    public double getWeekOverWeekGrowth() {
        return weekOverWeekGrowth;
    }

    public void setWeekOverWeekGrowth(double weekOverWeekGrowth) {
        this.weekOverWeekGrowth = weekOverWeekGrowth;
    }
}