package com.HMS.HMS.DTO.MedicationDTO;

import java.time.LocalDateTime;

public class StockUpdateResponseDTO {
    private Long id;
    private String drugName;
    private String batchNumber;
    private Integer currentStock;
    private Integer previousStock;
    private Integer stockChange;
    private Boolean isLowStock;
    private LocalDateTime lastUpdated;

    public StockUpdateResponseDTO() {}

    public StockUpdateResponseDTO(Long id, String drugName, String batchNumber, 
                                 Integer currentStock, Integer previousStock, 
                                 Boolean isLowStock, LocalDateTime lastUpdated) {
        this.id = id;
        this.drugName = drugName;
        this.batchNumber = batchNumber;
        this.currentStock = currentStock;
        this.previousStock = previousStock;
        this.stockChange = currentStock - previousStock;
        this.isLowStock = isLowStock;
        this.lastUpdated = lastUpdated;
    }

    // Getters
    public Long getId() { return id; }
    public String getDrugName() { return drugName; }
    public String getBatchNumber() { return batchNumber; }
    public Integer getCurrentStock() { return currentStock; }
    public Integer getPreviousStock() { return previousStock; }
    public Integer getStockChange() { return stockChange; }
    public Boolean getIsLowStock() { return isLowStock; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setDrugName(String drugName) { this.drugName = drugName; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    public void setCurrentStock(Integer currentStock) { 
        this.currentStock = currentStock;
        if (this.previousStock != null) {
            this.stockChange = currentStock - this.previousStock;
        }
    }
    public void setPreviousStock(Integer previousStock) { 
        this.previousStock = previousStock;
        if (this.currentStock != null) {
            this.stockChange = this.currentStock - previousStock;
        }
    }
    public void setStockChange(Integer stockChange) { this.stockChange = stockChange; }
    public void setIsLowStock(Boolean isLowStock) { this.isLowStock = isLowStock; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}