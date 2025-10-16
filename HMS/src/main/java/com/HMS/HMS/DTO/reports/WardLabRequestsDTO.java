package com.HMS.HMS.DTO.reports;

/**
 * DTO for Ward Laboratory Requests
 */
public class WardLabRequestsDTO {
    private String wardName;
    private String wardType;
    private Long totalRequests;
    private Long urgentRequests;
    private Long normalRequests;
    private Double percentage;
    private Double avgRequestsPerDay;
    private String mostCommonTest;
    
    // Constructor
    public WardLabRequestsDTO() {}
    
    public WardLabRequestsDTO(String wardName, String wardType, Long totalRequests, Double percentage) {
        this.wardName = wardName;
        this.wardType = wardType;
        this.totalRequests = totalRequests;
        this.percentage = percentage;
    }
    
    // Getters and Setters
    public String getWardName() {
        return wardName;
    }
    
    public void setWardName(String wardName) {
        this.wardName = wardName;
    }
    
    public String getWardType() {
        return wardType;
    }
    
    public void setWardType(String wardType) {
        this.wardType = wardType;
    }
    
    public Long getTotalRequests() {
        return totalRequests;
    }
    
    public void setTotalRequests(Long totalRequests) {
        this.totalRequests = totalRequests;
    }
    
    public Long getUrgentRequests() {
        return urgentRequests;
    }
    
    public void setUrgentRequests(Long urgentRequests) {
        this.urgentRequests = urgentRequests;
    }
    
    public Long getNormalRequests() {
        return normalRequests;
    }
    
    public void setNormalRequests(Long normalRequests) {
        this.normalRequests = normalRequests;
    }
    
    public Double getPercentage() {
        return percentage;
    }
    
    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
    
    public Double getAvgRequestsPerDay() {
        return avgRequestsPerDay;
    }
    
    public void setAvgRequestsPerDay(Double avgRequestsPerDay) {
        this.avgRequestsPerDay = avgRequestsPerDay;
    }
    
    public String getMostCommonTest() {
        return mostCommonTest;
    }
    
    public void setMostCommonTest(String mostCommonTest) {
        this.mostCommonTest = mostCommonTest;
    }
}