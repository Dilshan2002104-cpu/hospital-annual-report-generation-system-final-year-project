package com.HMS.HMS.DTO.reports;

public class MachinePerformanceDataDTO {
    private String machineId;
    private String machineName;
    private String location;
    private long totalSessions;
    private long completedSessions;
    private double utilizationRate;
    private double maintenanceHours;
    private double downtime;
    private double efficiency;
    private String status;

    public MachinePerformanceDataDTO() {}

    public MachinePerformanceDataDTO(String machineId, String machineName, String location, 
                                     long totalSessions, long completedSessions, double utilizationRate,
                                     double maintenanceHours, double downtime, double efficiency, String status) {
        this.machineId = machineId;
        this.machineName = machineName;
        this.location = location;
        this.totalSessions = totalSessions;
        this.completedSessions = completedSessions;
        this.utilizationRate = utilizationRate;
        this.maintenanceHours = maintenanceHours;
        this.downtime = downtime;
        this.efficiency = efficiency;
        this.status = status;
    }

    // Getters and setters
    public String getMachineId() { return machineId; }
    public void setMachineId(String machineId) { this.machineId = machineId; }

    public String getMachineName() { return machineName; }
    public void setMachineName(String machineName) { this.machineName = machineName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public long getTotalSessions() { return totalSessions; }
    public void setTotalSessions(long totalSessions) { this.totalSessions = totalSessions; }

    public long getCompletedSessions() { return completedSessions; }
    public void setCompletedSessions(long completedSessions) { this.completedSessions = completedSessions; }

    public double getUtilizationRate() { return utilizationRate; }
    public void setUtilizationRate(double utilizationRate) { this.utilizationRate = utilizationRate; }

    public double getMaintenanceHours() { return maintenanceHours; }
    public void setMaintenanceHours(double maintenanceHours) { this.maintenanceHours = maintenanceHours; }

    public double getDowntime() { return downtime; }
    public void setDowntime(double downtime) { this.downtime = downtime; }

    public double getEfficiency() { return efficiency; }
    public void setEfficiency(double efficiency) { this.efficiency = efficiency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}