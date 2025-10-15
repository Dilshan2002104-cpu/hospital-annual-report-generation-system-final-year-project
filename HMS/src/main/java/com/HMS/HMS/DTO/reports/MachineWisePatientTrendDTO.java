package com.HMS.HMS.DTO.reports;

import java.util.List;

public class MachineWisePatientTrendDTO {
    private String machineId;
    private String machineName;
    private String location;
    private List<MonthlyPatientDataDTO> monthlyPatientData;
    private int totalUniquePatients;
    private double averagePatientsPerMonth;
    private String trendDirection; // "INCREASING", "DECREASING", "STABLE"
    private double growthRate; // Year-over-year or month-over-month

    public MachineWisePatientTrendDTO() {}

    public MachineWisePatientTrendDTO(String machineId, String machineName, String location) {
        this.machineId = machineId;
        this.machineName = machineName;
        this.location = location;
    }

    // Monthly patient data for line chart
    public static class MonthlyPatientDataDTO {
        private int month;
        private String monthName;
        private int uniquePatients;
        private int totalSessions;
        private double utilizationRate;

        public MonthlyPatientDataDTO() {}

        public MonthlyPatientDataDTO(int month, String monthName, int uniquePatients, int totalSessions) {
            this.month = month;
            this.monthName = monthName;
            this.uniquePatients = uniquePatients;
            this.totalSessions = totalSessions;
            this.utilizationRate = totalSessions > 0 ? (uniquePatients * 100.0 / totalSessions) : 0.0;
        }

        // Getters and Setters
        public int getMonth() { return month; }
        public void setMonth(int month) { this.month = month; }
        
        public String getMonthName() { return monthName; }
        public void setMonthName(String monthName) { this.monthName = monthName; }
        
        public int getUniquePatients() { return uniquePatients; }
        public void setUniquePatients(int uniquePatients) { this.uniquePatients = uniquePatients; }
        
        public int getTotalSessions() { return totalSessions; }
        public void setTotalSessions(int totalSessions) { this.totalSessions = totalSessions; }
        
        public double getUtilizationRate() { return utilizationRate; }
        public void setUtilizationRate(double utilizationRate) { this.utilizationRate = utilizationRate; }
    }

    // Getters and Setters
    public String getMachineId() { return machineId; }
    public void setMachineId(String machineId) { this.machineId = machineId; }
    
    public String getMachineName() { return machineName; }
    public void setMachineName(String machineName) { this.machineName = machineName; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public List<MonthlyPatientDataDTO> getMonthlyPatientData() { return monthlyPatientData; }
    public void setMonthlyPatientData(List<MonthlyPatientDataDTO> monthlyPatientData) { this.monthlyPatientData = monthlyPatientData; }
    
    public int getTotalUniquePatients() { return totalUniquePatients; }
    public void setTotalUniquePatients(int totalUniquePatients) { this.totalUniquePatients = totalUniquePatients; }
    
    public double getAveragePatientsPerMonth() { return averagePatientsPerMonth; }
    public void setAveragePatientsPerMonth(double averagePatientsPerMonth) { this.averagePatientsPerMonth = averagePatientsPerMonth; }
    
    public String getTrendDirection() { return trendDirection; }
    public void setTrendDirection(String trendDirection) { this.trendDirection = trendDirection; }
    
    public double getGrowthRate() { return growthRate; }
    public void setGrowthRate(double growthRate) { this.growthRate = growthRate; }
}