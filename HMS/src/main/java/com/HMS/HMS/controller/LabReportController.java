package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.reports.LabAnnualReportDTO;
import com.HMS.HMS.service.reports.LabReportService;
import com.HMS.HMS.service.reports.PDFReportGeneratorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Controller for Laboratory Annual Report generation and management
 */
@RestController
@RequestMapping("/api/lab-reports")
@CrossOrigin(origins = "*")
public class LabReportController {

    private static final Logger logger = LoggerFactory.getLogger(LabReportController.class);
    
    @Autowired
    private LabReportService labReportService;
    
    @Autowired
    private PDFReportGeneratorService pdfReportGeneratorService;

    /**
     * Generate Laboratory Annual Report for specified year
     * GET /api/lab-reports/annual/{year}
     */
    @GetMapping("/annual/{year}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_MANAGER') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<LabAnnualReportDTO> generateAnnualReport(@PathVariable int year) {
        try {
            logger.info("Generating laboratory annual report for year: {}", year);
            
            // Validate year
            if (year < 2020 || year > LocalDateTime.now().getYear() + 1) {
                logger.warn("Invalid year requested: {}", year);
                return ResponseEntity.badRequest().build();
            }
            
            LabAnnualReportDTO report = labReportService.generateAnnualReport(year);
            
            logger.info("Successfully generated laboratory annual report for year: {}", year);
            return ResponseEntity.ok(report);
            
        } catch (Exception e) {
            logger.error("Error generating laboratory annual report for year {}: {}", year, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Download Laboratory Annual Report as PDF
     * GET /api/lab-reports/annual/{year}/pdf
     */
    @GetMapping("/annual/{year}/pdf")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_MANAGER') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<byte[]> downloadAnnualReportPDF(@PathVariable int year) {
        try {
            logger.info("Generating laboratory annual report PDF for year: {}", year);
            
            // Validate year
            if (year < 2020 || year > LocalDateTime.now().getYear() + 1) {
                logger.warn("Invalid year requested for PDF: {}", year);
                return ResponseEntity.badRequest().build();
            }
            
            // Generate report data
            LabAnnualReportDTO reportData = labReportService.generateAnnualReport(year);
            
            // Generate PDF
            byte[] pdfBytes = pdfReportGeneratorService.generateLaboratoryAnnualReport(reportData);
            
            // Prepare filename with timestamp
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = String.format("Laboratory_Annual_Report_%d_%s.pdf", year, timestamp);
            
            // Set response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("no-cache, no-store, must-revalidate");
            headers.setPragma("no-cache");
            headers.setExpires(0);
            
            logger.info("Successfully generated laboratory annual report PDF for year: {} (size: {} bytes)", 
                       year, pdfBytes.length);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(pdfBytes.length)
                    .body(pdfBytes);
                    
        } catch (Exception e) {
            logger.error("Error generating laboratory annual report PDF for year {}: {}", year, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .headers(new HttpHeaders())
                    .body(null);
        }
    }

    /**
     * Preview Laboratory Annual Report data (without PDF generation)
     * GET /api/lab-reports/annual/{year}/preview
     */
    @GetMapping("/annual/{year}/preview")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_MANAGER') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<LabAnnualReportDTO> previewAnnualReport(@PathVariable int year) {
        try {
            logger.info("Previewing laboratory annual report data for year: {}", year);
            
            // Validate year
            if (year < 2020 || year > LocalDateTime.now().getYear() + 1) {
                logger.warn("Invalid year requested for preview: {}", year);
                return ResponseEntity.badRequest().build();
            }
            
            LabAnnualReportDTO report = labReportService.generateAnnualReport(year);
            
            logger.info("Successfully generated laboratory report preview for year: {}", year);
            return ResponseEntity.ok(report);
            
        } catch (Exception e) {
            logger.error("Error previewing laboratory annual report for year {}: {}", year, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get available report years
     * GET /api/lab-reports/available-years
     */
    @GetMapping("/available-years")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_MANAGER') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<int[]> getAvailableReportYears() {
        try {
            logger.info("Fetching available report years");
            
            // For now, return years from 2020 to current year + 1 (for future planning)
            int currentYear = LocalDateTime.now().getYear();
            int startYear = 2020;
            int endYear = currentYear + 1;
            
            int[] availableYears = new int[endYear - startYear + 1];
            for (int i = 0; i < availableYears.length; i++) {
                availableYears[i] = endYear - i; // Reverse order (newest first)
            }
            
            logger.info("Available report years: {} to {}", startYear, endYear);
            return ResponseEntity.ok(availableYears);
            
        } catch (Exception e) {
            logger.error("Error fetching available report years: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Health check endpoint for laboratory reports service
     * GET /api/lab-reports/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        try {
            logger.debug("Laboratory reports service health check");
            return ResponseEntity.ok("Laboratory Reports service is running");
        } catch (Exception e) {
            logger.error("Health check failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Laboratory Reports service is unavailable");
        }
    }

    /**
     * Get report generation status/info
     * GET /api/lab-reports/info
     */
    @GetMapping("/info")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LAB_MANAGER') or hasRole('LAB_TECHNICIAN')")
    public ResponseEntity<ReportServiceInfo> getReportServiceInfo() {
        try {
            logger.debug("Fetching laboratory report service information");
            
            ReportServiceInfo info = new ReportServiceInfo();
            info.setServiceName("Laboratory Annual Reports");
            info.setVersion("1.0.0");
            info.setDescription("Comprehensive laboratory annual report generation with charts and analytics");
            info.setSupportedFormats(new String[]{"PDF", "JSON"});
            info.setLastUpdated(LocalDateTime.now());
            
            return ResponseEntity.ok(info);
            
        } catch (Exception e) {
            logger.error("Error fetching report service info: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DTO for report service information
     */
    public static class ReportServiceInfo {
        private String serviceName;
        private String version;
        private String description;
        private String[] supportedFormats;
        private LocalDateTime lastUpdated;

        // Getters and Setters
        public String getServiceName() {
            return serviceName;
        }

        public void setServiceName(String serviceName) {
            this.serviceName = serviceName;
        }

        public String getVersion() {
            return version;
        }

        public void setVersion(String version) {
            this.version = version;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String[] getSupportedFormats() {
            return supportedFormats;
        }

        public void setSupportedFormats(String[] supportedFormats) {
            this.supportedFormats = supportedFormats;
        }

        public LocalDateTime getLastUpdated() {
            return lastUpdated;
        }

        public void setLastUpdated(LocalDateTime lastUpdated) {
            this.lastUpdated = lastUpdated;
        }
    }
}