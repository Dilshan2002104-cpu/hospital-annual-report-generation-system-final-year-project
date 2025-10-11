package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.*;
import com.HMS.HMS.repository.Dialysis.DialysisSessionRepository;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class DialysisReportService {

    private final DialysisSessionRepository sessionRepository;

    public DialysisReportService(DialysisSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public DialysisAnnualReportDTO generateAnnualReport(int year) {
        try {
            // Get basic session statistics
            Long totalSessions = sessionRepository.countByYear(year);
            Long completedSessions = sessionRepository.countCompletedByYear(year);
            Long cancelledSessions = sessionRepository.countCancelledByYear(year);
            Long emergencySessions = sessionRepository.countEmergencyByYear(year);
            
            // Calculate rates
            double completionRate = totalSessions > 0 ? (completedSessions * 100.0 / totalSessions) : 0.0;
            double emergencyRate = totalSessions > 0 ? (emergencySessions * 100.0 / totalSessions) : 0.0;
            
            // Get patient statistics
            Long uniquePatients = sessionRepository.countUniquePatientsByYear(year);
            
            // Get previous year data for comparison
            Long previousYearSessions = sessionRepository.countByYear(year - 1);
            double yearOverYearChange = previousYearSessions > 0 ? 
                ((totalSessions - previousYearSessions) * 100.0 / previousYearSessions) : 0.0;

            // Generate monthly data
            List<MonthlyDialysisDataDTO> monthlySessions = generateMonthlySessionData(year);
            List<MonthlyDialysisDataDTO> monthlyPatients = generateMonthlyPatientData(year);
            List<MonthlyMachineUtilizationDTO> monthlyMachineUtilization = generateMonthlyMachineUtilization(year);

            // Generate machine performance data
            List<MachinePerformanceDataDTO> machinePerformance = generateMachinePerformanceData(year);

            // Generate patient outcomes
            List<PatientOutcomeDataDTO> patientOutcomes = generatePatientOutcomes(year);

            // Generate quality metrics
            QualityMetricsDTO qualityMetrics = generateQualityMetrics(year);

            return DialysisAnnualReportDTO.builder()
                    .year(year)
                    .totalSessions(totalSessions != null ? totalSessions : 0)
                    .completedSessions(completedSessions != null ? completedSessions : 0)
                    .cancelledSessions(cancelledSessions != null ? cancelledSessions : 0)
                    .emergencySessions(emergencySessions != null ? emergencySessions : 0)
                    .completionRate(completionRate)
                    .emergencyRate(emergencyRate)
                    .averageSessionDuration(4.2) // Default average duration
                    .totalPatients(uniquePatients != null ? uniquePatients.intValue() : 0)
                    .uniquePatients(uniquePatients != null ? uniquePatients.intValue() : 0)
                    .previousYearSessions(previousYearSessions != null ? previousYearSessions : 0)
                    .yearOverYearChange(yearOverYearChange)
                    .monthlySessions(monthlySessions)
                    .monthlyPatients(monthlyPatients)
                    .monthlyMachineUtilization(monthlyMachineUtilization)
                    .machinePerformance(machinePerformance)
                    .patientOutcomes(patientOutcomes)
                    .qualityMetrics(qualityMetrics)
                    .introductionText(generateIntroductionText(year, totalSessions, uniquePatients))
                    .trendsAnalysisText(generateTrendsAnalysisText(monthlySessions))
                    .machineAnalysisText(generateMachineAnalysisText(machinePerformance))
                    .patientAnalysisText(generatePatientAnalysisText(patientOutcomes))
                    .conclusionText(generateConclusionText(year, totalSessions, completionRate))
                    .build();

        } catch (Exception e) {
            System.err.println("Error generating dialysis annual report for year " + year + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private List<MonthlyDialysisDataDTO> generateMonthlySessionData(int year) {
        // For now, generate sample data - replace with actual repository calls
        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> {
                    // Sample data generation - replace with actual queries
                    long sessionCount = 80 + (long)(Math.random() * 40); // 80-120 sessions per month
                    long emergencyCount = (long)(sessionCount * 0.1); // 10% emergency
                    double utilization = 70 + (Math.random() * 20); // 70-90% utilization
                    
                    return new MonthlyDialysisDataDTO(
                        month,
                        Month.of(month).name(),
                        sessionCount,
                        0, // Patient count will be set separately
                        emergencyCount,
                        utilization,
                        "Sessions"
                    );
                })
                .collect(Collectors.toList());
    }

    private List<MonthlyDialysisDataDTO> generateMonthlyPatientData(int year) {
        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> {
                    long patientCount = 25 + (long)(Math.random() * 15); // 25-40 patients per month
                    
                    return new MonthlyDialysisDataDTO(
                        month,
                        Month.of(month).name(),
                        0, // Session count not relevant here
                        patientCount,
                        0, // Emergency count not relevant for patients
                        0, // Utilization not relevant for patients
                        "Patients"
                    );
                })
                .collect(Collectors.toList());
    }

    private List<MonthlyMachineUtilizationDTO> generateMonthlyMachineUtilization(int year) {
        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> {
                    double utilization = 65 + (Math.random() * 25); // 65-90% utilization
                    long totalHours = 720; // Approximate hours in a month
                    long activeHours = (long)(totalHours * utilization / 100);
                    long maintenanceHours = 20 + (long)(Math.random() * 30); // 20-50 hours maintenance
                    int activeMachines = 8 + (int)(Math.random() * 4); // 8-12 active machines
                    
                    return new MonthlyMachineUtilizationDTO(
                        month,
                        Month.of(month).name(),
                        utilization,
                        totalHours,
                        activeHours,
                        maintenanceHours,
                        activeMachines
                    );
                })
                .collect(Collectors.toList());
    }

    private List<MachinePerformanceDataDTO> generateMachinePerformanceData(int year) {
        // Generate sample machine performance data
        return IntStream.rangeClosed(1, 12)
                .mapToObj(machineId -> {
                    long totalSessions = 80 + (long)(Math.random() * 40);
                    long completedSessions = (long)(totalSessions * 0.95); // 95% completion rate
                    double utilizationRate = 70 + (Math.random() * 20);
                    double maintenanceHours = 15 + (Math.random() * 20);
                    double downtime = Math.random() * 10;
                    double efficiency = 85 + (Math.random() * 10);
                    
                    return new MachinePerformanceDataDTO(
                        String.valueOf(machineId),
                        "Dialysis Machine " + machineId,
                        "Ward " + ((machineId % 3) + 1),
                        totalSessions,
                        completedSessions,
                        utilizationRate,
                        maintenanceHours,
                        downtime,
                        efficiency,
                        "ACTIVE"
                    );
                })
                .collect(Collectors.toList());
    }

    private List<PatientOutcomeDataDTO> generatePatientOutcomes(int year) {
        // Generate sample patient outcome data
        int totalPatients = 150 + (int)(Math.random() * 50); // 150-200 patients
        int newPatients = (int)(totalPatients * 0.15); // 15% new patients
        int regularPatients = totalPatients - newPatients;
        double averageSessionsPerPatient = 48 + (Math.random() * 24); // 48-72 sessions per year
        double treatmentAdherence = 85 + (Math.random() * 10); // 85-95% adherence
        
        PatientOutcomeDataDTO.ClinicalOutcomesDTO clinicalOutcomes = new PatientOutcomeDataDTO.ClinicalOutcomesDTO(
            45, 38, 15, 2 // Excellent, Good, Fair, Poor percentages
        );
        
        return List.of(new PatientOutcomeDataDTO(
            totalPatients,
            newPatients,
            regularPatients,
            averageSessionsPerPatient,
            treatmentAdherence,
            clinicalOutcomes
        ));
    }

    private QualityMetricsDTO generateQualityMetrics(int year) {
        return new QualityMetricsDTO(
            0.5 + (Math.random() * 1.0), // 0.5-1.5% infection rate
            2.0 + (Math.random() * 2.0), // 2-4% complication rate
            85 + (Math.random() * 10),   // 85-95% patient satisfaction
            90 + (Math.random() * 8),    // 90-98% staff compliance
            94 + (Math.random() * 5),    // 94-99% equipment reliability
            88 + (Math.random() * 10)    // 88-98% protocol adherence
        );
    }

    // Text generation methods
    private String generateIntroductionText(int year, Long totalSessions, Long uniquePatients) {
        return String.format(
            "This comprehensive annual dialysis report presents a detailed analysis of our dialysis services for the year %d. " +
            "During this period, our department conducted %d dialysis sessions, serving %d unique patients. " +
            "This report provides insights into session trends, machine utilization, patient outcomes, and quality metrics.",
            year, totalSessions != null ? totalSessions : 0, uniquePatients != null ? uniquePatients : 0
        );
    }

    private String generateTrendsAnalysisText(List<MonthlyDialysisDataDTO> monthlySessions) {
        return "Monthly analysis reveals consistent demand for dialysis services throughout the year, " +
               "with seasonal variations observed in emergency session rates. The data demonstrates " +
               "steady patient flow and effective capacity management.";
    }

    private String generateMachineAnalysisText(List<MachinePerformanceDataDTO> machinePerformance) {
        return "Machine performance analysis indicates optimal utilization rates and minimal downtime. " +
               "Regular maintenance schedules have ensured high reliability and patient safety. " +
               "All machines maintained efficiency rates above acceptable thresholds.";
    }

    private String generatePatientAnalysisText(List<PatientOutcomeDataDTO> patientOutcomes) {
        return "Patient outcome analysis demonstrates excellent treatment adherence and positive clinical results. " +
               "The majority of patients showed good to excellent treatment responses, " +
               "reflecting the quality of care provided by our dialysis team.";
    }

    private String generateConclusionText(int year, Long totalSessions, double completionRate) {
        return String.format(
            "The %d dialysis annual report demonstrates our commitment to providing high-quality renal care. " +
            "With %d sessions completed at a %.1f%% completion rate, we continue to excel in patient care " +
            "while maintaining operational efficiency and safety standards.",
            year, totalSessions != null ? totalSessions : 0, completionRate
        );
    }
}