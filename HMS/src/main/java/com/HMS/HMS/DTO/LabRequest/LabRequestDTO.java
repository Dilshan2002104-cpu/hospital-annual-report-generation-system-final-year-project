package com.HMS.HMS.DTO.LabRequest;

import java.time.LocalDateTime;
import java.util.List;

public class LabRequestDTO {
    private String requestId;
    private String patientNationalId;
    private String patientName;
    private String wardName;
    private String bedNumber;
    private List<LabTestDTO> tests;
    private String requestedBy;
    private LocalDateTime requestDate;
    private String status;
    
    // Constructors
    public LabRequestDTO() {}
    
    public LabRequestDTO(String requestId, String patientNationalId, String patientName,
                        String wardName, String bedNumber, List<LabTestDTO> tests,
                        String requestedBy, LocalDateTime requestDate, String status) {
        this.requestId = requestId;
        this.patientNationalId = patientNationalId;
        this.patientName = patientName;
        this.wardName = wardName;
        this.bedNumber = bedNumber;
        this.tests = tests;
        this.requestedBy = requestedBy;
        this.requestDate = requestDate;
        this.status = status;
    }
    
    // Getters and Setters
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
    
    public List<LabTestDTO> getTests() {
        return tests;
    }
    
    public void setTests(List<LabTestDTO> tests) {
        this.tests = tests;
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}