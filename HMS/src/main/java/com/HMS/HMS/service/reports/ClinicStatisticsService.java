package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.ClinicStatisticsDTO;
import com.HMS.HMS.DTO.reports.MonthlyVisitDTO;
import com.HMS.HMS.repository.projection.ClinicMonthlyVisitsProjection;
import com.HMS.HMS.repository.reports.ClinicStatisticsRepository;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClinicStatisticsService {

    private final ClinicStatisticsRepository repository;
    private final ResourceLoader resourceLoader;

    public ClinicStatisticsService(ClinicStatisticsRepository repository, ResourceLoader resourceLoader) {
        this.repository = repository;
        this.resourceLoader = resourceLoader;
    }

    @Transactional(readOnly = true)
    public List<ClinicStatisticsDTO> getClinicStatistics(int year) {
        List<ClinicMonthlyVisitsProjection> rawData = repository.findClinicVisitsByYear(year);

        System.out.println("=== DEBUG: Clinic Statistics ===");
        System.out.println("Year: " + year);
        System.out.println("Raw data size: " + rawData.size());

        if (rawData.isEmpty()) {
            System.out.println("WARNING: No data found for year " + year);
            System.out.println("Check if:");
            System.out.println("1. You have appointments data in the database");
            System.out.println("2. Appointments have status = 'COMPLETED'");
            System.out.println("3. Doctors have specialization data");
            System.out.println("4. The year " + year + " has actual data");
            return new ArrayList<>();
        }

        // Group by unit name
        Map<String, List<ClinicMonthlyVisitsProjection>> groupedData = rawData.stream()
                .collect(Collectors.groupingBy(ClinicMonthlyVisitsProjection::getUnitName));

        System.out.println("Grouped data units: " + groupedData.keySet());

        return groupedData.entrySet().stream()
                .map(entry -> createClinicStatisticsDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    private ClinicStatisticsDTO createClinicStatisticsDTO(String unitName, List<ClinicMonthlyVisitsProjection> data) {
        // Convert to monthly visit DTOs
        List<MonthlyVisitDTO> monthlyData = data.stream()
                .map(d -> new MonthlyVisitDTO(d.getMonthName(), d.getVisitCount(), d.getMonthNumber()))
                .sorted(Comparator.comparing(MonthlyVisitDTO::getMonthNumber))
                .collect(Collectors.toList());

        // Calculate statistics
        int totalPatients = monthlyData.stream().mapToInt(MonthlyVisitDTO::getVisitCount).sum();
        double monthlyAverage = monthlyData.stream().mapToInt(MonthlyVisitDTO::getVisitCount).average().orElse(0.0);

        // Find peak and lowest months
        Optional<MonthlyVisitDTO> peakMonth = monthlyData.stream()
                .max(Comparator.comparing(MonthlyVisitDTO::getVisitCount));
        Optional<MonthlyVisitDTO> lowestMonth = monthlyData.stream()
                .min(Comparator.comparing(MonthlyVisitDTO::getVisitCount));

        // Create DTO
        ClinicStatisticsDTO dto = new ClinicStatisticsDTO(
            unitName,
            getUnitDescription(unitName),
            totalPatients,
            monthlyAverage,
            monthlyData
        );

        // Set trend analysis
        dto.setTrendAnalysis(generateTrendAnalysis(monthlyData, unitName));

        peakMonth.ifPresent(peak -> {
            dto.setPeakMonth(peak.getMonth());
            dto.setPeakValue(peak.getVisitCount());
        });

        lowestMonth.ifPresent(lowest -> {
            dto.setLowestMonth(lowest.getMonth());
            dto.setLowestValue(lowest.getVisitCount());
        });

        return dto;
    }

    private String generateTrendAnalysis(List<MonthlyVisitDTO> monthlyData, String unitName) {
        if (monthlyData.isEmpty()) return "No data available for analysis.";

        Optional<MonthlyVisitDTO> peak = monthlyData.stream()
                .max(Comparator.comparing(MonthlyVisitDTO::getVisitCount));
        Optional<MonthlyVisitDTO> lowest = monthlyData.stream()
                .min(Comparator.comparing(MonthlyVisitDTO::getVisitCount));

        StringBuilder analysis = new StringBuilder();
        analysis.append(String.format("Table %s provides an overview of patient visits to %s, ",
                getTableNumber(unitName), unitName));
        analysis.append(String.format("indicating a total of %,d patients with a monthly average of %,.0f. ",
                monthlyData.stream().mapToInt(MonthlyVisitDTO::getVisitCount).sum(),
                monthlyData.stream().mapToInt(MonthlyVisitDTO::getVisitCount).average().orElse(0.0)));

        if (peak.isPresent() && lowest.isPresent()) {
            analysis.append(String.format("The data reveals an increase in clinic visits during %s and a decrease in the month of %s.",
                    peak.get().getMonth(), lowest.get().getMonth()));
        }

        return analysis.toString();
    }

    private String getUnitDescription(String unitName) {
        return switch (unitName.toLowerCase()) {
            case "nephrology" -> "Our clinic stands as a distinguished center of excellence in the field of nephrology, dedicated to providing specialized care and treatment for individuals grappling with renal conditions.";
            case "urology" -> "The Urology department provides comprehensive urological care including kidney transplant and surgical procedures.";
            case "surgical" -> "The Surgical unit handles complex surgical procedures with specialized care and post-operative management.";
            default -> String.format("The %s unit provides specialized medical care and treatment services.", unitName);
        };
    }

    private String getTableNumber(String unitName) {
        return switch (unitName.toLowerCase()) {
            case "nephrology unit 1" -> "5.1";
            case "nephrology unit 2" -> "5.2";
            case "professor unit" -> "5.3";
            case "urology and transplant" -> "5.4";
            default -> "5.X";
        };
    }

    // Generate chart as byte array for JasperReports
    public byte[] generateLineChart(List<MonthlyVisitDTO> data, String title) {
        try {
            DefaultCategoryDataset dataset = new DefaultCategoryDataset();

            for (MonthlyVisitDTO visit : data) {
                dataset.addValue(visit.getVisitCount(), "Visits", visit.getMonth());
            }

            JFreeChart chart = ChartFactory.createLineChart(
                    title,
                    "Month",
                    "Number of Visits",
                    dataset
            );

            // Customize chart appearance to match your PDF style
            chart.setBackgroundPaint(Color.WHITE);
            chart.getPlot().setBackgroundPaint(Color.WHITE);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ChartUtils.writeChartAsPNG(baos, chart, 600, 400);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate chart", e);
        }
    }

    @Transactional(readOnly = true)
    public byte[] generateClinicStatisticsPdf(int year, String preparedBy) throws Exception {
        List<ClinicStatisticsDTO> data = getClinicStatistics(year);

        // Load the JasperReports template
        InputStream jrxml = resourceLoader
                .getResource("classpath:reports/clinic_statistics_report.jrxml")
                .getInputStream();
        JasperReport report = JasperCompileManager.compileReport(jrxml);

        // Create parameters for the report
        Map<String, Object> params = new HashMap<>();
        params.put("hospitalName", "National Institute for Nephrology, Dialysis & Transplantation");
        params.put("hospitalAddress", "No. xx, Colombo, Sri Lanka");
        params.put("reportTitle", "Clinic Statistics Report");
        params.put("reportYear", String.valueOf(year));
        params.put("preparedBy", preparedBy != null ? preparedBy : "System Administrator");
        params.put("generatedOn", LocalDate.now().toString());

        // Generate charts for each unit (you can pass chart bytes to JasperReports)
        if (!data.isEmpty()) {
            byte[] chartBytes = generateLineChart(data.get(0).getMonthlyData(),
                    "Monthly Visits - " + data.get(0).getUnitName());
            params.put("lineChart", chartBytes);
        }

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(data);
        JasperPrint print = JasperFillManager.fillReport(report, params, dataSource);

        return JasperExportManager.exportReportToPdf(print);
    }
}