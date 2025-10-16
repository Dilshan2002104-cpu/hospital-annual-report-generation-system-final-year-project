package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Service for generating Laboratory Annual Reports with mock data for 2025
 */
@Service
public class LabReportService {

    private final Random random = new Random();
    
    /**
     * Generate comprehensive Laboratory Annual Report for 2025
     */
    public LabAnnualReportDTO generateAnnualReport(int year) {
        LabAnnualReportDTO report = new LabAnnualReportDTO(
            year,
            LocalDateTime.now(),
            "Laboratory Department Annual Report " + year
        );
        
        // Generate all report sections with mock data
        report.setOverallStatistics(generateOverallStatistics());
        report.setMonthlyVolumes(generateMonthlyVolumes());
        report.setTestTypeStatistics(generateTestTypeStatistics());
        report.setEquipmentUtilization(generateEquipmentUtilization());
        report.setPerformanceMetrics(generatePerformanceMetrics());
        report.setWardRequests(generateWardRequests());
        report.setQualityMetrics(generateQualityMetrics());
        
        return report;
    }
    
    /**
     * Generate overall statistics for the laboratory
     */
    private LabOverallStatisticsDTO generateOverallStatistics() {
        LabOverallStatisticsDTO stats = new LabOverallStatisticsDTO();
        
        // Generate realistic annual figures for 2025
        stats.setTotalTests(125000L + random.nextInt(25000)); // 125K-150K tests per year
        stats.setTotalPatients(45000L + random.nextInt(10000)); // 45K-55K patients
        stats.setAvgTurnaroundTime(BigDecimal.valueOf(4.2 + random.nextDouble() * 2).setScale(1, RoundingMode.HALF_UP));
        stats.setQualityScore(92.0 + random.nextDouble() * 6); // 92-98%
        stats.setUrgentTests(15000L + random.nextInt(5000));
        stats.setNormalTests(stats.getTotalTests() - stats.getUrgentTests());
        stats.setEquipmentCount(25L + random.nextInt(10));
        stats.setEquipmentUptime(95.0 + random.nextDouble() * 4); // 95-99%
        stats.setTestsCancelled(1200L + random.nextInt(300));
        stats.setTestsRepeated(800L + random.nextInt(200));
        
        return stats;
    }
    
    /**
     * Generate monthly volume data for the year
     */
    private List<MonthlyLabVolumeDTO> generateMonthlyVolumes() {
        List<MonthlyLabVolumeDTO> monthlyData = new ArrayList<>();
        
        // Base monthly values with seasonal variation
        int[] baseTestCounts = {9500, 9200, 10800, 11200, 11500, 12000, 
                               11800, 11900, 12200, 12500, 11800, 10600};
        
        String[] monthNames = {"January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"};
        
        for (int i = 0; i < 12; i++) {
            MonthlyLabVolumeDTO monthly = new MonthlyLabVolumeDTO();
            monthly.setMonth(i + 1);
            monthly.setMonthName(monthNames[i]);
            
            // Add some randomness to base values
            Long testCount = (long) (baseTestCounts[i] + random.nextInt(1000) - 500);
            monthly.setTestCount(testCount);
            monthly.setPatientCount((long) (testCount * 0.35 + random.nextInt(200)));
            monthly.setAvgTurnaroundTime(BigDecimal.valueOf(3.8 + random.nextDouble() * 2.4).setScale(1, RoundingMode.HALF_UP));
            monthly.setUrgentTests((long) (testCount * 0.12 + random.nextInt(100)));
            monthly.setNormalTests(testCount - monthly.getUrgentTests());
            monthly.setQualityScore(90.0 + random.nextDouble() * 8);
            
            monthlyData.add(monthly);
        }
        
        return monthlyData;
    }
    
    /**
     * Generate test type statistics
     */
    private List<TestTypeStatisticsDTO> generateTestTypeStatistics() {
        List<TestTypeStatisticsDTO> testStats = new ArrayList<>();
        
        // Define common laboratory tests with realistic distribution
        String[][] testData = {
            {"Complete Blood Count (CBC)", "Hematology"},
            {"Basic Metabolic Panel", "Chemistry"},
            {"Glucose", "Chemistry"},
            {"Cholesterol Panel", "Chemistry"},
            {"Urine Analysis", "Urinalysis"},
            {"Thyroid Function Tests", "Endocrinology"},
            {"Liver Function Tests", "Chemistry"},
            {"Cardiac Enzymes", "Chemistry"},
            {"Blood Culture", "Microbiology"},
            {"COVID-19 PCR", "Molecular"},
            {"Hemoglobin A1C", "Chemistry"},
            {"Vitamin D", "Chemistry"},
            {"Electrolytes", "Chemistry"},
            {"Coagulation Studies", "Hematology"},
            {"Tumor Markers", "Oncology"}
        };
        
        // Distribution percentages that should sum to approximately 100%
        double[] percentages = {18.5, 12.3, 11.8, 8.7, 8.2, 6.9, 6.1, 5.4, 4.8, 4.2, 3.9, 3.1, 2.8, 2.5, 2.2};
        
        String[] wards = {"ICU", "Emergency", "Cardiology", "Internal Medicine", "Pediatrics"};
        
        for (int i = 0; i < testData.length; i++) {
            TestTypeStatisticsDTO stat = new TestTypeStatisticsDTO();
            stat.setTestType(testData[i][0]);
            stat.setTestCategory(testData[i][1]);
            stat.setPercentage(percentages[i] + random.nextDouble() * 2 - 1); // Add some variance
            stat.setTotalTests((long) (140000 * percentages[i] / 100 + random.nextInt(1000)));
            stat.setAvgProcessingTime((long) (45 + random.nextInt(90))); // 45-135 minutes
            stat.setSuccessRate(95.0 + random.nextDouble() * 4); // 95-99%
            stat.setTestsPerDay((long) (stat.getTotalTests() / 365 + random.nextInt(5)));
            stat.setMostCommonWard(wards[random.nextInt(wards.length)]);
            
            testStats.add(stat);
        }
        
        return testStats;
    }
    
    /**
     * Generate equipment utilization data
     */
    private List<EquipmentUtilizationDTO> generateEquipmentUtilization() {
        List<EquipmentUtilizationDTO> equipmentData = new ArrayList<>();
        
        String[][] equipment = {
            {"Automated Chemistry Analyzer", "Chemistry", "CHEM-001"},
            {"Hematology Analyzer", "Hematology", "HEMA-001"},
            {"Blood Gas Analyzer", "Chemistry", "BGA-001"},
            {"Coagulation Analyzer", "Hematology", "COAG-001"},
            {"Immunoassay Analyzer", "Immunology", "IA-001"},
            {"PCR Machine", "Molecular", "PCR-001"},
            {"Microscope Station 1", "Microscopy", "MICRO-001"},
            {"Centrifuge High-Speed", "General", "CENT-001"},
            {"Urine Analyzer", "Urinalysis", "URINE-001"},
            {"Blood Culture System", "Microbiology", "BC-001"}
        };
        
        String[] statuses = {"Active", "Active", "Active", "Maintenance", "Active"};
        
        for (String[] eq : equipment) {
            EquipmentUtilizationDTO util = new EquipmentUtilizationDTO();
            util.setEquipmentName(eq[0]);
            util.setEquipmentType(eq[1]);
            util.setEquipmentId(eq[2]);
            util.setUtilizationPercentage(75.0 + random.nextDouble() * 20); // 75-95%
            util.setTestsProcessed((long) (8000 + random.nextInt(12000)));
            util.setUptimePercentage(92.0 + random.nextDouble() * 6); // 92-98%
            util.setDowntimeHours((long) (20 + random.nextInt(40)));
            util.setStatus(statuses[random.nextInt(statuses.length)]);
            util.setMaintenanceCount((long) (4 + random.nextInt(8)));
            
            equipmentData.add(util);
        }
        
        return equipmentData;
    }
    
    /**
     * Generate performance metrics
     */
    private List<LabPerformanceMetricsDTO> generatePerformanceMetrics() {
        List<LabPerformanceMetricsDTO> metrics = new ArrayList<>();
        
        String[][] metricsData = {
            {"Average Turnaround Time", "Efficiency", "hours"},
            {"Test Accuracy Rate", "Quality", "%"},
            {"Sample Processing Speed", "Efficiency", "samples/hour"},
            {"Equipment Uptime", "Reliability", "%"},
            {"Error Rate", "Quality", "%"},
            {"Patient Satisfaction", "Service", "score"},
            {"Cost Per Test", "Financial", "USD"},
            {"Staff Productivity", "Efficiency", "tests/staff/day"}
        };
        
        BigDecimal[] values = {
            BigDecimal.valueOf(4.2),
            BigDecimal.valueOf(97.8),
            BigDecimal.valueOf(125.5),
            BigDecimal.valueOf(96.2),
            BigDecimal.valueOf(0.8),
            BigDecimal.valueOf(4.6),
            BigDecimal.valueOf(12.50),
            BigDecimal.valueOf(45.3)
        };
        
        String[] trends = {"decreasing", "increasing", "stable", "increasing", "decreasing", "increasing", "stable", "increasing"};
        String[] statuses = {"good", "good", "good", "good", "good", "good", "good", "good"};
        
        for (int i = 0; i < metricsData.length; i++) {
            LabPerformanceMetricsDTO metric = new LabPerformanceMetricsDTO();
            metric.setMetricName(metricsData[i][0]);
            metric.setMetricCategory(metricsData[i][1]);
            metric.setValue(values[i]);
            metric.setUnit(metricsData[i][2]);
            metric.setTargetValue(values[i].multiply(BigDecimal.valueOf(0.95 + random.nextDouble() * 0.1)));
            metric.setPreviousValue(values[i].multiply(BigDecimal.valueOf(0.9 + random.nextDouble() * 0.2)));
            metric.setTrend(trends[i]);
            metric.setStatus(statuses[i]);
            
            metrics.add(metric);
        }
        
        return metrics;
    }
    
    /**
     * Generate ward-wise laboratory requests data
     */
    private List<WardLabRequestsDTO> generateWardRequests() {
        List<WardLabRequestsDTO> wardData = new ArrayList<>();
        
        String[][] wards = {
            {"ICU", "Critical Care"},
            {"Emergency Department", "Emergency"},
            {"Internal Medicine", "General"},
            {"Cardiology", "Specialized"},
            {"Pediatrics", "Specialized"},
            {"Oncology", "Specialized"},
            {"Orthopedics", "Surgical"},
            {"Nephrology", "Specialized"},
            {"General Surgery", "Surgical"},
            {"Neurology", "Specialized"}
        };
        
        // Distribution percentages for wards
        double[] percentages = {22.5, 18.3, 15.8, 12.1, 9.4, 7.2, 6.1, 4.8, 3.2, 2.6};
        String[] commonTests = {"CBC", "Basic Metabolic Panel", "Glucose", "Cardiac Enzymes", "Urine Analysis"};
        
        for (int i = 0; i < wards.length; i++) {
            WardLabRequestsDTO ward = new WardLabRequestsDTO();
            ward.setWardName(wards[i][0]);
            ward.setWardType(wards[i][1]);
            ward.setPercentage(percentages[i]);
            
            Long totalRequests = (long) (140000 * percentages[i] / 100 + random.nextInt(2000));
            ward.setTotalRequests(totalRequests);
            ward.setUrgentRequests((long) (totalRequests * (0.15 + random.nextDouble() * 0.1)));
            ward.setNormalRequests(totalRequests - ward.getUrgentRequests());
            ward.setAvgRequestsPerDay((double) totalRequests / 365);
            ward.setMostCommonTest(commonTests[random.nextInt(commonTests.length)]);
            
            wardData.add(ward);
        }
        
        return wardData;
    }
    
    /**
     * Generate quality metrics
     */
    private LabQualityMetricsDTO generateQualityMetrics() {
        LabQualityMetricsDTO quality = new LabQualityMetricsDTO();
        
        quality.setOverallQualityScore(BigDecimal.valueOf(96.5 + random.nextDouble() * 2).setScale(1, RoundingMode.HALF_UP));
        quality.setErrorRate(0.5 + random.nextDouble() * 1.0); // 0.5-1.5%
        quality.setRepeatTestRate(0.8 + random.nextDouble() * 0.7); // 0.8-1.5%
        quality.setSampleRejectionRate(1.2 + random.nextDouble() * 0.8); // 1.2-2.0%
        quality.setCriticalValueAlerts(450L + random.nextInt(100));
        quality.setAccuracyScore(97.5 + random.nextDouble() * 2);
        quality.setPrecisionScore(96.8 + random.nextDouble() * 2.2);
        quality.setQualityControlTests(2400L + random.nextInt(200));
        quality.setCalibrationEvents(156L + random.nextInt(24));
        quality.setQualityTrend("improving");
        
        return quality;
    }
}