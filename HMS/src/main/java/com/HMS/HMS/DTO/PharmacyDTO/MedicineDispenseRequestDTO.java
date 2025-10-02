package com.HMS.HMS.DTO.PharmacyDTO;

import com.HMS.HMS.model.Pharmacy.MedicineDispenseRequest;

import java.util.List;

public class MedicineDispenseRequestDTO {

    private Long prescriptionId;
    private String requestedBy;
    private String wardLocation;
    private String deliveryLocation;
    private MedicineDispenseRequest.UrgencyLevel urgencyLevel;
    private String requestNotes;
    private List<DispenseItemRequestDTO> medications;

    // Constructors
    public MedicineDispenseRequestDTO() {}

    public MedicineDispenseRequestDTO(Long prescriptionId, String requestedBy, String wardLocation, 
                                    String deliveryLocation, MedicineDispenseRequest.UrgencyLevel urgencyLevel, 
                                    String requestNotes, List<DispenseItemRequestDTO> medications) {
        this.prescriptionId = prescriptionId;
        this.requestedBy = requestedBy;
        this.wardLocation = wardLocation;
        this.deliveryLocation = deliveryLocation;
        this.urgencyLevel = urgencyLevel;
        this.requestNotes = requestNotes;
        this.medications = medications;
    }

    // Getters and Setters
    public Long getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Long prescriptionId) { this.prescriptionId = prescriptionId; }

    public String getRequestedBy() { return requestedBy; }
    public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }

    public String getWardLocation() { return wardLocation; }
    public void setWardLocation(String wardLocation) { this.wardLocation = wardLocation; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public MedicineDispenseRequest.UrgencyLevel getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(MedicineDispenseRequest.UrgencyLevel urgencyLevel) { this.urgencyLevel = urgencyLevel; }

    public String getRequestNotes() { return requestNotes; }
    public void setRequestNotes(String requestNotes) { this.requestNotes = requestNotes; }

    public List<DispenseItemRequestDTO> getMedications() { return medications; }
    public void setMedications(List<DispenseItemRequestDTO> medications) { this.medications = medications; }

    // Inner DTO class for dispense items
    public static class DispenseItemRequestDTO {
        private Long medicationId;
        private Integer quantity;
        private String dosageInstructions;

        // Constructors
        public DispenseItemRequestDTO() {}

        public DispenseItemRequestDTO(Long medicationId, Integer quantity, String dosageInstructions) {
            this.medicationId = medicationId;
            this.quantity = quantity;
            this.dosageInstructions = dosageInstructions;
        }

        // Getters and Setters
        public Long getMedicationId() { return medicationId; }
        public void setMedicationId(Long medicationId) { this.medicationId = medicationId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getDosageInstructions() { return dosageInstructions; }
        public void setDosageInstructions(String dosageInstructions) { this.dosageInstructions = dosageInstructions; }
    }
}