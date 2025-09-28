package com.HMS.HMS.DTO.reports;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class WardStatisticsReportDTO {

    // Basic Info
    private String wardName;
    private int year;
    private LocalDateTime generatedAt;

    // Core Statistics
    private long totalAdmissions;
    private long totalDischarges;
    private long currentActiveAdmissions;
    private double currentOccupancyRate;
    private double averageLengthOfStay;
    private double monthlyAverageAdmissions;

    // Performance Metrics
    private long totalTransfersIn;
    private long totalTransfersOut;
    private double bedUtilizationRate;
    private int peakMonthAdmissions;
    private String peakMonthName;
    private int lowMonthAdmissions;
    private String lowMonthName;

    // Mortality & Safety
    private long totalDeaths;
    private long deathsWithin48Hours;
    private double mortalityRate;
    private double earlyMortalityRate;

    // Comparative Data
    private long previousYearAdmissions;
    private double yearOverYearGrowth;
    private double occupancyTrend;

    // Monthly Breakdown
    private List<MonthlyWardDataDTO> monthlyData;

    // Patient Demographics
    private Map<String, Long> ageGroupBreakdown;
    private Map<String, Long> genderBreakdown;

    // Analysis Text
    private String executiveSummary;
    private String trendAnalysis;
    private String performanceInsights;
    private String recommendations;

    // Charts Data
    private List<ChartDataPoint> admissionTrends;
    private List<ChartDataPoint> occupancyTrends;

    // Default constructor
    public WardStatisticsReportDTO() {
        this.generatedAt = LocalDateTime.now();
    }

    // Constructor with basic data
    public WardStatisticsReportDTO(String wardName, int year) {
        this();
        this.wardName = wardName;
        this.year = year;
    }

    // Inner class for monthly data
    public static class MonthlyWardDataDTO {
        private int month;
        private String monthName;
        private long admissions;
        private long discharges;
        private long deaths;
        private double averageOccupancy;
        private double averageLengthOfStay;

        // Constructors
        public MonthlyWardDataDTO() {}

        public MonthlyWardDataDTO(int month, String monthName, long admissions, long discharges) {
            this.month = month;
            this.monthName = monthName;
            this.admissions = admissions;
            this.discharges = discharges;
        }

        // Getters and Setters
        public int getMonth() { return month; }
        public void setMonth(int month) { this.month = month; }

        public String getMonthName() { return monthName; }
        public void setMonthName(String monthName) { this.monthName = monthName; }

        public long getAdmissions() { return admissions; }
        public void setAdmissions(long admissions) { this.admissions = admissions; }

        public long getDischarges() { return discharges; }
        public void setDischarges(long discharges) { this.discharges = discharges; }

        public long getDeaths() { return deaths; }
        public void setDeaths(long deaths) { this.deaths = deaths; }

        public double getAverageOccupancy() { return averageOccupancy; }
        public void setAverageOccupancy(double averageOccupancy) { this.averageOccupancy = averageOccupancy; }

        public double getAverageLengthOfStay() { return averageLengthOfStay; }
        public void setAverageLengthOfStay(double averageLengthOfStay) { this.averageLengthOfStay = averageLengthOfStay; }
    }

    // Inner class for chart data
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
    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public long getTotalAdmissions() { return totalAdmissions; }
    public void setTotalAdmissions(long totalAdmissions) { this.totalAdmissions = totalAdmissions; }

    public long getTotalDischarges() { return totalDischarges; }
    public void setTotalDischarges(long totalDischarges) { this.totalDischarges = totalDischarges; }

    public long getCurrentActiveAdmissions() { return currentActiveAdmissions; }
    public void setCurrentActiveAdmissions(long currentActiveAdmissions) { this.currentActiveAdmissions = currentActiveAdmissions; }

    public double getCurrentOccupancyRate() { return currentOccupancyRate; }
    public void setCurrentOccupancyRate(double currentOccupancyRate) { this.currentOccupancyRate = currentOccupancyRate; }

    public double getAverageLengthOfStay() { return averageLengthOfStay; }
    public void setAverageLengthOfStay(double averageLengthOfStay) { this.averageLengthOfStay = averageLengthOfStay; }

    public double getMonthlyAverageAdmissions() { return monthlyAverageAdmissions; }
    public void setMonthlyAverageAdmissions(double monthlyAverageAdmissions) { this.monthlyAverageAdmissions = monthlyAverageAdmissions; }

    public long getTotalTransfersIn() { return totalTransfersIn; }
    public void setTotalTransfersIn(long totalTransfersIn) { this.totalTransfersIn = totalTransfersIn; }

    public long getTotalTransfersOut() { return totalTransfersOut; }
    public void setTotalTransfersOut(long totalTransfersOut) { this.totalTransfersOut = totalTransfersOut; }

    public double getBedUtilizationRate() { return bedUtilizationRate; }
    public void setBedUtilizationRate(double bedUtilizationRate) { this.bedUtilizationRate = bedUtilizationRate; }

    public int getPeakMonthAdmissions() { return peakMonthAdmissions; }
    public void setPeakMonthAdmissions(int peakMonthAdmissions) { this.peakMonthAdmissions = peakMonthAdmissions; }

    public String getPeakMonthName() { return peakMonthName; }
    public void setPeakMonthName(String peakMonthName) { this.peakMonthName = peakMonthName; }

    public int getLowMonthAdmissions() { return lowMonthAdmissions; }
    public void setLowMonthAdmissions(int lowMonthAdmissions) { this.lowMonthAdmissions = lowMonthAdmissions; }

    public String getLowMonthName() { return lowMonthName; }
    public void setLowMonthName(String lowMonthName) { this.lowMonthName = lowMonthName; }

    public long getTotalDeaths() { return totalDeaths; }
    public void setTotalDeaths(long totalDeaths) { this.totalDeaths = totalDeaths; }

    public long getDeathsWithin48Hours() { return deathsWithin48Hours; }
    public void setDeathsWithin48Hours(long deathsWithin48Hours) { this.deathsWithin48Hours = deathsWithin48Hours; }

    public double getMortalityRate() { return mortalityRate; }
    public void setMortalityRate(double mortalityRate) { this.mortalityRate = mortalityRate; }

    public double getEarlyMortalityRate() { return earlyMortalityRate; }
    public void setEarlyMortalityRate(double earlyMortalityRate) { this.earlyMortalityRate = earlyMortalityRate; }

    public long getPreviousYearAdmissions() { return previousYearAdmissions; }
    public void setPreviousYearAdmissions(long previousYearAdmissions) { this.previousYearAdmissions = previousYearAdmissions; }

    public double getYearOverYearGrowth() { return yearOverYearGrowth; }
    public void setYearOverYearGrowth(double yearOverYearGrowth) { this.yearOverYearGrowth = yearOverYearGrowth; }

    public double getOccupancyTrend() { return occupancyTrend; }
    public void setOccupancyTrend(double occupancyTrend) { this.occupancyTrend = occupancyTrend; }

    public List<MonthlyWardDataDTO> getMonthlyData() { return monthlyData; }
    public void setMonthlyData(List<MonthlyWardDataDTO> monthlyData) { this.monthlyData = monthlyData; }

    public Map<String, Long> getAgeGroupBreakdown() { return ageGroupBreakdown; }
    public void setAgeGroupBreakdown(Map<String, Long> ageGroupBreakdown) { this.ageGroupBreakdown = ageGroupBreakdown; }

    public Map<String, Long> getGenderBreakdown() { return genderBreakdown; }
    public void setGenderBreakdown(Map<String, Long> genderBreakdown) { this.genderBreakdown = genderBreakdown; }

    public String getExecutiveSummary() { return executiveSummary; }
    public void setExecutiveSummary(String executiveSummary) { this.executiveSummary = executiveSummary; }

    public String getTrendAnalysis() { return trendAnalysis; }
    public void setTrendAnalysis(String trendAnalysis) { this.trendAnalysis = trendAnalysis; }

    public String getPerformanceInsights() { return performanceInsights; }
    public void setPerformanceInsights(String performanceInsights) { this.performanceInsights = performanceInsights; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public List<ChartDataPoint> getAdmissionTrends() { return admissionTrends; }
    public void setAdmissionTrends(List<ChartDataPoint> admissionTrends) { this.admissionTrends = admissionTrends; }

    public List<ChartDataPoint> getOccupancyTrends() { return occupancyTrends; }
    public void setOccupancyTrends(List<ChartDataPoint> occupancyTrends) { this.occupancyTrends = occupancyTrends; }
}