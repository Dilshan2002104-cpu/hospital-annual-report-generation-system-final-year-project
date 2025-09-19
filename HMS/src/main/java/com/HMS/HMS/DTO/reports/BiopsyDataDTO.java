package com.HMS.HMS.DTO.reports;

public class BiopsyDataDTO {
    private String biopsyType;
    private int totalCount;
    private String description;

    public BiopsyDataDTO() {}

    public BiopsyDataDTO(String biopsyType, int totalCount, String description) {
        this.biopsyType = biopsyType;
        this.totalCount = totalCount;
        this.description = description;
    }

    // Getters and Setters
    public String getBiopsyType() {
        return biopsyType;
    }

    public void setBiopsyType(String biopsyType) {
        this.biopsyType = biopsyType;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}