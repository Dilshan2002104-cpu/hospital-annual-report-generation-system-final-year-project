package com.HMS.HMS.model.Prescription;

import com.HMS.HMS.model.Patient.Patient;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clinic_prescriptions", indexes = {
    @Index(name = "idx_clinic_prescription_patient", columnList = "patient_national_id"),
    @Index(name = "idx_clinic_prescription_status", columnList = "status"),
    @Index(name = "idx_clinic_prescription_prescribed_date", columnList = "prescribed_date")
})
public class ClinicPrescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prescription_id", nullable = false, unique = true, length = 20)
    private String prescriptionId;

    // Relationship with Patient entity - no admission needed for clinic prescriptions
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_national_id", nullable = false)
    @JsonBackReference("patient-clinic-prescriptions")
    private Patient patient;

    // Doctor information for clinic prescriptions
    @Column(name = "prescribed_by", length = 100)
    private String prescribedBy;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

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

    // Clinic-specific fields
    @Column(name = "clinic_name", length = 100)
    private String clinicName = "Outpatient Clinic";

    @Column(name = "visit_type", length = 50)
    private String visitType; // e.g., "Consultation", "Follow-up", "Emergency"

    @Column(name = "total_medications", nullable = false)
    private Integer totalMedications = 0;

    @Column(name = "prescription_notes", columnDefinition = "TEXT")
    private String prescriptionNotes;

    // Clinic-specific prescription items
    @OneToMany(mappedBy = "clinicPrescription", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ClinicPrescriptionItem> prescriptionItems = new ArrayList<>();

    // Default constructor
    public ClinicPrescription() {}

    // Constructor with required fields
    public ClinicPrescription(String prescriptionId, Patient patient, String prescribedBy, 
                             LocalDate startDate, LocalDateTime prescribedDate) {
        this.prescriptionId = prescriptionId;
        this.patient = patient;
        this.prescribedBy = prescribedBy;
        this.startDate = startDate;
        this.prescribedDate = prescribedDate;
        this.status = PrescriptionStatus.ACTIVE;
        this.totalMedications = 0;
        this.prescriptionItems = new ArrayList<>();
        this.clinicName = "Outpatient Clinic";
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

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public String getPrescribedBy() {
        return prescribedBy;
    }

    public void setPrescribedBy(String prescribedBy) {
        this.prescribedBy = prescribedBy;
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

    public String getClinicName() {
        return clinicName;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
    }

    public String getVisitType() {
        return visitType;
    }

    public void setVisitType(String visitType) {
        this.visitType = visitType;
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

    public List<ClinicPrescriptionItem> getPrescriptionItems() {
        return prescriptionItems;
    }

    public void setPrescriptionItems(List<ClinicPrescriptionItem> prescriptionItems) {
        this.prescriptionItems = prescriptionItems;
    }

    // Helper methods
    public void addPrescriptionItem(ClinicPrescriptionItem item) {
        this.prescriptionItems.add(item);
        item.setClinicPrescription(this);
        this.totalMedications = this.prescriptionItems.size();
    }

    public void removePrescriptionItem(ClinicPrescriptionItem item) {
        this.prescriptionItems.remove(item);
        item.setClinicPrescription(null);
        this.totalMedications = this.prescriptionItems.size();
    }

    @Override
    public String toString() {
        return "ClinicPrescription{" +
                "id=" + id +
                ", prescriptionId='" + prescriptionId + '\'' +
                ", patient=" + (patient != null ? patient.getNationalId() : "null") +
                ", prescribedBy='" + prescribedBy + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", status=" + status +
                ", clinicName='" + clinicName + '\'' +
                ", visitType='" + visitType + '\'' +
                ", totalMedications=" + totalMedications +
                '}';
    }
}