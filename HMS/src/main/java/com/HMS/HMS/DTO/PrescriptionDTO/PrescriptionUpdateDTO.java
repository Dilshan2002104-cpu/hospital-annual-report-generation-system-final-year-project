package com.HMS.HMS.DTO.PrescriptionDTO;

import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import java.time.LocalDate;

public class PrescriptionUpdateDTO {

    private String drugName;
    private String dose;
    private String frequency;
    private Integer quantity;
    private String quantityUnit;
    private String instructions;
    private LocalDate startDate;
    private LocalDate endDate;
    private PrescriptionStatus status;

    private String route;
    private Boolean isUrgent;
    private String prescriptionNotes;

    // Default constructor
    public PrescriptionUpdateDTO() {}

    // Constructor
    public PrescriptionUpdateDTO(String drugName, String dose, String frequency, Integer quantity,
                               String instructions, LocalDate startDate, LocalDate endDate,
                               PrescriptionStatus status, String route, Boolean isUrgent) {
        this.drugName = drugName;
        this.dose = dose;
        this.frequency = frequency;
        this.quantity = quantity;
        this.instructions = instructions;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.route = route;
        this.isUrgent = isUrgent;
    }

    // Getters and Setters
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public PrescriptionStatus getStatus() {
        return status;
    }

    public void setStatus(PrescriptionStatus status) {
        this.status = status;
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

    public String getPrescriptionNotes() {
        return prescriptionNotes;
    }

    public void setPrescriptionNotes(String prescriptionNotes) {
        this.prescriptionNotes = prescriptionNotes;
    }

    @Override
    public String toString() {
        return "PrescriptionUpdateDTO{" +
                "drugName='" + drugName + '\'' +
                ", dose='" + dose + '\'' +
                ", frequency='" + frequency + '\'' +
                ", quantity=" + quantity +
                ", status=" + status +
                ", isUrgent=" + isUrgent +
                '}';
    }
}