package com.HMS.HMS.model.Admission;

import com.HMS.HMS.model.Patient.Patient;
import com.HMS.HMS.model.ward.Ward;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long admissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_national_id",nullable = false)
    @JsonBackReference("patient-admissions")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id", nullable = false)
    @JsonBackReference("ward-admissions")
    private Ward ward;

    private String bedNumber;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime admissionDate;

    private LocalDateTime dischargeDate;

    @Enumerated(EnumType.STRING)
    private AdmissionStatus status = AdmissionStatus.ACTIVE;

    public Admission(){}

    public Admission(Patient patient, Ward ward) {
        this.patient = patient;
        this.ward = ward;
    }

    public Long getAdmissionId() {
        return admissionId;
    }

    public void setAdmissionId(Long admissionId) {
        this.admissionId = admissionId;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Ward getWard() {
        return ward;
    }

    public void setWard(Ward ward) {
        this.ward = ward;
    }

    public LocalDateTime getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDateTime admissionDate) {
        this.admissionDate = admissionDate;
    }

    public LocalDateTime getDischargeDate() {
        return dischargeDate;
    }

    public void setDischargeDate(LocalDateTime dischargeDate) {
        this.dischargeDate = dischargeDate;
    }

    public AdmissionStatus getStatus() {
        return status;
    }

    public void setStatus(AdmissionStatus status) {
        this.status = status;
    }

    public String getBedNumber() {
        return bedNumber;
    }

    public void setBedNumber(String bedNumber) {
        this.bedNumber = bedNumber;
    }
}
