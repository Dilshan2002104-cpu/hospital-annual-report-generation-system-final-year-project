package com.HMS.HMS.DTO.LabRequest;

import java.time.LocalDateTime;
import java.util.Map;

public class TestResultResponseDTO {
    private Long id;
    private String requestId;
    private String testName;
    private String patientNationalId;
    private String patientName;
    private String wardName;
    private String completedBy;
    private LocalDateTime completedAt;
    private String notes;
    private Map<String, Object> results; // Specific test results
    
    // Constructors
    public TestResultResponseDTO() {}
    
    public TestResultResponseDTO(Long id, String requestId, String testName, 
                               String patientNationalId, String patientName, 
                               String wardName, String completedBy, 
                               LocalDateTime completedAt, String notes, 
                               Map<String, Object> results) {
        this.id = id;
        this.requestId = requestId;
        this.testName = testName;
        this.patientNationalId = patientNationalId;
        this.patientName = patientName;
        this.wardName = wardName;
        this.completedBy = completedBy;
        this.completedAt = completedAt;
        this.notes = notes;
        this.results = results;
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
    
    public String getTestName() {
        return testName;
    }
    
    public void setTestName(String testName) {
        this.testName = testName;
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
    
    public String getCompletedBy() {
        return completedBy;
    }
    
    public void setCompletedBy(String completedBy) {
        this.completedBy = completedBy;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Map<String, Object> getResults() {
        return results;
    }
    
    public void setResults(Map<String, Object> results) {
        this.results = results;
    }
}