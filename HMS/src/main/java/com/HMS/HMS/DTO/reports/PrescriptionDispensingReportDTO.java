package com.HMS.HMS.DTO.reports;

import java.time.LocalDate;
import java.util.List;

public class PrescriptionDispensingReportDTO {
    private LocalDate startDate;
    private LocalDate endDate;

    // Summary Statistics
    private Long totalPrescriptions;
    private Long completedPrescriptions;
    private Long pendingPrescriptions;
    private Long inProgressPrescriptions;
    private Long readyPrescriptions;
    private Long cancelledPrescriptions;
    private Double completionRate;
    private Double averageProcessingTimeHours;

    // Urgency Breakdown
    private Long urgentPrescriptions;
    private Long routinePrescriptions;

    // Daily breakdown
    private List<DailyPrescriptionDataDTO> dailyBreakdown;

    // Ward-wise breakdown
    private List<WardPrescriptionDataDTO> wardBreakdown;

    // Status distribution
    private List<StatusDistributionDTO> statusDistribution;

    // Generated text
    private String summaryText;
    private String trendsText;
    private String performanceText;

    public PrescriptionDispensingReportDTO() {
    }

    // Getters and Setters
    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
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

    public Long getInProgressPrescriptions() {
        return inProgressPrescriptions;
    }

    public void setInProgressPrescriptions(Long inProgressPrescriptions) {
        this.inProgressPrescriptions = inProgressPrescriptions;
    }

    public Long getReadyPrescriptions() {
        return readyPrescriptions;
    }

    public void setReadyPrescriptions(Long readyPrescriptions) {
        this.readyPrescriptions = readyPrescriptions;
    }

    public Long getCancelledPrescriptions() {
        return cancelledPrescriptions;
    }

    public void setCancelledPrescriptions(Long cancelledPrescriptions) {
        this.cancelledPrescriptions = cancelledPrescriptions;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Double getAverageProcessingTimeHours() {
        return averageProcessingTimeHours;
    }

    public void setAverageProcessingTimeHours(Double averageProcessingTimeHours) {
        this.averageProcessingTimeHours = averageProcessingTimeHours;
    }

    public Long getUrgentPrescriptions() {
        return urgentPrescriptions;
    }

    public void setUrgentPrescriptions(Long urgentPrescriptions) {
        this.urgentPrescriptions = urgentPrescriptions;
    }

    public Long getRoutinePrescriptions() {
        return routinePrescriptions;
    }

    public void setRoutinePrescriptions(Long routinePrescriptions) {
        this.routinePrescriptions = routinePrescriptions;
    }

    public List<DailyPrescriptionDataDTO> getDailyBreakdown() {
        return dailyBreakdown;
    }

    public void setDailyBreakdown(List<DailyPrescriptionDataDTO> dailyBreakdown) {
        this.dailyBreakdown = dailyBreakdown;
    }

    public List<WardPrescriptionDataDTO> getWardBreakdown() {
        return wardBreakdown;
    }

    public void setWardBreakdown(List<WardPrescriptionDataDTO> wardBreakdown) {
        this.wardBreakdown = wardBreakdown;
    }

    public List<StatusDistributionDTO> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(List<StatusDistributionDTO> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }

    public String getSummaryText() {
        return summaryText;
    }

    public void setSummaryText(String summaryText) {
        this.summaryText = summaryText;
    }

    public String getTrendsText() {
        return trendsText;
    }

    public void setTrendsText(String trendsText) {
        this.trendsText = trendsText;
    }

    public String getPerformanceText() {
        return performanceText;
    }

    public void setPerformanceText(String performanceText) {
        this.performanceText = performanceText;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final PrescriptionDispensingReportDTO dto = new PrescriptionDispensingReportDTO();

        public Builder startDate(LocalDate startDate) {
            dto.startDate = startDate;
            return this;
        }

        public Builder endDate(LocalDate endDate) {
            dto.endDate = endDate;
            return this;
        }

        public Builder totalPrescriptions(Long totalPrescriptions) {
            dto.totalPrescriptions = totalPrescriptions;
            return this;
        }

        public Builder completedPrescriptions(Long completedPrescriptions) {
            dto.completedPrescriptions = completedPrescriptions;
            return this;
        }

        public Builder pendingPrescriptions(Long pendingPrescriptions) {
            dto.pendingPrescriptions = pendingPrescriptions;
            return this;
        }

        public Builder inProgressPrescriptions(Long inProgressPrescriptions) {
            dto.inProgressPrescriptions = inProgressPrescriptions;
            return this;
        }

        public Builder readyPrescriptions(Long readyPrescriptions) {
            dto.readyPrescriptions = readyPrescriptions;
            return this;
        }

        public Builder cancelledPrescriptions(Long cancelledPrescriptions) {
            dto.cancelledPrescriptions = cancelledPrescriptions;
            return this;
        }

        public Builder completionRate(Double completionRate) {
            dto.completionRate = completionRate;
            return this;
        }

        public Builder averageProcessingTimeHours(Double averageProcessingTimeHours) {
            dto.averageProcessingTimeHours = averageProcessingTimeHours;
            return this;
        }

        public Builder urgentPrescriptions(Long urgentPrescriptions) {
            dto.urgentPrescriptions = urgentPrescriptions;
            return this;
        }

        public Builder routinePrescriptions(Long routinePrescriptions) {
            dto.routinePrescriptions = routinePrescriptions;
            return this;
        }

        public Builder dailyBreakdown(List<DailyPrescriptionDataDTO> dailyBreakdown) {
            dto.dailyBreakdown = dailyBreakdown;
            return this;
        }

        public Builder wardBreakdown(List<WardPrescriptionDataDTO> wardBreakdown) {
            dto.wardBreakdown = wardBreakdown;
            return this;
        }

        public Builder statusDistribution(List<StatusDistributionDTO> statusDistribution) {
            dto.statusDistribution = statusDistribution;
            return this;
        }

        public Builder summaryText(String summaryText) {
            dto.summaryText = summaryText;
            return this;
        }

        public Builder trendsText(String trendsText) {
            dto.trendsText = trendsText;
            return this;
        }

        public Builder performanceText(String performanceText) {
            dto.performanceText = performanceText;
            return this;
        }

        public PrescriptionDispensingReportDTO build() {
            return dto;
        }
    }
}
