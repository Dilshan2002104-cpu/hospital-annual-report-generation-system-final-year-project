package com.HMS.HMS.DTO.MedicationDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MedicationCompleteResponseDTO {
    private Long id;
    private String drugName;
    private String genericName;
    private String category;
    private String strength;
    private String dosageForm;
    private String manufacturer;
    private String batchNumber;
    private Integer currentStock;
    private Integer minimumStock;
    private Integer maximumStock;
    private BigDecimal unitCost;
    private LocalDate expiryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;

    public MedicationCompleteResponseDTO() {}

    public MedicationCompleteResponseDTO(Long id, String drugName, String genericName, String category,
                                       String strength, String dosageForm, String manufacturer, String batchNumber,
                                       Integer currentStock, Integer minimumStock, Integer maximumStock,
                                       BigDecimal unitCost, LocalDate expiryDate, LocalDateTime createdAt,
                                       LocalDateTime updatedAt, Boolean isActive) {
        this.id = id;
        this.drugName = drugName;
        this.genericName = genericName;
        this.category = category;
        this.strength = strength;
        this.dosageForm = dosageForm;
        this.manufacturer = manufacturer;
        this.batchNumber = batchNumber;
        this.currentStock = currentStock;
        this.minimumStock = minimumStock;
        this.maximumStock = maximumStock;
        this.unitCost = unitCost;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isActive = isActive;
    }

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

    public String getDosageForm() { return dosageForm; }
    public void setDosageForm(String dosageForm) { this.dosageForm = dosageForm; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public Integer getCurrentStock() { return currentStock; }
    public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }

    public Integer getMinimumStock() { return minimumStock; }
    public void setMinimumStock(Integer minimumStock) { this.minimumStock = minimumStock; }

    public Integer getMaximumStock() { return maximumStock; }
    public void setMaximumStock(Integer maximumStock) { this.maximumStock = maximumStock; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}