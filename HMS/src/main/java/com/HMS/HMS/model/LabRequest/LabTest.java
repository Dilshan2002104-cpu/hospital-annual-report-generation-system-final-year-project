package com.HMS.HMS.model.LabRequest;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "lab_tests")
public class LabTest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "test_id", nullable = false)
    private String testId;
    
    @Column(name = "test_name", nullable = false)
    private String testName;
    
    @Column(name = "category", nullable = false)
    private String category;
    
    @Column(name = "urgent")
    private Boolean urgent;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_request_id")
    @JsonIgnore // Prevent circular reference in JSON serialization
    private LabRequest labRequest;
    
    // Constructors
    public LabTest() {}
    
    public LabTest(String testId, String testName, String category, Boolean urgent) {
        this.testId = testId;
        this.testName = testName;
        this.category = category;
        this.urgent = urgent;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTestId() {
        return testId;
    }
    
    public void setTestId(String testId) {
        this.testId = testId;
    }
    
    public String getTestName() {
        return testName;
    }
    
    public void setTestName(String testName) {
        this.testName = testName;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Boolean getUrgent() {
        return urgent;
    }
    
    public void setUrgent(Boolean urgent) {
        this.urgent = urgent;
    }
    
    public LabRequest getLabRequest() {
        return labRequest;
    }
    
    public void setLabRequest(LabRequest labRequest) {
        this.labRequest = labRequest;
    }
}