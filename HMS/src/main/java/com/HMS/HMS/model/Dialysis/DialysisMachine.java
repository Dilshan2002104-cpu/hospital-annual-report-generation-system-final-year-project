package com.HMS.HMS.model.Dialysis;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dialysis_machine")
public class DialysisMachine {
    
    @Id
    @Column(name = "machine_id", length = 20)
    private String machineId;
    
    @Column(name = "machine_name", length = 100, nullable = false)
    private String machineName;
    
    @Column(name = "model", length = 50)
    private String model;
    
    @Column(name = "manufacturer", length = 50)
    private String manufacturer;
    
    @Column(name = "location", length = 100)
    private String location;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MachineStatus status = MachineStatus.ACTIVE;
    
    @Column(name = "installation_date")
    private LocalDate installationDate;
    
    @Column(name = "last_maintenance")
    private LocalDate lastMaintenance;
    
    @Column(name = "next_maintenance")
    private LocalDate nextMaintenance;
    
    @Column(name = "maintenance_interval_days")
    private Integer maintenanceIntervalDays = 90;
    
    @Column(name = "total_hours_used")
    private Integer totalHoursUsed = 0;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public DialysisMachine() {}
    
    public DialysisMachine(String machineId, String machineName, String model, String manufacturer, String location) {
        this.machineId = machineId;
        this.machineName = machineName;
        this.model = model;
        this.manufacturer = manufacturer;
        this.location = location;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // JPA Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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
    
    public MachineStatus getStatus() {
        return status;
    }
    
    public void setStatus(MachineStatus status) {
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
    
    public enum MachineStatus {
        ACTIVE,
        MAINTENANCE,
        OUT_OF_ORDER,
        RETIRED
    }
}