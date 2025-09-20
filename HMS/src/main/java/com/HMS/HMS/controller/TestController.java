package com.HMS.HMS.controller;

import com.HMS.HMS.service.reports.ClinicReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    private final ClinicReportService clinicReportService;

    public TestController(ClinicReportService clinicReportService) {
        this.clinicReportService = clinicReportService;
    }

    @GetMapping("/report-debug/{year}")
    public ResponseEntity<String> testReportGeneration(@PathVariable int year) {
        try {
            // Test the basic report generation step by step
            var report = clinicReportService.generateClinicStatisticsReport(year);
            return ResponseEntity.ok("Report generated successfully. Total appointments: " + report.getTotalAppointments());
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage() + " - " + e.getClass().getSimpleName());
        }
    }
}