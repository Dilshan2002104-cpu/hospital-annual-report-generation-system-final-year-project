package com.HMS.HMS.DTO.PrescriptionDTO;

import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

public class PrescriptionResponseDTO {

    private Long id;
    private String prescriptionId;
    private String patientNationalId;
    private String patientName;
    private String patientId;
    private Long admissionId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String prescribedBy;
    private LocalDateTime prescribedDate;
    private LocalDateTime lastModified;
    private PrescriptionStatus status;
    private LocalDateTime createdAt;
    private String wardName;
    private String bedNumber;
    private Integer totalMedications;
    private String prescriptionNotes;
    private List<PrescriptionItemDTO> prescriptionItems;

    // Default constructor
    public PrescriptionResponseDTO() {
        this.prescriptionItems = new ArrayList<>();
    }

    // Full constructor
    public PrescriptionResponseDTO(Long id, String prescriptionId, String patientNationalId,
                                 String patientName, Long admissionId, LocalDate startDate,
                                 LocalDate endDate, String prescribedBy, LocalDateTime prescribedDate,
                                 LocalDateTime lastModified, PrescriptionStatus status,
                                 LocalDateTime createdAt, String wardName, String bedNumber,
                                 Integer totalMedications, String prescriptionNotes,
                                 List<PrescriptionItemDTO> prescriptionItems) {
        this.id = id;
        this.prescriptionId = prescriptionId;
        this.patientNationalId = patientNationalId;
        this.patientName = patientName;
        this.patientId = "P" + patientNationalId; // Generate patient ID format
        this.admissionId = admissionId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.prescribedBy = prescribedBy;
        this.prescribedDate = prescribedDate;
        this.lastModified = lastModified;
        this.status = status;
        this.createdAt = createdAt;
        this.wardName = wardName;
        this.bedNumber = bedNumber;
        this.totalMedications = totalMedications;
        this.prescriptionNotes = prescriptionNotes;
        this.prescriptionItems = prescriptionItems != null ? prescriptionItems : new ArrayList<>();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(String prescriptionId) {
        this.prescriptionId = prescriptionId;
    }

    public String getPatientNationalId() {
        return patientNationalId;
    }

    public void setPatientNationalId(String patientNationalId) {
        this.patientNationalId = patientNationalId;
        this.patientId = "P" + patientNationalId; // Update patient ID when national ID changes
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public Long getAdmissionId() {
        return admissionId;
    }

    public void setAdmissionId(Long admissionId) {
        this.admissionId = admissionId;
    }

    public Integer getTotalMedications() {
        return totalMedications;
    }

    public void setTotalMedications(Integer totalMedications) {
        this.totalMedications = totalMedications;
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
        this.totalMedications = this.prescriptionItems.size();
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

    public LocalDateTime getPrescribedDate() {
        return prescribedDate;
    }

    public void setPrescribedDate(LocalDateTime prescribedDate) {
        this.prescribedDate = prescribedDate;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }

    public PrescriptionStatus getStatus() {
        return status;
    }

    public void setStatus(PrescriptionStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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
        this.totalMedications = this.prescriptionItems.size();
    }

    public boolean hasUrgentMedications() {
        return prescriptionItems != null && prescriptionItems.stream()
                .anyMatch(item -> Boolean.TRUE.equals(item.getIsUrgent()));
    }

    @Override
    public String toString() {
        return "PrescriptionResponseDTO{" +
                "id=" + id +
                ", prescriptionId='" + prescriptionId + '\'' +
                ", patientName='" + patientName + '\'' +
                ", totalMedications=" + totalMedications +
                ", status=" + status +
                ", wardName='" + wardName + '\'' +
                ", bedNumber='" + bedNumber + '\'' +
                '}';
    }
}