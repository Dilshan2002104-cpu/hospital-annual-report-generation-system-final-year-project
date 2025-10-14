package com.HMS.HMS.model.Prescription;

import com.HMS.HMS.model.Medication.Medication;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "clinic_prescription_items", indexes = {
    @Index(name = "idx_clinic_prescription_item_prescription", columnList = "clinic_prescription_id"),
    @Index(name = "idx_clinic_prescription_item_medication", columnList = "medication_id"),
    @Index(name = "idx_clinic_prescription_item_status", columnList = "item_status")
})
public class ClinicPrescriptionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Reference to clinic prescription
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinic_prescription_id", nullable = false)
    @JsonBackReference("clinic-prescription-items")
    private ClinicPrescription clinicPrescription;

    // Reference to medication
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medication_id", nullable = false)
    @JsonIgnoreProperties({"prescriptionItems", "hibernateLazyInitializer", "handler"})
    private Medication medication;

    @Column(name = "dose", nullable = false, length = 50)
    private String dose;

    @Column(name = "frequency", nullable = false, length = 100)
    private String frequency;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "quantity_unit", length = 20)
    private String quantityUnit = "tablets";

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "route", length = 50)
    private String route = "Oral";

    @Column(name = "is_urgent", nullable = false)
    private Boolean isUrgent = false;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_status", nullable = false, length = 20)
    private PrescriptionStatus itemStatus = PrescriptionStatus.PENDING;

    @Column(name = "dispensed_quantity")
    private Integer dispensedQuantity = 0;

    @Column(name = "remaining_quantity")
    private Integer remainingQuantity;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "dispensed_by", length = 100)
    private String dispensedBy;

    @Column(name = "dispensed_date")
    private LocalDateTime dispensedDate;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    // Default constructor
    public ClinicPrescriptionItem() {
        this.remainingQuantity = this.quantity;
    }

    // Constructor with required fields
    public ClinicPrescriptionItem(ClinicPrescription clinicPrescription, Medication medication,
                                 String dose, String frequency, Integer quantity) {
        this.clinicPrescription = clinicPrescription;
        this.medication = medication;
        this.dose = dose;
        this.frequency = frequency;
        this.quantity = quantity;
        this.remainingQuantity = quantity;
        this.dispensedQuantity = 0;
        this.itemStatus = PrescriptionStatus.PENDING;
        this.isUrgent = false;
        this.quantityUnit = "tablets";
        this.route = "Oral";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ClinicPrescription getClinicPrescription() {
        return clinicPrescription;
    }

    public void setClinicPrescription(ClinicPrescription clinicPrescription) {
        this.clinicPrescription = clinicPrescription;
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
        // Update remaining quantity when quantity changes
        if (this.dispensedQuantity != null) {
            this.remainingQuantity = quantity - this.dispensedQuantity;
        } else {
            this.remainingQuantity = quantity;
        }
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public PrescriptionStatus getItemStatus() {
        return itemStatus;
    }

    public void setItemStatus(PrescriptionStatus itemStatus) {
        this.itemStatus = itemStatus;
    }

    public Integer getDispensedQuantity() {
        return dispensedQuantity;
    }

    public void setDispensedQuantity(Integer dispensedQuantity) {
        this.dispensedQuantity = dispensedQuantity;
        // Update remaining quantity when dispensed quantity changes
        if (this.quantity != null) {
            this.remainingQuantity = this.quantity - dispensedQuantity;
        }
    }

    public Integer getRemainingQuantity() {
        return remainingQuantity;
    }

    public void setRemainingQuantity(Integer remainingQuantity) {
        this.remainingQuantity = remainingQuantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
        // Calculate total price when unit price changes
        if (this.quantity != null && unitPrice != null) {
            this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(this.quantity));
        }
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getDispensedBy() {
        return dispensedBy;
    }

    public void setDispensedBy(String dispensedBy) {
        this.dispensedBy = dispensedBy;
    }

    public LocalDateTime getDispensedDate() {
        return dispensedDate;
    }

    public void setDispensedDate(LocalDateTime dispensedDate) {
        this.dispensedDate = dispensedDate;
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

    // Helper methods
    public boolean isFullyDispensed() {
        return this.dispensedQuantity != null && 
               this.quantity != null && 
               this.dispensedQuantity.equals(this.quantity);
    }

    public boolean isPartiallyDispensed() {
        return this.dispensedQuantity != null && 
               this.dispensedQuantity > 0 && 
               !isFullyDispensed();
    }

    @Override
    public String toString() {
        return "ClinicPrescriptionItem{" +
                "id=" + id +
                ", medication=" + (medication != null ? medication.getDrugName() : "null") +
                ", dose='" + dose + '\'' +
                ", frequency='" + frequency + '\'' +
                ", quantity=" + quantity +
                ", quantityUnit='" + quantityUnit + '\'' +
                ", itemStatus=" + itemStatus +
                ", dispensedQuantity=" + dispensedQuantity +
                ", remainingQuantity=" + remainingQuantity +
                '}';
    }
}