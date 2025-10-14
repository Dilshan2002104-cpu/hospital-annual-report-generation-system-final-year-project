package com.HMS.HMS.DTO.PrescriptionDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

public class ClinicPrescriptionRequestDTO {

    private String patientNationalId;
    private String patientName;           // Optional - will be fetched from Patient entity
    private LocalDate startDate;
    private LocalDate endDate;
    private String prescribedBy;          // Doctor name as string
    private String prescriptionNotes;
    private String consultationType;      // "outpatient" for clinic
    private Boolean isUrgent;            // Whether prescription is urgent
    private List<PrescriptionItemDTO> prescriptionItems;

    // Default constructor
    public ClinicPrescriptionRequestDTO() {
        this.prescriptionItems = new ArrayList<>();
        this.consultationType = "outpatient";
        this.isUrgent = false;
    }

    // Constructor
    public ClinicPrescriptionRequestDTO(String patientNationalId, String patientName,
                                       LocalDate startDate, String prescribedBy,
                                       List<PrescriptionItemDTO> prescriptionItems) {
        this.patientNationalId = patientNationalId;
        this.patientName = patientName;
        this.startDate = startDate;
        this.prescribedBy = prescribedBy;
        this.prescriptionItems = prescriptionItems != null ? prescriptionItems : new ArrayList<>();
        this.consultationType = "outpatient";
        this.isUrgent = false;
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

    public String getPrescriptionNotes() {
        return prescriptionNotes;
    }

    public void setPrescriptionNotes(String prescriptionNotes) {
        this.prescriptionNotes = prescriptionNotes;
    }

    public String getConsultationType() {
        return consultationType;
    }

    public void setConsultationType(String consultationType) {
        this.consultationType = consultationType;
    }

    public Boolean getIsUrgent() {
        return isUrgent;
    }

    public void setIsUrgent(Boolean isUrgent) {
        this.isUrgent = isUrgent;
    }

    public List<PrescriptionItemDTO> getPrescriptionItems() {
        return prescriptionItems;
    }

    public void setPrescriptionItems(List<PrescriptionItemDTO> prescriptionItems) {
        this.prescriptionItems = prescriptionItems != null ? prescriptionItems : new ArrayList<>();
    }

    // Validation methods
    public boolean isValid() {
        return patientNationalId != null && !patientNationalId.trim().isEmpty() &&
               prescribedBy != null && !prescribedBy.trim().isEmpty() &&
               prescriptionItems != null && !prescriptionItems.isEmpty();
    }

    public int getTotalMedications() {
        return prescriptionItems != null ? prescriptionItems.size() : 0;
    }

    @Override
    public String toString() {
        return "ClinicPrescriptionRequestDTO{" +
                "patientNationalId='" + patientNationalId + '\'' +
                ", patientName='" + patientName + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", prescribedBy='" + prescribedBy + '\'' +
                ", consultationType='" + consultationType + '\'' +
                ", isUrgent=" + isUrgent +
                ", totalMedications=" + getTotalMedications() +
                '}';
    }
}