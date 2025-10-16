package com.HMS.HMS.DTO.reports;

/**
 * DTO for Equipment Utilization Data
 */
public class EquipmentUtilizationDTO {
    private String equipmentName;
    private String equipmentType;
    private String equipmentId;
    private Double utilizationPercentage;
    private Long testsProcessed;
    private Double uptimePercentage;
    private Long downtimeHours;
    private String status;
    private Long maintenanceCount;
    
    // Constructor
    public EquipmentUtilizationDTO() {}
    
    public EquipmentUtilizationDTO(String equipmentName, String equipmentType, Double utilizationPercentage, Long testsProcessed) {
        this.equipmentName = equipmentName;
        this.equipmentType = equipmentType;
        this.utilizationPercentage = utilizationPercentage;
        this.testsProcessed = testsProcessed;
    }
    
    // Getters and Setters
    public String getEquipmentName() {
        return equipmentName;
    }
    
    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }
    
    public String getEquipmentType() {
        return equipmentType;
    }
    
    public void setEquipmentType(String equipmentType) {
        this.equipmentType = equipmentType;
    }
    
    public String getEquipmentId() {
        return equipmentId;
    }
    
    public void setEquipmentId(String equipmentId) {
        this.equipmentId = equipmentId;
    }
    
    public Double getUtilizationPercentage() {
        return utilizationPercentage;
    }
    
    public void setUtilizationPercentage(Double utilizationPercentage) {
        this.utilizationPercentage = utilizationPercentage;
    }
    
    public Long getTestsProcessed() {
        return testsProcessed;
    }
    
    public void setTestsProcessed(Long testsProcessed) {
        this.testsProcessed = testsProcessed;
    }
    
    public Double getUptimePercentage() {
        return uptimePercentage;
    }
    
    public void setUptimePercentage(Double uptimePercentage) {
        this.uptimePercentage = uptimePercentage;
    }
    
    public Long getDowntimeHours() {
        return downtimeHours;
    }
    
    public void setDowntimeHours(Long downtimeHours) {
        this.downtimeHours = downtimeHours;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Long getMaintenanceCount() {
        return maintenanceCount;
    }
    
    public void setMaintenanceCount(Long maintenanceCount) {
        this.maintenanceCount = maintenanceCount;
    }
}