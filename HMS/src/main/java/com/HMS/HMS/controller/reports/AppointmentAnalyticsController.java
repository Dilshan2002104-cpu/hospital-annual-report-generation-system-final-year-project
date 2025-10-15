package com.HMS.HMS.controller.reports;

import com.HMS.HMS.DTO.reports.*;
import com.HMS.HMS.service.reports.AppointmentAnalyticsService;
import com.HMS.HMS.service.reports.ChartGenerationService;
import com.HMS.HMS.service.reports.PDFReportGeneratorService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/reports/appointment-analytics")
@CrossOrigin(origins = "*")
public class AppointmentAnalyticsController {

    private final AppointmentAnalyticsService appointmentAnalyticsService;
    private final ChartGenerationService chartGenerationService;

    public AppointmentAnalyticsController(AppointmentAnalyticsService appointmentAnalyticsService,
                                        ChartGenerationService chartGenerationService,
                                        PDFReportGeneratorService pdfReportGenerator) {
        this.appointmentAnalyticsService = appointmentAnalyticsService;
        this.chartGenerationService = chartGenerationService;
    }

    /**
     * Get complete appointment analytics report data
     */
    @GetMapping("/full-report/{year}")
    public ResponseEntity<AppointmentAnalyticsReportDTO> getAppointmentAnalyticsReport(@PathVariable int year) {
        try {
            AppointmentAnalyticsReportDTO report = appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download appointment analytics report as PDF
     */
    @GetMapping("/full-report/{year}/pdf")
    public ResponseEntity<byte[]> downloadAppointmentAnalyticsReportPDF(@PathVariable int year) {
        try {
            appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);

            // Note: You'll need to implement generateAppointmentAnalyticsPDF in PDFReportGeneratorService
            // For now, we'll create a placeholder response
            String pdfContent = String.format("Appointment Analytics Report for %d - Implementation Coming Soon", year);
            byte[] pdfBytes = pdfContent.getBytes();

            String filename = String.format("appointment-analytics-report-%d-%s.pdf",
                year,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.attachment().filename(filename).build());
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get appointment types distribution chart
     */
    @GetMapping("/charts/appointment-types/{year}")
    public ResponseEntity<byte[]> getAppointmentTypesChart(
            @PathVariable int year,
            @RequestParam(defaultValue = "donut") String chartType) {
        try {
            AppointmentAnalyticsReportDTO report = appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);
            List<AppointmentTypeChartDataDTO> data = report.getAppointmentTypeDistribution();

            byte[] chartBytes;
            String title = String.format("Appointment Types Distribution - %d", year);

            if ("pie".equalsIgnoreCase(chartType)) {
                chartBytes = chartGenerationService.generateAppointmentTypesPieChart(data, title);
            } else {
                chartBytes = chartGenerationService.generateAppointmentTypesDonutChart(data, title);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("appointment-types-%d-%s.png", year, chartType)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get appointment status distribution chart
     */
    @GetMapping("/charts/appointment-status/{year}")
    public ResponseEntity<byte[]> getAppointmentStatusChart(
            @PathVariable int year,
            @RequestParam(defaultValue = "pie") String chartType) {
        try {
            AppointmentAnalyticsReportDTO report = appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);
            List<AppointmentStatusChartDataDTO> data = report.getAppointmentStatusDistribution();

            byte[] chartBytes;
            String title = String.format("Appointment Status Distribution - %d", year);

            chartBytes = chartGenerationService.generateAppointmentStatusPieChart(data, title);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("appointment-status-%d.png", year)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get monthly appointment trends chart
     */
    @GetMapping("/charts/monthly-trends/{year}")
    public ResponseEntity<byte[]> getMonthlyTrendsChart(
            @PathVariable int year,
            @RequestParam(defaultValue = "line") String chartType) {
        try {
            AppointmentAnalyticsReportDTO report = appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);
            List<MonthlyAppointmentTrendDTO> data = report.getMonthlyTrends();

            byte[] chartBytes;
            String title = String.format("Monthly Appointment Trends - %d", year);

            if ("area".equalsIgnoreCase(chartType)) {
                chartBytes = chartGenerationService.generateMonthlyTrendsAreaChart(data, title);
            } else if ("bar".equalsIgnoreCase(chartType)) {
                chartBytes = chartGenerationService.generateMonthlyTrendsBarChart(data, title);
            } else {
                chartBytes = chartGenerationService.generateMonthlyTrendsLineChart(data, title);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("monthly-trends-%d-%s.png", year, chartType)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get daily appointment patterns chart
     */
    @GetMapping("/charts/daily-patterns/{year}")
    public ResponseEntity<byte[]> getDailyPatternsChart(
            @PathVariable int year,
            @RequestParam(defaultValue = "bar") String chartType) {
        try {
            AppointmentAnalyticsReportDTO report = appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);
            List<DailyAppointmentPatternDTO> data = report.getDailyPatterns();

            byte[] chartBytes;
            String title = String.format("Daily Appointment Patterns - %d", year);

            if ("radar".equalsIgnoreCase(chartType)) {
                chartBytes = chartGenerationService.generateDailyPatternsRadarChart(data, title);
            } else {
                chartBytes = chartGenerationService.generateDailyPatternsBarChart(data, title);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("daily-patterns-%d-%s.png", year, chartType)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/charts/doctor-performance/{year}")
    public ResponseEntity<byte[]> getDoctorPerformanceChart(
            @PathVariable int year,
            @RequestParam(defaultValue = "horizontal-bar") String chartType,
            @RequestParam(defaultValue = "10") int topN) {
        try {
            AppointmentAnalyticsReportDTO report = appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);
            List<DoctorAppointmentStatsDTO> data = report.getDoctorPerformance();

            // Limit to top N doctors
            List<DoctorAppointmentStatsDTO> topDoctors = data.stream()
                    .limit(topN)
                    .toList();

            byte[] chartBytes;
            String title = String.format("Top %d Doctor Performance - %d", topN, year);

            if ("stacked-bar".equalsIgnoreCase(chartType)) {
                chartBytes = chartGenerationService.generateDoctorPerformanceStackedChart(topDoctors, title);
            } else {
                chartBytes = chartGenerationService.generateDoctorPerformanceHorizontalBarChart(topDoctors, title);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("doctor-performance-%d-%s.png", year, chartType)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get time slot analysis heat map
     */
    @GetMapping("/charts/time-slot-heatmap/{year}")
    public ResponseEntity<byte[]> getTimeSlotHeatMap(@PathVariable int year) {
        try {
            AppointmentAnalyticsReportDTO report = appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);
            List<TimeSlotAnalysisDTO> data = report.getTimeSlotAnalysis();

            String title = String.format("Appointment Time Slot Analysis - %d", year);
            byte[] chartBytes = chartGenerationService.generateTimeSlotHeatMap(data, title);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("time-slot-heatmap-%d.png", year)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get weekly patterns chart
     */
    @GetMapping("/charts/weekly-patterns/{year}")
    public ResponseEntity<byte[]> getWeeklyPatternsChart(
            @PathVariable int year,
            @RequestParam(defaultValue = "area") String chartType) {
        try {
            AppointmentAnalyticsReportDTO report = appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);
            List<WeeklyPatternDTO> data = report.getWeeklyPatterns();

            byte[] chartBytes;
            String title = String.format("Weekly Appointment Patterns - %d", year);

            if ("line".equalsIgnoreCase(chartType)) {
                chartBytes = chartGenerationService.generateWeeklyPatternsLineChart(data, title);
            } else {
                chartBytes = chartGenerationService.generateWeeklyPatternsAreaChart(data, title);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("weekly-patterns-%d-%s.png", year, chartType)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get appointment summary statistics
     */
    @GetMapping("/summary/{year}")
    public ResponseEntity<Map<String, Object>> getAppointmentSummary(@PathVariable int year) {
        try {
            AppointmentAnalyticsReportDTO report = appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);

            Map<String, Object> summary = new HashMap<>();
            summary.put("year", year);
            summary.put("totalAppointments", report.getTotalAppointments());
            summary.put("completedAppointments", report.getCompletedAppointments());
            summary.put("cancelledAppointments", report.getCancelledAppointments());
            summary.put("scheduledAppointments", report.getScheduledAppointments());
            summary.put("completionRate", String.format("%.1f%%", report.getCompletionRate()));
            summary.put("cancellationRate", String.format("%.1f%%", report.getCancellationRate()));
            summary.put("reportGeneratedDate", report.getReportGeneratedDate());

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get appointment analytics dashboard data
     */
    @GetMapping("/dashboard/{year}")
    public ResponseEntity<Map<String, Object>> getAppointmentAnalyticsDashboard(@PathVariable int year) {
        try {
            AppointmentAnalyticsReportDTO report = appointmentAnalyticsService.generateAppointmentAnalyticsReport(year);

            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("summary", Map.of(
                "totalAppointments", report.getTotalAppointments(),
                "completionRate", report.getCompletionRate(),
                "cancellationRate", report.getCancellationRate()
            ));

            dashboard.put("appointmentTypes", report.getAppointmentTypeDistribution());
            dashboard.put("appointmentStatus", report.getAppointmentStatusDistribution());
            dashboard.put("monthlyTrends", report.getMonthlyTrends());
            dashboard.put("dailyPatterns", report.getDailyPatterns());
            dashboard.put("topDoctors", report.getDoctorPerformance().stream().limit(5).toList());
            dashboard.put("timeSlotAnalysis", report.getTimeSlotAnalysis());

            dashboard.put("analysis", Map.of(
                "executiveSummary", report.getExecutiveSummary(),
                "trendsAnalysis", report.getTrendsAnalysis(),
                "recommendations", report.getRecommendationsText()
            ));

            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}