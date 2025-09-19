package com.HMS.HMS.controller.reports;

import com.HMS.HMS.DTO.reports.*;
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
import java.util.HashMap;

@RestController
@RequestMapping("/api/reports/comprehensive-clinic")
@CrossOrigin(origins = "*")
public class ComprehensiveClinicReportController {

    private final ClinicReportService clinicReportService;
    private final PDFReportGeneratorService pdfReportGenerator;
    private final ChartGenerationService chartGenerationService;

    public ComprehensiveClinicReportController(ClinicReportService clinicReportService,
                                             PDFReportGeneratorService pdfReportGenerator,
                                             ChartGenerationService chartGenerationService) {
        this.clinicReportService = clinicReportService;
        this.pdfReportGenerator = pdfReportGenerator;
        this.chartGenerationService = chartGenerationService;
    }

    /**
     * Get comprehensive clinic statistics report - complete data like the PDF
     */
    @GetMapping("/full-report/{year}")
    public ResponseEntity<ClinicStatisticsReportDTO> getComprehensiveClinicReport(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO report = generateComprehensiveReport(year);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/full-report/{year}/pdf")
    public ResponseEntity<byte[]> downloadComprehensiveReportPDF(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO reportData = generateComprehensiveReport(year);
            byte[] pdfBytes = pdfReportGenerator.generateComprehensiveClinicReportPDF(reportData);

            String filename = String.format("comprehensive-clinic-report-%d-%s.pdf",
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
     * Get individual clinic unit data (like Nephrology Unit 1, Unit 2, etc.)
     */
    @GetMapping("/clinic-units/{year}")
    public ResponseEntity<List<ClinicUnitDataDTO>> getClinicUnitsData(@PathVariable int year) {
        try {
            List<ClinicUnitDataDTO> clinicUnits = List.of(
                createClinicUnit("Nephrology Unit 1", "Nephrology", year),
                createClinicUnit("Nephrology Unit 2", "Nephrology", year),
                createClinicUnit("Professor Unit", "Specialized", year),
                createClinicUnit("Urology and Transplant Clinic", "Surgical", year),
                createClinicUnit("Vascular and Transplant Unit", "Surgical", year),
                createClinicUnit("VP Clinic", "Specialized", year)
            );
            return ResponseEntity.ok(clinicUnits);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get procedure data (ultrasounds, wound dressings, biopsies, etc.)
     */
    @GetMapping("/procedures/{year}")
    public ResponseEntity<List<ProcedureDataDTO>> getProceduresData(@PathVariable int year) {
        try {
            List<ProcedureDataDTO> procedures = List.of(
                createProcedureData("Ultrasound Scans", year),
                createProcedureData("Wound Dressings", year),
                createProcedureData("Radiologist Consultations", year)
            );
            return ResponseEntity.ok(procedures);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get specific clinic unit chart
     */
    @GetMapping("/charts/clinic-unit/{unitName}/{year}")
    public ResponseEntity<byte[]> getClinicUnitChart(
            @PathVariable String unitName,
            @PathVariable int year,
            @RequestParam(defaultValue = "line") String chartType) {
        try {
            // Get monthly data for specific unit
            List<MonthlyVisitDataDTO> monthlyData = getMonthlyDataForUnit(unitName, year);

            String title = String.format("%s - Monthly Visits %d", unitName, year);

            byte[] chartBytes;
            if ("bar".equalsIgnoreCase(chartType)) {
                chartBytes = chartGenerationService.generateMonthlyVisitsBarChart(monthlyData, title);
            } else {
                chartBytes = chartGenerationService.generateMonthlyVisitsLineChart(monthlyData, title);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDisposition(ContentDisposition.inline()
                    .filename(String.format("%s-%d-%s.png",
                        unitName.replaceAll(" ", "-").toLowerCase(), year, chartType)).build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(chartBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get performance dashboard data like the PDF page 13
     */
    @GetMapping("/performance-dashboard/{year}")
    public ResponseEntity<Map<String, Object>> getPerformanceDashboard(@PathVariable int year) {
        try {
            Map<String, Object> dashboard = new HashMap<>();

            // Add clinic units summary
            List<ClinicUnitDataDTO> clinicUnits = List.of(
                createClinicUnit("Nephrology Unit 1", "Nephrology", year),
                createClinicUnit("Nephrology Unit 2", "Nephrology", year),
                createClinicUnit("Professor Unit", "Specialized", year),
                createClinicUnit("Urology and Transplant Clinic", "Surgical", year),
                createClinicUnit("Vascular and Transplant Unit", "Surgical", year)
            );

            dashboard.put("year", year);
            dashboard.put("clinicUnits", clinicUnits);
            dashboard.put("totalPatients", clinicUnits.stream().mapToLong(ClinicUnitDataDTO::getTotalPatients).sum());
            dashboard.put("averageMonthlyVisits", clinicUnits.stream().mapToDouble(ClinicUnitDataDTO::getMonthlyAverage).average().orElse(0));

            // Add nursing staff info
            dashboard.put("nursingLeader", "Mrs. Y.A.C. Jayasinghe");
            dashboard.put("nursingOfficers", 10);
            dashboard.put("supportStaff", 10);

            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Generate biopsies data
     */
    @GetMapping("/biopsies/{year}")
    public ResponseEntity<List<BiopsyDataDTO>> getBiopsiesData(@PathVariable int year) {
        try {
            List<BiopsyDataDTO> biopsyData = List.of(
                new BiopsyDataDTO("Native Renal Biopsies", 21, "Total native renal biopsies conducted"),
                new BiopsyDataDTO("Graft Renal Biopsies", 16, "Total graft renal biopsies conducted")
            );
            return ResponseEntity.ok(biopsyData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Helper methods
    private ClinicStatisticsReportDTO generateComprehensiveReport(int year) {
        // Get basic report
        ClinicStatisticsReportDTO baseReport = clinicReportService.generateClinicStatisticsReport(year);

        // Enhance with additional data
        List<ClinicUnitDataDTO> clinicUnits = List.of(
            createClinicUnit("Nephrology Unit 1", "Nephrology", year),
            createClinicUnit("Nephrology Unit 2", "Nephrology", year),
            createClinicUnit("Professor Unit", "Specialized", year),
            createClinicUnit("Urology and Transplant Clinic", "Surgical", year),
            createClinicUnit("Vascular and Transplant Unit", "Surgical", year),
            createClinicUnit("VP Clinic", "Specialized", year)
        );

        List<ProcedureDataDTO> procedures = List.of(
            createProcedureData("Ultrasound Scans", year),
            createProcedureData("Wound Dressings", year),
            createProcedureData("Radiologist Consultations", year)
        );

        List<BiopsyDataDTO> biopsyData = List.of(
            new BiopsyDataDTO("Native Renal Biopsies", 21, "Total native renal biopsies conducted"),
            new BiopsyDataDTO("Graft Renal Biopsies", 16, "Total graft renal biopsies conducted")
        );

        // Set additional data
        baseReport.setClinicUnits(clinicUnits);
        baseReport.setProcedures(procedures);
        baseReport.setBiopsyData(biopsyData);
        baseReport.setNursingLeader("Mrs. Y.A.C. Jayasinghe");
        baseReport.setNursingOfficers(10);
        baseReport.setSupportStaff(10);

        return baseReport;
    }

    private ClinicUnitDataDTO createClinicUnit(String unitName, String unitType, int year) {
        // This would typically query the database
        // For now, using sample data based on the PDF
        switch (unitName) {
            case "Nephrology Unit 1":
                return new ClinicUnitDataDTO(unitName, unitType, 10580, 881, "October", 977, "April", 749);
            case "Nephrology Unit 2":
                return new ClinicUnitDataDTO(unitName, unitType, 8037, 669, "December", 753, "February", 523);
            case "Professor Unit":
                return new ClinicUnitDataDTO(unitName, unitType, 653, 54, "October", 89, "December", 32);
            case "Urology and Transplant Clinic":
                return new ClinicUnitDataDTO(unitName, unitType, 3395, 282, "November", 373, "April", 156);
            case "Vascular and Transplant Unit":
                return new ClinicUnitDataDTO(unitName, unitType, 1602, 133, "July", 164, "March", 104);
            case "VP Clinic":
                return new ClinicUnitDataDTO(unitName, unitType, 1236, 103, "June", 156, "January", 57);
            default:
                return new ClinicUnitDataDTO(unitName, unitType, 0, 0, "N/A", 0, "N/A", 0);
        }
    }

    private ProcedureDataDTO createProcedureData(String procedureType, int year) {
        // Sample data based on the PDF
        switch (procedureType) {
            case "Ultrasound Scans":
                return new ProcedureDataDTO(procedureType, 1710, 142, "May", 171, "April", 77, null);
            case "Wound Dressings":
                return new ProcedureDataDTO(procedureType, 2164, 180, "June", 205, "September", 140, null);
            case "Radiologist Consultations":
                return new ProcedureDataDTO(procedureType, 1759, 146, "May/June", 173, "April", 80, null);
            default:
                return new ProcedureDataDTO(procedureType, 0, 0, "N/A", 0, "N/A", 0, null);
        }
    }

    private List<MonthlyVisitDataDTO> getMonthlyDataForUnit(String unitName, int year) {
        // Sample monthly data - this would come from database
        // Based on PDF data for Nephrology Unit 1
        return List.of(
            new MonthlyVisitDataDTO(1, "January", 938, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(2, "February", 785, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(3, "March", 956, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(4, "April", 749, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(5, "May", 855, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(6, "June", 923, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(7, "July", 897, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(8, "August", 972, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(9, "September", 831, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(10, "October", 977, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(11, "November", 899, unitName, 0L, 0.0),
            new MonthlyVisitDataDTO(12, "December", 798, unitName, 0L, 0.0)
        );
    }
}