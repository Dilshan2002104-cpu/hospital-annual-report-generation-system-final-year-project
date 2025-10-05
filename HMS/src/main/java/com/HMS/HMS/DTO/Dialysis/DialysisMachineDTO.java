package com.HMS.HMS.DTO.Dialysis;

import com.HMS.HMS.model.Dialysis.DialysisMachine;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DialysisMachineDTO {
    
    private String machineId;
    private String machineName;
    private String model;
    private String manufacturer;
    private String location;
    private DialysisMachine.MachineStatus status;
    private LocalDate installationDate;
    private LocalDate lastMaintenance;
    private LocalDate nextMaintenance;
    private Integer maintenanceIntervalDays;
    private Integer totalHoursUsed;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public DialysisMachineDTO() {}
    
    public DialysisMachineDTO(String machineId, String machineName, String model, String manufacturer, String location) {
        this.machineId = machineId;
        this.machineName = machineName;
        this.model = model;
        this.manufacturer = manufacturer;
        this.location = location;
    }
    
    // Getters and Setters
    public String getMachineId() {
        return machineId;
    }
    
    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }
    
    public String getMachineName() {
        return machineName;
    }
    
    public void setMachineName(String machineName) {
        this.machineName = machineName;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public String getManufacturer() {
        return manufacturer;
    }
    
    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public DialysisMachine.MachineStatus getStatus() {
        return status;
    }
    
    public void setStatus(DialysisMachine.MachineStatus status) {
        this.status = status;
    }
    
    public LocalDate getInstallationDate() {
        return installationDate;
    }
    
    public void setInstallationDate(LocalDate installationDate) {
        this.installationDate = installationDate;
    }
    
    public LocalDate getLastMaintenance() {
        return lastMaintenance;
    }
    
    public void setLastMaintenance(LocalDate lastMaintenance) {
        this.lastMaintenance = lastMaintenance;
    }
    
    public LocalDate getNextMaintenance() {
        return nextMaintenance;
    }
    
    public void setNextMaintenance(LocalDate nextMaintenance) {
        this.nextMaintenance = nextMaintenance;
    }
    
    public Integer getMaintenanceIntervalDays() {
        return maintenanceIntervalDays;
    }
    
    public void setMaintenanceIntervalDays(Integer maintenanceIntervalDays) {
        this.maintenanceIntervalDays = maintenanceIntervalDays;
    }
    
    public Integer getTotalHoursUsed() {
        return totalHoursUsed;
    }
    
    public void setTotalHoursUsed(Integer totalHoursUsed) {
        this.totalHoursUsed = totalHoursUsed;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}