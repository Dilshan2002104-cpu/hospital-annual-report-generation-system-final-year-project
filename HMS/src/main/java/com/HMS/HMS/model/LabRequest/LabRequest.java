package com.HMS.HMS.model.LabRequest;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "lab_requests")
public class LabRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "request_id", unique = true, nullable = false)
    private String requestId;
    
    @Column(name = "patient_national_id", nullable = false)
    private String patientNationalId;
    
    @Column(name = "patient_name", nullable = false)
    private String patientName;
    
    @Column(name = "ward_name", nullable = false)
    private String wardName;
    
    @Column(name = "bed_number")
    private String bedNumber;
    
    @Column(name = "priority")
    private String priority = "normal"; // Keep for database compatibility, always set to normal
    
    @Column(name = "requested_by", nullable = false)
    private String requestedBy;
    
    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LabRequestStatus status;
    
    @OneToMany(mappedBy = "labRequest", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<LabTest> tests;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public LabRequest() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.priority = "normal"; // Always set to normal
    }
    
    public LabRequest(String requestId, String patientNationalId, String patientName, 
                     String wardName, String bedNumber, 
                     String requestedBy, LocalDateTime requestDate, LabRequestStatus status) {
        this();
        this.requestId = requestId;
        this.patientNationalId = patientNationalId;
        this.patientName = patientName;
        this.wardName = wardName;
        this.bedNumber = bedNumber;
        this.priority = "normal"; // Always set to normal
        this.requestedBy = requestedBy;
        this.requestDate = requestDate;
        this.status = status;
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getRequestId() {
        return requestId;
    }
    
    public void setRequestId(String requestId) {
        this.requestId = requestId;
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
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority != null ? priority : "normal";
    }
    
    public String getRequestedBy() {
        return requestedBy;
    }
    
    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }
    
    public LocalDateTime getRequestDate() {
        return requestDate;
    }
    
    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }
    
    public LabRequestStatus getStatus() {
        return status;
    }
    
    public void setStatus(LabRequestStatus status) {
        this.status = status;
    }
    
    public List<LabTest> getTests() {
        return tests;
    }
    
    public void setTests(List<LabTest> tests) {
        this.tests = tests;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}