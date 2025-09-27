package com.HMS.HMS.model.Prescription;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions", indexes = {
    @Index(name = "idx_prescription_patient", columnList = "patient_national_id"),
    @Index(name = "idx_prescription_admission", columnList = "admission_id"),
    @Index(name = "idx_prescription_status", columnList = "status"),
    @Index(name = "idx_prescription_prescribed_date", columnList = "prescribed_date")
})
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prescription_id", nullable = false, unique = true, length = 20)
    private String prescriptionId;

    @Column(name = "patient_national_id", nullable = false, length = 20)
    private String patientNationalId;

    @Column(name = "patient_name", nullable = false, length = 255)
    private String patientName;

    @Column(name = "admission_id", nullable = false)
    private Long admissionId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "prescribed_by", nullable = false, length = 255)
    private String prescribedBy;

    @Column(name = "prescribed_date", nullable = false)
    private LocalDateTime prescribedDate;

    @UpdateTimestamp
    @Column(name = "last_modified")
    private LocalDateTime lastModified;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PrescriptionStatus status = PrescriptionStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "ward_name", length = 100)
    private String wardName;

    @Column(name = "bed_number", length = 10)
    private String bedNumber;

    @Column(name = "total_medications", nullable = false)
    private Integer totalMedications = 0;

    @Column(name = "prescription_notes", columnDefinition = "TEXT")
    private String prescriptionNotes;

    // Relationship to prescription items
    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<PrescriptionItem> prescriptionItems = new ArrayList<>();

    // Default constructor
    public Prescription() {}

    // Constructor with required fields
    public Prescription(String prescriptionId, String patientNationalId, String patientName,
                       Long admissionId, LocalDate startDate, String prescribedBy,
                       LocalDateTime prescribedDate) {
        this.prescriptionId = prescriptionId;
        this.patientNationalId = patientNationalId;
        this.patientName = patientName;
        this.admissionId = admissionId;
        this.startDate = startDate;
        this.prescribedBy = prescribedBy;
        this.prescribedDate = prescribedDate;
        this.status = PrescriptionStatus.ACTIVE;
        this.totalMedications = 0;
        this.prescriptionItems = new ArrayList<>();
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

    public List<PrescriptionItem> getPrescriptionItems() {
        return prescriptionItems;
    }

    public void setPrescriptionItems(List<PrescriptionItem> prescriptionItems) {
        this.prescriptionItems = prescriptionItems;
        this.totalMedications = prescriptionItems != null ? prescriptionItems.size() : 0;
    }

    // Helper methods for prescription items
    public void addPrescriptionItem(PrescriptionItem item) {
        if (this.prescriptionItems == null) {
            this.prescriptionItems = new ArrayList<>();
        }
        this.prescriptionItems.add(item);
        item.setPrescription(this);
        this.totalMedications = this.prescriptionItems.size();
    }

    public void removePrescriptionItem(PrescriptionItem item) {
        if (this.prescriptionItems != null) {
            this.prescriptionItems.remove(item);
            item.setPrescription(null);
            this.totalMedications = this.prescriptionItems.size();
        }
    }

    public boolean hasUrgentMedications() {
        return prescriptionItems != null && prescriptionItems.stream()
                .anyMatch(item -> Boolean.TRUE.equals(item.getIsUrgent()));
    }

    @Override
    public String toString() {
        return "Prescription{" +
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