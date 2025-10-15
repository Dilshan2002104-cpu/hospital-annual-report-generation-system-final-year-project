package com.HMS.HMS.DTO.reports;

import java.time.LocalDateTime;
import java.util.List;

public class DialysisAnnualReportDTO {
    private int year;
    private String hospitalName;
    private LocalDateTime reportGeneratedDate;
    
    // Summary statistics
    private long totalSessions;
    private long completedSessions;
    private long cancelledSessions;
    private long emergencySessions;
    private double completionRate;
    private double emergencyRate;
    private double averageSessionDuration;
    private int totalPatients;
    private int uniquePatients;
    
    // Monthly data for line charts
    private List<MonthlyDialysisDataDTO> monthlySessions;
    private List<MonthlyDialysisDataDTO> monthlyPatients;
    private List<MonthlyMachineUtilizationDTO> monthlyMachineUtilization;
    
    // Machine performance
    private List<MachinePerformanceDataDTO> machinePerformance;
    
    // Machine-wise patient trends
    private List<MachineWisePatientTrendDTO> machineWisePatientTrends;
    
    // Patient outcomes
    private List<PatientOutcomeDataDTO> patientOutcomes;
    
    // Quality metrics
    private QualityMetricsDTO qualityMetrics;
    
    // Generated text content
    private String introductionText;
    private String trendsAnalysisText;
    private String machineAnalysisText;
    private String patientAnalysisText;
    private String conclusionText;
    
    // Comparison with previous year
    private long previousYearSessions;
    private double yearOverYearChange;

    public DialysisAnnualReportDTO() {
        this.reportGeneratedDate = LocalDateTime.now();
        this.hospitalName = "National Institute for Nephrology, Dialysis & Transplantation";
    }

    // Builder pattern
    public static DialysisAnnualReportBuilder builder() {
        return new DialysisAnnualReportBuilder();
    }

    public static class DialysisAnnualReportBuilder {
        private DialysisAnnualReportDTO report = new DialysisAnnualReportDTO();

        public DialysisAnnualReportBuilder year(int year) {
            report.year = year;
            return this;
        }

        public DialysisAnnualReportBuilder totalSessions(long totalSessions) {
            report.totalSessions = totalSessions;
            return this;
        }

        public DialysisAnnualReportBuilder completedSessions(long completedSessions) {
            report.completedSessions = completedSessions;
            return this;
        }

        public DialysisAnnualReportBuilder cancelledSessions(long cancelledSessions) {
            report.cancelledSessions = cancelledSessions;
            return this;
        }

        public DialysisAnnualReportBuilder emergencySessions(long emergencySessions) {
            report.emergencySessions = emergencySessions;
            return this;
        }

        public DialysisAnnualReportBuilder completionRate(double completionRate) {
            report.completionRate = completionRate;
            return this;
        }

        public DialysisAnnualReportBuilder emergencyRate(double emergencyRate) {
            report.emergencyRate = emergencyRate;
            return this;
        }

        public DialysisAnnualReportBuilder averageSessionDuration(double averageSessionDuration) {
            report.averageSessionDuration = averageSessionDuration;
            return this;
        }

        public DialysisAnnualReportBuilder totalPatients(int totalPatients) {
            report.totalPatients = totalPatients;
            return this;
        }

        public DialysisAnnualReportBuilder uniquePatients(int uniquePatients) {
            report.uniquePatients = uniquePatients;
            return this;
        }

        public DialysisAnnualReportBuilder monthlySessions(List<MonthlyDialysisDataDTO> monthlySessions) {
            report.monthlySessions = monthlySessions;
            return this;
        }

        public DialysisAnnualReportBuilder monthlyPatients(List<MonthlyDialysisDataDTO> monthlyPatients) {
            report.monthlyPatients = monthlyPatients;
            return this;
        }

        public DialysisAnnualReportBuilder monthlyMachineUtilization(List<MonthlyMachineUtilizationDTO> monthlyMachineUtilization) {
            report.monthlyMachineUtilization = monthlyMachineUtilization;
            return this;
        }

        public DialysisAnnualReportBuilder machinePerformance(List<MachinePerformanceDataDTO> machinePerformance) {
            report.machinePerformance = machinePerformance;
            return this;
        }

        public DialysisAnnualReportBuilder machineWisePatientTrends(List<MachineWisePatientTrendDTO> machineWisePatientTrends) {
            report.machineWisePatientTrends = machineWisePatientTrends;
            return this;
        }

        public DialysisAnnualReportBuilder patientOutcomes(List<PatientOutcomeDataDTO> patientOutcomes) {
            report.patientOutcomes = patientOutcomes;
            return this;
        }

        public DialysisAnnualReportBuilder qualityMetrics(QualityMetricsDTO qualityMetrics) {
            report.qualityMetrics = qualityMetrics;
            return this;
        }

        public DialysisAnnualReportBuilder introductionText(String introductionText) {
            report.introductionText = introductionText;
            return this;
        }

        public DialysisAnnualReportBuilder trendsAnalysisText(String trendsAnalysisText) {
            report.trendsAnalysisText = trendsAnalysisText;
            return this;
        }

        public DialysisAnnualReportBuilder machineAnalysisText(String machineAnalysisText) {
            report.machineAnalysisText = machineAnalysisText;
            return this;
        }

        public DialysisAnnualReportBuilder patientAnalysisText(String patientAnalysisText) {
            report.patientAnalysisText = patientAnalysisText;
            return this;
        }

        public DialysisAnnualReportBuilder conclusionText(String conclusionText) {
            report.conclusionText = conclusionText;
            return this;
        }

        public DialysisAnnualReportBuilder previousYearSessions(long previousYearSessions) {
            report.previousYearSessions = previousYearSessions;
            return this;
        }

        public DialysisAnnualReportBuilder yearOverYearChange(double yearOverYearChange) {
            report.yearOverYearChange = yearOverYearChange;
            return this;
        }

        public DialysisAnnualReportDTO build() {
            return report;
        }
    }

    // Getters and setters
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public LocalDateTime getReportGeneratedDate() { return reportGeneratedDate; }
    public void setReportGeneratedDate(LocalDateTime reportGeneratedDate) { this.reportGeneratedDate = reportGeneratedDate; }

    public long getTotalSessions() { return totalSessions; }
    public void setTotalSessions(long totalSessions) { this.totalSessions = totalSessions; }

    public long getCompletedSessions() { return completedSessions; }
    public void setCompletedSessions(long completedSessions) { this.completedSessions = completedSessions; }

    public long getCancelledSessions() { return cancelledSessions; }
    public void setCancelledSessions(long cancelledSessions) { this.cancelledSessions = cancelledSessions; }

    public long getEmergencySessions() { return emergencySessions; }
    public void setEmergencySessions(long emergencySessions) { this.emergencySessions = emergencySessions; }

    public double getCompletionRate() { return completionRate; }
    public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }

    public double getEmergencyRate() { return emergencyRate; }
    public void setEmergencyRate(double emergencyRate) { this.emergencyRate = emergencyRate; }

    public double getAverageSessionDuration() { return averageSessionDuration; }
    public void setAverageSessionDuration(double averageSessionDuration) { this.averageSessionDuration = averageSessionDuration; }

    public int getTotalPatients() { return totalPatients; }
    public void setTotalPatients(int totalPatients) { this.totalPatients = totalPatients; }

    public int getUniquePatients() { return uniquePatients; }
    public void setUniquePatients(int uniquePatients) { this.uniquePatients = uniquePatients; }

    public List<MonthlyDialysisDataDTO> getMonthlySessions() { return monthlySessions; }
    public void setMonthlySessions(List<MonthlyDialysisDataDTO> monthlySessions) { this.monthlySessions = monthlySessions; }

    public List<MonthlyDialysisDataDTO> getMonthlyPatients() { return monthlyPatients; }
    public void setMonthlyPatients(List<MonthlyDialysisDataDTO> monthlyPatients) { this.monthlyPatients = monthlyPatients; }

    public List<MonthlyMachineUtilizationDTO> getMonthlyMachineUtilization() { return monthlyMachineUtilization; }
    public void setMonthlyMachineUtilization(List<MonthlyMachineUtilizationDTO> monthlyMachineUtilization) { this.monthlyMachineUtilization = monthlyMachineUtilization; }

    public List<MachinePerformanceDataDTO> getMachinePerformance() { return machinePerformance; }
    public void setMachinePerformance(List<MachinePerformanceDataDTO> machinePerformance) { this.machinePerformance = machinePerformance; }

    public List<PatientOutcomeDataDTO> getPatientOutcomes() { return patientOutcomes; }
    public void setPatientOutcomes(List<PatientOutcomeDataDTO> patientOutcomes) { this.patientOutcomes = patientOutcomes; }

    public QualityMetricsDTO getQualityMetrics() { return qualityMetrics; }
    public void setQualityMetrics(QualityMetricsDTO qualityMetrics) { this.qualityMetrics = qualityMetrics; }

    public String getIntroductionText() { return introductionText; }
    public void setIntroductionText(String introductionText) { this.introductionText = introductionText; }

    public String getTrendsAnalysisText() { return trendsAnalysisText; }
    public void setTrendsAnalysisText(String trendsAnalysisText) { this.trendsAnalysisText = trendsAnalysisText; }

    public String getMachineAnalysisText() { return machineAnalysisText; }
    public void setMachineAnalysisText(String machineAnalysisText) { this.machineAnalysisText = machineAnalysisText; }

    public String getPatientAnalysisText() { return patientAnalysisText; }
    public void setPatientAnalysisText(String patientAnalysisText) { this.patientAnalysisText = patientAnalysisText; }

    public String getConclusionText() { return conclusionText; }
    public void setConclusionText(String conclusionText) { this.conclusionText = conclusionText; }

    public long getPreviousYearSessions() { return previousYearSessions; }
    public void setPreviousYearSessions(long previousYearSessions) { this.previousYearSessions = previousYearSessions; }

    public double getYearOverYearChange() { return yearOverYearChange; }
    public void setYearOverYearChange(double yearOverYearChange) { this.yearOverYearChange = yearOverYearChange; }

    public List<MachineWisePatientTrendDTO> getMachineWisePatientTrends() { return machineWisePatientTrends; }
    public void setMachineWisePatientTrends(List<MachineWisePatientTrendDTO> machineWisePatientTrends) { this.machineWisePatientTrends = machineWisePatientTrends; }
}