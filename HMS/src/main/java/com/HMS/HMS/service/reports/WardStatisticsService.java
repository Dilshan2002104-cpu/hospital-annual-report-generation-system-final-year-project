package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.WardStatisticsReportDTO;
import com.HMS.HMS.DTO.reports.HospitalWideStatisticsDTO;
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
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.properties.*;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.geom.Rectangle;
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

    public WardStatisticsService(AdmissionRepository admissionRepository, PatientRepository patientRepository) {
        this.admissionRepository = admissionRepository;
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

            // All Wards Performance Analysis
            addSectionHeader(document, "ALL WARDS PERFORMANCE ANALYSIS", primaryBlue, boldFont);

            Table wardsTable = new Table(UnitValue.createPercentArray(new float[]{25, 15, 15, 15, 15, 15})).useAllAvailableWidth();
            wardsTable.setMarginBottom(20);

            // Headers with styling
            String[] headers = {"Ward Name", "Type", "Admissions", "Occupancy", "Avg LOS", "YoY Growth"};
            for (String header : headers) {
                Cell headerCell = new Cell()
                    .add(new Paragraph(header)
                        .setFont(boldFont)
                        .setFontSize(10)
                        .setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(primaryBlue)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(8);
                wardsTable.addHeaderCell(headerCell);
            }

            // Get data for all 4 wards
            String[] wardNames = {"Ward 1", "Ward 2", "Ward 3", "Ward 4"};
            String[] wardTypes = {"General", "General", "ICU", "Dialysis"};
            DeviceRgb[] wardColors = {
                new DeviceRgb(46, 204, 113),    // Green for General
                new DeviceRgb(46, 204, 113),    // Green for General
                new DeviceRgb(231, 76, 60),     // Red for ICU
                new DeviceRgb(155, 89, 182)     // Purple for Dialysis
            };

            boolean isEvenRow = false;
            for (int i = 0; i < wardNames.length; i++) {
                try {
                    WardStatisticsReportDTO wardStats = generateWardStatistics(wardNames[i], year);
                    DeviceRgb rowColor = isEvenRow ? new DeviceRgb(255, 255, 255) : lightGray;

                    // Ward Name with color coding
                    Cell wardNameCell = new Cell()
                        .add(new Paragraph(wardNames[i])
                            .setFont(boldFont)
                            .setFontSize(9)
                            .setFontColor(wardColors[i]))
                        .setBackgroundColor(rowColor)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setPadding(6);
                    wardsTable.addCell(wardNameCell);

                    // Ward Type
                    addWardDataRow(wardsTable, wardTypes[i], rowColor, normalFont);

                    // Admissions
                    addWardDataRow(wardsTable, String.valueOf(wardStats.getTotalAdmissions()), rowColor, normalFont);

                    // Occupancy
                    addWardDataRow(wardsTable, String.format("%.1f%%", wardStats.getCurrentOccupancyRate()), rowColor, normalFont);

                    // Avg LOS
                    addWardDataRow(wardsTable, String.format("%.1f days", wardStats.getAverageLengthOfStay()), rowColor, normalFont);

                    // YoY Growth
                    String growthText = wardStats.getYearOverYearGrowth() >= 0 ?
                        String.format("+%.1f%%", wardStats.getYearOverYearGrowth()) :
                        String.format("%.1f%%", wardStats.getYearOverYearGrowth());
                    addWardDataRow(wardsTable, growthText, rowColor, normalFont);

                    isEvenRow = !isEvenRow;
                } catch (Exception e) {
                    // If ward has no data, show zeros
                    DeviceRgb rowColor = isEvenRow ? new DeviceRgb(255, 255, 255) : lightGray;

                    Cell wardNameCell = new Cell()
                        .add(new Paragraph(wardNames[i])
                            .setFont(boldFont)
                            .setFontSize(9)
                            .setFontColor(wardColors[i]))
                        .setBackgroundColor(rowColor)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setPadding(6);
                    wardsTable.addCell(wardNameCell);

                    addWardDataRow(wardsTable, wardTypes[i], rowColor, normalFont);
                    addWardDataRow(wardsTable, "0", rowColor, normalFont);
                    addWardDataRow(wardsTable, "0.0%", rowColor, normalFont);
                    addWardDataRow(wardsTable, "0.0 days", rowColor, normalFont);
                    addWardDataRow(wardsTable, "0.0%", rowColor, normalFont);

                    isEvenRow = !isEvenRow;
                }
            }

            document.add(wardsTable);

            // Monthly Performance Analysis for all wards
            addSectionHeader(document, "MONTHLY PERFORMANCE ANALYSIS - ALL WARDS", primaryBlue, boldFont);

            Table monthlyTable = new Table(UnitValue.createPercentArray(new float[]{15, 17, 17, 17, 17, 17})).useAllAvailableWidth();
            monthlyTable.setMarginBottom(20);

            // Headers with styling
            String[] monthlyHeaders = {"Month", "Ward 1", "Ward 2", "Ward 3", "Ward 4", "Total"};
            DeviceRgb[] headerColors = {
                primaryBlue,                   // Month
                new DeviceRgb(46, 204, 113),  // Ward 1 (General) - Green
                new DeviceRgb(46, 204, 113),  // Ward 2 (General) - Green
                new DeviceRgb(231, 76, 60),   // Ward 3 (ICU) - Red
                new DeviceRgb(155, 89, 182),  // Ward 4 (Dialysis) - Purple
                primaryBlue                   // Total
            };

            for (int i = 0; i < monthlyHeaders.length; i++) {
                Cell headerCell = new Cell()
                    .add(new Paragraph(monthlyHeaders[i])
                        .setFont(boldFont)
                        .setFontSize(10)
                        .setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(headerColors[i])
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(8);
                monthlyTable.addHeaderCell(headerCell);
            }

            // Generate monthly data for all wards
            String[] allWardNames = {"Ward 1", "Ward 2", "Ward 3", "Ward 4"};

            // Get monthly data for all wards
            Map<String, List<WardStatisticsReportDTO.MonthlyWardDataDTO>> allWardsMonthlyData = new HashMap<>();
            for (String ward : allWardNames) {
                try {
                    WardStatisticsReportDTO wardReport = generateWardStatistics(ward, year);
                    allWardsMonthlyData.put(ward, wardReport.getMonthlyData());
                } catch (Exception e) {
                    allWardsMonthlyData.put(ward, new ArrayList<>());
                }
            }

            // Create rows for each month
            String[] monthNames = {"January", "February", "March", "April", "May", "June",
                                 "July", "August", "September", "October", "November", "December"};

            boolean isEvenMonthRow = false;
            for (int monthIndex = 0; monthIndex < 12; monthIndex++) {
                DeviceRgb rowColor = isEvenMonthRow ? new DeviceRgb(255, 255, 255) : lightGray;

                // Month name
                addMonthlyDataRow(monthlyTable, monthNames[monthIndex], rowColor, boldFont);

                long totalAdmissions = 0;

                // Data for each ward
                for (String ward : allWardNames) {
                    List<WardStatisticsReportDTO.MonthlyWardDataDTO> monthlyData = allWardsMonthlyData.get(ward);
                    long admissions = 0;

                    if (monthlyData != null && monthIndex < monthlyData.size()) {
                        admissions = monthlyData.get(monthIndex).getAdmissions();
                    }

                    totalAdmissions += admissions;
                    addMonthlyDataRow(monthlyTable, String.valueOf(admissions), rowColor, normalFont);
                }

                // Total column
                addMonthlyDataRow(monthlyTable, String.valueOf(totalAdmissions), rowColor, boldFont);

                isEvenMonthRow = !isEvenMonthRow;
            }

            document.add(monthlyTable);

            // Monthly Admission Trends Chart
            addSectionHeader(document, "MONTHLY ADMISSION TRENDS", primaryBlue, boldFont);

            try {
                byte[] chartBytes = generateMonthlyAdmissionChart(report, 400, 200);
                if (chartBytes != null) {
                    Image chartImage = new Image(ImageDataFactory.create(chartBytes));
                    chartImage.setWidth(400);
                    chartImage.setHeight(200);
                    chartImage.setHorizontalAlignment(HorizontalAlignment.CENTER);
                    document.add(chartImage);
                    document.add(new Paragraph().setMarginBottom(20));
                }
            } catch (Exception e) {
                // If chart generation fails, continue without chart
                document.add(new Paragraph("Chart generation temporarily unavailable")
                    .setFont(normalFont)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));
            }

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

    private void addWardDataRow(Table table, String data, DeviceRgb backgroundColor, PdfFont font) {
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

    // New methods for hospital-wide statistics
    public HospitalWideStatisticsDTO generateHospitalWideStatistics(int year) {
        HospitalWideStatisticsDTO hospitalReport = new HospitalWideStatisticsDTO(year);

        // Define all ward names
        String[] wardNames = {"Ward1", "Ward2", "Ward3", "Ward4"};
        List<WardStatisticsReportDTO> wardReports = new ArrayList<>();

        // Generate individual ward reports
        long totalHospitalAdmissions = 0;
        long totalHospitalDischarges = 0;
        long totalActiveAdmissions = 0;
        double totalOccupancy = 0;
        double totalBedUtilization = 0;
        double totalLengthOfStay = 0;
        int validWards = 0;

        Map<String, Long> combinedAgeGroups = new HashMap<>();
        Map<String, Long> combinedGenders = new HashMap<>();
        Map<String, Long> wardTypeDistribution = new HashMap<>();

        WardStatisticsReportDTO bestPerformingWard = null;
        WardStatisticsReportDTO highestOccupancyWard = null;
        WardStatisticsReportDTO mostActiveWard = null;

        for (String wardName : wardNames) {
            try {
                WardStatisticsReportDTO wardReport = generateWardStatistics(wardName, year);
                wardReports.add(wardReport);

                // Aggregate statistics
                totalHospitalAdmissions += wardReport.getTotalAdmissions();
                totalHospitalDischarges += wardReport.getTotalDischarges();
                totalActiveAdmissions += wardReport.getCurrentActiveAdmissions();
                totalOccupancy += wardReport.getCurrentOccupancyRate();
                totalBedUtilization += wardReport.getBedUtilizationRate();
                totalLengthOfStay += wardReport.getAverageLengthOfStay();
                validWards++;

                // Combine demographics
                if (wardReport.getAgeGroupBreakdown() != null) {
                    wardReport.getAgeGroupBreakdown().forEach((key, value) ->
                        combinedAgeGroups.merge(key, value, Long::sum));
                }

                if (wardReport.getGenderBreakdown() != null) {
                    wardReport.getGenderBreakdown().forEach((key, value) ->
                        combinedGenders.merge(key, value, Long::sum));
                }

                // Determine ward type and count
                String wardType = getWardType(wardName);
                wardTypeDistribution.merge(wardType, wardReport.getTotalAdmissions(), Long::sum);

                // Find best performing wards
                if (bestPerformingWard == null || wardReport.getBedUtilizationRate() > bestPerformingWard.getBedUtilizationRate()) {
                    bestPerformingWard = wardReport;
                }

                if (highestOccupancyWard == null || wardReport.getCurrentOccupancyRate() > highestOccupancyWard.getCurrentOccupancyRate()) {
                    highestOccupancyWard = wardReport;
                }

                if (mostActiveWard == null || wardReport.getTotalAdmissions() > mostActiveWard.getTotalAdmissions()) {
                    mostActiveWard = wardReport;
                }

            } catch (Exception e) {
                // Skip wards with no data
                continue;
            }
        }

        // Set aggregated statistics
        hospitalReport.setTotalWards(wardNames.length);
        hospitalReport.setTotalHospitalAdmissions(totalHospitalAdmissions);
        hospitalReport.setTotalHospitalDischarges(totalHospitalDischarges);
        hospitalReport.setTotalActiveAdmissions(totalActiveAdmissions);
        hospitalReport.setHospitalOccupancyRate(validWards > 0 ? totalOccupancy / validWards : 0);
        hospitalReport.setHospitalBedUtilizationRate(validWards > 0 ? totalBedUtilization / validWards : 0);
        hospitalReport.setAverageHospitalLengthOfStay(validWards > 0 ? totalLengthOfStay / validWards : 0);

        // Set ward reports and comparisons
        hospitalReport.setWardReports(wardReports);
        hospitalReport.setBestPerformingWard(bestPerformingWard);
        hospitalReport.setHighestOccupancyWard(highestOccupancyWard);
        hospitalReport.setMostActiveWard(mostActiveWard);

        // Set demographics
        hospitalReport.setHospitalAgeGroupBreakdown(combinedAgeGroups);
        hospitalReport.setHospitalGenderBreakdown(combinedGenders);
        hospitalReport.setWardTypeDistribution(wardTypeDistribution);

        // Generate monthly aggregated data
        generateHospitalMonthlyData(hospitalReport, year);

        // Generate hospital-wide analysis
        generateHospitalAnalysis(hospitalReport);

        // Generate chart data
        generateHospitalChartData(hospitalReport);

        return hospitalReport;
    }

    public byte[] exportHospitalWideStatisticsAsPDF(int year) {
        try {
            HospitalWideStatisticsDTO hospitalReport = generateHospitalWideStatistics(year);

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

            // Header Section
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
                .add(new Paragraph("HOSPITAL-WIDE STATISTICS REPORT")
                    .setFont(boldFont)
                    .setFontSize(20)
                    .setFontColor(primaryBlue)
                    .setTextAlignment(TextAlignment.CENTER))
                .add(new Paragraph(String.format("All Wards Comprehensive Analysis - %d", year))
                    .setFont(boldFont)
                    .setFontSize(14)
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
                .add(new Paragraph(hospitalReport.getGeneratedAt().toLocalDate().toString())
                    .setFont(boldFont)
                    .setFontSize(9)
                    .setFontColor(darkGray))
                .setTextAlignment(TextAlignment.RIGHT)
                .setBorder(Border.NO_BORDER);
            headerTable.addCell(dateCell);

            document.add(headerTable);
            document.add(new LineSeparator(new SolidLine(1f)).setMarginBottom(20));

            // Hospital-wide Key Performance Indicators
            addSectionHeader(document, "HOSPITAL-WIDE KEY PERFORMANCE INDICATORS", primaryBlue, boldFont);

            Table hospitalKpiTable = new Table(UnitValue.createPercentArray(new float[]{25, 25, 25, 25})).useAllAvailableWidth();
            hospitalKpiTable.setMarginBottom(20);

            addKPICard(hospitalKpiTable, "Total Admissions", String.valueOf(hospitalReport.getTotalHospitalAdmissions()), primaryBlue, normalFont, boldFont);
            addKPICard(hospitalKpiTable, "Average Occupancy", String.format("%.1f%%", hospitalReport.getHospitalOccupancyRate()), new DeviceRgb(231, 76, 60), normalFont, boldFont);
            addKPICard(hospitalKpiTable, "Avg Length of Stay", String.format("%.1f days", hospitalReport.getAverageHospitalLengthOfStay()), new DeviceRgb(46, 204, 113), normalFont, boldFont);
            addKPICard(hospitalKpiTable, "Bed Utilization", String.format("%.1f%%", hospitalReport.getHospitalBedUtilizationRate()), new DeviceRgb(155, 89, 182), normalFont, boldFont);

            document.add(hospitalKpiTable);

            // All Wards Comparison Table
            addSectionHeader(document, "ALL WARDS PERFORMANCE COMPARISON", primaryBlue, boldFont);

            Table wardsComparisonTable = new Table(UnitValue.createPercentArray(new float[]{20, 15, 15, 15, 15, 10, 10})).useAllAvailableWidth();
            wardsComparisonTable.setMarginBottom(20);

            // Headers
            String[] headers = {"Ward Name", "Type", "Admissions", "Occupancy", "Avg LOS", "Bed Util", "YoY Growth"};
            for (String header : headers) {
                Cell headerCell = new Cell()
                    .add(new Paragraph(header)
                        .setFont(boldFont)
                        .setFontSize(9)
                        .setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(primaryBlue)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(6);
                wardsComparisonTable.addHeaderCell(headerCell);
            }

            // Add data for each ward
            boolean isEvenRow = false;
            for (WardStatisticsReportDTO ward : hospitalReport.getWardReports()) {
                DeviceRgb rowColor = isEvenRow ? new DeviceRgb(255, 255, 255) : lightGray;

                addWardDataRow(wardsComparisonTable, ward.getWardName(), rowColor, normalFont);
                addWardDataRow(wardsComparisonTable, getWardType(ward.getWardName()), rowColor, normalFont);
                addWardDataRow(wardsComparisonTable, String.valueOf(ward.getTotalAdmissions()), rowColor, normalFont);
                addWardDataRow(wardsComparisonTable, String.format("%.1f%%", ward.getCurrentOccupancyRate()), rowColor, normalFont);
                addWardDataRow(wardsComparisonTable, String.format("%.1f", ward.getAverageLengthOfStay()), rowColor, normalFont);
                addWardDataRow(wardsComparisonTable, String.format("%.1f%%", ward.getBedUtilizationRate()), rowColor, normalFont);

                String growthText = ward.getYearOverYearGrowth() >= 0 ?
                    String.format("+%.1f%%", ward.getYearOverYearGrowth()) :
                    String.format("%.1f%%", ward.getYearOverYearGrowth());
                addWardDataRow(wardsComparisonTable, growthText, rowColor, normalFont);

                isEvenRow = !isEvenRow;
            }

            document.add(wardsComparisonTable);

            // Executive Summary
            addSectionHeader(document, "HOSPITAL-WIDE EXECUTIVE SUMMARY", primaryBlue, boldFont);

            Table summaryBox = new Table(UnitValue.createPercentArray(1)).useAllAvailableWidth();
            Cell summaryCell = new Cell()
                .add(new Paragraph(hospitalReport.getHospitalExecutiveSummary())
                    .setFont(normalFont)
                    .setFontSize(11)
                    .setMarginBottom(0))
                .setBackgroundColor(lightGray)
                .setPadding(15)
                .setBorder(new SolidBorder(lightBlue, 1));
            summaryBox.addCell(summaryCell);
            document.add(summaryBox);

            document.add(new Paragraph().setMarginBottom(20));

            // Hospital Demographics
            addSectionHeader(document, "HOSPITAL-WIDE PATIENT DEMOGRAPHICS", primaryBlue, boldFont);

            Table demoTable = new Table(UnitValue.createPercentArray(new float[]{33, 33, 34})).useAllAvailableWidth();
            demoTable.setMarginBottom(20);

            // Gender breakdown
            Cell genderCell = new Cell()
                .add(new Paragraph("Gender Distribution")
                    .setFont(boldFont)
                    .setFontSize(11)
                    .setMarginBottom(8))
                .setBackgroundColor(lightGray)
                .setPadding(10);

            if (hospitalReport.getHospitalGenderBreakdown() != null) {
                for (Map.Entry<String, Long> entry : hospitalReport.getHospitalGenderBreakdown().entrySet()) {
                    genderCell.add(new Paragraph(String.format("• %s: %d", entry.getKey(), entry.getValue()))
                        .setFont(normalFont)
                        .setFontSize(9)
                        .setMarginBottom(2));
                }
            }
            demoTable.addCell(genderCell);

            // Age group breakdown
            Cell ageCell = new Cell()
                .add(new Paragraph("Age Distribution")
                    .setFont(boldFont)
                    .setFontSize(11)
                    .setMarginBottom(8))
                .setBackgroundColor(lightGray)
                .setPadding(10);

            if (hospitalReport.getHospitalAgeGroupBreakdown() != null) {
                for (Map.Entry<String, Long> entry : hospitalReport.getHospitalAgeGroupBreakdown().entrySet()) {
                    ageCell.add(new Paragraph(String.format("• %s: %d", entry.getKey(), entry.getValue()))
                        .setFont(normalFont)
                        .setFontSize(9)
                        .setMarginBottom(2));
                }
            }
            demoTable.addCell(ageCell);

            // Ward type distribution
            Cell wardTypeCell = new Cell()
                .add(new Paragraph("Ward Type Distribution")
                    .setFont(boldFont)
                    .setFontSize(11)
                    .setMarginBottom(8))
                .setBackgroundColor(lightGray)
                .setPadding(10);

            if (hospitalReport.getWardTypeDistribution() != null) {
                for (Map.Entry<String, Long> entry : hospitalReport.getWardTypeDistribution().entrySet()) {
                    wardTypeCell.add(new Paragraph(String.format("• %s: %d", entry.getKey(), entry.getValue()))
                        .setFont(normalFont)
                        .setFontSize(9)
                        .setMarginBottom(2));
                }
            }
            demoTable.addCell(wardTypeCell);

            document.add(demoTable);

            // Hospital-wide Charts Section
            addSectionHeader(document, "HOSPITAL-WIDE PERFORMANCE CHARTS", primaryBlue, boldFont);

            try {
                // Monthly admission trends chart for hospital
                byte[] hospitalChartBytes = generateHospitalMonthlyChart(hospitalReport, 400, 200);
                if (hospitalChartBytes != null) {
                    Image hospitalChartImage = new Image(ImageDataFactory.create(hospitalChartBytes));
                    hospitalChartImage.setWidth(400);
                    hospitalChartImage.setHeight(200);
                    hospitalChartImage.setHorizontalAlignment(HorizontalAlignment.CENTER);
                    document.add(hospitalChartImage);
                    document.add(new Paragraph().setMarginBottom(10));
                }

                // Ward comparison chart
                byte[] wardComparisonBytes = generateWardComparisonChart(hospitalReport, 400, 200);
                if (wardComparisonBytes != null) {
                    Image wardComparisonImage = new Image(ImageDataFactory.create(wardComparisonBytes));
                    wardComparisonImage.setWidth(400);
                    wardComparisonImage.setHeight(200);
                    wardComparisonImage.setHorizontalAlignment(HorizontalAlignment.CENTER);
                    document.add(wardComparisonImage);
                    document.add(new Paragraph().setMarginBottom(20));
                }
            } catch (Exception e) {
                // If chart generation fails, continue without charts
                document.add(new Paragraph("Charts generation temporarily unavailable")
                    .setFont(normalFont)
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));
            }

            // Hospital Performance Analysis
            addSectionHeader(document, "HOSPITAL PERFORMANCE ANALYSIS", primaryBlue, boldFont);

            addInsightBox(document, "Hospital Trend Analysis", hospitalReport.getHospitalTrendAnalysis(), new DeviceRgb(52, 152, 219), normalFont, boldFont);
            addInsightBox(document, "Performance Insights", hospitalReport.getHospitalPerformanceInsights(), new DeviceRgb(46, 204, 113), normalFont, boldFont);
            addInsightBox(document, "Strategic Recommendations", hospitalReport.getHospitalRecommendations(), new DeviceRgb(155, 89, 182), normalFont, boldFont);

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
                .add(new Paragraph("Hospital-Wide Analytics Module")
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
                .add(new Paragraph("For Executive Use Only")
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
            throw new RuntimeException("Error generating hospital-wide PDF report", e);
        }
    }

    private String getWardType(String wardName) {
        switch (wardName) {
            case "Ward1":
            case "Ward2":
                return "General";
            case "Ward3":
                return "ICU";
            case "Ward4":
                return "Dialysis";
            default:
                return "Unknown";
        }
    }

    private void generateHospitalMonthlyData(HospitalWideStatisticsDTO hospitalReport, int year) {
        List<HospitalWideStatisticsDTO.HospitalMonthlyDataDTO> monthlyData = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            String monthName = Month.of(month).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            HospitalWideStatisticsDTO.HospitalMonthlyDataDTO monthlyDto =
                new HospitalWideStatisticsDTO.HospitalMonthlyDataDTO(month, monthName);

            long totalMonthAdmissions = 0;
            long totalMonthDischarges = 0;
            double totalMonthOccupancy = 0;
            int validWards = 0;
            Map<String, Long> wardBreakdown = new HashMap<>();

            for (WardStatisticsReportDTO ward : hospitalReport.getWardReports()) {
                if (ward.getMonthlyData() != null && ward.getMonthlyData().size() >= month) {
                    WardStatisticsReportDTO.MonthlyWardDataDTO wardMonth = ward.getMonthlyData().get(month - 1);
                    totalMonthAdmissions += wardMonth.getAdmissions();
                    totalMonthDischarges += wardMonth.getDischarges();
                    totalMonthOccupancy += wardMonth.getAverageOccupancy();
                    validWards++;
                    wardBreakdown.put(ward.getWardName(), wardMonth.getAdmissions());
                }
            }

            monthlyDto.setTotalAdmissions(totalMonthAdmissions);
            monthlyDto.setTotalDischarges(totalMonthDischarges);
            monthlyDto.setAverageOccupancy(validWards > 0 ? totalMonthOccupancy / validWards : 0);
            monthlyDto.setWardBreakdown(wardBreakdown);

            monthlyData.add(monthlyDto);
        }

        hospitalReport.setHospitalMonthlyData(monthlyData);
    }

    private void generateHospitalAnalysis(HospitalWideStatisticsDTO hospitalReport) {
        StringBuilder executiveSummary = new StringBuilder();
        StringBuilder trendAnalysis = new StringBuilder();
        StringBuilder performanceInsights = new StringBuilder();
        StringBuilder recommendations = new StringBuilder();

        // Executive Summary
        executiveSummary.append(String.format(
            "Hospital-wide analysis for %d shows %d total admissions across %d wards. " +
            "Average occupancy rate is %.1f%% with an average length of stay of %.1f days. " +
            "The hospital maintains a bed utilization rate of %.1f%%, indicating %s operational efficiency.",
            hospitalReport.getYear(),
            hospitalReport.getTotalHospitalAdmissions(),
            hospitalReport.getTotalWards(),
            hospitalReport.getHospitalOccupancyRate(),
            hospitalReport.getAverageHospitalLengthOfStay(),
            hospitalReport.getHospitalBedUtilizationRate(),
            hospitalReport.getHospitalBedUtilizationRate() > 80 ? "excellent" :
            hospitalReport.getHospitalBedUtilizationRate() > 60 ? "good" : "room for improvement in"
        ));

        // Trend Analysis
        if (hospitalReport.getBestPerformingWard() != null) {
            trendAnalysis.append(String.format(
                "%s demonstrates the highest bed utilization at %.1f%%, while %s shows the highest occupancy at %.1f%%. " +
                "%s recorded the most admissions with %d patients. ",
                hospitalReport.getBestPerformingWard().getWardName(),
                hospitalReport.getBestPerformingWard().getBedUtilizationRate(),
                hospitalReport.getHighestOccupancyWard().getWardName(),
                hospitalReport.getHighestOccupancyWard().getCurrentOccupancyRate(),
                hospitalReport.getMostActiveWard().getWardName(),
                hospitalReport.getMostActiveWard().getTotalAdmissions()
            ));
        }

        trendAnalysis.append("Monthly trends indicate seasonal variations in admission patterns, " +
            "with peak periods requiring enhanced resource allocation and staffing adjustments.");

        // Performance Insights
        performanceInsights.append(
            "Cross-ward analysis reveals varying performance metrics highlighting opportunities for " +
            "best practice sharing and standardization. ICU and specialized wards show different " +
            "utilization patterns compared to general wards, reflecting their specialized care requirements. " +
            "Patient demographics show balanced distribution across age groups and gender, " +
            "supporting comprehensive care delivery across all demographics."
        );

        // Recommendations
        recommendations.append(
            "1. Implement inter-ward best practice sharing sessions to standardize high-performance protocols. " +
            "2. Develop seasonal capacity planning based on monthly admission trends. " +
            "3. Consider flexible staffing models to accommodate varying ward utilization rates. " +
            "4. Establish hospital-wide KPI monitoring dashboard for real-time performance tracking. " +
            "5. Implement predictive analytics for admission forecasting and resource optimization."
        );

        hospitalReport.setHospitalExecutiveSummary(executiveSummary.toString());
        hospitalReport.setHospitalTrendAnalysis(trendAnalysis.toString());
        hospitalReport.setHospitalPerformanceInsights(performanceInsights.toString());
        hospitalReport.setHospitalRecommendations(recommendations.toString());
    }

    private void generateHospitalChartData(HospitalWideStatisticsDTO hospitalReport) {
        List<HospitalWideStatisticsDTO.ChartDataPoint> admissionTrends = new ArrayList<>();
        List<HospitalWideStatisticsDTO.ChartDataPoint> wardComparison = new ArrayList<>();

        // Monthly admission trends for hospital
        if (hospitalReport.getHospitalMonthlyData() != null) {
            for (HospitalWideStatisticsDTO.HospitalMonthlyDataDTO monthData : hospitalReport.getHospitalMonthlyData()) {
                admissionTrends.add(new HospitalWideStatisticsDTO.ChartDataPoint(
                    monthData.getMonthName(),
                    monthData.getTotalAdmissions(),
                    "Hospital Total"
                ));
            }
        }

        // Ward comparison data
        for (WardStatisticsReportDTO ward : hospitalReport.getWardReports()) {
            wardComparison.add(new HospitalWideStatisticsDTO.ChartDataPoint(
                ward.getWardName(),
                ward.getTotalAdmissions(),
                getWardType(ward.getWardName())
            ));
        }

        hospitalReport.setHospitalAdmissionTrends(admissionTrends);
        hospitalReport.setWardComparisonData(wardComparison);
    }

    // Chart generation methods using iText drawing capabilities
    private byte[] generateMonthlyAdmissionChart(WardStatisticsReportDTO report, int width, int height) {
        try {
            ByteArrayOutputStream chartStream = new ByteArrayOutputStream();
            PdfWriter chartWriter = new PdfWriter(chartStream);
            PdfDocument chartDoc = new PdfDocument(chartWriter);
            Document chartDocument = new Document(chartDoc);

            // Create a chart area
            Rectangle chartArea = new Rectangle(50, 50, width - 100, height - 100);
            PdfCanvas canvas = new PdfCanvas(chartDoc.addNewPage());

            // Colors for the chart
            DeviceRgb primaryBlue = new DeviceRgb(41, 128, 185);
            DeviceRgb lightGray = new DeviceRgb(236, 240, 241);

            // Draw chart background
            canvas.rectangle(chartArea);
            canvas.setStrokeColor(lightGray);
            canvas.setLineWidth(1);
            canvas.stroke();

            // Get monthly data
            List<WardStatisticsReportDTO.MonthlyWardDataDTO> monthlyData = report.getMonthlyData();
            if (monthlyData != null && !monthlyData.isEmpty()) {
                long maxAdmissions = monthlyData.stream()
                    .mapToLong(WardStatisticsReportDTO.MonthlyWardDataDTO::getAdmissions)
                    .max()
                    .orElse(1L);

                float barWidth = (chartArea.getWidth() - 60) / 12;
                float maxBarHeight = chartArea.getHeight() - 60;

                // Draw bars for each month
                for (int i = 0; i < Math.min(12, monthlyData.size()); i++) {
                    WardStatisticsReportDTO.MonthlyWardDataDTO monthData = monthlyData.get(i);
                    float barHeight = (monthData.getAdmissions() / (float) maxAdmissions) * maxBarHeight;

                    float x = chartArea.getLeft() + 30 + (i * barWidth) + (barWidth * 0.1f);
                    float y = chartArea.getBottom() + 30;

                    // Draw bar
                    canvas.rectangle(x, y, barWidth * 0.8f, barHeight);
                    canvas.setFillColor(primaryBlue);
                    canvas.fill();

                    // Add month label (first 3 characters)
                    String monthLabel = monthData.getMonthName().substring(0, 3);
                    canvas.beginText();
                    canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA), 8);
                    canvas.setFillColor(ColorConstants.BLACK);
                    canvas.moveText(x + (barWidth * 0.2f), y - 15);
                    canvas.showText(monthLabel);
                    canvas.endText();

                    // Add value label on top of bar
                    canvas.beginText();
                    canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA), 7);
                    canvas.moveText(x + (barWidth * 0.3f), y + barHeight + 2);
                    canvas.showText(String.valueOf(monthData.getAdmissions()));
                    canvas.endText();
                }

                // Add chart title
                canvas.beginText();
                canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD), 12);
                canvas.setFillColor(primaryBlue);
                canvas.moveText(chartArea.getLeft() + (chartArea.getWidth() / 2) - 50, chartArea.getTop() + 10);
                canvas.showText("Monthly Admissions Trend");
                canvas.endText();

                // Add Y-axis label
                canvas.beginText();
                canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA), 9);
                canvas.moveText(chartArea.getLeft() - 20, chartArea.getTop() - 10);
                canvas.showText("Admissions");
                canvas.endText();
            }

            chartDocument.close();
            return chartStream.toByteArray();

        } catch (Exception e) {
            return null;
        }
    }

    private byte[] generateHospitalMonthlyChart(HospitalWideStatisticsDTO hospitalReport, int width, int height) {
        try {
            ByteArrayOutputStream chartStream = new ByteArrayOutputStream();
            PdfWriter chartWriter = new PdfWriter(chartStream);
            PdfDocument chartDoc = new PdfDocument(chartWriter);
            Document chartDocument = new Document(chartDoc);

            Rectangle chartArea = new Rectangle(50, 50, width - 100, height - 100);
            PdfCanvas canvas = new PdfCanvas(chartDoc.addNewPage());

            DeviceRgb primaryBlue = new DeviceRgb(41, 128, 185);
            DeviceRgb lightGray = new DeviceRgb(236, 240, 241);

            // Draw chart background
            canvas.rectangle(chartArea);
            canvas.setStrokeColor(lightGray);
            canvas.setLineWidth(1);
            canvas.stroke();

            List<HospitalWideStatisticsDTO.HospitalMonthlyDataDTO> monthlyData = hospitalReport.getHospitalMonthlyData();
            if (monthlyData != null && !monthlyData.isEmpty()) {
                long maxAdmissions = monthlyData.stream()
                    .mapToLong(HospitalWideStatisticsDTO.HospitalMonthlyDataDTO::getTotalAdmissions)
                    .max()
                    .orElse(1L);

                float barWidth = (chartArea.getWidth() - 60) / 12;
                float maxBarHeight = chartArea.getHeight() - 60;

                for (int i = 0; i < Math.min(12, monthlyData.size()); i++) {
                    HospitalWideStatisticsDTO.HospitalMonthlyDataDTO monthData = monthlyData.get(i);
                    float barHeight = (monthData.getTotalAdmissions() / (float) maxAdmissions) * maxBarHeight;

                    float x = chartArea.getLeft() + 30 + (i * barWidth) + (barWidth * 0.1f);
                    float y = chartArea.getBottom() + 30;

                    canvas.rectangle(x, y, barWidth * 0.8f, barHeight);
                    canvas.setFillColor(primaryBlue);
                    canvas.fill();

                    // Month label
                    String monthLabel = monthData.getMonthName().substring(0, 3);
                    canvas.beginText();
                    canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA), 8);
                    canvas.setFillColor(ColorConstants.BLACK);
                    canvas.moveText(x + (barWidth * 0.2f), y - 15);
                    canvas.showText(monthLabel);
                    canvas.endText();

                    // Value label
                    canvas.beginText();
                    canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA), 7);
                    canvas.moveText(x + (barWidth * 0.2f), y + barHeight + 2);
                    canvas.showText(String.valueOf(monthData.getTotalAdmissions()));
                    canvas.endText();
                }

                // Chart title
                canvas.beginText();
                canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD), 12);
                canvas.setFillColor(primaryBlue);
                canvas.moveText(chartArea.getLeft() + (chartArea.getWidth() / 2) - 80, chartArea.getTop() + 10);
                canvas.showText("Hospital-wide Monthly Admissions");
                canvas.endText();
            }

            chartDocument.close();
            return chartStream.toByteArray();

        } catch (Exception e) {
            return null;
        }
    }

    private byte[] generateWardComparisonChart(HospitalWideStatisticsDTO hospitalReport, int width, int height) {
        try {
            ByteArrayOutputStream chartStream = new ByteArrayOutputStream();
            PdfWriter chartWriter = new PdfWriter(chartStream);
            PdfDocument chartDoc = new PdfDocument(chartWriter);
            Document chartDocument = new Document(chartDoc);

            Rectangle chartArea = new Rectangle(50, 50, width - 100, height - 100);
            PdfCanvas canvas = new PdfCanvas(chartDoc.addNewPage());

            DeviceRgb[] wardColors = {
                new DeviceRgb(46, 204, 113),    // Green for Ward1
                new DeviceRgb(52, 152, 219),    // Blue for Ward2
                new DeviceRgb(231, 76, 60),     // Red for Ward3
                new DeviceRgb(155, 89, 182)     // Purple for Ward4
            };

            // Draw chart background
            canvas.rectangle(chartArea);
            canvas.setStrokeColor(new DeviceRgb(236, 240, 241));
            canvas.setLineWidth(1);
            canvas.stroke();

            List<WardStatisticsReportDTO> wardReports = hospitalReport.getWardReports();
            if (wardReports != null && !wardReports.isEmpty()) {
                long maxAdmissions = wardReports.stream()
                    .mapToLong(WardStatisticsReportDTO::getTotalAdmissions)
                    .max()
                    .orElse(1L);

                float barWidth = (chartArea.getWidth() - 60) / wardReports.size();
                float maxBarHeight = chartArea.getHeight() - 60;

                for (int i = 0; i < wardReports.size(); i++) {
                    WardStatisticsReportDTO ward = wardReports.get(i);
                    float barHeight = (ward.getTotalAdmissions() / (float) maxAdmissions) * maxBarHeight;

                    float x = chartArea.getLeft() + 30 + (i * barWidth) + (barWidth * 0.1f);
                    float y = chartArea.getBottom() + 30;

                    // Draw bar with ward-specific color
                    canvas.rectangle(x, y, barWidth * 0.8f, barHeight);
                    canvas.setFillColor(wardColors[i % wardColors.length]);
                    canvas.fill();

                    // Ward name label
                    canvas.beginText();
                    canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA), 8);
                    canvas.setFillColor(ColorConstants.BLACK);
                    canvas.moveText(x + (barWidth * 0.1f), y - 15);
                    canvas.showText(ward.getWardName());
                    canvas.endText();

                    // Admission count label
                    canvas.beginText();
                    canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA), 7);
                    canvas.moveText(x + (barWidth * 0.3f), y + barHeight + 2);
                    canvas.showText(String.valueOf(ward.getTotalAdmissions()));
                    canvas.endText();
                }

                // Chart title
                canvas.beginText();
                canvas.setFontAndSize(PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD), 12);
                canvas.setFillColor(new DeviceRgb(41, 128, 185));
                canvas.moveText(chartArea.getLeft() + (chartArea.getWidth() / 2) - 60, chartArea.getTop() + 10);
                canvas.showText("Ward Admissions Comparison");
                canvas.endText();
            }

            chartDocument.close();
            return chartStream.toByteArray();

        } catch (Exception e) {
            return null;
        }
    }
}