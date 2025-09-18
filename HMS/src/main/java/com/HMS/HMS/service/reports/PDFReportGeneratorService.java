package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.ClinicStatisticsReportDTO;
import com.HMS.HMS.DTO.reports.MonthlyVisitDataDTO;
import com.HMS.HMS.DTO.reports.SpecializationDataDTO;
import com.HMS.HMS.DTO.reports.WardOccupancyDataDTO;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.io.image.ImageDataFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PDFReportGeneratorService {

    private final ChartGenerationService chartGenerationService;
    private final DecimalFormat decimalFormat = new DecimalFormat("#,##0");
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");

    public PDFReportGeneratorService(ChartGenerationService chartGenerationService) {
        this.chartGenerationService = chartGenerationService;
    }

    public byte[] generateClinicStatisticsPDF(ClinicStatisticsReportDTO reportData) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);

            // Set up fonts
            PdfFont titleFont = PdfFontFactory.createFont();
            PdfFont headerFont = PdfFontFactory.createFont();
            PdfFont bodyFont = PdfFontFactory.createFont();

            // Add title page
            addTitleSection(document, reportData, titleFont, headerFont);

            // Add introduction
            addIntroductionSection(document, reportData, headerFont, bodyFont);

            // Add trends analysis with charts
            addTrendsAnalysisSection(document, reportData, headerFont, bodyFont);

            // Add monthly data tables and charts
            addMonthlyDataSection(document, reportData, headerFont, bodyFont);

            // Add specialization breakdown
            addSpecializationSection(document, reportData, headerFont, bodyFont);

            // Add ward occupancy analysis
            addWardOccupancySection(document, reportData, headerFont, bodyFont);

            // Add impact analysis
            addImpactAnalysisSection(document, reportData, headerFont, bodyFont);

            // Add conclusion
            addConclusionSection(document, reportData, headerFont, bodyFont);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }
    }

    private void addTitleSection(Document document, ClinicStatisticsReportDTO reportData,
                                PdfFont titleFont, PdfFont headerFont) {
        // Main title
        Paragraph title = new Paragraph("CLINIC STATISTICS")
                .setFont(titleFont)
                .setFontSize(24)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(title);

        // Hospital name
        Paragraph hospitalName = new Paragraph(reportData.getHospitalName())
                .setFont(headerFont)
                .setFontSize(16)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10);
        document.add(hospitalName);

        // Report year and date
        Paragraph reportInfo = new Paragraph(String.format("Annual Report %d", reportData.getYear()))
                .setFont(headerFont)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(5);
        document.add(reportInfo);

        Paragraph generatedDate = new Paragraph(String.format("Generated on: %s",
                reportData.getReportGeneratedDate().format(dateFormatter)))
                .setFont(headerFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(30);
        document.add(generatedDate);

        // Add a line separator
        document.add(new LineSeparator(new com.itextpdf.kernel.pdf.canvas.draw.SolidLine()));
        document.add(new Paragraph("\n"));
    }

    private void addIntroductionSection(Document document, ClinicStatisticsReportDTO reportData,
                                       PdfFont headerFont, PdfFont bodyFont) {
        // Section header
        Paragraph introHeader = new Paragraph("Clinic Introduction")
                .setFont(headerFont)
                .setFontSize(16)
                .setBold()
                .setMarginBottom(10);
        document.add(introHeader);

        // Introduction text
        Paragraph introText = new Paragraph(reportData.getIntroductionText())
                .setFont(bodyFont)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.JUSTIFIED)
                .setMarginBottom(20);
        document.add(introText);
    }

    private void addTrendsAnalysisSection(Document document, ClinicStatisticsReportDTO reportData,
                                         PdfFont headerFont, PdfFont bodyFont) {
        // Section header
        Paragraph trendsHeader = new Paragraph("Trends in Clinic Visits")
                .setFont(headerFont)
                .setFontSize(16)
                .setBold()
                .setMarginBottom(10);
        document.add(trendsHeader);

        // Key statistics
        List<String> bulletPoints = List.of(
            String.format("• In %d, the total clinic visits were %s appointments and %s admissions.",
                reportData.getYear(),
                decimalFormat.format(reportData.getTotalAppointments()),
                decimalFormat.format(reportData.getTotalAdmissions())),
            String.format("• Monthly average appointments: %s visits per month.",
                decimalFormat.format(Math.round(reportData.getMonthlyAverageAppointments()))),
            String.format("• Monthly average admissions: %s admissions per month.",
                decimalFormat.format(Math.round(reportData.getMonthlyAverageAdmissions())))
        );

        for (String bullet : bulletPoints) {
            Paragraph bulletParagraph = new Paragraph(bullet)
                    .setFont(bodyFont)
                    .setFontSize(11)
                    .setMarginBottom(5);
            document.add(bulletParagraph);
        }

        // Trends analysis text
        if (reportData.getTrendsAnalysisText() != null) {
            Paragraph trendsText = new Paragraph(reportData.getTrendsAnalysisText())
                    .setFont(bodyFont)
                    .setFontSize(11)
                    .setTextAlignment(TextAlignment.JUSTIFIED)
                    .setMarginBottom(20);
            document.add(trendsText);
        }
    }

    private void addMonthlyDataSection(Document document, ClinicStatisticsReportDTO reportData,
                                      PdfFont headerFont, PdfFont bodyFont) {
        // Appointments section
        if (reportData.getMonthlyAppointments() != null && !reportData.getMonthlyAppointments().isEmpty()) {
            document.add(new AreaBreak());

            Paragraph appointmentsHeader = new Paragraph("Monthly Appointment Visits")
                    .setFont(headerFont)
                    .setFontSize(16)
                    .setBold()
                    .setMarginBottom(10);
            document.add(appointmentsHeader);

            // Add appointments table
            addMonthlyDataTable(document, reportData.getMonthlyAppointments(), "Appointments", bodyFont);

            // Add appointments chart
            try {
                byte[] chartBytes = chartGenerationService.generateMonthlyVisitsLineChart(
                    reportData.getMonthlyAppointments(),
                    "Monthly Appointment Visits - " + reportData.getYear());

                Image chartImage = new Image(ImageDataFactory.create(chartBytes));
                chartImage.setWidth(UnitValue.createPercentValue(80));
                chartImage.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
                document.add(chartImage);
            } catch (Exception e) {
                // If chart generation fails, add a note
                Paragraph chartError = new Paragraph("[Chart could not be generated]")
                        .setFont(bodyFont)
                        .setFontSize(10)
                        .setFontColor(ColorConstants.RED)
                        .setTextAlignment(TextAlignment.CENTER);
                document.add(chartError);
            }
        }

        // Admissions section
        if (reportData.getMonthlyAdmissions() != null && !reportData.getMonthlyAdmissions().isEmpty()) {
            document.add(new Paragraph("\n"));

            Paragraph admissionsHeader = new Paragraph("Monthly Admissions")
                    .setFont(headerFont)
                    .setFontSize(16)
                    .setBold()
                    .setMarginBottom(10);
            document.add(admissionsHeader);

            // Add admissions table
            addMonthlyDataTable(document, reportData.getMonthlyAdmissions(), "Admissions", bodyFont);

            // Add admissions chart
            try {
                byte[] chartBytes = chartGenerationService.generateMonthlyVisitsLineChart(
                    reportData.getMonthlyAdmissions(),
                    "Monthly Admissions - " + reportData.getYear());

                Image chartImage = new Image(ImageDataFactory.create(chartBytes));
                chartImage.setWidth(UnitValue.createPercentValue(80));
                chartImage.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
                document.add(chartImage);
            } catch (Exception e) {
                Paragraph chartError = new Paragraph("[Chart could not be generated]")
                        .setFont(bodyFont)
                        .setFontSize(10)
                        .setFontColor(ColorConstants.RED)
                        .setTextAlignment(TextAlignment.CENTER);
                document.add(chartError);
            }
        }
    }

    private void addMonthlyDataTable(Document document, List<MonthlyVisitDataDTO> monthlyData,
                                    String dataType, PdfFont bodyFont) {
        Table table = new Table(UnitValue.createPercentArray(new float[]{3, 2}));
        table.setWidth(UnitValue.createPercentValue(60));
        table.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);

        // Header
        table.addHeaderCell(new Cell().add(new Paragraph("Month").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));
        table.addHeaderCell(new Cell().add(new Paragraph("Total " + dataType).setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));

        // Data rows
        long total = 0;
        for (MonthlyVisitDataDTO data : monthlyData) {
            table.addCell(new Cell().add(new Paragraph(data.getMonthName()).setFont(bodyFont)));
            table.addCell(new Cell().add(new Paragraph(decimalFormat.format(data.getPatientCount())).setFont(bodyFont))
                    .setTextAlignment(TextAlignment.RIGHT));
            total += data.getPatientCount();
        }

        // Total row
        table.addCell(new Cell().add(new Paragraph("Total").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(245, 245, 245)));
        table.addCell(new Cell().add(new Paragraph(decimalFormat.format(total)).setFont(bodyFont).setBold())
                .setTextAlignment(TextAlignment.RIGHT)
                .setBackgroundColor(new DeviceRgb(245, 245, 245)));

        document.add(table);
        document.add(new Paragraph("\n"));
    }

    private void addSpecializationSection(Document document, ClinicStatisticsReportDTO reportData,
                                         PdfFont headerFont, PdfFont bodyFont) {
        if (reportData.getSpecializationBreakdown() == null || reportData.getSpecializationBreakdown().isEmpty()) {
            return;
        }

        document.add(new AreaBreak());

        Paragraph specializationHeader = new Paragraph("Specialization Breakdown")
                .setFont(headerFont)
                .setFontSize(16)
                .setBold()
                .setMarginBottom(10);
        document.add(specializationHeader);

        // Create specialization table
        Table table = new Table(UnitValue.createPercentArray(new float[]{4, 2, 2, 2}));
        table.setWidth(UnitValue.createPercentValue(90));

        // Headers
        table.addHeaderCell(new Cell().add(new Paragraph("Specialization").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));
        table.addHeaderCell(new Cell().add(new Paragraph("Total Visits").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));
        table.addHeaderCell(new Cell().add(new Paragraph("Monthly Avg").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));
        table.addHeaderCell(new Cell().add(new Paragraph("Percentage").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));

        // Data rows
        for (SpecializationDataDTO data : reportData.getSpecializationBreakdown()) {
            table.addCell(new Cell().add(new Paragraph(data.getSpecialization()).setFont(bodyFont)));
            table.addCell(new Cell().add(new Paragraph(decimalFormat.format(data.getTotalVisits())).setFont(bodyFont))
                    .setTextAlignment(TextAlignment.RIGHT));
            table.addCell(new Cell().add(new Paragraph(decimalFormat.format(Math.round(data.getAverageVisitsPerMonth()))).setFont(bodyFont))
                    .setTextAlignment(TextAlignment.RIGHT));
            table.addCell(new Cell().add(new Paragraph(String.format("%.1f%%", data.getPercentageOfTotal())).setFont(bodyFont))
                    .setTextAlignment(TextAlignment.RIGHT));
        }

        document.add(table);

        // Add pie chart
        try {
            byte[] chartBytes = chartGenerationService.generateSpecializationPieChart(
                reportData.getSpecializationBreakdown(),
                "Visits by Specialization - " + reportData.getYear());

            Image chartImage = new Image(ImageDataFactory.create(chartBytes));
            chartImage.setWidth(UnitValue.createPercentValue(70));
            chartImage.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
            document.add(chartImage);
        } catch (Exception e) {
            Paragraph chartError = new Paragraph("[Specialization chart could not be generated]")
                    .setFont(bodyFont)
                    .setFontSize(10)
                    .setFontColor(ColorConstants.RED)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(chartError);
        }
    }

    private void addWardOccupancySection(Document document, ClinicStatisticsReportDTO reportData,
                                        PdfFont headerFont, PdfFont bodyFont) {
        if (reportData.getWardOccupancy() == null || reportData.getWardOccupancy().isEmpty()) {
            return;
        }

        document.add(new AreaBreak());

        Paragraph wardHeader = new Paragraph("Ward Occupancy Analysis")
                .setFont(headerFont)
                .setFontSize(16)
                .setBold()
                .setMarginBottom(10);
        document.add(wardHeader);

        // Create ward occupancy table
        Table table = new Table(UnitValue.createPercentArray(new float[]{3, 2, 2, 2, 2}));
        table.setWidth(UnitValue.createPercentValue(95));

        // Headers
        table.addHeaderCell(new Cell().add(new Paragraph("Ward Name").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));
        table.addHeaderCell(new Cell().add(new Paragraph("Ward Type").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));
        table.addHeaderCell(new Cell().add(new Paragraph("Total Admissions").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));
        table.addHeaderCell(new Cell().add(new Paragraph("Active Admissions").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));
        table.addHeaderCell(new Cell().add(new Paragraph("Occupancy Rate").setFont(bodyFont).setBold())
                .setBackgroundColor(new DeviceRgb(230, 230, 230)));

        // Data rows
        for (WardOccupancyDataDTO data : reportData.getWardOccupancy()) {
            table.addCell(new Cell().add(new Paragraph(data.getWardName()).setFont(bodyFont)));
            table.addCell(new Cell().add(new Paragraph(data.getWardType()).setFont(bodyFont)));
            table.addCell(new Cell().add(new Paragraph(String.valueOf(data.getTotalAdmissions())).setFont(bodyFont))
                    .setTextAlignment(TextAlignment.RIGHT));
            table.addCell(new Cell().add(new Paragraph(String.valueOf(data.getActiveAdmissions())).setFont(bodyFont))
                    .setTextAlignment(TextAlignment.RIGHT));
            table.addCell(new Cell().add(new Paragraph(String.format("%.1f%%", data.getOccupancyRate())).setFont(bodyFont))
                    .setTextAlignment(TextAlignment.RIGHT));
        }

        document.add(table);
    }

    private void addImpactAnalysisSection(Document document, ClinicStatisticsReportDTO reportData,
                                         PdfFont headerFont, PdfFont bodyFont) {
        if (reportData.getImpactAnalysisText() == null) {
            return;
        }

        document.add(new Paragraph("\n"));

        Paragraph impactHeader = new Paragraph("Impact Analysis and Performance Review")
                .setFont(headerFont)
                .setFontSize(16)
                .setBold()
                .setMarginBottom(10);
        document.add(impactHeader);

        Paragraph impactText = new Paragraph(reportData.getImpactAnalysisText())
                .setFont(bodyFont)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.JUSTIFIED)
                .setMarginBottom(20);
        document.add(impactText);
    }

    private void addConclusionSection(Document document, ClinicStatisticsReportDTO reportData,
                                     PdfFont headerFont, PdfFont bodyFont) {
        if (reportData.getConclusionText() == null) {
            return;
        }

        document.add(new Paragraph("\n"));

        Paragraph conclusionHeader = new Paragraph("Strategic Outlook and Conclusion")
                .setFont(headerFont)
                .setFontSize(16)
                .setBold()
                .setMarginBottom(10);
        document.add(conclusionHeader);

        Paragraph conclusionText = new Paragraph(reportData.getConclusionText())
                .setFont(bodyFont)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.JUSTIFIED)
                .setMarginBottom(20);
        document.add(conclusionText);

        // Add footer
        document.add(new Paragraph("\n\n"));
        Paragraph footer = new Paragraph("Report generated by Hospital Management System")
                .setFont(bodyFont)
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.GRAY);
        document.add(footer);
    }
}