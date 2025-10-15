package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.transferDTO.TransferResponseDTO;
import com.HMS.HMS.service.TransferService;
import com.HMS.HMS.service.reports.PatientTransferPDFService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/reports/transfers")
@CrossOrigin(origins = "http://localhost:3000")
public class TransferReportController {

    private final TransferService transferService;
    private final PatientTransferPDFService pdfService;

    public TransferReportController(TransferService transferService, 
                                   PatientTransferPDFService pdfService) {
        this.transferService = transferService;
        this.pdfService = pdfService;
    }

    /**
     * Generate professional PDF report for patient's transfer history
     */
    @GetMapping("/patient/{patientNationalId}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'WARD_NURSE', 'DOCTOR')")
    public ResponseEntity<byte[]> generatePatientTransferReport(@PathVariable String patientNationalId) {
        try {
            // Check if patient has transfer history
            List<TransferResponseDTO> transfers = transferService.getTransferHistory(patientNationalId);
            if (transfers.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Generate professional PDF
            byte[] pdfBytes = pdfService.generatePatientTransferPDF(patientNationalId);
            
            String patientName = transfers.get(0).getPatientName().replaceAll("\\s+", "_");
            String filename = String.format("Transfer_Report_%s_%s_%s.pdf", 
                    patientName,
                    patientNationalId,
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error generating transfer report: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Error generating transfer report: " + e.getMessage()).getBytes());
        }
    }

    /**
     * Preview PDF report for patient's transfer history (inline display)
     */
    @GetMapping("/patient/{patientNationalId}/preview")
    @PreAuthorize("hasAnyRole('ADMIN', 'WARD_NURSE', 'DOCTOR')")
    public ResponseEntity<byte[]> previewPatientTransferReport(@PathVariable String patientNationalId) {
        try {
            // Check if patient has transfer history
            List<TransferResponseDTO> transfers = transferService.getTransferHistory(patientNationalId);
            if (transfers.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Generate professional PDF
            byte[] pdfBytes = pdfService.generatePatientTransferPDF(patientNationalId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "transfer_report_preview.pdf");
            headers.setContentLength(pdfBytes.length);
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error generating transfer report preview: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Error generating transfer report preview: " + e.getMessage()).getBytes());
        }
    }

    /**
     * Check if patient has transfer history
     */
    @GetMapping("/patient/{patientNationalId}/exists")
    @PreAuthorize("hasAnyRole('ADMIN', 'WARD_NURSE', 'DOCTOR')")
    public ResponseEntity<Boolean> checkTransferHistoryExists(@PathVariable String patientNationalId) {
        try {
            List<TransferResponseDTO> transfers = transferService.getTransferHistory(patientNationalId);
            return ResponseEntity.ok(!transfers.isEmpty());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }
}