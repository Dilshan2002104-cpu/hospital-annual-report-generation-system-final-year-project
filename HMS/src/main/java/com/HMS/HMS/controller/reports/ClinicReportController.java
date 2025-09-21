package com.HMS.HMS.controller.reports;

import com.HMS.HMS.DTO.reports.ClinicStatisticsReportDTO;
import com.HMS.HMS.DTO.reports.MonthlyVisitDataDTO;
import com.HMS.HMS.service.reports.ClinicReportService;
import com.HMS.HMS.service.reports.PDFReportGeneratorService;
import com.HMS.HMS.service.reports.ChartGenerationService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports/clinic")
@CrossOrigin(origins = "*")
public class ClinicReportController {

    private final ClinicReportService clinicReportService;
    private final PDFReportGeneratorService pdfReportGenerator;
    private final ChartGenerationService chartGenerationService;

    public ClinicReportController(ClinicReportService clinicReportService,
                                 PDFReportGeneratorService pdfReportGenerator,
                                 ChartGenerationService chartGenerationService) {
        this.clinicReportService = clinicReportService;
        this.pdfReportGenerator = pdfReportGenerator;
        this.chartGenerationService = chartGenerationService;
    }

    /**
     * Get complete clinic statistics report data
     */
    @GetMapping("/statistics/{year}")
    public ResponseEntity<ClinicStatisticsReportDTO> getClinicStatistics(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO report = clinicReportService.generateClinicStatisticsReport(year);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Debug endpoint to test report generation
     */
    @GetMapping("/debug/{year}")
    public ResponseEntity<String> debugReport(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO report = clinicReportService.generateClinicStatisticsReport(year);
            return ResponseEntity.ok("Report generated successfully. Total appointments: " + report.getTotalAppointments());
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage() + " - " + e.getClass().getSimpleName());
        }
    }

    /**
     * Download clinic statistics report as PDF
     */
    @GetMapping("/statistics/{year}/pdf")
    public ResponseEntity<byte[]> downloadClinicStatisticsPDF(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO reportData = clinicReportService.generateClinicStatisticsReport(year);
            byte[] pdfBytes = pdfReportGenerator.generateClinicStatisticsPDF(reportData);

            String filename = String.format("clinic-statistics-%d-%s.pdf",
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
     * Get monthly appointment data
     */
    @GetMapping("/appointments/monthly/{year}")
    public ResponseEntity<List<MonthlyVisitDataDTO>> getMonthlyAppointments(
            @PathVariable int year,
            @RequestParam(required = false) String specialization) {
        try {
            List<MonthlyVisitDataDTO> data = clinicReportService.getMonthlyAppointmentsBySpecialization(year, specialization);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get monthly admission data
     */
    @GetMapping("/admissions/monthly/{year}")
    public ResponseEntity<List<MonthlyVisitDataDTO>> getMonthlyAdmissions(
            @PathVariable int year,
            @RequestParam(required = false) String wardType) {
        try {
            List<MonthlyVisitDataDTO> data = clinicReportService.getMonthlyAdmissionsByWardType(year, wardType);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generate and download monthly appointments chart
     */
    @GetMapping("/charts/appointments/monthly/{year}")
    public ResponseEntity<byte[]> getMonthlyAppointmentsChart(
            @PathVariable int year,
            @RequestParam(defaultValue = "line") String chartType,
            @RequestParam(required = false) String specialization) {
        try {
            List<MonthlyVisitDataDTO> data = clinicReportService.getMonthlyAppointmentsBySpecialization(year, specialization);

            String title = String.format("Monthly Appointments - %d", year);
            if (specialization != null) {
                title += " (" + specialization + ")";
            }

            byte[] chartBytes;
            if ("bar".equalsIgnoreCase(chartType)) {
                chartBytes = chartGenerationService.generateMonthlyVisitsBarChart(data, title);
            } else {
                chartBytes = chartGenerationService.generateMonthlyVisitsLineChart(data, title);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("appointments-%d-%s.png", year, chartType)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generate and download monthly admissions chart
     */
    @GetMapping("/charts/admissions/monthly/{year}")
    public ResponseEntity<byte[]> getMonthlyAdmissionsChart(
            @PathVariable int year,
            @RequestParam(defaultValue = "line") String chartType,
            @RequestParam(required = false) String wardType) {
        try {
            List<MonthlyVisitDataDTO> data = clinicReportService.getMonthlyAdmissionsByWardType(year, wardType);

            String title = String.format("Monthly Admissions - %d", year);
            if (wardType != null) {
                title += " (" + wardType + " Ward)";
            }

            byte[] chartBytes;
            if ("bar".equalsIgnoreCase(chartType)) {
                chartBytes = chartGenerationService.generateMonthlyVisitsBarChart(data, title);
            } else {
                chartBytes = chartGenerationService.generateMonthlyVisitsLineChart(data, title);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("admissions-%d-%s.png", year, chartType)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generate specialization breakdown chart
     */
    @GetMapping("/charts/specializations/{year}")
    public ResponseEntity<byte[]> getSpecializationChart(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO reportData = clinicReportService.generateClinicStatisticsReport(year);

            if (reportData.getSpecializationBreakdown() == null || reportData.getSpecializationBreakdown().isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            byte[] chartBytes = chartGenerationService.generateSpecializationPieChart(
                    reportData.getSpecializationBreakdown(),
                    String.format("Visits by Specialization - %d", year));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("specializations-%d.png", year)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generate ward occupancy chart
     */
    @GetMapping("/charts/ward-occupancy/{year}")
    public ResponseEntity<byte[]> getWardOccupancyChart(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO reportData = clinicReportService.generateClinicStatisticsReport(year);

            if (reportData.getWardOccupancy() == null || reportData.getWardOccupancy().isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            byte[] chartBytes = chartGenerationService.generateWardOccupancyChart(
                    reportData.getWardOccupancy(),
                    String.format("Ward Occupancy Analysis - %d", year));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("ward-occupancy-%d.png", year)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generate comparison chart between appointments and admissions
     */
    @GetMapping("/charts/comparison/{year}")
    public ResponseEntity<byte[]> getComparisonChart(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO reportData = clinicReportService.generateClinicStatisticsReport(year);

            byte[] chartBytes = chartGenerationService.generateComparisonChart(
                    reportData.getMonthlyAppointments(),
                    reportData.getMonthlyAdmissions(),
                    String.format("Appointments vs Admissions Comparison - %d", year));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("comparison-%d.png", year)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Comprehensive clinic report with proper error handling
     */
    @GetMapping("/comprehensive/{year}")
    public ResponseEntity<?> getComprehensiveReport(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO report = clinicReportService.generateClinicStatisticsReport(year);
            if (report.getTotalAppointments() > 0) {
                return ResponseEntity.ok(report);
            } else {
                return ResponseEntity.status(404).body(Map.of(
                    "error", "No Data Found",
                    "message", "No appointment data found for year " + year + ". Cannot generate comprehensive clinic report.",
                    "year", year,
                    "status", 404
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Report Generation Failed",
                "message", "An error occurred while generating the report: " + e.getMessage(),
                "year", year,
                "status", 500
            ));
        }
    }


    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Clinic Reports API is running");
    }

    /**
     * Get available years for reporting
     */
    @GetMapping("/available-years")
    public ResponseEntity<List<Integer>> getAvailableYears() {
        try {
            // For now, return a range of years. This could be enhanced to query actual data years
            List<Integer> years = List.of(2019, 2020, 2021, 2022, 2023, 2024);
            return ResponseEntity.ok(years);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}