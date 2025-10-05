package com.HMS.HMS.service;

import com.HMS.HMS.DTO.PharmacyAnalyticsDTO.PharmacyAnalyticsDTO;
import com.HMS.HMS.DTO.PharmacyAnalyticsDTO.PharmacyAnalyticsDTO.*;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import com.HMS.HMS.repository.MedicationRepository;
import com.HMS.HMS.repository.PrescriptionRepository;
import com.HMS.HMS.repository.PrescriptionItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class PharmacyAnalyticsService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final MedicationRepository medicationRepository;

    @Autowired
    public PharmacyAnalyticsService(PrescriptionRepository prescriptionRepository,
                                  PrescriptionItemRepository prescriptionItemRepository,
                                  MedicationRepository medicationRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionItemRepository = prescriptionItemRepository;
        this.medicationRepository = medicationRepository;
    }

    /**
     * Get comprehensive pharmacy analytics for the specified date range
     */
    public PharmacyAnalyticsDTO getPharmacyAnalytics(String period) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = calculateStartDate(period, endDate);

        PrescriptionAnalyticsDTO prescriptionAnalytics = getPrescriptionAnalytics(startDate, endDate);
        InventoryAnalyticsDTO inventoryAnalytics = getInventoryAnalytics();
        PerformanceMetricsDTO performanceMetrics = getPerformanceMetrics(startDate, endDate);
        RevenueAnalyticsDTO revenueAnalytics = getRevenueAnalytics(startDate, endDate);
        List<AlertDTO> alerts = generateAlerts();

        return new PharmacyAnalyticsDTO(
            prescriptionAnalytics,
            inventoryAnalytics,
            performanceMetrics,
            revenueAnalytics,
            alerts
        );
    }

    /**
     * Get prescription analytics data
     */
    private PrescriptionAnalyticsDTO getPrescriptionAnalytics(LocalDate startDate, LocalDate endDate) {
        // Get basic counts
        Long totalPrescriptions = prescriptionRepository.countByPrescribedDateBetween(
            startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        
        Long activePrescriptions = prescriptionRepository.countByStatus(PrescriptionStatus.ACTIVE);
        Long completedPrescriptions = prescriptionRepository.countByStatusAndPrescribedDateBetween(
            PrescriptionStatus.COMPLETED, startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        
        Long urgentPrescriptions = prescriptionItemRepository.countByIsUrgentTrueAndCreatedAtBetween(
            startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

        // Calculate processing rate
        Double processingRate = totalPrescriptions > 0 ? 
            (completedPrescriptions.doubleValue() / totalPrescriptions.doubleValue()) * 100 : 0.0;

        // Calculate average processing time (simplified)
        Double averageProcessingTimeHours = calculateAverageProcessingTime(startDate, endDate);

        // Get daily volume data
        List<DailyVolumeDTO> dailyVolume = getDailyVolumeData(startDate, endDate);

        // Get status distribution
        Map<String, Long> statusDistribution = getStatusDistribution();

        return new PrescriptionAnalyticsDTO(
            totalPrescriptions,
            activePrescriptions,
            completedPrescriptions,
            urgentPrescriptions,
            averageProcessingTimeHours,
            processingRate,
            dailyVolume,
            statusDistribution
        );
    }

    /**
     * Get inventory analytics data
     */
    private InventoryAnalyticsDTO getInventoryAnalytics() {
        InventoryAnalyticsDTO analytics = new InventoryAnalyticsDTO();
        
        // Get total medications count
        Long totalMedications = medicationRepository.countByIsActiveTrue();
        analytics.setTotalMedications(totalMedications);

        // Get stock status counts
        Long lowStockCount = medicationRepository.countLowStockMedications();
        Long outOfStockCount = medicationRepository.countOutOfStockMedications();
        Long expiringCount = medicationRepository.countMedicationsExpiringSoon(LocalDate.now().plusDays(30));

        analytics.setLowStockCount(lowStockCount);
        analytics.setOutOfStockCount(outOfStockCount);
        analytics.setExpiringCount(expiringCount);

        // Calculate total inventory value
        BigDecimal totalValue = medicationRepository.calculateTotalInventoryValue();
        analytics.setTotalInventoryValue(totalValue != null ? totalValue : BigDecimal.ZERO);

        // Get stock status distribution
        Map<String, Long> stockStatusDistribution = new HashMap<>();
        stockStatusDistribution.put("IN_STOCK", totalMedications - lowStockCount - outOfStockCount);
        stockStatusDistribution.put("LOW_STOCK", lowStockCount);
        stockStatusDistribution.put("OUT_OF_STOCK", outOfStockCount);
        stockStatusDistribution.put("EXPIRING_SOON", expiringCount);
        analytics.setStockStatusDistribution(stockStatusDistribution);

        // Get top dispensed medications (mock data for now)
        List<TopMedicationDTO> topMedications = getTopDispensedMedications();
        analytics.setTopDispensedMedications(topMedications);

        // Get expiring medications
        List<ExpiringMedicationDTO> expiringMedications = getExpiringMedications(30);
        analytics.setExpiringMedications(expiringMedications);

        return analytics;
    }

    /**
     * Get performance metrics
     */
    private PerformanceMetricsDTO getPerformanceMetrics(LocalDate startDate, LocalDate endDate) {
        PerformanceMetricsDTO metrics = new PerformanceMetricsDTO();

        // Calculate dispensing efficiency (completed vs total prescriptions)
        Long totalPrescriptions = prescriptionRepository.countByPrescribedDateBetween(
            startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        Long completedPrescriptions = prescriptionRepository.countByStatusAndPrescribedDateBetween(
            PrescriptionStatus.COMPLETED, startDate.atStartOfDay(), endDate.atTime(23, 59, 59));

        Double efficiency = totalPrescriptions > 0 ? 
            (completedPrescriptions.doubleValue() / totalPrescriptions.doubleValue()) * 100 : 0.0;
        metrics.setDispensingEfficiency(efficiency);

        // Mock data for other metrics (can be enhanced later)
        metrics.setAverageWaitTime(15.5); // minutes
        metrics.setTotalPatientsServed(completedPrescriptions);
        metrics.setCustomerSatisfactionScore(4.2); // out of 5

        return metrics;
    }

    /**
     * Get revenue analytics
     */
    private RevenueAnalyticsDTO getRevenueAnalytics(LocalDate startDate, LocalDate endDate) {
        RevenueAnalyticsDTO analytics = new RevenueAnalyticsDTO();

        // Calculate revenue based on completed prescriptions and medication costs
        BigDecimal totalRevenue = calculateRevenueForPeriod(startDate, endDate);
        BigDecimal monthlyRevenue = calculateRevenueForPeriod(LocalDate.now().withDayOfMonth(1), LocalDate.now());
        BigDecimal dailyRevenue = calculateRevenueForPeriod(LocalDate.now(), LocalDate.now());

        analytics.setTotalRevenue(totalRevenue);
        analytics.setMonthlyRevenue(monthlyRevenue);
        analytics.setDailyRevenue(dailyRevenue);

        // Generate revenue history data
        List<RevenueDataPointDTO> revenueHistory = generateRevenueHistory(startDate, endDate);
        analytics.setRevenueHistory(revenueHistory);

        // Calculate average transaction value
        Long totalTransactions = prescriptionRepository.countByStatusAndPrescribedDateBetween(
            PrescriptionStatus.COMPLETED, startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        BigDecimal avgTransactionValue = totalTransactions > 0 ? 
            totalRevenue.divide(BigDecimal.valueOf(totalTransactions), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        analytics.setAverageTransactionValue(avgTransactionValue);

        return analytics;
    }

    /**
     * Generate alerts for various conditions
     */
    private List<AlertDTO> generateAlerts() {
        List<AlertDTO> alerts = new ArrayList<>();

        // Low stock alerts
        Long lowStockCount = medicationRepository.countLowStockMedications();
        if (lowStockCount > 0) {
            alerts.add(new AlertDTO(
                "LOW_STOCK",
                lowStockCount + " medications are running low on stock",
                "WARNING",
                "INVENTORY"
            ));
        }

        // Out of stock alerts
        Long outOfStockCount = medicationRepository.countOutOfStockMedications();
        if (outOfStockCount > 0) {
            alerts.add(new AlertDTO(
                "OUT_OF_STOCK",
                outOfStockCount + " medications are out of stock",
                "CRITICAL",
                "INVENTORY"
            ));
        }

        // Expiring medications alerts
        Long expiringCount = medicationRepository.countMedicationsExpiringSoon(LocalDate.now().plusDays(30));
        if (expiringCount > 0) {
            alerts.add(new AlertDTO(
                "EXPIRING_SOON",
                expiringCount + " medications expire within 30 days",
                "WARNING",
                "INVENTORY"
            ));
        }

        // Urgent prescriptions alerts
        Long urgentCount = prescriptionItemRepository.countByIsUrgentTrueAndItemStatus(PrescriptionStatus.ACTIVE);
        if (urgentCount > 0) {
            alerts.add(new AlertDTO(
                "URGENT_PRESCRIPTIONS",
                urgentCount + " urgent prescriptions pending",
                "HIGH",
                "PRESCRIPTIONS"
            ));
        }

        return alerts;
    }

    // Helper methods

    private LocalDate calculateStartDate(String period, LocalDate endDate) {
        return switch (period.toLowerCase()) {
            case "7d" -> endDate.minusDays(7);
            case "30d" -> endDate.minusDays(30);
            case "90d" -> endDate.minusDays(90);
            case "1y" -> endDate.minusYears(1);
            default -> endDate.minusDays(7);
        };
    }

    private Double calculateAverageProcessingTime(LocalDate startDate, LocalDate endDate) {
        // Simplified calculation - can be enhanced with actual processing time tracking
        return 2.5; // hours (mock data)
    }

    private List<DailyVolumeDTO> getDailyVolumeData(LocalDate startDate, LocalDate endDate) {
        List<DailyVolumeDTO> dailyVolume = new ArrayList<>();
        
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            Long totalCount = prescriptionRepository.countByPrescribedDateBetween(
                currentDate.atStartOfDay(), currentDate.atTime(23, 59, 59));
            Long urgentCount = prescriptionItemRepository.countByIsUrgentTrueAndCreatedAtBetween(
                currentDate.atStartOfDay(), currentDate.atTime(23, 59, 59));
            
            dailyVolume.add(new DailyVolumeDTO(currentDate, totalCount, urgentCount));
            currentDate = currentDate.plusDays(1);
        }
        
        return dailyVolume;
    }

    private Map<String, Long> getStatusDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        for (PrescriptionStatus status : PrescriptionStatus.values()) {
            Long count = prescriptionRepository.countByStatus(status);
            distribution.put(status.name(), count);
        }
        return distribution;
    }

    private List<TopMedicationDTO> getTopDispensedMedications() {
        // Mock data - can be enhanced with actual dispensing tracking
        return Arrays.asList(
            new TopMedicationDTO("Paracetamol", 245L, new BigDecimal("1225.50")),
            new TopMedicationDTO("Amoxicillin", 189L, new BigDecimal("2835.75")),
            new TopMedicationDTO("Ibuprofen", 167L, new BigDecimal("1003.50")),
            new TopMedicationDTO("Metformin", 143L, new BigDecimal("2145.25")),
            new TopMedicationDTO("Aspirin", 128L, new BigDecimal("640.00"))
        );
    }

    private List<ExpiringMedicationDTO> getExpiringMedications(int days) {
        LocalDate cutoffDate = LocalDate.now().plusDays(days);
        return medicationRepository.findByExpiryDateBeforeAndIsActiveTrue(cutoffDate)
            .stream()
            .map(medication -> new ExpiringMedicationDTO(
                medication.getDrugName(),
                medication.getBatchNumber(),
                medication.getExpiryDate(),
                medication.getCurrentStock(),
                ChronoUnit.DAYS.between(LocalDate.now(), medication.getExpiryDate())
            ))
            .collect(Collectors.toList());
    }

    private BigDecimal calculateRevenueForPeriod(LocalDate startDate, LocalDate endDate) {
        // Mock calculation - can be enhanced with actual revenue tracking
        Long completedPrescriptions = prescriptionRepository.countByStatusAndPrescribedDateBetween(
            PrescriptionStatus.COMPLETED, startDate.atStartOfDay(), endDate.atTime(23, 59, 59));
        return BigDecimal.valueOf(completedPrescriptions * 25.50); // Average revenue per prescription
    }

    private List<RevenueDataPointDTO> generateRevenueHistory(LocalDate startDate, LocalDate endDate) {
        List<RevenueDataPointDTO> history = new ArrayList<>();
        
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            BigDecimal dailyRevenue = calculateRevenueForPeriod(currentDate, currentDate);
            history.add(new RevenueDataPointDTO(currentDate, dailyRevenue));
            currentDate = currentDate.plusDays(1);
        }
        
        return history;
    }
}