package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.MonthlyVisitDataDTO;
import com.HMS.HMS.DTO.reports.SpecializationDataDTO;
import com.HMS.HMS.DTO.reports.WardOccupancyDataDTO;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Comparator;
import java.util.List;

@Service
public class ReportTextGeneratorService {

    private final DecimalFormat decimalFormat = new DecimalFormat("#,##0");
    private final DecimalFormat percentageFormat = new DecimalFormat("#0.0");

    public String generateIntroductionText(int year, Long totalAppointments, Long totalAdmissions) {
        double monthlyAverageAppointments = totalAppointments != null ? totalAppointments / 12.0 : 0;
        double monthlyAverageAdmissions = totalAdmissions != null ? totalAdmissions / 12.0 : 0;

        return String.format(
            "Our clinic stands as a distinguished center of excellence in the field of nephrology, " +
            "dedicated to providing specialized care and treatment for individuals grappling with renal conditions. " +
            "Led by our experienced medical team, the clinic offers comprehensive healthcare services to " +
            "patients with kidney diseases. Our team, consisting of skilled nursing officers and " +
            "dedicated support staff members, collaborates to ensure patients receive personalized care " +
            "throughout their treatment journey.\n\n" +
            "In %d, we successfully managed %s appointment visits with a monthly average of %s, " +
            "and %s admissions with a monthly average of %s. This focus on individualized care " +
            "aims to improve the quality of life for our patients.",
            year,
            decimalFormat.format(totalAppointments != null ? totalAppointments : 0),
            decimalFormat.format(Math.round(monthlyAverageAppointments)),
            decimalFormat.format(totalAdmissions != null ? totalAdmissions : 0),
            decimalFormat.format(Math.round(monthlyAverageAdmissions))
        );
    }

    public String generateTrendsAnalysis(List<MonthlyVisitDataDTO> monthlyAppointments, List<MonthlyVisitDataDTO> monthlyAdmissions) {
        if (monthlyAppointments == null || monthlyAppointments.isEmpty()) {
            return "No appointment data available for trend analysis.";
        }

        // Find peak and low months for appointments
        MonthlyVisitDataDTO highestAppointments = monthlyAppointments.stream()
                .max(Comparator.comparing(MonthlyVisitDataDTO::getPatientCount))
                .orElse(null);

        MonthlyVisitDataDTO lowestAppointments = monthlyAppointments.stream()
                .min(Comparator.comparing(MonthlyVisitDataDTO::getPatientCount))
                .orElse(null);

        StringBuilder analysis = new StringBuilder();
        analysis.append("**Trends in Clinic Visits**\n\n");

        if (highestAppointments != null && lowestAppointments != null) {
            analysis.append(String.format(
                "• Appointment visits showed significant variation throughout the year, " +
                "with the highest volume recorded in %s (%s visits) and the lowest in %s (%s visits).\n",
                highestAppointments.getMonthName(),
                decimalFormat.format(highestAppointments.getPatientCount()),
                lowestAppointments.getMonthName(),
                decimalFormat.format(lowestAppointments.getPatientCount())
            ));
        }

        // Analyze admissions if available
        if (monthlyAdmissions != null && !monthlyAdmissions.isEmpty()) {
            MonthlyVisitDataDTO highestAdmissions = monthlyAdmissions.stream()
                    .max(Comparator.comparing(MonthlyVisitDataDTO::getPatientCount))
                    .orElse(null);

            MonthlyVisitDataDTO lowestAdmissions = monthlyAdmissions.stream()
                    .min(Comparator.comparing(MonthlyVisitDataDTO::getPatientCount))
                    .orElse(null);

            if (highestAdmissions != null && lowestAdmissions != null) {
                analysis.append(String.format(
                    "• Similarly, admissions peaked in %s with %s patients, " +
                    "while %s recorded the lowest admission rate with %s patients.\n",
                    highestAdmissions.getMonthName(),
                    decimalFormat.format(highestAdmissions.getPatientCount()),
                    lowestAdmissions.getMonthName(),
                    decimalFormat.format(lowestAdmissions.getPatientCount())
                ));
            }
        }

        return analysis.toString();
    }

    public String generateImpactAnalysis(int year, Long currentYearAppointments, Long previousYearAppointments) {
        if (previousYearAppointments == null || previousYearAppointments == 0) {
            return String.format(
                "**Impact Analysis and Recovery Efforts**\n\n" +
                "In %d, our clinic demonstrated resilience and adaptability in delivering healthcare services. " +
                "We continue to implement strategic initiatives to enhance patient access, optimize service delivery, " +
                "and maintain high standards of care. Through continuous improvements in patient care, " +
                "we remain committed to addressing the evolving healthcare needs of our community.",
                year
            );
        }

        double changePercentage = ((double) (currentYearAppointments - previousYearAppointments) / previousYearAppointments) * 100;
        String changeDirection = changePercentage >= 0 ? "increase" : "decline";
        String changeDescription = changePercentage >= 0 ? "improvement" : "challenges";

        return String.format(
            "**Impact Analysis and Recovery Efforts**\n\n" +
            "Comparing %d to %d, appointment visits showed a %s of %s%%, " +
            "reflecting the ongoing %s in healthcare delivery. " +
            "This change can be attributed to multiple factors, including ongoing improvements in " +
            "healthcare services, enhanced patient engagement strategies, and adaptive service delivery models.\n\n" +
            "The hospital continues to actively implement strategic initiatives to enhance " +
            "patient access, optimize service delivery, and improve clinical outcomes. Through " +
            "continuous improvements in patient care and operational efficiency, we remain committed to " +
            "addressing the evolving healthcare needs of our community.",
            year,
            year - 1,
            changeDirection,
            percentageFormat.format(Math.abs(changePercentage)),
            changeDescription
        );
    }

    public String generateConclusionText(List<SpecializationDataDTO> specializationData, List<WardOccupancyDataDTO> wardOccupancyData) {
        StringBuilder conclusion = new StringBuilder();
        conclusion.append("**Strategic Outlook and Performance Summary**\n\n");

        if (specializationData != null && !specializationData.isEmpty()) {
            SpecializationDataDTO topSpecialization = specializationData.stream()
                    .max(Comparator.comparing(SpecializationDataDTO::getTotalVisits))
                    .orElse(null);

            if (topSpecialization != null) {
                conclusion.append(String.format(
                    "Our clinic's performance demonstrates strong capabilities across multiple specializations, " +
                    "with %s leading in patient volume with %s visits. ",
                    topSpecialization.getSpecialization(),
                    decimalFormat.format(topSpecialization.getTotalVisits())
                ));
            }
        }

        if (wardOccupancyData != null && !wardOccupancyData.isEmpty()) {
            double averageOccupancy = wardOccupancyData.stream()
                    .mapToDouble(WardOccupancyDataDTO::getOccupancyRate)
                    .average()
                    .orElse(0.0);

            conclusion.append(String.format(
                "Ward utilization remains efficient with an average occupancy rate of %s%%, " +
                "demonstrating effective resource management and patient flow optimization. ",
                percentageFormat.format(averageOccupancy)
            ));
        }

        conclusion.append(
            "Moving forward, we will continue to focus on enhancing service quality, " +
            "expanding access to specialized care, and implementing innovative healthcare delivery models. " +
            "Our commitment to excellence in nephrology care positions us to meet the growing healthcare " +
            "needs of our community while maintaining the highest standards of patient safety and satisfaction."
        );

        return conclusion.toString();
    }

    public String generateMonthlyAnalysis(List<MonthlyVisitDataDTO> monthlyData, String dataType) {
        if (monthlyData == null || monthlyData.isEmpty()) {
            return String.format("No %s data available for analysis.", dataType.toLowerCase());
        }

        MonthlyVisitDataDTO highest = monthlyData.stream()
                .max(Comparator.comparing(MonthlyVisitDataDTO::getPatientCount))
                .orElse(null);

        MonthlyVisitDataDTO lowest = monthlyData.stream()
                .min(Comparator.comparing(MonthlyVisitDataDTO::getPatientCount))
                .orElse(null);

        long totalVisits = monthlyData.stream()
                .mapToLong(MonthlyVisitDataDTO::getPatientCount)
                .sum();

        if (highest != null && lowest != null) {
            return String.format(
                "This data provides an overview of %s patterns, indicating a total of %s patients " +
                "with a monthly average of %s. The data reveals an increase in visits during %s " +
                "and a decrease in the month of %s.",
                dataType.toLowerCase(),
                decimalFormat.format(totalVisits),
                decimalFormat.format(Math.round(totalVisits / 12.0)),
                highest.getMonthName(),
                lowest.getMonthName()
            );
        }

        return String.format(
            "Total %s for the year: %s patients with a monthly average of %s.",
            dataType.toLowerCase(),
            decimalFormat.format(totalVisits),
            decimalFormat.format(Math.round(totalVisits / 12.0))
        );
    }
}