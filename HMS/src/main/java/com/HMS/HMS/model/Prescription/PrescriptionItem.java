package com.HMS.HMS.model.Prescription;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescription_items", indexes = {
    @Index(name = "idx_prescription_item_prescription", columnList = "prescription_id"),
    @Index(name = "idx_prescription_item_drug", columnList = "drug_name")
})
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(name = "drug_name", nullable = false, length = 255)
    private String drugName;

    @Column(name = "dose", nullable = false, length = 50)
    private String dose;

    @Column(name = "frequency", nullable = false, length = 100)
    private String frequency;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "quantity_unit", length = 50)
    private String quantityUnit;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "route", length = 50)
    private String route;

    @Column(name = "is_urgent", nullable = false)
    private Boolean isUrgent = false;

    @Column(name = "item_status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private PrescriptionStatus itemStatus = PrescriptionStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    // Additional medication details
    @Column(name = "dosage_form", length = 50)
    private String dosageForm;

    @Column(name = "generic_name", length = 255)
    private String genericName;

    @Column(name = "manufacturer", length = 255)
    private String manufacturer;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Default constructor
    public PrescriptionItem() {}

    // Constructor with required fields
    public PrescriptionItem(Prescription prescription, String drugName, String dose,
                           String frequency, Integer quantity) {
        this.prescription = prescription;
        this.drugName = drugName;
        this.dose = dose;
        this.frequency = frequency;
        this.quantity = quantity;
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

    public Prescription getPrescription() {
        return prescription;
    }

    public void setPrescription(Prescription prescription) {
        this.prescription = prescription;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
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

    @Override
    public String toString() {
        return "PrescriptionItem{" +
                "id=" + id +
                ", drugName='" + drugName + '\'' +
                ", dose='" + dose + '\'' +
                ", frequency='" + frequency + '\'' +
                ", quantity=" + quantity +
                ", itemStatus=" + itemStatus +
                '}';
    }
}