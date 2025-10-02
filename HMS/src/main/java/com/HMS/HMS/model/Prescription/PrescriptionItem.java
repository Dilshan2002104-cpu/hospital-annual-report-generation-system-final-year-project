package com.HMS.HMS.model.Prescription;

import com.HMS.HMS.model.Medication.Medication;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescription_items", indexes = {
    @Index(name = "idx_prescription_item_prescription", columnList = "prescription_id"),
    @Index(name = "idx_prescription_item_medication", columnList = "medication_id")
})
public class PrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    // Proper relationship with Medication entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medication_id", nullable = true)  // Nullable to support existing data migration
    @JsonBackReference("medication-prescription-items")
    private Medication medication;

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

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Default constructor
    public PrescriptionItem() {}

    // Constructor with required fields
    public PrescriptionItem(Prescription prescription, Medication medication, String dose,
                           String frequency, Integer quantity, String route) {
        this.prescription = prescription;
        this.medication = medication;
        this.dose = dose;
        this.frequency = frequency;
        this.quantity = quantity;
        this.route = route;
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

    public Medication getMedication() {
        return medication;
    }

    public void setMedication(Medication medication) {
        this.medication = medication;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // Helper methods to get medication details
    public String getDrugName() {
        return medication != null ? medication.getDrugName() : null;
    }

    public String getGenericName() {
        return medication != null ? medication.getGenericName() : null;
    }

    public String getDosageForm() {
        return medication != null ? medication.getDosageForm() : null;
    }

    public String getManufacturer() {
        return medication != null ? medication.getManufacturer() : null;
    }

    @Override
    public String toString() {
        return "PrescriptionItem{" +
                "id=" + id +
                ", drugName='" + getDrugName() + '\'' +
                ", dose='" + dose + '\'' +
                ", frequency='" + frequency + '\'' +
                ", quantity=" + quantity +
                ", itemStatus=" + itemStatus +
                '}';
    }
}