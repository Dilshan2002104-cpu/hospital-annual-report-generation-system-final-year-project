package com.HMS.HMS.DTO.reports;

/**
 * DTO for Test Type Statistics
 */
public class TestTypeStatisticsDTO {
    private String testType;
    private String testCategory;
    private Long totalTests;
    private Double percentage;
    private Long avgProcessingTime; // in minutes
    private Double successRate;
    private Long testsPerDay;
    private String mostCommonWard;
    
    // Constructor
    public TestTypeStatisticsDTO() {}
    
    public TestTypeStatisticsDTO(String testType, String testCategory, Long totalTests, Double percentage) {
        this.testType = testType;
        this.testCategory = testCategory;
        this.totalTests = totalTests;
        this.percentage = percentage;
    }
    
    // Getters and Setters
    public String getTestType() {
        return testType;
    }
    
    public void setTestType(String testType) {
        this.testType = testType;
    }
    
    public String getTestCategory() {
        return testCategory;
    }
    
    public void setTestCategory(String testCategory) {
        this.testCategory = testCategory;
    }
    
    public Long getTotalTests() {
        return totalTests;
    }
    
    public void setTotalTests(Long totalTests) {
        this.totalTests = totalTests;
    }
    
    public Double getPercentage() {
        return percentage;
    }
    
    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
    
    public Long getAvgProcessingTime() {
        return avgProcessingTime;
    }
    
    public void setAvgProcessingTime(Long avgProcessingTime) {
        this.avgProcessingTime = avgProcessingTime;
    }
    
    public Double getSuccessRate() {
        return successRate;
    }
    
    public void setSuccessRate(Double successRate) {
        this.successRate = successRate;
    }
    
    public Long getTestsPerDay() {
        return testsPerDay;
    }
    
    public void setTestsPerDay(Long testsPerDay) {
        this.testsPerDay = testsPerDay;
    }
    
    public String getMostCommonWard() {
        return mostCommonWard;
    }
    
    public void setMostCommonWard(String mostCommonWard) {
        this.mostCommonWard = mostCommonWard;
    }
}