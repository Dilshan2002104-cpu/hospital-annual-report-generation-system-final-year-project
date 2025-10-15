package com.HMS.HMS.controller.reports;

import com.HMS.HMS.DTO.reports.DialysisAnnualReportDTO;
import com.HMS.HMS.service.reports.DialysisReportService;
import com.HMS.HMS.service.reports.PDFReportGeneratorService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dialysis/reports")
@CrossOrigin(origins = "*")
public class DialysisReportController {

    private final DialysisReportService dialysisReportService;
    private final PDFReportGeneratorService pdfGeneratorService;

    public DialysisReportController(DialysisReportService dialysisReportService,
                                   PDFReportGeneratorService pdfGeneratorService) {
        this.dialysisReportService = dialysisReportService;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    /**
     * Get dialysis annual report data as JSON
     */
    @GetMapping("/annual/{year}")
    public ResponseEntity<DialysisAnnualReportDTO> getAnnualReport(@PathVariable int year) {
        try {
            DialysisAnnualReportDTO report = dialysisReportService.generateAnnualReport(year);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Download dialysis annual report as PDF
     */
    @GetMapping("/annual/{year}/pdf")
    public ResponseEntity<byte[]> downloadAnnualReportPDF(@PathVariable int year) {
        try {
            // Generate the report data
            DialysisAnnualReportDTO report = dialysisReportService.generateAnnualReport(year);
            
            // Generate PDF
            byte[] pdfBytes = pdfGeneratorService.generateDialysisAnnualReportPDF(report);
            
            // Set headers for PDF download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                String.format("Dialysis_Annual_Report_%d.pdf", year));
            headers.setContentLength(pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("Error generating dialysis annual report PDF: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get comprehensive dialysis report with quarterly breakdown
     */
    @GetMapping("/comprehensive/{year}/{quarter}")
    public ResponseEntity<DialysisAnnualReportDTO> getComprehensiveReport(
            @PathVariable int year, 
            @PathVariable String quarter) {
        try {
            // For now, return annual report regardless of quarter
            // This can be enhanced to filter by quarter
            DialysisAnnualReportDTO report = dialysisReportService.generateAnnualReport(year);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Export comprehensive dialysis report as PDF
     */
    @GetMapping("/comprehensive/export-pdf/{year}/{quarter}")
    public ResponseEntity<byte[]> exportComprehensiveReportPDF(
            @PathVariable int year, 
            @PathVariable String quarter) {
        try {
            DialysisAnnualReportDTO report = dialysisReportService.generateAnnualReport(year);
            byte[] pdfBytes = pdfGeneratorService.generateDialysisAnnualReportPDF(report);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                String.format("Comprehensive_Dialysis_Report_%d_%s.pdf", year, quarter));
            headers.setContentLength(pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("Error generating comprehensive dialysis report PDF: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get machine-specific performance report
     */
    @GetMapping("/machine-performance/{machineId}/{year}")
    public ResponseEntity<DialysisAnnualReportDTO> getMachinePerformanceReport(
            @PathVariable String machineId,
            @PathVariable int year) {
        try {
            // This would be enhanced to filter by specific machine
            DialysisAnnualReportDTO report = dialysisReportService.generateAnnualReport(year);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Export machine performance report as PDF
     */
    @GetMapping("/machine-performance/export-pdf/{machineId}/{year}")
    public ResponseEntity<byte[]> exportMachinePerformanceReportPDF(
            @PathVariable String machineId,
            @PathVariable int year) {
        try {
            DialysisAnnualReportDTO report = dialysisReportService.generateAnnualReport(year);
            byte[] pdfBytes = pdfGeneratorService.generateDialysisAnnualReportPDF(report);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                String.format("Machine_Performance_Report_%s_%d.pdf", machineId, year));
            headers.setContentLength(pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("Error generating machine performance report PDF: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get patient analytics report
     */
    @GetMapping("/patient-analytics/{year}/{quarter}")
    public ResponseEntity<DialysisAnnualReportDTO> getPatientAnalyticsReport(
            @PathVariable int year,
            @PathVariable String quarter) {
        try {
            DialysisAnnualReportDTO report = dialysisReportService.generateAnnualReport(year);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Export patient analytics report as PDF
     */
    @GetMapping("/patient-analytics/export-pdf/{year}/{quarter}")
    public ResponseEntity<byte[]> exportPatientAnalyticsReportPDF(
            @PathVariable int year,
            @PathVariable String quarter) {
        try {
            DialysisAnnualReportDTO report = dialysisReportService.generateAnnualReport(year);
            byte[] pdfBytes = pdfGeneratorService.generateDialysisAnnualReportPDF(report);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                String.format("Patient_Analytics_Report_%d_%s.pdf", year, quarter));
            headers.setContentLength(pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            System.err.println("Error generating patient analytics report PDF: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get machine-wise patient trends data
     */
    @GetMapping("/machine-trends/{year}")
    public ResponseEntity<?> getMachineWisePatientTrends(@PathVariable int year) {
        try {
            DialysisAnnualReportDTO report = dialysisReportService.generateAnnualReport(year);
            return ResponseEntity.ok(report.getMachineWisePatientTrends());
        } catch (Exception e) {
            System.err.println("Error getting machine-wise patient trends: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}