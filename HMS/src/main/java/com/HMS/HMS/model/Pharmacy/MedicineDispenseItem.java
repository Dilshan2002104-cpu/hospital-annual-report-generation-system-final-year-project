package com.HMS.HMS.model.Pharmacy;

import com.HMS.HMS.model.Medication.Medication;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicine_dispense_items", indexes = {
    @Index(name = "idx_dispense_item_request", columnList = "dispense_request_id"),
    @Index(name = "idx_dispense_item_medication", columnList = "medication_id"),
    @Index(name = "idx_dispense_item_status", columnList = "item_status")
})
public class MedicineDispenseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dispense_request_id", nullable = false)
    @JsonBackReference("dispense-request-items")
    private MedicineDispenseRequest dispenseRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    @Column(name = "requested_quantity", nullable = false)
    private Integer requestedQuantity;

    @Column(name = "dispensed_quantity", nullable = false)
    private Integer dispensedQuantity = 0;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_status", nullable = false)
    private ItemStatus itemStatus = ItemStatus.PENDING;

    @Column(name = "dosage_instructions", length = 500)
    private String dosageInstructions;

    @Column(name = "pharmacy_notes", length = 500)
    private String pharmacyNotes;

    @Column(name = "substitution_reason", length = 300)
    private String substitutionReason;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enum for item status
    public enum ItemStatus {
        PENDING,
        AVAILABLE,
        OUT_OF_STOCK,
        PARTIALLY_AVAILABLE,
        DISPENSED,
        SUBSTITUTED,
        CANCELLED
    }

    // Constructors
    public MedicineDispenseItem() {}

    public MedicineDispenseItem(MedicineDispenseRequest dispenseRequest, Medication medication, 
                              Integer requestedQuantity, String dosageInstructions) {
        this.dispenseRequest = dispenseRequest;
        this.medication = medication;
        this.requestedQuantity = requestedQuantity;
        this.dosageInstructions = dosageInstructions;
        this.unitPrice = medication.getUnitCost();
        this.totalPrice = medication.getUnitCost().multiply(BigDecimal.valueOf(requestedQuantity));
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MedicineDispenseRequest getDispenseRequest() { return dispenseRequest; }
    public void setDispenseRequest(MedicineDispenseRequest dispenseRequest) { this.dispenseRequest = dispenseRequest; }

    public Medication getMedication() { return medication; }
    public void setMedication(Medication medication) { this.medication = medication; }

    public Integer getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(Integer requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public Integer getDispensedQuantity() { return dispensedQuantity; }
    public void setDispensedQuantity(Integer dispensedQuantity) { this.dispensedQuantity = dispensedQuantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public ItemStatus getItemStatus() { return itemStatus; }
    public void setItemStatus(ItemStatus itemStatus) { this.itemStatus = itemStatus; }

    public String getDosageInstructions() { return dosageInstructions; }
    public void setDosageInstructions(String dosageInstructions) { this.dosageInstructions = dosageInstructions; }

    public String getPharmacyNotes() { return pharmacyNotes; }
    public void setPharmacyNotes(String pharmacyNotes) { this.pharmacyNotes = pharmacyNotes; }

    public String getSubstitutionReason() { return substitutionReason; }
    public void setSubstitutionReason(String substitutionReason) { this.substitutionReason = substitutionReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Helper methods
    public boolean isFullyDispensed() {
        return dispensedQuantity >= requestedQuantity;
    }

    public boolean isPartiallyDispensed() {
        return dispensedQuantity > 0 && dispensedQuantity < requestedQuantity;
    }

    public Integer getRemainingQuantity() {
        return requestedQuantity - dispensedQuantity;
    }

    public void updateTotalPrice() {
        if (unitPrice != null && dispensedQuantity != null) {
            this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(dispensedQuantity));
        }
    }

    public boolean isAvailable() {
        return itemStatus == ItemStatus.AVAILABLE || itemStatus == ItemStatus.PARTIALLY_AVAILABLE;
    }

    public void dispense(Integer quantity) {
        if (quantity > getRemainingQuantity()) {
            throw new IllegalArgumentException("Cannot dispense more than remaining quantity");
        }
        this.dispensedQuantity += quantity;
        updateTotalPrice();
        
        if (isFullyDispensed()) {
            this.itemStatus = ItemStatus.DISPENSED;
        } else if (isPartiallyDispensed()) {
            this.itemStatus = ItemStatus.PARTIALLY_AVAILABLE;
        }
    }
}