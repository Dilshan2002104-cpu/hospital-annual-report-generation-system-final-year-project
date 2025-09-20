package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.*;
import com.HMS.HMS.repository.projection.MonthlyVisitsProjection;
import com.HMS.HMS.repository.projection.SpecializationVisitsProjection;
import com.HMS.HMS.repository.projection.WardOccupancyProjection;
import com.HMS.HMS.repository.reports.ClinicReportRepository;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ClinicReportService {

    private final ClinicReportRepository clinicReportRepository;
    private final ReportTextGeneratorService textGeneratorService;

    public ClinicReportService(ClinicReportRepository clinicReportRepository,
                              ReportTextGeneratorService textGeneratorService) {
        this.clinicReportRepository = clinicReportRepository;
        this.textGeneratorService = textGeneratorService;
    }

    public ClinicStatisticsReportDTO generateClinicStatisticsReport(int year) {
        // Get basic metrics
        Long totalAppointments = clinicReportRepository.getTotalAppointmentsByYear(year);
        Long totalAdmissions = clinicReportRepository.getTotalAdmissionsByYear(year);

        // Get previous year data for comparison
        Long previousYearAppointments = clinicReportRepository.getTotalAppointmentsByYear(year - 1);

        // Get monthly data
        List<MonthlyVisitDataDTO> monthlyAppointments = getMonthlyAppointmentData(year);
        List<MonthlyVisitDataDTO> monthlyAdmissions = getMonthlyAdmissionData(year);

        // Get specialization breakdown
        List<SpecializationDataDTO> specializationData = getSpecializationBreakdown(year, totalAppointments);

        // Get ward occupancy data
        List<WardOccupancyDataDTO> wardOccupancyData = getWardOccupancyData(year);

        // Generate text content
        return ClinicStatisticsReportDTO.builder()
                .year(year)
                .totalAppointments(totalAppointments != null ? totalAppointments : 0)
                .totalAdmissions(totalAdmissions != null ? totalAdmissions : 0)
                .previousYearAppointments(previousYearAppointments != null ? previousYearAppointments : 0)
                .monthlyAppointments(monthlyAppointments)
                .monthlyAdmissions(monthlyAdmissions)
                .specializationBreakdown(specializationData)
                .wardOccupancy(wardOccupancyData)
                .introductionText(textGeneratorService.generateIntroductionText(year, totalAppointments, totalAdmissions))
                .trendsAnalysisText(textGeneratorService.generateTrendsAnalysis(monthlyAppointments, monthlyAdmissions))
                .impactAnalysisText(textGeneratorService.generateImpactAnalysis(year, totalAppointments, previousYearAppointments))
                .conclusionText(textGeneratorService.generateConclusionText(specializationData, wardOccupancyData))
                .build();
    }

    private List<MonthlyVisitDataDTO> getMonthlyAppointmentData(int year) {
        List<MonthlyVisitsProjection> rawData = clinicReportRepository.getMonthlyAppointmentsBySpecialization(year);

        // Group by month and aggregate across specializations
        Map<Integer, Long> monthlyTotals = rawData.stream()
                .collect(Collectors.groupingBy(
                    MonthlyVisitsProjection::getMonth,
                    Collectors.summingLong(MonthlyVisitsProjection::getVisitCount)
                ));

        // Create complete monthly data (including months with zero visits)
        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> new MonthlyVisitDataDTO(
                    month,
                    Month.of(month).name(),
                    monthlyTotals.getOrDefault(month, 0L),
                    "Appointments",
                    0L, // Previous year data can be added later if needed
                    0.0  // Change percentage can be calculated later if needed
                ))
                .collect(Collectors.toList());
    }

    private List<MonthlyVisitDataDTO> getMonthlyAdmissionData(int year) {
        List<MonthlyVisitsProjection> rawData = clinicReportRepository.getMonthlyAdmissionsByWardType(year);

        // Group by month and aggregate across ward types
        Map<Integer, Long> monthlyTotals = rawData.stream()
                .collect(Collectors.groupingBy(
                    MonthlyVisitsProjection::getMonth,
                    Collectors.summingLong(MonthlyVisitsProjection::getVisitCount)
                ));

        // Create complete monthly data
        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> new MonthlyVisitDataDTO(
                    month,
                    Month.of(month).name(),
                    monthlyTotals.getOrDefault(month, 0L),
                    "Admissions",
                    0L,
                    0.0
                ))
                .collect(Collectors.toList());
    }

    private List<SpecializationDataDTO> getSpecializationBreakdown(int year, Long totalAppointments) {
        List<SpecializationVisitsProjection> rawData = clinicReportRepository.getSpecializationSummary(year);

        return rawData.stream()
                .map(projection -> new SpecializationDataDTO(
                    projection.getSpecialization(),
                    projection.getVisitCount(),
                    projection.getAverageVisitsPerMonth(),
                    totalAppointments != null && totalAppointments > 0 ?
                        (projection.getVisitCount() * 100.0 / totalAppointments) : 0.0
                ))
                .collect(Collectors.toList());
    }

    private List<WardOccupancyDataDTO> getWardOccupancyData(int year) {
        List<WardOccupancyProjection> rawData = clinicReportRepository.getWardOccupancyAnalysis(year);

        return rawData.stream()
                .map(projection -> new WardOccupancyDataDTO(
                    projection.getWardName(),
                    projection.getWardType(),
                    projection.getTotalAdmissions(),
                    projection.getActiveAdmissions(),
                    projection.getOccupancyRate()
                ))
                .collect(Collectors.toList());
    }

    public List<MonthlyVisitDataDTO> getMonthlyAppointmentsBySpecialization(int year, String specialization) {
        List<MonthlyVisitsProjection> rawData = clinicReportRepository.getMonthlyAppointmentsBySpecialization(year);

        // Filter by specialization if provided
        Map<Integer, Long> monthlyData = rawData.stream()
                .filter(data -> specialization == null || specialization.equals(data.getUnitType()))
                .collect(Collectors.groupingBy(
                    MonthlyVisitsProjection::getMonth,
                    Collectors.summingLong(MonthlyVisitsProjection::getVisitCount)
                ));

        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> new MonthlyVisitDataDTO(
                    month,
                    Month.of(month).name(),
                    monthlyData.getOrDefault(month, 0L),
                    specialization != null ? specialization : "All Specializations",
                    0L,
                    0.0
                ))
                .collect(Collectors.toList());
    }

    public List<MonthlyVisitDataDTO> getMonthlyAdmissionsByWardType(int year, String wardType) {
        List<MonthlyVisitsProjection> rawData = clinicReportRepository.getMonthlyAdmissionsByWardType(year);

        // Filter by ward type if provided
        Map<Integer, Long> monthlyData = rawData.stream()
                .filter(data -> wardType == null || wardType.equals(data.getUnitType()))
                .collect(Collectors.groupingBy(
                    MonthlyVisitsProjection::getMonth,
                    Collectors.summingLong(MonthlyVisitsProjection::getVisitCount)
                ));

        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> new MonthlyVisitDataDTO(
                    month,
                    Month.of(month).name(),
                    monthlyData.getOrDefault(month, 0L),
                    wardType != null ? wardType : "All Ward Types",
                    0L,
                    0.0
                ))
                .collect(Collectors.toList());
    }
}