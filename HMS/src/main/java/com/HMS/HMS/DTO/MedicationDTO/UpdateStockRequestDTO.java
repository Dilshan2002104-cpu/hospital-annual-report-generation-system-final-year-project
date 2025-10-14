package com.HMS.HMS.DTO.MedicationDTO;

public class UpdateStockRequestDTO {
    
    private Integer newStock;
    private String batchNumber;
    
    // Constructors
    public UpdateStockRequestDTO() {}
    
    public UpdateStockRequestDTO(Integer newStock, String batchNumber) {
        this.newStock = newStock;
        this.batchNumber = batchNumber;
    }
    
    // Getters and Setters
    public Integer getNewStock() {
        return newStock;
    }
    
    public void setNewStock(Integer newStock) {
        this.newStock = newStock;
    }
    
    public String getBatchNumber() {
        return batchNumber;
    }
    
    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }
    
    @Override
    public String toString() {
        return "UpdateStockRequestDTO{" +
               "newStock=" + newStock +
               ", batchNumber='" + batchNumber + '\'' +
               '}';
    }
}