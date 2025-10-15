package com.HMS.HMS.controller.reports;

import com.HMS.HMS.service.reports.PharmacyReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacy/reports")
@CrossOrigin(origins = "*")
public class PharmacyReportController {

    private final PharmacyReportService reportService;

    @Autowired
    public PharmacyReportController(PharmacyReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Test endpoint to verify API is working
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Pharmacy reports API is working");
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    /**
     * Get annual pharmacy report data
     */
    @GetMapping("/annual/{year}")
    public ResponseEntity<Map<String, Object>> getAnnualReport(@PathVariable int year) {
        try {
            Map<String, Object> reportData = reportService.generateAnnualReportData(year);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Annual pharmacy report data retrieved successfully");
            response.put("data", reportData);
            response.put("year", year);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            // Handle no data available for year
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            errorResponse.put("error", "NoDataAvailable");
            errorResponse.put("year", year);
            
            return ResponseEntity.badRequest().body(errorResponse);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve annual report data: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Download annual pharmacy report as PDF
     */
    @GetMapping("/annual/{year}/pdf")
    public ResponseEntity<byte[]> downloadAnnualReportPDF(@PathVariable int year) {
        try {
            System.out.println("📄 Generating pharmacy annual report PDF for year: " + year);
            
            // Get report data
            Map<String, Object> reportData = reportService.generateAnnualReportData(year);
            System.out.println("📊 Report data generated. Keys: " + reportData.keySet());
            
            if (reportData.isEmpty()) {
                System.out.println("⚠️ No pharmacy data found for year " + year);
                return ResponseEntity.notFound()
                    .header("X-Message", "No pharmacy data found for year " + year + ". Cannot generate PDF.")
                    .build();
            }

            // Generate PDF
            System.out.println("🔄 Generating PDF...");
            byte[] pdfBytes = reportService.generateAnnualReportPDF(reportData, year);
            System.out.println("✅ PDF generated successfully. Size: " + pdfBytes.length + " bytes");

            // Set headers for PDF download
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                String.format("Pharmacy_Annual_Report_%d.pdf", year));
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            // Handle no data available for year
            System.out.println("❌ No data available for year " + year + ": " + e.getMessage());
            return ResponseEntity.badRequest()
                .header("X-Message", e.getMessage())
                .build();
                
        } catch (Exception e) {
            System.err.println("❌ Error generating pharmacy annual report PDF: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .header("X-Message", "Error generating PDF: " + e.getMessage())
                .build();
        }
    }

    /**
     * Get monthly prescription trends for a specific year
     */
    @GetMapping("/prescription-trends/{year}")
    public ResponseEntity<Map<String, Object>> getMonthlyPrescriptionTrends(@PathVariable int year) {
        try {
            Map<String, Object> trendsData = reportService.getMonthlyPrescriptionTrends(year);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Monthly prescription trends retrieved successfully");
            response.put("data", trendsData);
            response.put("year", year);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve prescription trends: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get top dispensed medications for a specific year
     */
    @GetMapping("/top-medications/{year}")
    public ResponseEntity<Map<String, Object>> getTopDispensedMedications(@PathVariable int year) {
        try {
            Map<String, Object> medicationsData = reportService.getTopDispensedMedications(year);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Top dispensed medications retrieved successfully");
            response.put("data", medicationsData);
            response.put("year", year);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve top medications: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}