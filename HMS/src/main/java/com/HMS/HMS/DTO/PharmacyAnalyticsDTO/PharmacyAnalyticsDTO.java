package com.HMS.HMS.DTO.PharmacyAnalyticsDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class PharmacyAnalyticsDTO {
    private PrescriptionAnalyticsDTO prescriptionAnalytics;
    private InventoryAnalyticsDTO inventoryAnalytics;
    private PerformanceMetricsDTO performanceMetrics;
    private RevenueAnalyticsDTO revenueAnalytics;
    private List<AlertDTO> alerts;
    private LocalDateTime generatedAt;

    // Constructors
    public PharmacyAnalyticsDTO() {
        this.generatedAt = LocalDateTime.now();
    }

    public PharmacyAnalyticsDTO(PrescriptionAnalyticsDTO prescriptionAnalytics,
                               InventoryAnalyticsDTO inventoryAnalytics,
                               PerformanceMetricsDTO performanceMetrics,
                               RevenueAnalyticsDTO revenueAnalytics,
                               List<AlertDTO> alerts) {
        this.prescriptionAnalytics = prescriptionAnalytics;
        this.inventoryAnalytics = inventoryAnalytics;
        this.performanceMetrics = performanceMetrics;
        this.revenueAnalytics = revenueAnalytics;
        this.alerts = alerts;
        this.generatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public PrescriptionAnalyticsDTO getPrescriptionAnalytics() {
        return prescriptionAnalytics;
    }

    public void setPrescriptionAnalytics(PrescriptionAnalyticsDTO prescriptionAnalytics) {
        this.prescriptionAnalytics = prescriptionAnalytics;
    }

    public InventoryAnalyticsDTO getInventoryAnalytics() {
        return inventoryAnalytics;
    }

    public void setInventoryAnalytics(InventoryAnalyticsDTO inventoryAnalytics) {
        this.inventoryAnalytics = inventoryAnalytics;
    }

    public PerformanceMetricsDTO getPerformanceMetrics() {
        return performanceMetrics;
    }

    public void setPerformanceMetrics(PerformanceMetricsDTO performanceMetrics) {
        this.performanceMetrics = performanceMetrics;
    }

    public RevenueAnalyticsDTO getRevenueAnalytics() {
        return revenueAnalytics;
    }

    public void setRevenueAnalytics(RevenueAnalyticsDTO revenueAnalytics) {
        this.revenueAnalytics = revenueAnalytics;
    }

    public List<AlertDTO> getAlerts() {
        return alerts;
    }

    public void setAlerts(List<AlertDTO> alerts) {
        this.alerts = alerts;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    // Helper DTOs
    public static class PrescriptionAnalyticsDTO {
        private Long totalPrescriptions;
        private Long activePrescriptions;
        private Long completedPrescriptions;
        private Long urgentPrescriptions;
        private Double averageProcessingTimeHours;
        private Double processingRate;
        private List<DailyVolumeDTO> dailyVolume;
        private Map<String, Long> statusDistribution;

        // Constructors
        public PrescriptionAnalyticsDTO() {}

        public PrescriptionAnalyticsDTO(Long totalPrescriptions, Long activePrescriptions,
                                      Long completedPrescriptions, Long urgentPrescriptions,
                                      Double averageProcessingTimeHours, Double processingRate,
                                      List<DailyVolumeDTO> dailyVolume, Map<String, Long> statusDistribution) {
            this.totalPrescriptions = totalPrescriptions;
            this.activePrescriptions = activePrescriptions;
            this.completedPrescriptions = completedPrescriptions;
            this.urgentPrescriptions = urgentPrescriptions;
            this.averageProcessingTimeHours = averageProcessingTimeHours;
            this.processingRate = processingRate;
            this.dailyVolume = dailyVolume;
            this.statusDistribution = statusDistribution;
        }

        // Getters and Setters
        public Long getTotalPrescriptions() { return totalPrescriptions; }
        public void setTotalPrescriptions(Long totalPrescriptions) { this.totalPrescriptions = totalPrescriptions; }

        public Long getActivePrescriptions() { return activePrescriptions; }
        public void setActivePrescriptions(Long activePrescriptions) { this.activePrescriptions = activePrescriptions; }

        public Long getCompletedPrescriptions() { return completedPrescriptions; }
        public void setCompletedPrescriptions(Long completedPrescriptions) { this.completedPrescriptions = completedPrescriptions; }

        public Long getUrgentPrescriptions() { return urgentPrescriptions; }
        public void setUrgentPrescriptions(Long urgentPrescriptions) { this.urgentPrescriptions = urgentPrescriptions; }

        public Double getAverageProcessingTimeHours() { return averageProcessingTimeHours; }
        public void setAverageProcessingTimeHours(Double averageProcessingTimeHours) { this.averageProcessingTimeHours = averageProcessingTimeHours; }

        public Double getProcessingRate() { return processingRate; }
        public void setProcessingRate(Double processingRate) { this.processingRate = processingRate; }

        public List<DailyVolumeDTO> getDailyVolume() { return dailyVolume; }
        public void setDailyVolume(List<DailyVolumeDTO> dailyVolume) { this.dailyVolume = dailyVolume; }

        public Map<String, Long> getStatusDistribution() { return statusDistribution; }
        public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }
    }

    public static class InventoryAnalyticsDTO {
        private Long totalMedications;
        private Long lowStockCount;
        private Long outOfStockCount;
        private Long expiringCount;
        private BigDecimal totalInventoryValue;
        private Map<String, Long> stockStatusDistribution;
        private List<TopMedicationDTO> topDispensedMedications;
        private List<ExpiringMedicationDTO> expiringMedications;

        // Constructors
        public InventoryAnalyticsDTO() {}

        // Getters and Setters
        public Long getTotalMedications() { return totalMedications; }
        public void setTotalMedications(Long totalMedications) { this.totalMedications = totalMedications; }

        public Long getLowStockCount() { return lowStockCount; }
        public void setLowStockCount(Long lowStockCount) { this.lowStockCount = lowStockCount; }

        public Long getOutOfStockCount() { return outOfStockCount; }
        public void setOutOfStockCount(Long outOfStockCount) { this.outOfStockCount = outOfStockCount; }

        public Long getExpiringCount() { return expiringCount; }
        public void setExpiringCount(Long expiringCount) { this.expiringCount = expiringCount; }

        public BigDecimal getTotalInventoryValue() { return totalInventoryValue; }
        public void setTotalInventoryValue(BigDecimal totalInventoryValue) { this.totalInventoryValue = totalInventoryValue; }

        public Map<String, Long> getStockStatusDistribution() { return stockStatusDistribution; }
        public void setStockStatusDistribution(Map<String, Long> stockStatusDistribution) { this.stockStatusDistribution = stockStatusDistribution; }

        public List<TopMedicationDTO> getTopDispensedMedications() { return topDispensedMedications; }
        public void setTopDispensedMedications(List<TopMedicationDTO> topDispensedMedications) { this.topDispensedMedications = topDispensedMedications; }

        public List<ExpiringMedicationDTO> getExpiringMedications() { return expiringMedications; }
        public void setExpiringMedications(List<ExpiringMedicationDTO> expiringMedications) { this.expiringMedications = expiringMedications; }
    }

    public static class PerformanceMetricsDTO {
        private Double dispensingEfficiency;
        private Double averageWaitTime;
        private Long totalPatientsServed;
        private Double customerSatisfactionScore;

        // Constructors and getters/setters
        public PerformanceMetricsDTO() {}

        public Double getDispensingEfficiency() { return dispensingEfficiency; }
        public void setDispensingEfficiency(Double dispensingEfficiency) { this.dispensingEfficiency = dispensingEfficiency; }

        public Double getAverageWaitTime() { return averageWaitTime; }
        public void setAverageWaitTime(Double averageWaitTime) { this.averageWaitTime = averageWaitTime; }

        public Long getTotalPatientsServed() { return totalPatientsServed; }
        public void setTotalPatientsServed(Long totalPatientsServed) { this.totalPatientsServed = totalPatientsServed; }

        public Double getCustomerSatisfactionScore() { return customerSatisfactionScore; }
        public void setCustomerSatisfactionScore(Double customerSatisfactionScore) { this.customerSatisfactionScore = customerSatisfactionScore; }
    }

    public static class RevenueAnalyticsDTO {
        private BigDecimal totalRevenue;
        private BigDecimal monthlyRevenue;
        private BigDecimal dailyRevenue;
        private List<RevenueDataPointDTO> revenueHistory;
        private BigDecimal averageTransactionValue;

        // Constructors and getters/setters
        public RevenueAnalyticsDTO() {}

        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

        public BigDecimal getMonthlyRevenue() { return monthlyRevenue; }
        public void setMonthlyRevenue(BigDecimal monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

        public BigDecimal getDailyRevenue() { return dailyRevenue; }
        public void setDailyRevenue(BigDecimal dailyRevenue) { this.dailyRevenue = dailyRevenue; }

        public List<RevenueDataPointDTO> getRevenueHistory() { return revenueHistory; }
        public void setRevenueHistory(List<RevenueDataPointDTO> revenueHistory) { this.revenueHistory = revenueHistory; }

        public BigDecimal getAverageTransactionValue() { return averageTransactionValue; }
        public void setAverageTransactionValue(BigDecimal averageTransactionValue) { this.averageTransactionValue = averageTransactionValue; }
    }

    // Supporting DTOs
    public static class DailyVolumeDTO {
        private LocalDate date;
        private Long totalPrescriptions;
        private Long urgentPrescriptions;

        public DailyVolumeDTO(LocalDate date, Long totalPrescriptions, Long urgentPrescriptions) {
            this.date = date;
            this.totalPrescriptions = totalPrescriptions;
            this.urgentPrescriptions = urgentPrescriptions;
        }

        // Getters and Setters
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public Long getTotalPrescriptions() { return totalPrescriptions; }
        public void setTotalPrescriptions(Long totalPrescriptions) { this.totalPrescriptions = totalPrescriptions; }

        public Long getUrgentPrescriptions() { return urgentPrescriptions; }
        public void setUrgentPrescriptions(Long urgentPrescriptions) { this.urgentPrescriptions = urgentPrescriptions; }
    }

    public static class TopMedicationDTO {
        private String drugName;
        private Long totalDispensed;
        private BigDecimal revenue;

        public TopMedicationDTO(String drugName, Long totalDispensed, BigDecimal revenue) {
            this.drugName = drugName;
            this.totalDispensed = totalDispensed;
            this.revenue = revenue;
        }

        // Getters and Setters
        public String getDrugName() { return drugName; }
        public void setDrugName(String drugName) { this.drugName = drugName; }

        public Long getTotalDispensed() { return totalDispensed; }
        public void setTotalDispensed(Long totalDispensed) { this.totalDispensed = totalDispensed; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }

    public static class ExpiringMedicationDTO {
        private String drugName;
        private String batchNumber;
        private LocalDate expiryDate;
        private Integer currentStock;
        private Long daysUntilExpiry;

        public ExpiringMedicationDTO(String drugName, String batchNumber, LocalDate expiryDate, Integer currentStock, Long daysUntilExpiry) {
            this.drugName = drugName;
            this.batchNumber = batchNumber;
            this.expiryDate = expiryDate;
            this.currentStock = currentStock;
            this.daysUntilExpiry = daysUntilExpiry;
        }

        // Getters and Setters
        public String getDrugName() { return drugName; }
        public void setDrugName(String drugName) { this.drugName = drugName; }

        public String getBatchNumber() { return batchNumber; }
        public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

        public Integer getCurrentStock() { return currentStock; }
        public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }

        public Long getDaysUntilExpiry() { return daysUntilExpiry; }
        public void setDaysUntilExpiry(Long daysUntilExpiry) { this.daysUntilExpiry = daysUntilExpiry; }
    }

    public static class RevenueDataPointDTO {
        private LocalDate date;
        private BigDecimal revenue;

        public RevenueDataPointDTO(LocalDate date, BigDecimal revenue) {
            this.date = date;
            this.revenue = revenue;
        }

        // Getters and Setters
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
    }

    public static class AlertDTO {
        private String type;
        private String message;
        private String severity;
        private String category;
        private LocalDateTime createdAt;

        public AlertDTO(String type, String message, String severity, String category) {
            this.type = type;
            this.message = message;
            this.severity = severity;
            this.category = category;
            this.createdAt = LocalDateTime.now();
        }

        // Getters and Setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}