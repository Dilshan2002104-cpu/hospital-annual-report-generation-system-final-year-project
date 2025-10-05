package com.HMS.HMS.DTO.reports;

public class WardPrescriptionDataDTO {
    private String wardName;
    private Long totalPrescriptions;
    private Long completedPrescriptions;
    private Long pendingPrescriptions;
    private Double completionRate;

    public WardPrescriptionDataDTO() {
    }

    public WardPrescriptionDataDTO(String wardName, Long totalPrescriptions, Long completedPrescriptions,
                                  Long pendingPrescriptions, Double completionRate) {
        this.wardName = wardName;
        this.totalPrescriptions = totalPrescriptions;
        this.completedPrescriptions = completedPrescriptions;
        this.pendingPrescriptions = pendingPrescriptions;
        this.completionRate = completionRate;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public Long getTotalPrescriptions() {
        return totalPrescriptions;
    }

    public void setTotalPrescriptions(Long totalPrescriptions) {
        this.totalPrescriptions = totalPrescriptions;
    }

    public Long getCompletedPrescriptions() {
        return completedPrescriptions;
    }

    public void setCompletedPrescriptions(Long completedPrescriptions) {
        this.completedPrescriptions = completedPrescriptions;
    }

    public Long getPendingPrescriptions() {
        return pendingPrescriptions;
    }

    public void setPendingPrescriptions(Long pendingPrescriptions) {
        this.pendingPrescriptions = pendingPrescriptions;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }
}
