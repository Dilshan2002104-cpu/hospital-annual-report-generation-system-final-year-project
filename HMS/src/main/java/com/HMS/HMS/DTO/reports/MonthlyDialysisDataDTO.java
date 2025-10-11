package com.HMS.HMS.DTO.reports;

public class MonthlyDialysisDataDTO {
    private int month;
    private String monthName;
    private long sessionCount;
    private long patientCount;
    private long emergencyCount;
    private double averageUtilization;
    private String dataType; // "Sessions" or "Patients"

    public MonthlyDialysisDataDTO() {}

    public MonthlyDialysisDataDTO(int month, String monthName, long sessionCount, long patientCount, 
                                  long emergencyCount, double averageUtilization, String dataType) {
        this.month = month;
        this.monthName = monthName;
        this.sessionCount = sessionCount;
        this.patientCount = patientCount;
        this.emergencyCount = emergencyCount;
        this.averageUtilization = averageUtilization;
        this.dataType = dataType;
    }

    // Getters and setters
    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public String getMonthName() { return monthName; }
    public void setMonthName(String monthName) { this.monthName = monthName; }

    public long getSessionCount() { return sessionCount; }
    public void setSessionCount(long sessionCount) { this.sessionCount = sessionCount; }

    public long getPatientCount() { return patientCount; }
    public void setPatientCount(long patientCount) { this.patientCount = patientCount; }

    public long getEmergencyCount() { return emergencyCount; }
    public void setEmergencyCount(long emergencyCount) { this.emergencyCount = emergencyCount; }

    public double getAverageUtilization() { return averageUtilization; }
    public void setAverageUtilization(double averageUtilization) { this.averageUtilization = averageUtilization; }

    public String getDataType() { return dataType; }
    public void setDataType(String dataType) { this.dataType = dataType; }
}