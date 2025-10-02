package com.HMS.HMS.DTO.PrescriptionDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

public class PrescriptionRequestDTO {

    private String patientNationalId;
    private String patientName;           // Optional - will be fetched from Patient entity
    private Long admissionId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String prescribedBy;          // Doctor name as string
    private String wardName;              // Optional - will be fetched from Admission entity
    private String bedNumber;             // Optional - will be fetched from Admission entity
    private String prescriptionNotes;
    private List<PrescriptionItemDTO> prescriptionItems;

    // Default constructor
    public PrescriptionRequestDTO() {
        this.prescriptionItems = new ArrayList<>();
    }

    // Constructor
    public PrescriptionRequestDTO(String patientNationalId, String patientName, Long admissionId,
                                LocalDate startDate, String prescribedBy, String wardName,
                                String bedNumber, List<PrescriptionItemDTO> prescriptionItems) {
        this.patientNationalId = patientNationalId;
        this.patientName = patientName;
        this.admissionId = admissionId;
        this.startDate = startDate;
        this.prescribedBy = prescribedBy;
        this.wardName = wardName;
        this.bedNumber = bedNumber;
        this.prescriptionItems = prescriptionItems != null ? prescriptionItems : new ArrayList<>();
    }

    // Getters and Setters
    public String getPatientNationalId() {
        return patientNationalId;
    }

    public void setPatientNationalId(String patientNationalId) {
        this.patientNationalId = patientNationalId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Long getAdmissionId() {
        return admissionId;
    }

    public void setAdmissionId(Long admissionId) {
        this.admissionId = admissionId;
    }

    public String getPrescriptionNotes() {
        return prescriptionNotes;
    }

    public void setPrescriptionNotes(String prescriptionNotes) {
        this.prescriptionNotes = prescriptionNotes;
    }

    public List<PrescriptionItemDTO> getPrescriptionItems() {
        return prescriptionItems;
    }

    public void setPrescriptionItems(List<PrescriptionItemDTO> prescriptionItems) {
        this.prescriptionItems = prescriptionItems != null ? prescriptionItems : new ArrayList<>();
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

    public String getPrescribedBy() {
        return prescribedBy;
    }

    public void setPrescribedBy(String prescribedBy) {
        this.prescribedBy = prescribedBy;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public String getBedNumber() {
        return bedNumber;
    }

    public void setBedNumber(String bedNumber) {
        this.bedNumber = bedNumber;
    }

    // Helper methods
    public void addPrescriptionItem(PrescriptionItemDTO item) {
        if (this.prescriptionItems == null) {
            this.prescriptionItems = new ArrayList<>();
        }
        this.prescriptionItems.add(item);
    }

    public int getTotalMedications() {
        return prescriptionItems != null ? prescriptionItems.size() : 0;
    }

    public boolean hasUrgentMedications() {
        return prescriptionItems != null && prescriptionItems.stream()
                .anyMatch(item -> Boolean.TRUE.equals(item.getIsUrgent()));
    }

    @Override
    public String toString() {
        return "PrescriptionRequestDTO{" +
                "patientName='" + patientName + '\'' +
                ", admissionId=" + admissionId +
                ", totalMedications=" + getTotalMedications() +
                ", hasUrgentMedications=" + hasUrgentMedications() +
                ", wardName='" + wardName + '\'' +
                ", bedNumber='" + bedNumber + '\'' +
                '}';
    }
}