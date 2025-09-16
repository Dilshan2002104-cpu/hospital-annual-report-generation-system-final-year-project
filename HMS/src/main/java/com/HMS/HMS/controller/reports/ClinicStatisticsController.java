package com.HMS.HMS.controller.reports;

import com.HMS.HMS.DTO.reports.ClinicStatisticsDTO;
import com.HMS.HMS.service.reports.ClinicStatisticsService;
import com.HMS.HMS.service.reports.ClinicStatisticsITextService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports/clinic-statistics")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175", "http://localhost:3000"},
            allowedHeaders = "*",
            methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class ClinicStatisticsController {

    private final ClinicStatisticsService service;
    private final ClinicStatisticsITextService itextService;

    public ClinicStatisticsController(ClinicStatisticsService service, ClinicStatisticsITextService itextService) {
        this.service = service;
        this.itextService = itextService;
    }

    /**
     * Get clinic statistics data as JSON
     * Endpoint: GET /api/reports/clinic-statistics/yearly?year=2023
     */
    @GetMapping("/yearly")
    public ResponseEntity<List<ClinicStatisticsDTO>> getYearlyClinicStatistics(@RequestParam int year) {
        List<ClinicStatisticsDTO> statistics = service.getClinicStatistics(year);
        System.out.println("Controller: Returning " + statistics.size() + " clinic units");
        return ResponseEntity.ok(statistics);
    }

    /**
     * Debug endpoint to test database connectivity and data availability
     * Endpoint: GET /api/reports/clinic-statistics/debug?year=2023
     */
    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debugClinicData(@RequestParam int year) {
        Map<String, Object> debug = new HashMap<>();

        try {
            List<ClinicStatisticsDTO> statistics = service.getClinicStatistics(year);
            debug.put("year", year);
            debug.put("statisticsCount", statistics.size());
            debug.put("hasData", !statistics.isEmpty());
            debug.put("units", statistics.stream()
                    .map(ClinicStatisticsDTO::getUnitName)
                    .collect(java.util.stream.Collectors.toList()));

            if (!statistics.isEmpty()) {
                ClinicStatisticsDTO first = statistics.get(0);
                debug.put("sampleUnit", first.getUnitName());
                debug.put("sampleTotalPatients", first.getTotalPatients());
                debug.put("sampleMonthlyDataSize", first.getMonthlyData() != null ? first.getMonthlyData().size() : 0);
            }
        } catch (Exception e) {
            debug.put("error", e.getMessage());
            debug.put("hasData", false);
        }

        return ResponseEntity.ok(debug);
    }

    /**
     * Generate clinic statistics report as PDF using iText 7 (Modern Alternative)
     * Endpoint: GET /api/reports/clinic-statistics/yearly/pdf?year=2023&preparedBy=Dr.%20Smith
     */
    @GetMapping("/yearly/pdf")
    public ResponseEntity<?> generateClinicStatisticsPdf(
            @RequestParam int year,
            @RequestParam(required = false) String preparedBy) {

        System.out.println("=== Controller Debug ===");
        System.out.println("Received request for year: " + year);
        System.out.println("Prepared by: " + preparedBy);

        try {
            byte[] pdfBytes = itextService.generateClinicStatisticsPdf(year, preparedBy);

            if (pdfBytes == null || pdfBytes.length == 0) {
                throw new RuntimeException("PDF generation returned empty result");
            }

            String fileName = "clinic_statistics_report_itext_" + year + ".pdf";
            System.out.println("PDF generated successfully, size: " + pdfBytes.length + " bytes");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            System.err.println("Controller caught exception: " + e.getMessage());
            e.printStackTrace();

            // Return JSON error response instead of trying to serialize as PDF
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to generate PDF report");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", java.time.LocalDateTime.now());
            errorResponse.put("year", year);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(errorResponse);
        }
    }

    /**
     * Generate with JasperReports (Alternative endpoint)
     */
    @GetMapping(value = "/yearly/pdf/jasper", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generateClinicStatisticsPdfJasper(
            @RequestParam int year,
            @RequestParam(required = false) String preparedBy) throws Exception {

        byte[] pdfBytes = service.generateClinicStatisticsPdf(year, preparedBy);
        String fileName = "clinic_statistics_report_jasper_" + year + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}