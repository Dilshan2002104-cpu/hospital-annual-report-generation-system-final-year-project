package com.HMS.HMS.DTO.reports;

public class MonthlyMachineUtilizationDTO {
    private int month;
    private String monthName;
    private double utilizationPercentage;
    private long totalHours;
    private long activeHours;
    private long maintenanceHours;
    private int activeMachines;

    public MonthlyMachineUtilizationDTO() {}

    public MonthlyMachineUtilizationDTO(int month, String monthName, double utilizationPercentage, 
                                        long totalHours, long activeHours, long maintenanceHours, int activeMachines) {
        this.month = month;
        this.monthName = monthName;
        this.utilizationPercentage = utilizationPercentage;
        this.totalHours = totalHours;
        this.activeHours = activeHours;
        this.maintenanceHours = maintenanceHours;
        this.activeMachines = activeMachines;
    }

    // Getters and setters
    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public String getMonthName() { return monthName; }
    public void setMonthName(String monthName) { this.monthName = monthName; }

    public double getUtilizationPercentage() { return utilizationPercentage; }
    public void setUtilizationPercentage(double utilizationPercentage) { this.utilizationPercentage = utilizationPercentage; }

    public long getTotalHours() { return totalHours; }
    public void setTotalHours(long totalHours) { this.totalHours = totalHours; }

    public long getActiveHours() { return activeHours; }
    public void setActiveHours(long activeHours) { this.activeHours = activeHours; }

    public long getMaintenanceHours() { return maintenanceHours; }
    public void setMaintenanceHours(long maintenanceHours) { this.maintenanceHours = maintenanceHours; }

    public int getActiveMachines() { return activeMachines; }
    public void setActiveMachines(int activeMachines) { this.activeMachines = activeMachines; }
}