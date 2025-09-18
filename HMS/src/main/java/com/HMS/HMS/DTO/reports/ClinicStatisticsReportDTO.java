package com.HMS.HMS.DTO.reports;

import java.time.LocalDateTime;
import java.util.List;

public class ClinicStatisticsReportDTO {
    private int year;
    private String hospitalName;
    private LocalDateTime reportGeneratedDate;
    private long totalAppointments;
    private long totalAdmissions;
    private double monthlyAverageAppointments;
    private double monthlyAverageAdmissions;
    private List<MonthlyVisitDataDTO> monthlyAppointments;
    private List<MonthlyVisitDataDTO> monthlyAdmissions;
    private List<SpecializationDataDTO> specializationBreakdown;
    private List<WardOccupancyDataDTO> wardOccupancy;
    private String introductionText;
    private String trendsAnalysisText;
    private String impactAnalysisText;
    private String conclusionText;
    private long previousYearAppointments;
    private double yearOverYearChangeAppointments;

    public ClinicStatisticsReportDTO() {
        this.reportGeneratedDate = LocalDateTime.now();
        this.hospitalName = "National Institute for Nephrology, Dialysis & Transplantation";
    }

    // Builder pattern methods
    public static ClinicStatisticsReportBuilder builder() {
        return new ClinicStatisticsReportBuilder();
    }

    public static class ClinicStatisticsReportBuilder {
        private ClinicStatisticsReportDTO report = new ClinicStatisticsReportDTO();

        public ClinicStatisticsReportBuilder year(int year) {
            report.year = year;
            return this;
        }

        public ClinicStatisticsReportBuilder totalAppointments(long totalAppointments) {
            report.totalAppointments = totalAppointments;
            report.monthlyAverageAppointments = totalAppointments / 12.0;
            return this;
        }

        public ClinicStatisticsReportBuilder totalAdmissions(long totalAdmissions) {
            report.totalAdmissions = totalAdmissions;
            report.monthlyAverageAdmissions = totalAdmissions / 12.0;
            return this;
        }

        public ClinicStatisticsReportBuilder monthlyAppointments(List<MonthlyVisitDataDTO> monthlyAppointments) {
            report.monthlyAppointments = monthlyAppointments;
            return this;
        }

        public ClinicStatisticsReportBuilder monthlyAdmissions(List<MonthlyVisitDataDTO> monthlyAdmissions) {
            report.monthlyAdmissions = monthlyAdmissions;
            return this;
        }

        public ClinicStatisticsReportBuilder specializationBreakdown(List<SpecializationDataDTO> specializationBreakdown) {
            report.specializationBreakdown = specializationBreakdown;
            return this;
        }

        public ClinicStatisticsReportBuilder wardOccupancy(List<WardOccupancyDataDTO> wardOccupancy) {
            report.wardOccupancy = wardOccupancy;
            return this;
        }

        public ClinicStatisticsReportBuilder introductionText(String introductionText) {
            report.introductionText = introductionText;
            return this;
        }

        public ClinicStatisticsReportBuilder trendsAnalysisText(String trendsAnalysisText) {
            report.trendsAnalysisText = trendsAnalysisText;
            return this;
        }

        public ClinicStatisticsReportBuilder impactAnalysisText(String impactAnalysisText) {
            report.impactAnalysisText = impactAnalysisText;
            return this;
        }

        public ClinicStatisticsReportBuilder conclusionText(String conclusionText) {
            report.conclusionText = conclusionText;
            return this;
        }

        public ClinicStatisticsReportBuilder previousYearAppointments(long previousYearAppointments) {
            report.previousYearAppointments = previousYearAppointments;
            if (previousYearAppointments > 0) {
                report.yearOverYearChangeAppointments =
                    ((double) (report.totalAppointments - previousYearAppointments) / previousYearAppointments) * 100;
            }
            return this;
        }

        public ClinicStatisticsReportDTO build() {
            return report;
        }
    }

    // Getters and Setters
    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public LocalDateTime getReportGeneratedDate() {
        return reportGeneratedDate;
    }

    public void setReportGeneratedDate(LocalDateTime reportGeneratedDate) {
        this.reportGeneratedDate = reportGeneratedDate;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
        this.monthlyAverageAppointments = totalAppointments / 12.0;
    }

    public long getTotalAdmissions() {
        return totalAdmissions;
    }

    public void setTotalAdmissions(long totalAdmissions) {
        this.totalAdmissions = totalAdmissions;
        this.monthlyAverageAdmissions = totalAdmissions / 12.0;
    }

    public double getMonthlyAverageAppointments() {
        return monthlyAverageAppointments;
    }

    public double getMonthlyAverageAdmissions() {
        return monthlyAverageAdmissions;
    }

    public List<MonthlyVisitDataDTO> getMonthlyAppointments() {
        return monthlyAppointments;
    }

    public void setMonthlyAppointments(List<MonthlyVisitDataDTO> monthlyAppointments) {
        this.monthlyAppointments = monthlyAppointments;
    }

    public List<MonthlyVisitDataDTO> getMonthlyAdmissions() {
        return monthlyAdmissions;
    }

    public void setMonthlyAdmissions(List<MonthlyVisitDataDTO> monthlyAdmissions) {
        this.monthlyAdmissions = monthlyAdmissions;
    }

    public List<SpecializationDataDTO> getSpecializationBreakdown() {
        return specializationBreakdown;
    }

    public void setSpecializationBreakdown(List<SpecializationDataDTO> specializationBreakdown) {
        this.specializationBreakdown = specializationBreakdown;
    }

    public List<WardOccupancyDataDTO> getWardOccupancy() {
        return wardOccupancy;
    }

    public void setWardOccupancy(List<WardOccupancyDataDTO> wardOccupancy) {
        this.wardOccupancy = wardOccupancy;
    }

    public String getIntroductionText() {
        return introductionText;
    }

    public void setIntroductionText(String introductionText) {
        this.introductionText = introductionText;
    }

    public String getTrendsAnalysisText() {
        return trendsAnalysisText;
    }

    public void setTrendsAnalysisText(String trendsAnalysisText) {
        this.trendsAnalysisText = trendsAnalysisText;
    }

    public String getImpactAnalysisText() {
        return impactAnalysisText;
    }

    public void setImpactAnalysisText(String impactAnalysisText) {
        this.impactAnalysisText = impactAnalysisText;
    }

    public String getConclusionText() {
        return conclusionText;
    }

    public void setConclusionText(String conclusionText) {
        this.conclusionText = conclusionText;
    }

    public long getPreviousYearAppointments() {
        return previousYearAppointments;
    }

    public void setPreviousYearAppointments(long previousYearAppointments) {
        this.previousYearAppointments = previousYearAppointments;
        if (previousYearAppointments > 0) {
            this.yearOverYearChangeAppointments =
                ((double) (this.totalAppointments - previousYearAppointments) / previousYearAppointments) * 100;
        }
    }

    public double getYearOverYearChangeAppointments() {
        return yearOverYearChangeAppointments;
    }

    public void setYearOverYearChangeAppointments(double yearOverYearChangeAppointments) {
        this.yearOverYearChangeAppointments = yearOverYearChangeAppointments;
    }
}