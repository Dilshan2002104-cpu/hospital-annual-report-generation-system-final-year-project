package com.HMS.HMS.DTO.PrescriptionDTO;

import com.HMS.HMS.model.Prescription.PrescriptionStatus;

public class PrescriptionItemDTO {

    private Long id;
    private Long medicationId;        // Medication ID to fetch Medication entity
    private String drugName;          // Will be fetched from Medication entity
    private String dose;
    private String frequency;
    private Integer quantity;
    private String quantityUnit;
    private String instructions;
    private String route;
    private Boolean isUrgent;
    private PrescriptionStatus itemStatus;
    private String dosageForm;        // Will be fetched from Medication entity
    private String genericName;       // Will be fetched from Medication entity
    private String manufacturer;      // Will be fetched from Medication entity
    private String notes;

    // Default constructor
    public PrescriptionItemDTO() {}

    // Constructor for creating new items
    public PrescriptionItemDTO(String drugName, String dose, String frequency, Integer quantity,
                              String quantityUnit, String instructions) {
        this.drugName = drugName;
        this.dose = dose;
        this.frequency = frequency;
        this.quantity = quantity;
        this.quantityUnit = quantityUnit;
        this.instructions = instructions;
        this.isUrgent = false;
        this.itemStatus = PrescriptionStatus.ACTIVE;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDrugName() {
        return drugName;
    }

    public void setDrugName(String drugName) {
        this.drugName = drugName;
    }

    public String getDose() {
        return dose;
    }

    public void setDose(String dose) {
        this.dose = dose;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getQuantityUnit() {
        return quantityUnit;
    }

    public void setQuantityUnit(String quantityUnit) {
        this.quantityUnit = quantityUnit;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public Boolean getIsUrgent() {
        return isUrgent;
    }

    public void setIsUrgent(Boolean isUrgent) {
        this.isUrgent = isUrgent;
    }

    public PrescriptionStatus getItemStatus() {
        return itemStatus;
    }

    public void setItemStatus(PrescriptionStatus itemStatus) {
        this.itemStatus = itemStatus;
    }

    public String getDosageForm() {
        return dosageForm;
    }

    public void setDosageForm(String dosageForm) {
        this.dosageForm = dosageForm;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getMedicationId() {
        return medicationId;
    }

    public void setMedicationId(Long medicationId) {
        this.medicationId = medicationId;
    }

    @Override
    public String toString() {
        return "PrescriptionItemDTO{" +
                "drugName='" + drugName + '\'' +
                ", dose='" + dose + '\'' +
                ", frequency='" + frequency + '\'' +
                ", quantity=" + quantity +
                ", isUrgent=" + isUrgent +
                ", itemStatus=" + itemStatus +
                '}';
    }
}