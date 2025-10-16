package com.HMS.HMS.DTO.LabRequest;

import java.util.Map;
import java.util.List;

public class TestResultSubmissionDTO {
    private String requestId;
    private List<Object> tests; // List of test objects from frontend
    private Map<String, Map<String, Object>> results; // Test results organized by test name
    private String notes;
    private String completedAt;
    private String completedBy;
    
    // Constructors
    public TestResultSubmissionDTO() {}
    
    public TestResultSubmissionDTO(String requestId, List<Object> tests, 
                                 Map<String, Map<String, Object>> results, 
                                 String notes, String completedAt, String completedBy) {
        this.requestId = requestId;
        this.tests = tests;
        this.results = results;
        this.notes = notes;
        this.completedAt = completedAt;
        this.completedBy = completedBy;
    }
    
    // Getters and Setters
    public String getRequestId() {
        return requestId;
    }
    
    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }
    
    public List<Object> getTests() {
        return tests;
    }
    
    public void setTests(List<Object> tests) {
        this.tests = tests;
    }
    
    public Map<String, Map<String, Object>> getResults() {
        return results;
    }
    
    public void setResults(Map<String, Map<String, Object>> results) {
        this.results = results;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(String completedAt) {
        this.completedAt = completedAt;
    }
    
    public String getCompletedBy() {
        return completedBy;
    }
    
    public void setCompletedBy(String completedBy) {
        this.completedBy = completedBy;
    }
}