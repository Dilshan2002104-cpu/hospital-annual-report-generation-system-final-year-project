package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.PharmacyAnalyticsDTO.PharmacyAnalyticsDTO;
import com.HMS.HMS.service.PharmacyAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;

@Service
public class PharmacyReportService {

    private final PharmacyAnalyticsService analyticsService;
    private final PDFReportGeneratorService pdfGeneratorService;

    @Autowired
    public PharmacyReportService(PharmacyAnalyticsService analyticsService,
                                PDFReportGeneratorService pdfGeneratorService) {
        this.analyticsService = analyticsService;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    /**
     * Generate comprehensive annual report data for pharmacy
     */
    public Map<String, Object> generateAnnualReportData(int year) {
        Map<String, Object> reportData = new HashMap<>();

        try {
            // Validate if data exists for the selected year
            if (!hasDataForYear(year)) {
                throw new IllegalArgumentException(
                    String.format("No pharmacy data found for year %d. Please select a year with available data or ensure the database contains records for this period.", year)
                );
            }

            // Get basic analytics
            PharmacyAnalyticsDTO analytics = analyticsService.getPharmacyAnalytics("1y");

            // Summary statistics
            Map<String, Object> summary = new HashMap<>();
            summary.put("totalPrescriptions", analytics.getPrescriptionAnalytics().getTotalPrescriptions());
            summary.put("totalMedications", analytics.getInventoryAnalytics().getTotalMedications());
            summary.put("totalRevenue", analytics.getRevenueAnalytics().getTotalRevenue());
            summary.put("averageProcessingTime", analytics.getPrescriptionAnalytics().getAverageProcessingTimeHours());
            summary.put("year", year);
            summary.put("generatedAt", LocalDateTime.now());

            reportData.put("summary", summary);

            // Monthly prescription trends
            Map<String, Object> monthlyTrends = getMonthlyPrescriptionTrends(year);
            reportData.put("monthlyTrends", monthlyTrends);

            // Top dispensed medications
            Map<String, Object> topMedications = getTopDispensedMedications(year);
            reportData.put("topMedications", topMedications);

            // Performance metrics
            Map<String, Object> performance = new HashMap<>();
            performance.put("dispensingEfficiency", analytics.getPerformanceMetrics().getDispensingEfficiency());
            performance.put("averageWaitTime", analytics.getPerformanceMetrics().getAverageWaitTime());
            performance.put("totalPatientsServed", analytics.getPerformanceMetrics().getTotalPatientsServed());
            performance.put("customerSatisfaction", analytics.getPerformanceMetrics().getCustomerSatisfactionScore());
            reportData.put("performance", performance);

            // Revenue breakdown
            Map<String, Object> revenue = new HashMap<>();
            revenue.put("totalRevenue", analytics.getRevenueAnalytics().getTotalRevenue());
            revenue.put("monthlyRevenue", analytics.getRevenueAnalytics().getMonthlyRevenue());
            revenue.put("averageTransactionValue", analytics.getRevenueAnalytics().getAverageTransactionValue());
            reportData.put("revenue", revenue);

            // Inventory insights
            Map<String, Object> inventory = new HashMap<>();
            inventory.put("totalMedications", analytics.getInventoryAnalytics().getTotalMedications());
            inventory.put("lowStockItems", analytics.getInventoryAnalytics().getLowStockCount());
            inventory.put("outOfStockItems", analytics.getInventoryAnalytics().getOutOfStockCount());
            inventory.put("inventoryValue", analytics.getInventoryAnalytics().getTotalInventoryValue());
            reportData.put("inventory", inventory);

            return reportData;

        } catch (Exception e) {
            System.err.println("Error generating annual report data: " + e.getMessage());
            return new HashMap<>();
        }
    }

    /**
     * Get monthly prescription dispensing trends
     */
    public Map<String, Object> getMonthlyPrescriptionTrends(int year) {
        Map<String, Object> trendsData = new HashMap<>();

        try {
            // Get monthly data for the specified year
            List<Map<String, Object>> monthlyData = new ArrayList<>();
            
            for (int month = 1; month <= 12; month++) {
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", Month.of(month).name());
                monthData.put("monthNumber", month);
                
                // Simulate prescription counts - in real implementation, query from database
                int prescriptionCount = generateMockPrescriptionCount(month, year);
                monthData.put("prescriptions", prescriptionCount);
                
                // Revenue calculation (mock data)
                double revenue = prescriptionCount * 45.0; // Average prescription value
                monthData.put("revenue", revenue);
                
                monthlyData.add(monthData);
            }

            trendsData.put("monthlyData", monthlyData);
            trendsData.put("year", year);

            // Calculate year-over-year growth
            int totalPrescriptions = monthlyData.stream()
                .mapToInt(data -> (Integer) data.get("prescriptions"))
                .sum();
            
            double totalRevenue = monthlyData.stream()
                .mapToDouble(data -> (Double) data.get("revenue"))
                .sum();

            trendsData.put("totalPrescriptions", totalPrescriptions);
            trendsData.put("totalRevenue", totalRevenue);
            trendsData.put("averageMonthlyPrescriptions", totalPrescriptions / 12.0);

            return trendsData;

        } catch (Exception e) {
            System.err.println("Error getting monthly prescription trends: " + e.getMessage());
            return new HashMap<>();
        }
    }

    /**
     * Get top dispensed medications for the year
     */
    public Map<String, Object> getTopDispensedMedications(int year) {
        Map<String, Object> medicationsData = new HashMap<>();

        try {
            // In real implementation, query from database
            List<Map<String, Object>> topMedications = Arrays.asList(
                createMedicationData("Amoxicillin", "Antibiotic", 2450, 122500.0),
                createMedicationData("Lisinopril", "ACE Inhibitor", 2180, 130800.0),
                createMedicationData("Metformin", "Diabetes", 2050, 82000.0),
                createMedicationData("Atorvastatin", "Cholesterol", 1890, 151200.0),
                createMedicationData("Omeprazole", "Acid Reducer", 1750, 87500.0),
                createMedicationData("Amlodipine", "Blood Pressure", 1620, 64800.0),
                createMedicationData("Gabapentin", "Nerve Pain", 1580, 110600.0),
                createMedicationData("Hydrochlorothiazide", "Diuretic", 1450, 58000.0),
                createMedicationData("Sertraline", "Antidepressant", 1380, 110400.0),
                createMedicationData("Ibuprofen", "Pain Relief", 1290, 38700.0)
            );

            medicationsData.put("topMedications", topMedications);
            medicationsData.put("year", year);
            
            int totalQuantity = topMedications.stream()
                .mapToInt(med -> (Integer) med.get("quantity"))
                .sum();
            
            double totalValue = topMedications.stream()
                .mapToDouble(med -> (Double) med.get("totalValue"))
                .sum();

            medicationsData.put("totalQuantityDispensed", totalQuantity);
            medicationsData.put("totalValueDispensed", totalValue);

            return medicationsData;

        } catch (Exception e) {
            System.err.println("Error getting top dispensed medications: " + e.getMessage());
            return new HashMap<>();
        }
    }

    /**
     * Generate PDF for annual report
     */
    public byte[] generateAnnualReportPDF(Map<String, Object> reportData, int year) {
        // This will be implemented by adding a method to PDFReportGeneratorService
        // For now, create a basic implementation
        return pdfGeneratorService.generatePharmacyAnnualReportPDF(reportData, year);
    }

    // Helper methods
    private Map<String, Object> createMedicationData(String name, String category, int quantity, double totalValue) {
        Map<String, Object> medication = new HashMap<>();
        medication.put("medicationName", name);
        medication.put("category", category);
        medication.put("quantity", quantity);
        medication.put("totalValue", totalValue);
        medication.put("averagePrice", totalValue / quantity);
        return medication;
    }

    private int generateMockPrescriptionCount(int month, int year) {
        // Generate realistic mock data based on seasonal patterns
        int baseCount = 800;
        
        // Seasonal adjustments
        if (month >= 10 || month <= 3) { // Winter months
            baseCount += 150; // More prescriptions during flu season
        } else if (month >= 6 && month <= 8) { // Summer months
            baseCount -= 50; // Fewer prescriptions in summer
        }
        
        // Add some randomness
        Random random = new Random(year * 12 + month); // Consistent for same month/year
        int variation = random.nextInt(200) - 100; // ±100 variation
        
        return Math.max(500, baseCount + variation); // Minimum 500 prescriptions
    }

    /**
     * Check if there's any pharmacy data available for the specified year
     */
    private boolean hasDataForYear(int year) {
        try {
            // Check if there are any prescriptions for the given year
            // In a real implementation, this would query the database
            // For now, let's assume data is only available for recent years
            
            int currentYear = LocalDateTime.now().getYear();
            
            // Only allow data for years where we might realistically have data
            if (year > currentYear) {
                return false; // Future years
            }
            
            if (year < 2020) {
                return false; // Too old, no data available
            }
            
            // For simulation purposes, let's say we only have data for specific years
            // In real implementation, query prescription or inventory tables:
            // SELECT COUNT(*) FROM prescriptions WHERE YEAR(created_date) = ?
            // or check if any pharmacy transactions exist for that year
            
            // Mock validation - assume we have data for current year and previous 2 years
            return year >= (currentYear - 2) && year <= currentYear;
            
        } catch (Exception e) {
            System.err.println("Error checking data availability for year " + year + ": " + e.getMessage());
            return false;
        }
    }
}