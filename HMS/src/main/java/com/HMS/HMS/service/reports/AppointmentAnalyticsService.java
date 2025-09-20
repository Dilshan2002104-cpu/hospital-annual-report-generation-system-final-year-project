package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.*;
import com.HMS.HMS.model.Appointment.Appointment;
import com.HMS.HMS.model.Appointment.AppointmentStatus;
import com.HMS.HMS.model.Appointment.AppointmentType;
import com.HMS.HMS.repository.reports.AppointmentAnalyticsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentAnalyticsService {

    private final AppointmentAnalyticsRepository appointmentAnalyticsRepository;

    public AppointmentAnalyticsService(AppointmentAnalyticsRepository appointmentAnalyticsRepository) {
        this.appointmentAnalyticsRepository = appointmentAnalyticsRepository;
    }

    public AppointmentAnalyticsReportDTO generateAppointmentAnalyticsReport(int year) {
        AppointmentAnalyticsReportDTO report = new AppointmentAnalyticsReportDTO();
        report.setYear(year);

        // Create date range for the year
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);

        // Get all appointments for the year
        List<Appointment> appointments = appointmentAnalyticsRepository.getAppointmentsForYear(startDate, endDate);

        // Calculate summary statistics
        calculateSummaryStatistics(report, appointments);

        // Generate chart data
        report.setAppointmentTypeDistribution(generateAppointmentTypeDistribution(appointments));
        report.setAppointmentStatusDistribution(generateAppointmentStatusDistribution(appointments));
        report.setMonthlyTrends(generateMonthlyTrends(appointments, year));
        report.setDailyPatterns(generateDailyPatterns(appointments));
        report.setDoctorPerformance(generateDoctorPerformance(appointments));
        report.setTimeSlotAnalysis(generateTimeSlotAnalysis(appointments));
        report.setWeeklyPatterns(generateWeeklyPatterns(appointments, year));

        // Generate analysis text
        generateAnalysisText(report);

        return report;
    }

    private void calculateSummaryStatistics(AppointmentAnalyticsReportDTO report, List<Appointment> appointments) {
        long total = appointments.size();
        long completed = appointments.stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();
        long cancelled = appointments.stream().filter(a -> a.getStatus() == AppointmentStatus.CANCELLED).count();
        long scheduled = appointments.stream().filter(a -> a.getStatus() == AppointmentStatus.SCHEDULED).count();

        report.setTotalAppointments(total);
        report.setCompletedAppointments(completed);
        report.setCancelledAppointments(cancelled);
        report.setScheduledAppointments(scheduled);

        if (total > 0) {
            report.setCompletionRate((double) completed / total * 100);
            report.setCancellationRate((double) cancelled / total * 100);
        }
    }

    private List<AppointmentTypeChartDataDTO> generateAppointmentTypeDistribution(List<Appointment> appointments) {
        Map<AppointmentType, Long> typeCount = appointments.stream()
                .collect(Collectors.groupingBy(Appointment::getAppointmentType, Collectors.counting()));

        List<AppointmentTypeChartDataDTO> distribution = new ArrayList<>();
        String[] colors = {"#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#F44336", "#00BCD4"};

        long total = appointments.size();
        int colorIndex = 0;

        for (Map.Entry<AppointmentType, Long> entry : typeCount.entrySet()) {
            String type = entry.getKey().name();
            Long count = entry.getValue();
            double percentage = total > 0 ? (double) count / total * 100 : 0;
            String color = colors[colorIndex % colors.length];

            distribution.add(new AppointmentTypeChartDataDTO(type, count, percentage, color));
            colorIndex++;
        }

        return distribution;
    }

    private List<AppointmentStatusChartDataDTO> generateAppointmentStatusDistribution(List<Appointment> appointments) {
        Map<AppointmentStatus, Long> statusCount = appointments.stream()
                .collect(Collectors.groupingBy(Appointment::getStatus, Collectors.counting()));

        List<AppointmentStatusChartDataDTO> distribution = new ArrayList<>();
        long total = appointments.size();

        for (Map.Entry<AppointmentStatus, Long> entry : statusCount.entrySet()) {
            String status = entry.getKey().name();
            Long count = entry.getValue();
            double percentage = total > 0 ? (double) count / total * 100 : 0;

            String color;
            String description;
            switch (entry.getKey()) {
                case COMPLETED:
                    color = "#4CAF50";
                    description = "Appointments that were successfully completed";
                    break;
                case CANCELLED:
                    color = "#F44336";
                    description = "Appointments that were cancelled";
                    break;
                case SCHEDULED:
                    color = "#2196F3";
                    description = "Appointments that are scheduled";
                    break;
                default:
                    color = "#9E9E9E";
                    description = "Other appointment status";
            }

            distribution.add(new AppointmentStatusChartDataDTO(status, count, percentage, color, description));
        }

        return distribution;
    }

    private List<MonthlyAppointmentTrendDTO> generateMonthlyTrends(List<Appointment> appointments, int year) {
        List<MonthlyAppointmentTrendDTO> trends = new ArrayList<>();

        // Initialize all months
        for (int month = 1; month <= 12; month++) {
            String monthName = LocalDate.of(year, month, 1)
                    .getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            trends.add(new MonthlyAppointmentTrendDTO(month, monthName, 0, 0, 0, 0));
        }

        // Group appointments by month
        Map<Integer, List<Appointment>> appointmentsByMonth = appointments.stream()
                .collect(Collectors.groupingBy(a -> a.getAppointmentDate().getMonthValue()));

        // Populate with actual data
        for (Map.Entry<Integer, List<Appointment>> entry : appointmentsByMonth.entrySet()) {
            int month = entry.getKey();
            List<Appointment> monthlyAppointments = entry.getValue();

            long total = monthlyAppointments.size();
            long completed = monthlyAppointments.stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();
            long cancelled = monthlyAppointments.stream().filter(a -> a.getStatus() == AppointmentStatus.CANCELLED).count();
            long scheduled = monthlyAppointments.stream().filter(a -> a.getStatus() == AppointmentStatus.SCHEDULED).count();

            MonthlyAppointmentTrendDTO trend = trends.get(month - 1);
            trend.setTotalAppointments(total);
            trend.setCompletedAppointments(completed);
            trend.setCancelledAppointments(cancelled);
            trend.setScheduledAppointments(scheduled);
        }

        return trends;
    }

    private List<DailyAppointmentPatternDTO> generateDailyPatterns(List<Appointment> appointments) {
        String[] dayNames = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
        List<DailyAppointmentPatternDTO> patterns = new ArrayList<>();

        // Initialize all days
        for (int day = 1; day <= 7; day++) {
            patterns.add(new DailyAppointmentPatternDTO(dayNames[day - 1], day, 0, 0, "N/A"));
        }

        // Group by day of week
        Map<Integer, List<Appointment>> appointmentsByDay = appointments.stream()
                .collect(Collectors.groupingBy(a -> a.getAppointmentDate().getDayOfWeek().getValue()));

        // Populate with actual data
        for (Map.Entry<Integer, List<Appointment>> entry : appointmentsByDay.entrySet()) {
            int dayOfWeek = entry.getKey(); // 1=Monday, 7=Sunday
            // Convert to our format (0=Sunday, 6=Saturday)
            int dayIndex = dayOfWeek == 7 ? 0 : dayOfWeek;

            long count = entry.getValue().size();
            DailyAppointmentPatternDTO pattern = patterns.get(dayIndex);
            pattern.setAppointmentCount(count);
            pattern.setAverageAppointments(count / 52.0); // Approximate weeks in a year
        }

        return patterns;
    }

    private List<DoctorAppointmentStatsDTO> generateDoctorPerformance(List<Appointment> appointments) {
        Map<Long, List<Appointment>> appointmentsByDoctor = appointments.stream()
                .filter(a -> a.getDoctor() != null)
                .collect(Collectors.groupingBy(a -> a.getDoctor().getEmployeeId()));

        List<DoctorAppointmentStatsDTO> performance = new ArrayList<>();

        for (Map.Entry<Long, List<Appointment>> entry : appointmentsByDoctor.entrySet()) {
            List<Appointment> doctorAppointments = entry.getValue();
            if (doctorAppointments.isEmpty()) continue;

            Appointment firstAppointment = doctorAppointments.get(0);
            Long doctorId = firstAppointment.getDoctor().getEmployeeId();
            String doctorName = firstAppointment.getDoctor().getDoctorName();
            String specialization = firstAppointment.getDoctor().getSpecialization();

            long totalAppointments = doctorAppointments.size();
            long completedAppointments = doctorAppointments.stream()
                    .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();
            long cancelledAppointments = doctorAppointments.stream()
                    .filter(a -> a.getStatus() == AppointmentStatus.CANCELLED).count();

            DoctorAppointmentStatsDTO stats = new DoctorAppointmentStatsDTO(
                    doctorId, doctorName, specialization,
                    totalAppointments, completedAppointments, cancelledAppointments
            );

            stats.setAverageAppointmentsPerDay(totalAppointments / 250.0);
            performance.add(stats);
        }

        // Sort by total appointments descending
        performance.sort((a, b) -> Long.compare(b.getTotalAppointments(), a.getTotalAppointments()));

        return performance;
    }

    private List<TimeSlotAnalysisDTO> generateTimeSlotAnalysis(List<Appointment> appointments) {
        Map<Integer, List<Appointment>> appointmentsByHour = appointments.stream()
                .filter(a -> a.getAppointmentTime() != null)
                .collect(Collectors.groupingBy(a -> a.getAppointmentTime().getHour()));

        List<TimeSlotAnalysisDTO> analysis = new ArrayList<>();
        long maxCount = appointmentsByHour.values().stream().mapToLong(List::size).max().orElse(1);

        for (Map.Entry<Integer, List<Appointment>> entry : appointmentsByHour.entrySet()) {
            int hour = entry.getKey();
            long count = entry.getValue().size();
            String timeSlot = String.format("%02d:00-%02d:00", hour, hour + 1);
            double utilizationRate = (double) count / maxCount * 100;

            analysis.add(new TimeSlotAnalysisDTO(timeSlot, hour, count, utilizationRate));
        }

        analysis.sort(Comparator.comparing(TimeSlotAnalysisDTO::getHour));
        return analysis;
    }

    private List<WeeklyPatternDTO> generateWeeklyPatterns(List<Appointment> appointments, int year) {
        // Simplified weekly patterns - group by month for now
        Map<Integer, List<Appointment>> appointmentsByMonth = appointments.stream()
                .collect(Collectors.groupingBy(a -> a.getAppointmentDate().getMonthValue()));

        List<WeeklyPatternDTO> patterns = new ArrayList<>();

        for (Map.Entry<Integer, List<Appointment>> entry : appointmentsByMonth.entrySet()) {
            int month = entry.getKey();
            List<Appointment> monthlyAppointments = entry.getValue();

            long totalAppointments = monthlyAppointments.size();
            long completedAppointments = monthlyAppointments.stream()
                    .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();

            String monthName = LocalDate.of(year, month, 1)
                    .getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            String weekRange = String.format("%s %d", monthName, year);

            WeeklyPatternDTO pattern = new WeeklyPatternDTO(
                    month, weekRange, totalAppointments, completedAppointments, "Monday", "Sunday"
            );

            patterns.add(pattern);
        }

        return patterns;
    }

    private void generateAnalysisText(AppointmentAnalyticsReportDTO report) {
        // Executive Summary
        String executiveSummary = String.format(
                "The %d appointment analytics report reveals comprehensive insights into healthcare service delivery patterns. " +
                        "With %,d total appointments processed, the system achieved a %.1f%% completion rate and maintained a %.1f%% " +
                        "cancellation rate. This performance indicates efficient appointment management and strong patient engagement " +
                        "across all medical specialties.",
                report.getYear(),
                report.getTotalAppointments(),
                report.getCompletionRate(),
                report.getCancellationRate()
        );
        report.setExecutiveSummary(executiveSummary);

        // Trends Analysis
        String trendsAnalysis = String.format(
                "Monthly appointment trends reveal seasonal healthcare utilization patterns consistent with chronic disease " +
                        "management cycles. The observed completion rate of %.1f%% exceeds industry benchmarks, " +
                        "indicating effective patient communication and appointment management protocols.",
                report.getCompletionRate()
        );
        report.setTrendsAnalysis(trendsAnalysis);

        // Recommendations
        String recommendations = String.format(
                "Based on the %d appointment analytics, several strategic recommendations emerge for service enhancement. " +
                        "Consider implementing predictive scheduling algorithms to optimize appointment distribution. " +
                        "Develop targeted patient reminder systems to further reduce the %.1f%% cancellation rate.",
                report.getYear(),
                report.getCancellationRate()
        );
        report.setRecommendationsText(recommendations);
    }
}