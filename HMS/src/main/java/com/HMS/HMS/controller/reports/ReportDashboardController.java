package com.HMS.HMS.controller.reports;

import com.HMS.HMS.DTO.reports.ClinicStatisticsReportDTO;
import com.HMS.HMS.service.reports.ClinicReportService;
import com.HMS.HMS.service.reports.ChartGenerationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports/dashboard")
@CrossOrigin(origins = "*")
public class ReportDashboardController {

    private final ClinicReportService clinicReportService;
    private final ChartGenerationService chartGenerationService;

    public ReportDashboardController(ClinicReportService clinicReportService,
                                   ChartGenerationService chartGenerationService) {
        this.clinicReportService = clinicReportService;
        this.chartGenerationService = chartGenerationService;
    }

    /**
     * Get dashboard summary data
     */
    @GetMapping("/summary/{year}")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO reportData = clinicReportService.generateClinicStatisticsReport(year);

            Map<String, Object> summary = new HashMap<>();
            summary.put("year", year);
            summary.put("totalAppointments", reportData.getTotalAppointments());
            summary.put("totalAdmissions", reportData.getTotalAdmissions());
            summary.put("monthlyAverageAppointments", Math.round(reportData.getMonthlyAverageAppointments()));
            summary.put("monthlyAverageAdmissions", Math.round(reportData.getMonthlyAverageAdmissions()));
            summary.put("previousYearAppointments", reportData.getPreviousYearAppointments());
            summary.put("yearOverYearChange", reportData.getYearOverYearChangeAppointments());

            // Add top specialization
            if (reportData.getSpecializationBreakdown() != null && !reportData.getSpecializationBreakdown().isEmpty()) {
                var topSpecialization = reportData.getSpecializationBreakdown().get(0);
                summary.put("topSpecialization", Map.of(
                    "name", topSpecialization.getSpecialization(),
                    "visits", topSpecialization.getTotalVisits(),
                    "percentage", topSpecialization.getPercentageOfTotal()
                ));
            }

            // Add ward summary
            if (reportData.getWardOccupancy() != null && !reportData.getWardOccupancy().isEmpty()) {
                double avgOccupancy = reportData.getWardOccupancy().stream()
                        .mapToDouble(ward -> ward.getOccupancyRate())
                        .average()
                        .orElse(0.0);
                summary.put("averageWardOccupancy", Math.round(avgOccupancy * 100.0) / 100.0);
            }

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get key performance indicators
     */
    @GetMapping("/kpi/{year}")
    public ResponseEntity<Map<String, Object>> getKPIs(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO reportData = clinicReportService.generateClinicStatisticsReport(year);
            ClinicStatisticsReportDTO previousYearData = null;

            try {
                previousYearData = clinicReportService.generateClinicStatisticsReport(year - 1);
            } catch (Exception e) {
                // Previous year data might not be available
            }

            Map<String, Object> kpis = new HashMap<>();

            // Appointment KPIs
            kpis.put("totalAppointments", reportData.getTotalAppointments());
            kpis.put("appointmentGrowth", reportData.getYearOverYearChangeAppointments());

            // Monthly trends
            if (reportData.getMonthlyAppointments() != null && !reportData.getMonthlyAppointments().isEmpty()) {
                var monthlyData = reportData.getMonthlyAppointments();
                var maxMonth = monthlyData.stream().max((a, b) -> Long.compare(a.getPatientCount(), b.getPatientCount())).orElse(null);
                var minMonth = monthlyData.stream().min((a, b) -> Long.compare(a.getPatientCount(), b.getPatientCount())).orElse(null);

                if (maxMonth != null && minMonth != null) {
                    kpis.put("peakMonth", Map.of(
                        "month", maxMonth.getMonthName(),
                        "visits", maxMonth.getPatientCount()
                    ));
                    kpis.put("lowMonth", Map.of(
                        "month", minMonth.getMonthName(),
                        "visits", minMonth.getPatientCount()
                    ));
                    kpis.put("monthlyVariation", maxMonth.getPatientCount() - minMonth.getPatientCount());
                }
            }

            // Specialization performance
            if (reportData.getSpecializationBreakdown() != null && !reportData.getSpecializationBreakdown().isEmpty()) {
                kpis.put("totalSpecializations", reportData.getSpecializationBreakdown().size());
                kpis.put("specializationData", reportData.getSpecializationBreakdown());
            }

            // Ward performance
            if (reportData.getWardOccupancy() != null && !reportData.getWardOccupancy().isEmpty()) {
                long totalBeds = reportData.getWardOccupancy().stream()
                        .mapToLong(ward -> ward.getTotalAdmissions())
                        .sum();
                long activeBeds = reportData.getWardOccupancy().stream()
                        .mapToLong(ward -> ward.getActiveAdmissions())
                        .sum();

                kpis.put("totalBeds", totalBeds);
                kpis.put("activeBeds", activeBeds);
                kpis.put("bedUtilization", totalBeds > 0 ? (activeBeds * 100.0 / totalBeds) : 0.0);
            }

            return ResponseEntity.ok(kpis);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get chart data for dashboard widgets
     */
    @GetMapping("/widgets/{year}")
    public ResponseEntity<Map<String, Object>> getDashboardWidgets(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO reportData = clinicReportService.generateClinicStatisticsReport(year);

            Map<String, Object> widgets = new HashMap<>();

            // Monthly trends widget data
            if (reportData.getMonthlyAppointments() != null) {
                widgets.put("monthlyAppointments", reportData.getMonthlyAppointments());
            }

            if (reportData.getMonthlyAdmissions() != null) {
                widgets.put("monthlyAdmissions", reportData.getMonthlyAdmissions());
            }

            // Specialization widget data
            if (reportData.getSpecializationBreakdown() != null) {
                widgets.put("specializations", reportData.getSpecializationBreakdown());
            }

            // Ward occupancy widget data
            if (reportData.getWardOccupancy() != null) {
                widgets.put("wardOccupancy", reportData.getWardOccupancy());
            }

            return ResponseEntity.ok(widgets);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get mini chart for dashboard widgets
     */
    @GetMapping(value = "/widgets/chart/{type}/{year}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getWidgetChart(
            @PathVariable String type,
            @PathVariable int year,
            @RequestParam(defaultValue = "400") int width,
            @RequestParam(defaultValue = "300") int height) {
        try {
            ClinicStatisticsReportDTO reportData = clinicReportService.generateClinicStatisticsReport(year);
            byte[] chartBytes = null;

            switch (type.toLowerCase()) {
                case "appointments":
                    if (reportData.getMonthlyAppointments() != null) {
                        chartBytes = chartGenerationService.generateMonthlyVisitsLineChart(
                            reportData.getMonthlyAppointments(),
                            "Monthly Appointments");
                    }
                    break;
                case "admissions":
                    if (reportData.getMonthlyAdmissions() != null) {
                        chartBytes = chartGenerationService.generateMonthlyVisitsLineChart(
                            reportData.getMonthlyAdmissions(),
                            "Monthly Admissions");
                    }
                    break;
                case "specializations":
                    if (reportData.getSpecializationBreakdown() != null) {
                        chartBytes = chartGenerationService.generateSpecializationPieChart(
                            reportData.getSpecializationBreakdown(),
                            "Specializations");
                    }
                    break;
                default:
                    return ResponseEntity.badRequest().build();
            }

            if (chartBytes == null) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get text analysis for dashboard
     */
    @GetMapping("/analysis/{year}")
    public ResponseEntity<Map<String, String>> getAnalysisTexts(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO reportData = clinicReportService.generateClinicStatisticsReport(year);

            Map<String, String> analysis = new HashMap<>();
            analysis.put("introduction", reportData.getIntroductionText());
            analysis.put("trends", reportData.getTrendsAnalysisText());
            analysis.put("impact", reportData.getImpactAnalysisText());
            analysis.put("conclusion", reportData.getConclusionText());

            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get quick stats for header display
     */
    @GetMapping("/quick-stats/{year}")
    public ResponseEntity<Map<String, Object>> getQuickStats(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO reportData = clinicReportService.generateClinicStatisticsReport(year);

            Map<String, Object> quickStats = new HashMap<>();
            quickStats.put("totalAppointments", reportData.getTotalAppointments());
            quickStats.put("totalAdmissions", reportData.getTotalAdmissions());
            quickStats.put("yearOverYearChange", Math.round(reportData.getYearOverYearChangeAppointments() * 10.0) / 10.0);

            // Current month stats (assuming current year)
            if (year == java.time.Year.now().getValue() && reportData.getMonthlyAppointments() != null) {
                int currentMonth = java.time.LocalDate.now().getMonthValue();
                var currentMonthData = reportData.getMonthlyAppointments().stream()
                        .filter(data -> data.getMonth() == currentMonth)
                        .findFirst()
                        .orElse(null);

                if (currentMonthData != null) {
                    quickStats.put("currentMonthAppointments", currentMonthData.getPatientCount());
                }
            }

            return ResponseEntity.ok(quickStats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}