package com.HMS.HMS.DTO.LabRequest;

public class LabTestDTO {
    private String id;
    private String name;
    private String category;
    private Boolean urgent;
    
    // Constructors
    public LabTestDTO() {}
    
    public LabTestDTO(String id, String name, String category, Boolean urgent) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.urgent = urgent;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
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
}