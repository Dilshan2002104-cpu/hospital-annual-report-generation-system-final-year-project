package com.HMS.HMS.controller.reports;

import com.HMS.HMS.DTO.reports.PrescriptionDispensingReportDTO;
import com.HMS.HMS.service.reports.PrescriptionReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports/pharmacy/prescription")
@CrossOrigin(origins = "*")
public class PrescriptionReportController {

    private final PrescriptionReportService prescriptionReportService;

    public PrescriptionReportController(PrescriptionReportService prescriptionReportService) {
        this.prescriptionReportService = prescriptionReportService;
    }

    /**
     * Generate prescription dispensing report for a date range
     */
    @GetMapping("/dispensing")
    public ResponseEntity<PrescriptionDispensingReportDTO> getPrescriptionDispensingReport(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            PrescriptionDispensingReportDTO report = prescriptionReportService.generatePrescriptionDispensingReport(start, end);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get summary statistics for prescription dispensing
     */
    @GetMapping("/dispensing/summary")
    public ResponseEntity<Map<String, Object>> getDispensingSummary(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            PrescriptionDispensingReportDTO report = prescriptionReportService.generatePrescriptionDispensingReport(start, end);

            Map<String, Object> summary = new HashMap<>();
            summary.put("startDate", report.getStartDate());
            summary.put("endDate", report.getEndDate());
            summary.put("totalPrescriptions", report.getTotalPrescriptions());
            summary.put("completedPrescriptions", report.getCompletedPrescriptions());
            summary.put("pendingPrescriptions", report.getPendingPrescriptions());
            summary.put("completionRate", Math.round(report.getCompletionRate() * 100.0) / 100.0);
            summary.put("averageProcessingTimeHours", Math.round(report.getAverageProcessingTimeHours() * 100.0) / 100.0);

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get daily breakdown data for charts
     */
    @GetMapping("/dispensing/daily")
    public ResponseEntity<Map<String, Object>> getDailyBreakdown(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            PrescriptionDispensingReportDTO report = prescriptionReportService.generatePrescriptionDispensingReport(start, end);

            Map<String, Object> data = new HashMap<>();
            data.put("dailyBreakdown", report.getDailyBreakdown());

            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get ward-wise breakdown data
     */
    @GetMapping("/dispensing/wards")
    public ResponseEntity<Map<String, Object>> getWardBreakdown(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            PrescriptionDispensingReportDTO report = prescriptionReportService.generatePrescriptionDispensingReport(start, end);

            Map<String, Object> data = new HashMap<>();
            data.put("wardBreakdown", report.getWardBreakdown());

            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get status distribution data
     */
    @GetMapping("/dispensing/status")
    public ResponseEntity<Map<String, Object>> getStatusDistribution(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            PrescriptionDispensingReportDTO report = prescriptionReportService.generatePrescriptionDispensingReport(start, end);

            Map<String, Object> data = new HashMap<>();
            data.put("statusDistribution", report.getStatusDistribution());

            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get generated text insights
     */
    @GetMapping("/dispensing/insights")
    public ResponseEntity<Map<String, String>> getInsights(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            PrescriptionDispensingReportDTO report = prescriptionReportService.generatePrescriptionDispensingReport(start, end);

            Map<String, String> insights = new HashMap<>();
            insights.put("summary", report.getSummaryText());
            insights.put("trends", report.getTrendsText());
            insights.put("performance", report.getPerformanceText());

            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get quick stats for header display
     */
    @GetMapping("/dispensing/quick-stats")
    public ResponseEntity<Map<String, Object>> getQuickStats(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            PrescriptionDispensingReportDTO report = prescriptionReportService.generatePrescriptionDispensingReport(start, end);

            Map<String, Object> quickStats = new HashMap<>();
            quickStats.put("totalPrescriptions", report.getTotalPrescriptions());
            quickStats.put("completionRate", Math.round(report.getCompletionRate() * 10.0) / 10.0);
            quickStats.put("averageProcessingTime", Math.round(report.getAverageProcessingTimeHours() * 10.0) / 10.0);
            quickStats.put("completedCount", report.getCompletedPrescriptions());
            quickStats.put("pendingCount", report.getPendingPrescriptions());

            return ResponseEntity.ok(quickStats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Download prescription dispensing report as PDF
     */
    @GetMapping("/dispensing/pdf")
    public ResponseEntity<byte[]> downloadPrescriptionDispensingPDF(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            byte[] pdfBytes = prescriptionReportService.generatePrescriptionDispensingPDF(start, end);
            
            String filename = String.format("prescription-dispensing-report-%s-to-%s.pdf", 
                    startDate, endDate);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
