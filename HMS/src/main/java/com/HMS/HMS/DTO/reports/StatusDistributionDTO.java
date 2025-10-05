package com.HMS.HMS.DTO.reports;

public class StatusDistributionDTO {
    private String status;
    private String statusLabel;
    private Long count;
    private Double percentage;

    public StatusDistributionDTO() {
    }

    public StatusDistributionDTO(String status, String statusLabel, Long count, Double percentage) {
        this.status = status;
        this.statusLabel = statusLabel;
        this.count = count;
        this.percentage = percentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
}
