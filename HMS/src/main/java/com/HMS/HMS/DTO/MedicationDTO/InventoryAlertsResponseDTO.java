package com.HMS.HMS.DTO.MedicationDTO;

import java.time.LocalDate;
import java.util.List;

public class InventoryAlertsResponseDTO {
    
    private List<MedicationAlertDTO> expiredMedications;
    private List<MedicationAlertDTO> nearExpiryMedications;
    private List<MedicationAlertDTO> outOfStockMedications;
    private List<MedicationAlertDTO> lowStockMedications;
    
    // Alert summary counts
    private AlertSummaryDTO summary;
    
    public InventoryAlertsResponseDTO() {}
    
    public InventoryAlertsResponseDTO(List<MedicationAlertDTO> expiredMedications,
                                    List<MedicationAlertDTO> nearExpiryMedications,
                                    List<MedicationAlertDTO> outOfStockMedications,
                                    List<MedicationAlertDTO> lowStockMedications,
                                    AlertSummaryDTO summary) {
        this.expiredMedications = expiredMedications;
        this.nearExpiryMedications = nearExpiryMedications;
        this.outOfStockMedications = outOfStockMedications;
        this.lowStockMedications = lowStockMedications;
        this.summary = summary;
    }
    
    // Getters and Setters
    public List<MedicationAlertDTO> getExpiredMedications() {
        return expiredMedications;
    }
    
    public void setExpiredMedications(List<MedicationAlertDTO> expiredMedications) {
        this.expiredMedications = expiredMedications;
    }
    
    public List<MedicationAlertDTO> getNearExpiryMedications() {
        return nearExpiryMedications;
    }
    
    public void setNearExpiryMedications(List<MedicationAlertDTO> nearExpiryMedications) {
        this.nearExpiryMedications = nearExpiryMedications;
    }
    
    public List<MedicationAlertDTO> getOutOfStockMedications() {
        return outOfStockMedications;
    }
    
    public void setOutOfStockMedications(List<MedicationAlertDTO> outOfStockMedications) {
        this.outOfStockMedications = outOfStockMedications;
    }
    
    public List<MedicationAlertDTO> getLowStockMedications() {
        return lowStockMedications;
    }
    
    public void setLowStockMedications(List<MedicationAlertDTO> lowStockMedications) {
        this.lowStockMedications = lowStockMedications;
    }
    
    public AlertSummaryDTO getSummary() {
        return summary;
    }
    
    public void setSummary(AlertSummaryDTO summary) {
        this.summary = summary;
    }
    
    // Inner class for individual medication alerts
    public static class MedicationAlertDTO {
        private Long id;
        private String drugName;
        private String genericName;
        private String category;
        private String strength;
        private String batchNumber;
        private Integer currentStock;
        private Integer minimumStock;
        private Integer maximumStock;
        private LocalDate expiryDate;
        private String alertType;
        private Integer daysUntilExpiry;
        private String priority; // HIGH, MEDIUM, LOW
        
        public MedicationAlertDTO() {}
        
        public MedicationAlertDTO(Long id, String drugName, String genericName, String category,
                                String strength, String batchNumber, Integer currentStock,
                                Integer minimumStock, Integer maximumStock, LocalDate expiryDate,
                                String alertType, Integer daysUntilExpiry, String priority) {
            this.id = id;
            this.drugName = drugName;
            this.genericName = genericName;
            this.category = category;
            this.strength = strength;
            this.batchNumber = batchNumber;
            this.currentStock = currentStock;
            this.minimumStock = minimumStock;
            this.maximumStock = maximumStock;
            this.expiryDate = expiryDate;
            this.alertType = alertType;
            this.daysUntilExpiry = daysUntilExpiry;
            this.priority = priority;
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getDrugName() { return drugName; }
        public void setDrugName(String drugName) { this.drugName = drugName; }
        
        public String getGenericName() { return genericName; }
        public void setGenericName(String genericName) { this.genericName = genericName; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public String getStrength() { return strength; }
        public void setStrength(String strength) { this.strength = strength; }
        
        public String getBatchNumber() { return batchNumber; }
        public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
        
        public Integer getCurrentStock() { return currentStock; }
        public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }
        
        public Integer getMinimumStock() { return minimumStock; }
        public void setMinimumStock(Integer minimumStock) { this.minimumStock = minimumStock; }
        
        public Integer getMaximumStock() { return maximumStock; }
        public void setMaximumStock(Integer maximumStock) { this.maximumStock = maximumStock; }
        
        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
        
        public String getAlertType() { return alertType; }
        public void setAlertType(String alertType) { this.alertType = alertType; }
        
        public Integer getDaysUntilExpiry() { return daysUntilExpiry; }
        public void setDaysUntilExpiry(Integer daysUntilExpiry) { this.daysUntilExpiry = daysUntilExpiry; }
        
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
    }
    
    // Inner class for alert summary
    public static class AlertSummaryDTO {
        private Integer totalAlerts;
        private Integer expiredCount;
        private Integer nearExpiryCount;
        private Integer outOfStockCount;
        private Integer lowStockCount;
        private Integer highPriorityCount;
        private Integer mediumPriorityCount;
        private Integer lowPriorityCount;
        
        public AlertSummaryDTO() {}
        
        public AlertSummaryDTO(Integer totalAlerts, Integer expiredCount, Integer nearExpiryCount,
                             Integer outOfStockCount, Integer lowStockCount, Integer highPriorityCount,
                             Integer mediumPriorityCount, Integer lowPriorityCount) {
            this.totalAlerts = totalAlerts;
            this.expiredCount = expiredCount;
            this.nearExpiryCount = nearExpiryCount;
            this.outOfStockCount = outOfStockCount;
            this.lowStockCount = lowStockCount;
            this.highPriorityCount = highPriorityCount;
            this.mediumPriorityCount = mediumPriorityCount;
            this.lowPriorityCount = lowPriorityCount;
        }
        
        // Getters and Setters
        public Integer getTotalAlerts() { return totalAlerts; }
        public void setTotalAlerts(Integer totalAlerts) { this.totalAlerts = totalAlerts; }
        
        public Integer getExpiredCount() { return expiredCount; }
        public void setExpiredCount(Integer expiredCount) { this.expiredCount = expiredCount; }
        
        public Integer getNearExpiryCount() { return nearExpiryCount; }
        public void setNearExpiryCount(Integer nearExpiryCount) { this.nearExpiryCount = nearExpiryCount; }
        
        public Integer getOutOfStockCount() { return outOfStockCount; }
        public void setOutOfStockCount(Integer outOfStockCount) { this.outOfStockCount = outOfStockCount; }
        
        public Integer getLowStockCount() { return lowStockCount; }
        public void setLowStockCount(Integer lowStockCount) { this.lowStockCount = lowStockCount; }
        
        public Integer getHighPriorityCount() { return highPriorityCount; }
        public void setHighPriorityCount(Integer highPriorityCount) { this.highPriorityCount = highPriorityCount; }
        
        public Integer getMediumPriorityCount() { return mediumPriorityCount; }
        public void setMediumPriorityCount(Integer mediumPriorityCount) { this.mediumPriorityCount = mediumPriorityCount; }
        
        public Integer getLowPriorityCount() { return lowPriorityCount; }
        public void setLowPriorityCount(Integer lowPriorityCount) { this.lowPriorityCount = lowPriorityCount; }
    }
}