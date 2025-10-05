package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.*;
import com.HMS.HMS.model.Prescription.Prescription;
import com.HMS.HMS.model.Prescription.PrescriptionStatus;
import com.HMS.HMS.repository.PrescriptionRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PrescriptionReportService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionReportService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public PrescriptionDispensingReportDTO generatePrescriptionDispensingReport(LocalDate startDate, LocalDate endDate) {
        // Convert LocalDate to LocalDateTime for database queries
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        // Fetch all prescriptions within date range
        List<Prescription> prescriptions = prescriptionRepository.findAllByCreatedAtBetween(startDateTime, endDateTime);

        // Calculate summary statistics
        long totalPrescriptions = prescriptions.size();
        long completed = prescriptions.stream().filter(p -> p.getStatus() == PrescriptionStatus.COMPLETED).count();
        long pending = prescriptions.stream().filter(p -> p.getStatus() == PrescriptionStatus.PENDING || p.getStatus() == PrescriptionStatus.ACTIVE).count();
        long inProgress = prescriptions.stream().filter(p -> p.getStatus() == PrescriptionStatus.IN_PROGRESS).count();
        long ready = prescriptions.stream().filter(p -> p.getStatus() == PrescriptionStatus.READY).count();
        long cancelled = prescriptions.stream().filter(p -> p.getStatus() == PrescriptionStatus.DISCONTINUED).count();

        double completionRate = totalPrescriptions > 0 ? (completed * 100.0 / totalPrescriptions) : 0.0;

        // Calculate average processing time
        double averageProcessingTime = calculateAverageProcessingTime(prescriptions);

        // Generate daily breakdown
        List<DailyPrescriptionDataDTO> dailyBreakdown = generateDailyBreakdown(prescriptions);

        // Generate ward-wise breakdown
        List<WardPrescriptionDataDTO> wardBreakdown = generateWardBreakdown(prescriptions);

        // Generate status distribution
        List<StatusDistributionDTO> statusDistribution = generateStatusDistribution(prescriptions, totalPrescriptions);

        // Generate text summaries
        String summaryText = generateSummaryText(totalPrescriptions, completed, completionRate);
        String trendsText = generateTrendsText(dailyBreakdown);
        String performanceText = generatePerformanceText(wardBreakdown, averageProcessingTime);

        return PrescriptionDispensingReportDTO.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalPrescriptions(totalPrescriptions)
                .completedPrescriptions(completed)
                .pendingPrescriptions(pending)
                .inProgressPrescriptions(inProgress)
                .readyPrescriptions(ready)
                .cancelledPrescriptions(cancelled)
                .completionRate(Math.round(completionRate * 10.0) / 10.0)
                .averageProcessingTimeHours(Math.round(averageProcessingTime * 10.0) / 10.0)
                .urgentPrescriptions(0L)
                .routinePrescriptions(0L)
                .dailyBreakdown(dailyBreakdown)
                .wardBreakdown(wardBreakdown)
                .statusDistribution(statusDistribution)
                .summaryText(summaryText)
                .trendsText(trendsText)
                .performanceText(performanceText)
                .build();
    }

    private double calculateAverageProcessingTime(List<Prescription> prescriptions) {
        List<Prescription> completedPrescriptions = prescriptions.stream()
                .filter(p -> p.getStatus() == PrescriptionStatus.COMPLETED)
                .collect(Collectors.toList());

        if (completedPrescriptions.isEmpty()) {
            return 0.0;
        }

        long totalHours = 0;
        int validCount = 0;

        for (Prescription prescription : completedPrescriptions) {
            LocalDateTime created = prescription.getCreatedAt();
            LocalDateTime modified = prescription.getLastModified();

            if (created != null && modified != null) {
                long hours = ChronoUnit.HOURS.between(created, modified);
                if (hours >= 0 && hours < 168) { // Less than 7 days
                    totalHours += hours;
                    validCount++;
                }
            }
        }

        return validCount > 0 ? (double) totalHours / validCount : 0.0;
    }

    private List<DailyPrescriptionDataDTO> generateDailyBreakdown(List<Prescription> prescriptions) {
        Map<LocalDate, DailyPrescriptionDataDTO> dailyMap = new HashMap<>();

        for (Prescription prescription : prescriptions) {
            LocalDate date = prescription.getCreatedAt().toLocalDate();

            DailyPrescriptionDataDTO dayData = dailyMap.getOrDefault(date,
                    new DailyPrescriptionDataDTO(date, date.toString(), 0L, 0L, 0L, 0L, 0L, 0L));

            dayData.setTotal(dayData.getTotal() + 1);

            switch (prescription.getStatus()) {
                case COMPLETED:
                    dayData.setCompleted(dayData.getCompleted() + 1);
                    break;
                case IN_PROGRESS:
                    dayData.setInProgress(dayData.getInProgress() + 1);
                    break;
                case READY:
                    dayData.setReady(dayData.getReady() + 1);
                    break;
                case DISCONTINUED:
                    dayData.setCancelled(dayData.getCancelled() + 1);
                    break;
                case PENDING:
                case ACTIVE:
                default:
                    dayData.setPending(dayData.getPending() + 1);
                    break;
            }

            dailyMap.put(date, dayData);
        }

        return dailyMap.values().stream()
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());
    }

    private List<WardPrescriptionDataDTO> generateWardBreakdown(List<Prescription> prescriptions) {
        Map<String, WardPrescriptionDataDTO> wardMap = new HashMap<>();

        for (Prescription prescription : prescriptions) {
            String wardName = prescription.getWardName() != null ? prescription.getWardName() : "Unknown";

            WardPrescriptionDataDTO wardData = wardMap.getOrDefault(wardName,
                    new WardPrescriptionDataDTO(wardName, 0L, 0L, 0L, 0.0));

            wardData.setTotalPrescriptions(wardData.getTotalPrescriptions() + 1);

            if (prescription.getStatus() == PrescriptionStatus.COMPLETED) {
                wardData.setCompletedPrescriptions(wardData.getCompletedPrescriptions() + 1);
            } else {
                wardData.setPendingPrescriptions(wardData.getPendingPrescriptions() + 1);
            }

            wardMap.put(wardName, wardData);
        }

        // Calculate completion rates
        wardMap.values().forEach(ward -> {
            if (ward.getTotalPrescriptions() > 0) {
                double rate = (ward.getCompletedPrescriptions() * 100.0 / ward.getTotalPrescriptions());
                ward.setCompletionRate(Math.round(rate * 10.0) / 10.0);
            }
        });

        return new ArrayList<>(wardMap.values());
    }

    private List<StatusDistributionDTO> generateStatusDistribution(List<Prescription> prescriptions, long total) {
        Map<PrescriptionStatus, Long> statusCounts = prescriptions.stream()
                .collect(Collectors.groupingBy(Prescription::getStatus, Collectors.counting()));

        List<StatusDistributionDTO> distribution = new ArrayList<>();

        for (Map.Entry<PrescriptionStatus, Long> entry : statusCounts.entrySet()) {
            String status = entry.getKey().name();
            String label = getStatusLabel(entry.getKey());
            long count = entry.getValue();
            double percentage = total > 0 ? (count * 100.0 / total) : 0.0;

            distribution.add(new StatusDistributionDTO(
                    status,
                    label,
                    count,
                    Math.round(percentage * 10.0) / 10.0
            ));
        }

        return distribution;
    }

    private String getStatusLabel(PrescriptionStatus status) {
        switch (status) {
            case PENDING:
                return "Pending";
            case ACTIVE:
                return "Active";
            case IN_PROGRESS:
                return "In Progress";
            case READY:
                return "Ready";
            case COMPLETED:
                return "Completed";
            case DISCONTINUED:
                return "Cancelled";
            default:
                return status.name();
        }
    }

    private String generateSummaryText(long total, long completed, double completionRate) {
        return String.format(
                "During the selected period, the pharmacy processed %d prescriptions with a completion rate of %.1f%%. " +
                "%d prescriptions were successfully dispensed to patients.",
                total, completionRate, completed
        );
    }

    private String generateTrendsText(List<DailyPrescriptionDataDTO> dailyBreakdown) {
        if (dailyBreakdown.isEmpty()) {
            return "No prescription data available for trend analysis.";
        }

        DailyPrescriptionDataDTO maxDay = dailyBreakdown.stream()
                .max((a, b) -> Long.compare(a.getTotal(), b.getTotal()))
                .orElse(null);

        DailyPrescriptionDataDTO minDay = dailyBreakdown.stream()
                .min((a, b) -> Long.compare(a.getTotal(), b.getTotal()))
                .orElse(null);

        if (maxDay != null && minDay != null) {
            return String.format(
                    "Prescription volume showed variation throughout the period, with the highest activity on %s (%d prescriptions) " +
                    "and the lowest on %s (%d prescriptions).",
                    maxDay.getDate(), maxDay.getTotal(),
                    minDay.getDate(), minDay.getTotal()
            );
        }

        return "Prescription trends analyzed for the selected period.";
    }

    private String generatePerformanceText(List<WardPrescriptionDataDTO> wardBreakdown, double avgProcessingTime) {
        if (wardBreakdown.isEmpty()) {
            return "No ward data available for performance analysis.";
        }

        WardPrescriptionDataDTO topWard = wardBreakdown.stream()
                .max((a, b) -> Long.compare(a.getTotalPrescriptions(), b.getTotalPrescriptions()))
                .orElse(null);

        if (topWard != null) {
            return String.format(
                    "The pharmacy maintained an average processing time of %.1f hours. " +
                    "%s submitted the most prescriptions with %d requests and a completion rate of %.1f%%.",
                    avgProcessingTime,
                    topWard.getWardName(),
                    topWard.getTotalPrescriptions(),
                    topWard.getCompletionRate()
            );
        }

        return "Performance metrics analyzed for the selected period.";
    }

    /**
     * Generate PDF report for prescription dispensing
     */
    public byte[] generatePrescriptionDispensingPDF(LocalDate startDate, LocalDate endDate) {
        try {
            // Get report data
            PrescriptionDispensingReportDTO report = generatePrescriptionDispensingReport(startDate, endDate);
            
            // Create PDF
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            Paragraph title = new Paragraph("Prescription Dispensing Report")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);

            // Date range
            Paragraph dateRange = new Paragraph(String.format("Period: %s to %s", 
                    startDate.format(DateTimeFormatter.ofPattern("MMM dd, yyyy")),
                    endDate.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))))
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(dateRange);

            // Summary Statistics Table
            Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{3, 2}))
                    .setWidth(UnitValue.createPercentValue(100));
            
            // Add header
            summaryTable.addHeaderCell(new Cell().add(new Paragraph("Metric").setBold()));
            summaryTable.addHeaderCell(new Cell().add(new Paragraph("Value").setBold()));
            
            // Add summary data
            summaryTable.addCell("Total Prescriptions");
            summaryTable.addCell(String.valueOf(report.getTotalPrescriptions()));
            
            summaryTable.addCell("Completed Prescriptions");
            summaryTable.addCell(String.valueOf(report.getCompletedPrescriptions()));
            
            summaryTable.addCell("Completion Rate");
            summaryTable.addCell(String.format("%.1f%%", report.getCompletionRate()));
            
            summaryTable.addCell("Average Processing Time");
            summaryTable.addCell(String.format("%.1f hours", report.getAverageProcessingTimeHours()));
            
            summaryTable.addCell("Pending Prescriptions");
            summaryTable.addCell(String.valueOf(report.getPendingPrescriptions()));
            
            summaryTable.addCell("Ready for Dispensing");
            summaryTable.addCell(String.valueOf(report.getReadyPrescriptions()));

            document.add(new Paragraph("Summary Statistics").setBold().setFontSize(14).setMarginTop(20));
            document.add(summaryTable);

            // Status Distribution
            if (report.getStatusDistribution() != null && !report.getStatusDistribution().isEmpty()) {
                document.add(new Paragraph("Status Distribution").setBold().setFontSize(14).setMarginTop(20));
                
                Table statusTable = new Table(UnitValue.createPercentArray(new float[]{3, 2, 2}))
                        .setWidth(UnitValue.createPercentValue(100));
                
                statusTable.addHeaderCell(new Cell().add(new Paragraph("Status").setBold()));
                statusTable.addHeaderCell(new Cell().add(new Paragraph("Count").setBold()));
                statusTable.addHeaderCell(new Cell().add(new Paragraph("Percentage").setBold()));
                
                for (StatusDistributionDTO status : report.getStatusDistribution()) {
                    statusTable.addCell(status.getStatusLabel());
                    statusTable.addCell(String.valueOf(status.getCount()));
                    statusTable.addCell(String.format("%.1f%%", status.getPercentage()));
                }
                
                document.add(statusTable);
            }

            // Ward Breakdown
            if (report.getWardBreakdown() != null && !report.getWardBreakdown().isEmpty()) {
                document.add(new Paragraph("Ward-wise Performance").setBold().setFontSize(14).setMarginTop(20));
                
                Table wardTable = new Table(UnitValue.createPercentArray(new float[]{3, 2, 2, 2}))
                        .setWidth(UnitValue.createPercentValue(100));
                
                wardTable.addHeaderCell(new Cell().add(new Paragraph("Ward").setBold()));
                wardTable.addHeaderCell(new Cell().add(new Paragraph("Total").setBold()));
                wardTable.addHeaderCell(new Cell().add(new Paragraph("Completed").setBold()));
                wardTable.addHeaderCell(new Cell().add(new Paragraph("Completion Rate").setBold()));
                
                for (WardPrescriptionDataDTO ward : report.getWardBreakdown()) {
                    wardTable.addCell(ward.getWardName());
                    wardTable.addCell(String.valueOf(ward.getTotalPrescriptions()));
                    wardTable.addCell(String.valueOf(ward.getCompletedPrescriptions()));
                    wardTable.addCell(String.format("%.1f%%", ward.getCompletionRate()));
                }
                
                document.add(wardTable);
            }

            // Insights
            if (report.getSummaryText() != null || report.getTrendsText() != null || report.getPerformanceText() != null) {
                document.add(new Paragraph("Analysis & Insights").setBold().setFontSize(14).setMarginTop(20));
                
                if (report.getSummaryText() != null) {
                    document.add(new Paragraph("Summary: " + report.getSummaryText()).setMarginBottom(10));
                }
                
                if (report.getTrendsText() != null) {
                    document.add(new Paragraph("Trends: " + report.getTrendsText()).setMarginBottom(10));
                }
                
                if (report.getPerformanceText() != null) {
                    document.add(new Paragraph("Performance: " + report.getPerformanceText()).setMarginBottom(10));
                }
            }

            // Footer
            document.add(new Paragraph(String.format("Report generated on: %s", 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm"))))
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginTop(30));

            document.close();
            return baos.toByteArray();
            
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report: " + e.getMessage(), e);
        }
    }
}
