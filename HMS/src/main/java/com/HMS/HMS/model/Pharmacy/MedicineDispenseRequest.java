package com.HMS.HMS.model.Pharmacy;

import com.HMS.HMS.model.Prescription.Prescription;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medicine_dispense_requests", indexes = {
    @Index(name = "idx_dispense_request_id", columnList = "request_id"),
    @Index(name = "idx_dispense_prescription", columnList = "prescription_id"),
    @Index(name = "idx_dispense_status", columnList = "status"),
    @Index(name = "idx_dispense_urgency", columnList = "urgency_level"),
    @Index(name = "idx_dispense_created", columnList = "created_at")
})
public class MedicineDispenseRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id", nullable = false, unique = true, length = 20)
    private String requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    @JsonBackReference("prescription-dispense-requests")
    private Prescription prescription;

    @Column(name = "requested_by", nullable = false, length = 100)
    private String requestedBy;

    @Column(name = "ward_location", length = 100)
    private String wardLocation;

    @Column(name = "delivery_location", nullable = false, length = 100)
    private String deliveryLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level", nullable = false)
    private UrgencyLevel urgencyLevel = UrgencyLevel.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DispenseStatus status = DispenseStatus.PENDING;

    @Column(name = "request_notes", length = 500)
    private String requestNotes;

    @Column(name = "pharmacy_notes", length = 500)
    private String pharmacyNotes;

    @Column(name = "processed_by", length = 100)
    private String processedBy;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "dispatched_at")
    private LocalDateTime dispatchedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "dispenseRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MedicineDispenseItem> dispenseItems = new ArrayList<>();

    // Enums
    public enum UrgencyLevel {
        NORMAL, URGENT, EMERGENCY
    }

    public enum DispenseStatus {
        PENDING,
        PROCESSING,
        PREPARED,
        DISPATCHED,
        DELIVERED,
        CANCELLED,
        PARTIALLY_DISPENSED
    }

    // Constructors
    public MedicineDispenseRequest() {}

    public MedicineDispenseRequest(String requestId, Prescription prescription, String requestedBy, 
                                 String wardLocation, String deliveryLocation, UrgencyLevel urgencyLevel, 
                                 String requestNotes) {
        this.requestId = requestId;
        this.prescription = prescription;
        this.requestedBy = requestedBy;
        this.wardLocation = wardLocation;
        this.deliveryLocation = deliveryLocation;
        this.urgencyLevel = urgencyLevel;
        this.requestNotes = requestNotes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public Prescription getPrescription() { return prescription; }
    public void setPrescription(Prescription prescription) { this.prescription = prescription; }

    public String getRequestedBy() { return requestedBy; }
    public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }

    public String getWardLocation() { return wardLocation; }
    public void setWardLocation(String wardLocation) { this.wardLocation = wardLocation; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public UrgencyLevel getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(UrgencyLevel urgencyLevel) { this.urgencyLevel = urgencyLevel; }

    public DispenseStatus getStatus() { return status; }
    public void setStatus(DispenseStatus status) { this.status = status; }

    public String getRequestNotes() { return requestNotes; }
    public void setRequestNotes(String requestNotes) { this.requestNotes = requestNotes; }

    public String getPharmacyNotes() { return pharmacyNotes; }
    public void setPharmacyNotes(String pharmacyNotes) { this.pharmacyNotes = pharmacyNotes; }

    public String getProcessedBy() { return processedBy; }
    public void setProcessedBy(String processedBy) { this.processedBy = processedBy; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }

    public LocalDateTime getDispatchedAt() { return dispatchedAt; }
    public void setDispatchedAt(LocalDateTime dispatchedAt) { this.dispatchedAt = dispatchedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public List<MedicineDispenseItem> getDispenseItems() { return dispenseItems; }
    public void setDispenseItems(List<MedicineDispenseItem> dispenseItems) { this.dispenseItems = dispenseItems; }

    // Helper methods
    public void addDispenseItem(MedicineDispenseItem item) {
        dispenseItems.add(item);
        item.setDispenseRequest(this);
    }

    public void removeDispenseItem(MedicineDispenseItem item) {
        dispenseItems.remove(item);
        item.setDispenseRequest(null);
    }

    public boolean isUrgent() {
        return urgencyLevel == UrgencyLevel.URGENT || urgencyLevel == UrgencyLevel.EMERGENCY;
    }

    public boolean isCompleted() {
        return status == DispenseStatus.DELIVERED || status == DispenseStatus.PARTIALLY_DISPENSED;
    }

    public boolean canBeCancelled() {
        return status == DispenseStatus.PENDING || status == DispenseStatus.PROCESSING;
    }
}