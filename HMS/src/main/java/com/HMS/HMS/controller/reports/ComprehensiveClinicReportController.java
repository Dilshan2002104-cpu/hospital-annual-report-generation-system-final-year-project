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
    @GetMapping("/debug/{year}")
    public ResponseEntity<String> debugReport(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO baseReport = clinicReportService.generateClinicStatisticsReport(year);
            return ResponseEntity.ok("Base report generated successfully. Appointments: " + baseReport.getTotalAppointments());
        } catch (Exception e) {
            return ResponseEntity.ok("Error in base report: " + e.getMessage() + " - " + e.getClass().getSimpleName());
        }
    }

    @GetMapping("/full-report/{year}")
    public ResponseEntity<ClinicStatisticsReportDTO> getComprehensiveClinicReport(@PathVariable int year) {
        try {
            ClinicStatisticsReportDTO report = generateComprehensiveReport(year);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            // For debugging - include error in response
            ClinicStatisticsReportDTO errorReport = new ClinicStatisticsReportDTO();
            errorReport.setYear(year);
            errorReport.setIntroductionText("Error: " + e.getMessage() + " - " + e.getClass().getSimpleName());
            return ResponseEntity.ok(errorReport);
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
            List<BiopsyDataDTO> biopsyData = generateBiopsyData(year);
            return ResponseEntity.ok(biopsyData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Helper methods
    private ClinicStatisticsReportDTO generateComprehensiveReport(int year) {
        // Get basic report
        ClinicStatisticsReportDTO baseReport;
        try {
            baseReport = clinicReportService.generateClinicStatisticsReport(year);
        } catch (Exception e) {
            // If base report fails, create a minimal report with error info
            baseReport = new ClinicStatisticsReportDTO();
            baseReport.setYear(year);
            baseReport.setTotalAppointments(0);
            baseReport.setTotalAdmissions(0);
            // Log error for debugging
            System.err.println("Error generating base report: " + e.getMessage());
            e.printStackTrace();
        }

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

        List<BiopsyDataDTO> biopsyData = generateBiopsyData(year);

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
        try {
            // Get the specialization mapping for clinic units
            String specialization = getSpecializationForUnit(unitName);

            // Get monthly data for this specialization and year
            List<MonthlyVisitDataDTO> monthlyData = clinicReportService.getMonthlyAppointmentsBySpecialization(year, specialization);

            // Calculate total visits for the year
            long totalVisits = monthlyData.stream().mapToLong(MonthlyVisitDataDTO::getPatientCount).sum();

            // Calculate monthly average
            long monthlyAverage = totalVisits > 0 ? totalVisits / 12 : 0;

            // Find highest and lowest months
            MonthlyVisitDataDTO highestMonth = monthlyData.stream()
                .max((a, b) -> Long.compare(a.getPatientCount(), b.getPatientCount()))
                .orElse(new MonthlyVisitDataDTO(1, "January", 0L, specialization, 0L, 0.0));

            MonthlyVisitDataDTO lowestMonth = monthlyData.stream()
                .min((a, b) -> Long.compare(a.getPatientCount(), b.getPatientCount()))
                .orElse(new MonthlyVisitDataDTO(1, "January", 0L, specialization, 0L, 0.0));

            return new ClinicUnitDataDTO(
                unitName,
                unitType,
                totalVisits,
                monthlyAverage,
                highestMonth.getMonthName(),
                highestMonth.getPatientCount(),
                lowestMonth.getMonthName(),
                lowestMonth.getPatientCount()
            );
        } catch (Exception e) {
            // Return default data if database query fails
            return new ClinicUnitDataDTO(unitName, unitType, 0, 0, "N/A", 0, "N/A", 0);
        }
    }

    private String getSpecializationForUnit(String unitName) {
        // Map clinic unit names to doctor specializations in the database
        switch (unitName) {
            case "Nephrology Unit 1":
            case "Nephrology Unit 2":
                return "Nephrology";
            case "Urology and Transplant Clinic":
                return "Urology";
            case "Vascular and Transplant Unit":
                return "Vascular Surgery";
            case "Professor Unit":
            case "VP Clinic":
                return "Internal Medicine";
            default:
                return "General Medicine";
        }
    }

    private ProcedureDataDTO createProcedureData(String procedureType, int year) {
        try {
            // Get total appointments for the year as a basis for procedure estimation
            Long totalAppointments = clinicReportService.generateClinicStatisticsReport(year).getTotalAppointments();

            if (totalAppointments == null || totalAppointments == 0) {
                return new ProcedureDataDTO(procedureType, 0, 0, "N/A", 0, "N/A", 0, null);
            }

            // Get monthly appointment data to find peak months
            List<MonthlyVisitDataDTO> monthlyData = clinicReportService.generateClinicStatisticsReport(year).getMonthlyAppointments();

            // Find highest and lowest months
            MonthlyVisitDataDTO highestMonth = monthlyData.stream()
                .max((a, b) -> Long.compare(a.getPatientCount(), b.getPatientCount()))
                .orElse(new MonthlyVisitDataDTO(1, "January", 0L, "Appointments", 0L, 0.0));

            MonthlyVisitDataDTO lowestMonth = monthlyData.stream()
                .min((a, b) -> Long.compare(a.getPatientCount(), b.getPatientCount()))
                .orElse(new MonthlyVisitDataDTO(1, "January", 0L, "Appointments", 0L, 0.0));

            // Estimate procedures based on appointment types and frequency
            long estimatedTotal;
            double procedureRate;

            switch (procedureType) {
                case "Ultrasound Scans":
                    procedureRate = 0.15; // ~15% of appointments involve ultrasound
                    break;
                case "Wound Dressings":
                    procedureRate = 0.20; // ~20% of appointments involve wound care
                    break;
                case "Radiologist Consultations":
                    procedureRate = 0.12; // ~12% of appointments need radiology
                    break;
                default:
                    procedureRate = 0.10; // Default 10%
                    break;
            }

            estimatedTotal = Math.round(totalAppointments * procedureRate);
            long monthlyAverage = estimatedTotal > 0 ? estimatedTotal / 12 : 0;

            // Scale the highest/lowest month values proportionally
            long highestValue = Math.round(highestMonth.getPatientCount() * procedureRate);
            long lowestValue = Math.round(lowestMonth.getPatientCount() * procedureRate);

            return new ProcedureDataDTO(
                procedureType,
                estimatedTotal,
                monthlyAverage,
                highestMonth.getMonthName(),
                highestValue,
                lowestMonth.getMonthName(),
                lowestValue,
                null
            );
        } catch (Exception e) {
            return new ProcedureDataDTO(procedureType, 0, 0, "N/A", 0, "N/A", 0, null);
        }
    }

    private List<MonthlyVisitDataDTO> getMonthlyDataForUnit(String unitName, int year) {
        try {
            // Get the specialization for this unit
            String specialization = getSpecializationForUnit(unitName);

            // Get monthly data from the database for this specialization and year
            return clinicReportService.getMonthlyAppointmentsBySpecialization(year, specialization);
        } catch (Exception e) {
            // Return empty data if query fails
            List<MonthlyVisitDataDTO> emptyData = new java.util.ArrayList<>();
            for (int month = 1; month <= 12; month++) {
                emptyData.add(new MonthlyVisitDataDTO(
                    month,
                    java.time.Month.of(month).name(),
                    0L,
                    unitName,
                    0L,
                    0.0
                ));
            }
            return emptyData;
        }
    }

    private List<BiopsyDataDTO> generateBiopsyData(int year) {
        try {
            // Get nephrology-related appointments as a basis for biopsy estimation
            List<MonthlyVisitDataDTO> nephrologyData = clinicReportService.getMonthlyAppointmentsBySpecialization(year, "Nephrology");
            long totalNephrologyVisits = nephrologyData.stream().mapToLong(MonthlyVisitDataDTO::getPatientCount).sum();

            // Estimate biopsies based on nephrology visits
            // Typically 2-3% of nephrology visits might require biopsies
            long estimatedNativeBiopsies = Math.round(totalNephrologyVisits * 0.025); // 2.5% for native
            long estimatedGraftBiopsies = Math.round(totalNephrologyVisits * 0.015); // 1.5% for graft

            // Ensure minimum values if there are visits
            if (totalNephrologyVisits > 0) {
                estimatedNativeBiopsies = Math.max(estimatedNativeBiopsies, 5);
                estimatedGraftBiopsies = Math.max(estimatedGraftBiopsies, 3);
            }

            return List.of(
                new BiopsyDataDTO(
                    "Native Renal Biopsies",
                    (int) estimatedNativeBiopsies,
                    String.format("Estimated native renal biopsies for %d based on nephrology visits", year)
                ),
                new BiopsyDataDTO(
                    "Graft Renal Biopsies",
                    (int) estimatedGraftBiopsies,
                    String.format("Estimated graft renal biopsies for %d based on nephrology visits", year)
                )
            );
        } catch (Exception e) {
            // Return default data if calculation fails
            return List.of(
                new BiopsyDataDTO("Native Renal Biopsies", 0, "Data unavailable for " + year),
                new BiopsyDataDTO("Graft Renal Biopsies", 0, "Data unavailable for " + year)
            );
        }
    }
}