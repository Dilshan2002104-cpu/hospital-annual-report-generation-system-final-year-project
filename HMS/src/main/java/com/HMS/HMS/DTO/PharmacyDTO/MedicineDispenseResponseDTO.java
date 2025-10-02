package com.HMS.HMS.DTO.PharmacyDTO;

import com.HMS.HMS.model.Pharmacy.MedicineDispenseRequest;
import com.HMS.HMS.model.Pharmacy.MedicineDispenseItem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class MedicineDispenseResponseDTO {

    private Long id;
    private String requestId;
    private Long prescriptionId;
    private String prescriptionNumber;
    private String patientName;
    private String patientId;
    private String requestedBy;
    private String wardLocation;
    private String deliveryLocation;
    private MedicineDispenseRequest.UrgencyLevel urgencyLevel;
    private MedicineDispenseRequest.DispenseStatus status;
    private String requestNotes;
    private String pharmacyNotes;
    private String processedBy;
    private LocalDateTime processedAt;
    private LocalDateTime dispatchedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<DispenseItemResponseDTO> dispenseItems;
    private BigDecimal totalCost;

    // Constructors
    public MedicineDispenseResponseDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getPrescriptionNumber() { return prescriptionNumber; }
    public void setPrescriptionNumber(String prescriptionNumber) { this.prescriptionNumber = prescriptionNumber; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getRequestedBy() { return requestedBy; }
    public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }

    public String getWardLocation() { return wardLocation; }
    public void setWardLocation(String wardLocation) { this.wardLocation = wardLocation; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public MedicineDispenseRequest.UrgencyLevel getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(MedicineDispenseRequest.UrgencyLevel urgencyLevel) { this.urgencyLevel = urgencyLevel; }

    public MedicineDispenseRequest.DispenseStatus getStatus() { return status; }
    public void setStatus(MedicineDispenseRequest.DispenseStatus status) { this.status = status; }

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
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<DispenseItemResponseDTO> getDispenseItems() { return dispenseItems; }
    public void setDispenseItems(List<DispenseItemResponseDTO> dispenseItems) { this.dispenseItems = dispenseItems; }

    public BigDecimal getTotalCost() { return totalCost; }
    public void setTotalCost(BigDecimal totalCost) { this.totalCost = totalCost; }

    // Inner DTO class for dispense items
    public static class DispenseItemResponseDTO {
        private Long id;
        private Long medicationId;
        private String medicationName;
        private String genericName;
        private String strength;
        private String dosageForm;
        private Integer requestedQuantity;
        private Integer dispensedQuantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private MedicineDispenseItem.ItemStatus itemStatus;
        private String dosageInstructions;
        private String pharmacyNotes;
        private String substitutionReason;

        // Constructors
        public DispenseItemResponseDTO() {}

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getMedicationId() { return medicationId; }
        public void setMedicationId(Long medicationId) { this.medicationId = medicationId; }

        public String getMedicationName() { return medicationName; }
        public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

        public String getGenericName() { return genericName; }
        public void setGenericName(String genericName) { this.genericName = genericName; }

        public String getStrength() { return strength; }
        public void setStrength(String strength) { this.strength = strength; }

        public String getDosageForm() { return dosageForm; }
        public void setDosageForm(String dosageForm) { this.dosageForm = dosageForm; }

        public Integer getRequestedQuantity() { return requestedQuantity; }
        public void setRequestedQuantity(Integer requestedQuantity) { this.requestedQuantity = requestedQuantity; }

        public Integer getDispensedQuantity() { return dispensedQuantity; }
        public void setDispensedQuantity(Integer dispensedQuantity) { this.dispensedQuantity = dispensedQuantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

        public BigDecimal getTotalPrice() { return totalPrice; }
        public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

        public MedicineDispenseItem.ItemStatus getItemStatus() { return itemStatus; }
        public void setItemStatus(MedicineDispenseItem.ItemStatus itemStatus) { this.itemStatus = itemStatus; }

        public String getDosageInstructions() { return dosageInstructions; }
        public void setDosageInstructions(String dosageInstructions) { this.dosageInstructions = dosageInstructions; }

        public String getPharmacyNotes() { return pharmacyNotes; }
        public void setPharmacyNotes(String pharmacyNotes) { this.pharmacyNotes = pharmacyNotes; }

        public String getSubstitutionReason() { return substitutionReason; }
        public void setSubstitutionReason(String substitutionReason) { this.substitutionReason = substitutionReason; }
    }
}