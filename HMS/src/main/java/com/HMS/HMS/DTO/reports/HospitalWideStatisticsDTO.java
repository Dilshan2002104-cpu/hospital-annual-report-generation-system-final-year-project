package com.HMS.HMS.DTO.reports;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class HospitalWideStatisticsDTO {

    // Basic Info
    private String reportTitle;
    private int year;
    private LocalDateTime generatedAt;
    private int totalWards;

    // Hospital-wide Aggregated Statistics
    private long totalHospitalAdmissions;
    private long totalHospitalDischarges;
    private long totalActiveAdmissions;
    private double hospitalOccupancyRate;
    private double hospitalBedUtilizationRate;
    private double averageHospitalLengthOfStay;

    // Individual Ward Statistics
    private List<WardStatisticsReportDTO> wardReports;

    // Comparative Analysis
    private WardStatisticsReportDTO bestPerformingWard;
    private WardStatisticsReportDTO highestOccupancyWard;
    private WardStatisticsReportDTO mostActiveWard;

    // Hospital-wide Demographics
    private Map<String, Long> hospitalAgeGroupBreakdown;
    private Map<String, Long> hospitalGenderBreakdown;
    private Map<String, Long> wardTypeDistribution;

    // Monthly Aggregated Data
    private List<HospitalMonthlyDataDTO> hospitalMonthlyData;

    // Performance Insights
    private String hospitalExecutiveSummary;
    private String hospitalTrendAnalysis;
    private String hospitalPerformanceInsights;
    private String hospitalRecommendations;

    // Charts Data for All Wards
    private List<ChartDataPoint> hospitalAdmissionTrends;
    private List<ChartDataPoint> wardComparisonData;

    // Default constructor
    public HospitalWideStatisticsDTO() {
        this.generatedAt = LocalDateTime.now();
        this.reportTitle = "Hospital-Wide Ward Statistics Report";
    }

    // Constructor with year
    public HospitalWideStatisticsDTO(int year) {
        this();
        this.year = year;
    }

    // Inner class for hospital monthly data
    public static class HospitalMonthlyDataDTO {
        private int month;
        private String monthName;
        private long totalAdmissions;
        private long totalDischarges;
        private double averageOccupancy;
        private Map<String, Long> wardBreakdown;

        // Constructors
        public HospitalMonthlyDataDTO() {}

        public HospitalMonthlyDataDTO(int month, String monthName) {
            this.month = month;
            this.monthName = monthName;
        }

        // Getters and Setters
        public int getMonth() { return month; }
        public void setMonth(int month) { this.month = month; }

        public String getMonthName() { return monthName; }
        public void setMonthName(String monthName) { this.monthName = monthName; }

        public long getTotalAdmissions() { return totalAdmissions; }
        public void setTotalAdmissions(long totalAdmissions) { this.totalAdmissions = totalAdmissions; }

        public long getTotalDischarges() { return totalDischarges; }
        public void setTotalDischarges(long totalDischarges) { this.totalDischarges = totalDischarges; }

        public double getAverageOccupancy() { return averageOccupancy; }
        public void setAverageOccupancy(double averageOccupancy) { this.averageOccupancy = averageOccupancy; }

        public Map<String, Long> getWardBreakdown() { return wardBreakdown; }
        public void setWardBreakdown(Map<String, Long> wardBreakdown) { this.wardBreakdown = wardBreakdown; }
    }

    // Use the existing ChartDataPoint from WardStatisticsReportDTO
    public static class ChartDataPoint {
        private String label;
        private double value;
        private String category;

        public ChartDataPoint() {}

        public ChartDataPoint(String label, double value) {
            this.label = label;
            this.value = value;
        }

        public ChartDataPoint(String label, double value, String category) {
            this.label = label;
            this.value = value;
            this.category = category;
        }

        // Getters and Setters
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public double getValue() { return value; }
        public void setValue(double value) { this.value = value; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }

    // Main class getters and setters
    public String getReportTitle() { return reportTitle; }
    public void setReportTitle(String reportTitle) { this.reportTitle = reportTitle; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public int getTotalWards() { return totalWards; }
    public void setTotalWards(int totalWards) { this.totalWards = totalWards; }

    public long getTotalHospitalAdmissions() { return totalHospitalAdmissions; }
    public void setTotalHospitalAdmissions(long totalHospitalAdmissions) { this.totalHospitalAdmissions = totalHospitalAdmissions; }

    public long getTotalHospitalDischarges() { return totalHospitalDischarges; }
    public void setTotalHospitalDischarges(long totalHospitalDischarges) { this.totalHospitalDischarges = totalHospitalDischarges; }

    public long getTotalActiveAdmissions() { return totalActiveAdmissions; }
    public void setTotalActiveAdmissions(long totalActiveAdmissions) { this.totalActiveAdmissions = totalActiveAdmissions; }

    public double getHospitalOccupancyRate() { return hospitalOccupancyRate; }
    public void setHospitalOccupancyRate(double hospitalOccupancyRate) { this.hospitalOccupancyRate = hospitalOccupancyRate; }

    public double getHospitalBedUtilizationRate() { return hospitalBedUtilizationRate; }
    public void setHospitalBedUtilizationRate(double hospitalBedUtilizationRate) { this.hospitalBedUtilizationRate = hospitalBedUtilizationRate; }

    public double getAverageHospitalLengthOfStay() { return averageHospitalLengthOfStay; }
    public void setAverageHospitalLengthOfStay(double averageHospitalLengthOfStay) { this.averageHospitalLengthOfStay = averageHospitalLengthOfStay; }

    public List<WardStatisticsReportDTO> getWardReports() { return wardReports; }
    public void setWardReports(List<WardStatisticsReportDTO> wardReports) { this.wardReports = wardReports; }

    public WardStatisticsReportDTO getBestPerformingWard() { return bestPerformingWard; }
    public void setBestPerformingWard(WardStatisticsReportDTO bestPerformingWard) { this.bestPerformingWard = bestPerformingWard; }

    public WardStatisticsReportDTO getHighestOccupancyWard() { return highestOccupancyWard; }
    public void setHighestOccupancyWard(WardStatisticsReportDTO highestOccupancyWard) { this.highestOccupancyWard = highestOccupancyWard; }

    public WardStatisticsReportDTO getMostActiveWard() { return mostActiveWard; }
    public void setMostActiveWard(WardStatisticsReportDTO mostActiveWard) { this.mostActiveWard = mostActiveWard; }

    public Map<String, Long> getHospitalAgeGroupBreakdown() { return hospitalAgeGroupBreakdown; }
    public void setHospitalAgeGroupBreakdown(Map<String, Long> hospitalAgeGroupBreakdown) { this.hospitalAgeGroupBreakdown = hospitalAgeGroupBreakdown; }

    public Map<String, Long> getHospitalGenderBreakdown() { return hospitalGenderBreakdown; }
    public void setHospitalGenderBreakdown(Map<String, Long> hospitalGenderBreakdown) { this.hospitalGenderBreakdown = hospitalGenderBreakdown; }

    public Map<String, Long> getWardTypeDistribution() { return wardTypeDistribution; }
    public void setWardTypeDistribution(Map<String, Long> wardTypeDistribution) { this.wardTypeDistribution = wardTypeDistribution; }

    public List<HospitalMonthlyDataDTO> getHospitalMonthlyData() { return hospitalMonthlyData; }
    public void setHospitalMonthlyData(List<HospitalMonthlyDataDTO> hospitalMonthlyData) { this.hospitalMonthlyData = hospitalMonthlyData; }

    public String getHospitalExecutiveSummary() { return hospitalExecutiveSummary; }
    public void setHospitalExecutiveSummary(String hospitalExecutiveSummary) { this.hospitalExecutiveSummary = hospitalExecutiveSummary; }

    public String getHospitalTrendAnalysis() { return hospitalTrendAnalysis; }
    public void setHospitalTrendAnalysis(String hospitalTrendAnalysis) { this.hospitalTrendAnalysis = hospitalTrendAnalysis; }

    public String getHospitalPerformanceInsights() { return hospitalPerformanceInsights; }
    public void setHospitalPerformanceInsights(String hospitalPerformanceInsights) { this.hospitalPerformanceInsights = hospitalPerformanceInsights; }

    public String getHospitalRecommendations() { return hospitalRecommendations; }
    public void setHospitalRecommendations(String hospitalRecommendations) { this.hospitalRecommendations = hospitalRecommendations; }

    public List<ChartDataPoint> getHospitalAdmissionTrends() { return hospitalAdmissionTrends; }
    public void setHospitalAdmissionTrends(List<ChartDataPoint> hospitalAdmissionTrends) { this.hospitalAdmissionTrends = hospitalAdmissionTrends; }

    public List<ChartDataPoint> getWardComparisonData() { return wardComparisonData; }
    public void setWardComparisonData(List<ChartDataPoint> wardComparisonData) { this.wardComparisonData = wardComparisonData; }
}