package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.WardStatisticsReportDTO;
import com.HMS.HMS.model.Admission.Admission;
import com.HMS.HMS.model.Patient.Patient;
import com.HMS.HMS.repository.AdmissionRepository;
import com.HMS.HMS.repository.PatientRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.*;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.io.font.constants.StandardFonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WardStatisticsService {

    private final AdmissionRepository admissionRepository;
    private final PatientRepository patientRepository;

    public WardStatisticsService(AdmissionRepository admissionRepository, PatientRepository patientRepository) {
        this.admissionRepository = admissionRepository;
        this.patientRepository = patientRepository;
    }

    public WardStatisticsReportDTO generateWardStatistics(String wardName, int year) {
        WardStatisticsReportDTO report = new WardStatisticsReportDTO(wardName, year);

        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);

        // Get all admissions for the ward in the given year
        List<Admission> allAdmissions = admissionRepository.findAll();

        // Normalize ward name for matching (handle both "Ward1" and "Ward 1" patterns)
        String normalizedWardName = wardName.replaceAll("(Ward)(\\d+)", "Ward $2").trim();
        String alternativeWardName = wardName.replaceAll("(Ward)\\s+(\\d+)", "Ward$2").trim();


        List<Admission> wardAdmissions = allAdmissions.stream()
                .filter(admission -> admission.getWard() != null &&
                       admission.getAdmissionDate() != null &&
                       (admission.getWard().getWardName().equalsIgnoreCase(wardName) ||
                        admission.getWard().getWardName().equalsIgnoreCase(normalizedWardName) ||
                        admission.getWard().getWardName().equalsIgnoreCase(alternativeWardName) ||
                        admission.getWard().getWardName().contains(wardName) ||
                        admission.getWard().getWardName().contains(normalizedWardName)) &&
                       admission.getAdmissionDate().toLocalDate().isAfter(startDate.minusDays(1)) &&
                       admission.getAdmissionDate().toLocalDate().isBefore(endDate.plusDays(1)))
                .collect(Collectors.toList());

        // Calculate core statistics
        calculateCoreStatistics(report, wardAdmissions, year);

        // Calculate performance metrics
        calculatePerformanceMetrics(report, wardAdmissions);

        // Calculate mortality and safety metrics
        calculateMortalityMetrics(report, wardAdmissions);

        // Calculate comparative data
        calculateComparativeData(report, wardName, year);

        // Generate monthly breakdown
        generateMonthlyBreakdown(report, wardAdmissions, year);

        // Generate patient demographics
        generatePatientDemographics(report, wardAdmissions);

        // Generate analysis text
        generateAnalysisText(report);

        // Generate chart data
        generateChartData(report);

        return report;
    }

    private void calculateCoreStatistics(WardStatisticsReportDTO report, List<Admission> admissions, int year) {
        report.setTotalAdmissions(admissions.size());

        long discharges = admissions.stream()
                .filter(a -> a.getDischargeDate() != null && a.getDischargeDate().getYear() == year)
                .count();
        report.setTotalDischarges(discharges);

        long activeAdmissions = admissions.stream()
                .filter(a -> a.getDischargeDate() == null)
                .count();
        report.setCurrentActiveAdmissions(activeAdmissions);

        // Calculate occupancy rate (assuming 20 beds per ward)
        double occupancyRate = activeAdmissions / 20.0 * 100;
        report.setCurrentOccupancyRate(Math.round(occupancyRate * 100.0) / 100.0);

        // Calculate average length of stay
        double avgLOS = admissions.stream()
                .filter(a -> a.getDischargeDate() != null)
                .mapToLong(a -> ChronoUnit.DAYS.between(a.getAdmissionDate().toLocalDate(), a.getDischargeDate().toLocalDate()))
                .average()
                .orElse(0.0);
        report.setAverageLengthOfStay(Math.round(avgLOS * 100.0) / 100.0);

        // Calculate monthly average admissions
        report.setMonthlyAverageAdmissions(Math.round((admissions.size() / 12.0) * 100.0) / 100.0);
    }

    private void calculatePerformanceMetrics(WardStatisticsReportDTO report, List<Admission> admissions) {
        // For now, set transfers to 0 as the model doesn't include transfer data
        report.setTotalTransfersIn(0L);
        report.setTotalTransfersOut(0L);

        // Calculate bed utilization rate
        long totalBedDays = admissions.stream()
                .filter(a -> a.getDischargeDate() != null)
                .mapToLong(a -> ChronoUnit.DAYS.between(a.getAdmissionDate().toLocalDate(), a.getDischargeDate().toLocalDate()))
                .sum();

        double bedUtilizationRate = totalBedDays / (20.0 * 365) * 100;
        report.setBedUtilizationRate(Math.round(bedUtilizationRate * 100.0) / 100.0);

        // Find peak and low months
        Map<Integer, Long> monthlyAdmissions = admissions.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getAdmissionDate().getMonthValue(),
                        Collectors.counting()
                ));

        if (!monthlyAdmissions.isEmpty()) {
            int peakMonth = monthlyAdmissions.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(1);

            int lowMonth = monthlyAdmissions.entrySet().stream()
                    .min(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(1);

            report.setPeakMonthAdmissions(monthlyAdmissions.get(peakMonth).intValue());
            report.setPeakMonthName(Month.of(peakMonth).getDisplayName(TextStyle.FULL, Locale.ENGLISH));

            report.setLowMonthAdmissions(monthlyAdmissions.get(lowMonth).intValue());
            report.setLowMonthName(Month.of(lowMonth).getDisplayName(TextStyle.FULL, Locale.ENGLISH));
        }
    }

    private void calculateMortalityMetrics(WardStatisticsReportDTO report, List<Admission> admissions) {
        // For now, set mortality metrics to 0 as the model doesn't include death data
        report.setTotalDeaths(0L);
        report.setDeathsWithin48Hours(0L);
        report.setMortalityRate(0.0);
        report.setEarlyMortalityRate(0.0);
    }

    private void calculateComparativeData(WardStatisticsReportDTO report, String wardName, int year) {
        LocalDate prevYearStart = LocalDate.of(year - 1, 1, 1);
        LocalDate prevYearEnd = LocalDate.of(year - 1, 12, 31);

        List<Admission> allPrevAdmissions = admissionRepository.findAll();

        // Use same ward name normalization logic
        String normalizedWardName = wardName.replaceAll("(Ward)(\\d+)", "Ward $2").trim();
        String alternativeWardName = wardName.replaceAll("(Ward)\\s+(\\d+)", "Ward$2").trim();

        List<Admission> prevYearAdmissions = allPrevAdmissions.stream()
                .filter(admission -> admission.getWard() != null &&
                       admission.getAdmissionDate() != null &&
                       (admission.getWard().getWardName().equalsIgnoreCase(wardName) ||
                        admission.getWard().getWardName().equalsIgnoreCase(normalizedWardName) ||
                        admission.getWard().getWardName().equalsIgnoreCase(alternativeWardName) ||
                        admission.getWard().getWardName().contains(wardName) ||
                        admission.getWard().getWardName().contains(normalizedWardName)) &&
                       admission.getAdmissionDate().toLocalDate().isAfter(prevYearStart.minusDays(1)) &&
                       admission.getAdmissionDate().toLocalDate().isBefore(prevYearEnd.plusDays(1)))
                .collect(Collectors.toList());

        report.setPreviousYearAdmissions(prevYearAdmissions.size());

        if (prevYearAdmissions.size() > 0) {
            double growth = ((double) report.getTotalAdmissions() - prevYearAdmissions.size()) / prevYearAdmissions.size() * 100;
            report.setYearOverYearGrowth(Math.round(growth * 100.0) / 100.0);
        } else {
            report.setYearOverYearGrowth(0.0);
        }

        // Calculate occupancy trend (simplified)
        report.setOccupancyTrend(report.getYearOverYearGrowth());
    }

    private void generateMonthlyBreakdown(WardStatisticsReportDTO report, List<Admission> admissions, int year) {
        List<WardStatisticsReportDTO.MonthlyWardDataDTO> monthlyData = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            LocalDate monthStart = LocalDate.of(year, month, 1);
            LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());

            List<Admission> monthAdmissions = admissions.stream()
                    .filter(a -> a.getAdmissionDate().toLocalDate().isAfter(monthStart.minusDays(1)) &&
                               a.getAdmissionDate().toLocalDate().isBefore(monthEnd.plusDays(1)))
                    .collect(Collectors.toList());

            long monthDischarges = monthAdmissions.stream()
                    .filter(a -> a.getDischargeDate() != null &&
                               a.getDischargeDate().toLocalDate().isAfter(monthStart.minusDays(1)) &&
                               a.getDischargeDate().toLocalDate().isBefore(monthEnd.plusDays(1)))
                    .count();

            WardStatisticsReportDTO.MonthlyWardDataDTO monthData = new WardStatisticsReportDTO.MonthlyWardDataDTO();
            monthData.setMonth(month);
            monthData.setMonthName(Month.of(month).getDisplayName(TextStyle.FULL, Locale.ENGLISH));
            monthData.setAdmissions(monthAdmissions.size());
            monthData.setDischarges(monthDischarges);
            monthData.setDeaths(0L); // Not implemented yet
            monthData.setAverageOccupancy(monthAdmissions.size() / 20.0 * 100);

            double avgLOS = monthAdmissions.stream()
                    .filter(a -> a.getDischargeDate() != null)
                    .mapToLong(a -> ChronoUnit.DAYS.between(a.getAdmissionDate().toLocalDate(), a.getDischargeDate().toLocalDate()))
                    .average()
                    .orElse(0.0);
            monthData.setAverageLengthOfStay(Math.round(avgLOS * 100.0) / 100.0);

            monthlyData.add(monthData);
        }

        report.setMonthlyData(monthlyData);
    }

    private void generatePatientDemographics(WardStatisticsReportDTO report, List<Admission> admissions) {
        // Get patient demographics
        List<Patient> patients = admissions.stream()
                .map(Admission::getPatient)
                .distinct()
                .collect(Collectors.toList());

        // Age group breakdown
        Map<String, Long> ageGroups = patients.stream()
                .collect(Collectors.groupingBy(
                        patient -> getAgeGroup(patient.getDateOfBirth()),
                        Collectors.counting()
                ));
        report.setAgeGroupBreakdown(ageGroups);

        // Gender breakdown
        Map<String, Long> genderBreakdown = patients.stream()
                .collect(Collectors.groupingBy(
                        Patient::getGender,
                        Collectors.counting()
                ));
        report.setGenderBreakdown(genderBreakdown);
    }

    private String getAgeGroup(LocalDate dateOfBirth) {
        if (dateOfBirth == null) return "Unknown";

        int age = (int) ChronoUnit.YEARS.between(dateOfBirth, LocalDate.now());

        if (age < 18) return "0-17";
        else if (age < 30) return "18-29";
        else if (age < 50) return "30-49";
        else if (age < 65) return "50-64";
        else return "65+";
    }

    private void generateAnalysisText(WardStatisticsReportDTO report) {
        StringBuilder executiveSummary = new StringBuilder();
        executiveSummary.append(String.format("Ward %s processed %d admissions in %d with an average occupancy rate of %.1f%%. ",
                report.getWardName(), report.getTotalAdmissions(), report.getYear(), report.getCurrentOccupancyRate()));

        if (report.getYearOverYearGrowth() > 0) {
            executiveSummary.append(String.format("This represents a %.1f%% increase from the previous year. ", report.getYearOverYearGrowth()));
        } else if (report.getYearOverYearGrowth() < 0) {
            executiveSummary.append(String.format("This represents a %.1f%% decrease from the previous year. ", Math.abs(report.getYearOverYearGrowth())));
        }

        executiveSummary.append(String.format("The average length of stay was %.1f days with peak admissions in %s (%d admissions).",
                report.getAverageLengthOfStay(), report.getPeakMonthName(), report.getPeakMonthAdmissions()));

        report.setExecutiveSummary(executiveSummary.toString());

        // Trend Analysis
        StringBuilder trendAnalysis = new StringBuilder();
        trendAnalysis.append("Monthly admission patterns show ");
        if (report.getPeakMonthAdmissions() > report.getLowMonthAdmissions() * 1.5) {
            trendAnalysis.append("significant seasonal variation with peak demand in ")
                    .append(report.getPeakMonthName())
                    .append(" and lowest demand in ")
                    .append(report.getLowMonthName())
                    .append(". ");
        } else {
            trendAnalysis.append("relatively stable admission patterns throughout the year. ");
        }

        report.setTrendAnalysis(trendAnalysis.toString());

        // Performance Insights
        StringBuilder insights = new StringBuilder();
        if (report.getCurrentOccupancyRate() > 85) {
            insights.append("High occupancy rate indicates strong demand but may impact patient flow. ");
        } else if (report.getCurrentOccupancyRate() < 60) {
            insights.append("Low occupancy rate suggests capacity for additional patients. ");
        } else {
            insights.append("Occupancy rate is within optimal range for efficient operations. ");
        }

        report.setPerformanceInsights(insights.toString());

        // Recommendations
        StringBuilder recommendations = new StringBuilder();
        if (report.getCurrentOccupancyRate() > 85) {
            recommendations.append("Consider capacity expansion or improved discharge planning. ");
        }
        if (report.getAverageLengthOfStay() > 7) {
            recommendations.append("Review care protocols to reduce length of stay. ");
        }
        recommendations.append("Continue monitoring seasonal trends for resource planning.");

        report.setRecommendations(recommendations.toString());
    }

    private void generateChartData(WardStatisticsReportDTO report) {
        List<WardStatisticsReportDTO.ChartDataPoint> admissionTrends = new ArrayList<>();
        List<WardStatisticsReportDTO.ChartDataPoint> occupancyTrends = new ArrayList<>();

        if (report.getMonthlyData() != null) {
            for (WardStatisticsReportDTO.MonthlyWardDataDTO monthData : report.getMonthlyData()) {
                admissionTrends.add(new WardStatisticsReportDTO.ChartDataPoint(
                        monthData.getMonthName(), monthData.getAdmissions(), "admissions"));

                occupancyTrends.add(new WardStatisticsReportDTO.ChartDataPoint(
                        monthData.getMonthName(), monthData.getAverageOccupancy(), "occupancy"));
            }
        }

        report.setAdmissionTrends(admissionTrends);
        report.setOccupancyTrends(occupancyTrends);
    }

    public Map<String, Object> getMonthlyBreakdown(String wardName, int year) {
        WardStatisticsReportDTO report = generateWardStatistics(wardName, year);

        Map<String, Object> result = new HashMap<>();
        result.put("monthlyData", report.getMonthlyData());
        result.put("chartData", report.getAdmissionTrends());

        return result;
    }

    public Map<String, Object> getWardKPIs(String wardName, int year) {
        WardStatisticsReportDTO report = generateWardStatistics(wardName, year);

        Map<String, Object> kpis = new HashMap<>();
        kpis.put("totalAdmissions", report.getTotalAdmissions());
        kpis.put("currentOccupancy", report.getCurrentOccupancyRate());
        kpis.put("averageLengthOfStay", report.getAverageLengthOfStay());
        kpis.put("bedUtilizationRate", report.getBedUtilizationRate());
        kpis.put("monthlyAverage", report.getMonthlyAverageAdmissions());
        kpis.put("yearOverYearGrowth", report.getYearOverYearGrowth());

        return kpis;
    }

    public Map<String, Object> getYearOverYearComparison(String wardName, int year) {
        WardStatisticsReportDTO currentYear = generateWardStatistics(wardName, year);
        WardStatisticsReportDTO previousYear = generateWardStatistics(wardName, year - 1);

        Map<String, Object> comparison = new HashMap<>();
        comparison.put("currentYear", currentYear);
        comparison.put("previousYear", previousYear);
        comparison.put("admissionsChange", currentYear.getTotalAdmissions() - previousYear.getTotalAdmissions());
        comparison.put("occupancyChange", currentYear.getCurrentOccupancyRate() - previousYear.getCurrentOccupancyRate());
        comparison.put("losChange", currentYear.getAverageLengthOfStay() - previousYear.getAverageLengthOfStay());

        return comparison;
    }

    public Map<String, Object> getAllWardsSummary(int year) {
        String[] wardNames = {"Ward 1", "Ward 2", "Ward 3", "Ward 4"};
        Map<String, Object> summary = new HashMap<>();
        List<Map<String, Object>> wardSummaries = new ArrayList<>();

        for (String wardName : wardNames) {
            WardStatisticsReportDTO wardStats = generateWardStatistics(wardName, year);

            Map<String, Object> wardSummary = new HashMap<>();
            wardSummary.put("wardName", wardName);
            wardSummary.put("totalAdmissions", wardStats.getTotalAdmissions());
            wardSummary.put("occupancyRate", wardStats.getCurrentOccupancyRate());
            wardSummary.put("averageLengthOfStay", wardStats.getAverageLengthOfStay());
            wardSummary.put("yearOverYearGrowth", wardStats.getYearOverYearGrowth());

            wardSummaries.add(wardSummary);
        }

        summary.put("wards", wardSummaries);
        summary.put("year", year);
        summary.put("generatedAt", LocalDateTime.now());

        return summary;
    }

    public Map<String, String> generateTrendAnalysis(String wardName, int year) {
        WardStatisticsReportDTO report = generateWardStatistics(wardName, year);

        Map<String, String> trends = new HashMap<>();
        trends.put("trendAnalysis", report.getTrendAnalysis());
        trends.put("performanceInsights", report.getPerformanceInsights());
        trends.put("recommendations", report.getRecommendations());

        return trends;
    }

    public byte[] exportWardStatisticsAsPDF(String wardName, int year) {
        try {
            WardStatisticsReportDTO report = generateWardStatistics(wardName, year);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Define colors and fonts
            DeviceRgb primaryBlue = new DeviceRgb(41, 128, 185);
            DeviceRgb lightBlue = new DeviceRgb(174, 214, 241);
            DeviceRgb darkGray = new DeviceRgb(52, 73, 94);
            DeviceRgb lightGray = new DeviceRgb(236, 240, 241);

            PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont normalFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            // Header Section with Logo Area
            Table headerTable = new Table(UnitValue.createPercentArray(new float[]{20, 60, 20})).useAllAvailableWidth();
            headerTable.setMarginBottom(20);

            // Logo placeholder
            Cell logoCell = new Cell()
                .add(new Paragraph("HMS")
                    .setFont(boldFont)
                    .setFontSize(16)
                    .setFontColor(primaryBlue))
                .setTextAlignment(TextAlignment.LEFT)
                .setBorder(Border.NO_BORDER);
            headerTable.addCell(logoCell);

            // Main title
            Cell titleCell = new Cell()
                .add(new Paragraph(String.format("WARD STATISTICS REPORT"))
                    .setFont(boldFont)
                    .setFontSize(20)
                    .setFontColor(primaryBlue)
                    .setTextAlignment(TextAlignment.CENTER))
                .add(new Paragraph(String.format("%s - %d", wardName, year))
                    .setFont(boldFont)
                    .setFontSize(16)
                    .setFontColor(darkGray)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(5))
                .setBorder(Border.NO_BORDER);
            headerTable.addCell(titleCell);

            // Date
            Cell dateCell = new Cell()
                .add(new Paragraph("Generated:")
                    .setFont(normalFont)
                    .setFontSize(8)
                    .setFontColor(darkGray))
                .add(new Paragraph(report.getGeneratedAt().toLocalDate().toString())
                    .setFont(boldFont)
                    .setFontSize(9)
                    .setFontColor(darkGray))
                .setTextAlignment(TextAlignment.RIGHT)
                .setBorder(Border.NO_BORDER);
            headerTable.addCell(dateCell);

            document.add(headerTable);

            // Add separator line
            document.add(new LineSeparator(new SolidLine(1f)).setMarginBottom(20));

            // Executive Summary Section
            addSectionHeader(document, "EXECUTIVE SUMMARY", primaryBlue, boldFont);

            Table summaryBox = new Table(UnitValue.createPercentArray(1)).useAllAvailableWidth();
            Cell summaryCell = new Cell()
                .add(new Paragraph(report.getExecutiveSummary())
                    .setFont(normalFont)
                    .setFontSize(11)
                    .setMarginBottom(0))
                .setBackgroundColor(lightGray)
                .setPadding(15)
                .setBorder(new SolidBorder(lightBlue, 1));
            summaryBox.addCell(summaryCell);
            document.add(summaryBox);
            document.add(new Paragraph().setMarginBottom(20));

            // Key Performance Indicators
            addSectionHeader(document, "KEY PERFORMANCE INDICATORS", primaryBlue, boldFont);

            Table kpiTable = new Table(UnitValue.createPercentArray(new float[]{40, 20, 40, 20})).useAllAvailableWidth();
            kpiTable.setMarginBottom(20);

            // KPI Cards
            addKPICard(kpiTable, "Total Admissions", String.valueOf(report.getTotalAdmissions()), primaryBlue, normalFont, boldFont);
            addKPICard(kpiTable, "Current Occupancy", String.format("%.1f%%", report.getCurrentOccupancyRate()), new DeviceRgb(231, 76, 60), normalFont, boldFont);
            addKPICard(kpiTable, "Avg Length of Stay", String.format("%.1f days", report.getAverageLengthOfStay()), new DeviceRgb(46, 204, 113), normalFont, boldFont);
            addKPICard(kpiTable, "YoY Growth", String.format("%.1f%%", report.getYearOverYearGrowth()), new DeviceRgb(155, 89, 182), normalFont, boldFont);

            document.add(kpiTable);

            // Monthly Performance Analysis
            addSectionHeader(document, "MONTHLY PERFORMANCE ANALYSIS", primaryBlue, boldFont);

            Table monthlyTable = new Table(UnitValue.createPercentArray(new float[]{25, 20, 20, 20, 15})).useAllAvailableWidth();
            monthlyTable.setMarginBottom(20);

            // Headers with styling
            String[] headers = {"Month", "Admissions", "Discharges", "Avg Occupancy", "Avg LOS"};
            for (String header : headers) {
                Cell headerCell = new Cell()
                    .add(new Paragraph(header)
                        .setFont(boldFont)
                        .setFontSize(10)
                        .setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(primaryBlue)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(8);
                monthlyTable.addHeaderCell(headerCell);
            }

            // Monthly data rows
            if (report.getMonthlyData() != null) {
                boolean isEvenRow = false;
                for (WardStatisticsReportDTO.MonthlyWardDataDTO monthData : report.getMonthlyData()) {
                    DeviceRgb rowColor = isEvenRow ? new DeviceRgb(255, 255, 255) : lightGray;

                    addMonthlyDataRow(monthlyTable, monthData.getMonthName(), rowColor, normalFont);
                    addMonthlyDataRow(monthlyTable, String.valueOf(monthData.getAdmissions()), rowColor, normalFont);
                    addMonthlyDataRow(monthlyTable, String.valueOf(monthData.getDischarges()), rowColor, normalFont);
                    addMonthlyDataRow(monthlyTable, String.format("%.1f%%", monthData.getAverageOccupancy()), rowColor, normalFont);
                    addMonthlyDataRow(monthlyTable, String.format("%.1f", monthData.getAverageLengthOfStay()), rowColor, normalFont);

                    isEvenRow = !isEvenRow;
                }
            }

            document.add(monthlyTable);

            // Patient Demographics
            addSectionHeader(document, "PATIENT DEMOGRAPHICS", primaryBlue, boldFont);

            Table demoTable = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth();
            demoTable.setMarginBottom(20);

            // Gender breakdown
            Cell genderCell = new Cell()
                .add(new Paragraph("Gender Distribution")
                    .setFont(boldFont)
                    .setFontSize(12)
                    .setMarginBottom(10))
                .setBackgroundColor(lightGray)
                .setPadding(10);

            if (report.getGenderBreakdown() != null) {
                for (Map.Entry<String, Long> entry : report.getGenderBreakdown().entrySet()) {
                    genderCell.add(new Paragraph(String.format("• %s: %d patients", entry.getKey(), entry.getValue()))
                        .setFont(normalFont)
                        .setFontSize(10)
                        .setMarginBottom(3));
                }
            }
            demoTable.addCell(genderCell);

            // Age group breakdown
            Cell ageCell = new Cell()
                .add(new Paragraph("Age Group Distribution")
                    .setFont(boldFont)
                    .setFontSize(12)
                    .setMarginBottom(10))
                .setBackgroundColor(lightGray)
                .setPadding(10);

            if (report.getAgeGroupBreakdown() != null) {
                for (Map.Entry<String, Long> entry : report.getAgeGroupBreakdown().entrySet()) {
                    ageCell.add(new Paragraph(String.format("• %s years: %d patients", entry.getKey(), entry.getValue()))
                        .setFont(normalFont)
                        .setFontSize(10)
                        .setMarginBottom(3));
                }
            }
            demoTable.addCell(ageCell);

            document.add(demoTable);

            // Trend Analysis & Insights
            addSectionHeader(document, "TREND ANALYSIS & INSIGHTS", primaryBlue, boldFont);

            // Trend Analysis
            addInsightBox(document, "Trend Analysis", report.getTrendAnalysis(), new DeviceRgb(52, 152, 219), normalFont, boldFont);

            // Performance Insights
            addInsightBox(document, "Performance Insights", report.getPerformanceInsights(), new DeviceRgb(46, 204, 113), normalFont, boldFont);

            // Recommendations
            addInsightBox(document, "Recommendations", report.getRecommendations(), new DeviceRgb(155, 89, 182), normalFont, boldFont);

            // Footer
            document.add(new Paragraph().setMarginTop(30));
            document.add(new LineSeparator(new SolidLine(0.5f)));

            Table footerTable = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth();
            footerTable.setMarginTop(10);

            Cell footerLeft = new Cell()
                .add(new Paragraph("Hospital Management System")
                    .setFont(boldFont)
                    .setFontSize(10)
                    .setFontColor(primaryBlue))
                .add(new Paragraph("Ward Analytics Module")
                    .setFont(normalFont)
                    .setFontSize(8)
                    .setFontColor(darkGray))
                .setBorder(Border.NO_BORDER);
            footerTable.addCell(footerLeft);

            Cell footerRight = new Cell()
                .add(new Paragraph("Confidential Document")
                    .setFont(boldFont)
                    .setFontSize(8)
                    .setFontColor(new DeviceRgb(231, 76, 60)))
                .add(new Paragraph("For Internal Use Only")
                    .setFont(normalFont)
                    .setFontSize(8)
                    .setFontColor(darkGray))
                .setTextAlignment(TextAlignment.RIGHT)
                .setBorder(Border.NO_BORDER);
            footerTable.addCell(footerRight);

            document.add(footerTable);

            document.close();
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }
    }

    private void addSectionHeader(Document document, String title, DeviceRgb color, PdfFont boldFont) {
        Paragraph header = new Paragraph(title)
            .setFont(boldFont)
            .setFontSize(14)
            .setFontColor(color)
            .setMarginTop(15)
            .setMarginBottom(10);
        document.add(header);
    }

    private void addKPICard(Table table, String label, String value, DeviceRgb color, PdfFont normalFont, PdfFont boldFont) {
        // Label cell
        Cell labelCell = new Cell()
            .add(new Paragraph(label)
                .setFont(normalFont)
                .setFontSize(10)
                .setFontColor(new DeviceRgb(52, 73, 94)))
            .setBackgroundColor(new DeviceRgb(236, 240, 241))
            .setPadding(8)
            .setTextAlignment(TextAlignment.CENTER)
            .setBorder(new SolidBorder(color, 1));
        table.addCell(labelCell);

        // Value cell
        Cell valueCell = new Cell()
            .add(new Paragraph(value)
                .setFont(boldFont)
                .setFontSize(16)
                .setFontColor(color))
            .setBackgroundColor(ColorConstants.WHITE)
            .setPadding(8)
            .setTextAlignment(TextAlignment.CENTER)
            .setBorder(new SolidBorder(color, 1));
        table.addCell(valueCell);
    }

    private void addMonthlyDataRow(Table table, String data, DeviceRgb backgroundColor, PdfFont font) {
        Cell cell = new Cell()
            .add(new Paragraph(data)
                .setFont(font)
                .setFontSize(9))
            .setBackgroundColor(backgroundColor)
            .setTextAlignment(TextAlignment.CENTER)
            .setPadding(6);
        table.addCell(cell);
    }

    private void addInsightBox(Document document, String title, String content, DeviceRgb color, PdfFont normalFont, PdfFont boldFont) {
        Table insightTable = new Table(UnitValue.createPercentArray(1)).useAllAvailableWidth();
        insightTable.setMarginBottom(15);

        Cell insightCell = new Cell()
            .add(new Paragraph(title)
                .setFont(boldFont)
                .setFontSize(12)
                .setFontColor(ColorConstants.WHITE)
                .setMarginBottom(8))
            .add(new Paragraph(content)
                .setFont(normalFont)
                .setFontSize(10)
                .setFontColor(ColorConstants.WHITE)
                .setMarginBottom(0))
            .setBackgroundColor(color)
            .setPadding(12)
            .setBorder(Border.NO_BORDER);

        insightTable.addCell(insightCell);
        document.add(insightTable);
    }

    private void addTableRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()));
        table.addCell(new Cell().add(new Paragraph(value)));
    }

    private void addTableHeader(Table table, String header) {
        table.addHeaderCell(new Cell().add(new Paragraph(header).setBold()));
    }
}