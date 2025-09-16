package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.ClinicStatisticsDTO;
import com.HMS.HMS.DTO.reports.MonthlyVisitDTO;
import com.HMS.HMS.repository.reports.ClinicStatisticsRepository;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class ClinicStatisticsITextService {

    private final ClinicStatisticsService baseService;
    private static final DeviceRgb HEADER_COLOR = new DeviceRgb(74, 144, 226);
    private static final DeviceRgb LIGHT_BLUE = new DeviceRgb(230, 243, 255);

    public ClinicStatisticsITextService(ClinicStatisticsService baseService) {
        this.baseService = baseService;
    }

    @Transactional(readOnly = true)
    public byte[] generateClinicStatisticsPdf(int year, String preparedBy) throws Exception {
        System.out.println("=== PDF Generation Debug ===");
        System.out.println("Year: " + year);
        System.out.println("Prepared by: " + preparedBy);

        try {
            List<ClinicStatisticsDTO> statistics = baseService.getClinicStatistics(year);
            System.out.println("Statistics retrieved: " + statistics.size() + " units");

            if (statistics.isEmpty()) {
                throw new RuntimeException("No clinic statistics data found for year " + year);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            try {
                // Fonts
                PdfFont titleFont = PdfFontFactory.createFont();
                PdfFont headerFont = PdfFontFactory.createFont();
                PdfFont normalFont = PdfFontFactory.createFont();

                // Add Header
                addHeader(document, titleFont, year);

                // Add content for each clinic unit
                for (ClinicStatisticsDTO stat : statistics) {
                    addClinicSection(document, stat, headerFont, normalFont);
                    document.add(new AreaBreak());
                }

                // Add Footer
                addFooter(document, normalFont, preparedBy);

                System.out.println("PDF generation completed successfully");
                return baos.toByteArray();
            } finally {
                document.close();
            }
        } catch (Exception e) {
            System.err.println("Error during PDF generation: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate PDF report: " + e.getMessage(), e);
        }
    }

    private void addHeader(Document document, PdfFont titleFont, int year) {
        // Header with background
        Table headerTable = new Table(1);
        headerTable.setWidth(UnitValue.createPercentValue(100));
        headerTable.setBackgroundColor(LIGHT_BLUE);
        headerTable.setBorder(Border.NO_BORDER);

        Cell headerCell = new Cell();
        headerCell.setBorder(Border.NO_BORDER);
        headerCell.setPadding(20);

        // Hospital name
        Paragraph hospitalName = new Paragraph("NATIONAL INSTITUTE FOR NEPHROLOGY, DIALYSIS & TRANSPLANTATION")
                .setFont(titleFont)
                .setFontSize(14)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER);

        // Report title
        Paragraph reportTitle = new Paragraph("CLINIC STATISTICS")
                .setFont(titleFont)
                .setFontSize(18)
                .setBold()
                .setFontColor(HEADER_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10);

        // Year
        Paragraph yearPara = new Paragraph("Year: " + year)
                .setFont(titleFont)
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(5);

        headerCell.add(hospitalName);
        headerCell.add(reportTitle);
        headerCell.add(yearPara);
        headerTable.addCell(headerCell);

        document.add(headerTable);
        document.add(new Paragraph("\n"));
    }

    private void addClinicSection(Document document, ClinicStatisticsDTO stat,
                                 PdfFont headerFont, PdfFont normalFont) throws Exception {

        // Unit Introduction Header
        Paragraph unitHeader = new Paragraph(stat.getUnitName() + " Introduction")
                .setFont(headerFont)
                .setFontSize(14)
                .setBold()
                .setFontColor(HEADER_COLOR)
                .setMarginBottom(10);
        document.add(unitHeader);

        // Unit Description
        Paragraph description = new Paragraph(stat.getUnitDescription())
                .setFont(normalFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.JUSTIFIED)
                .setMarginBottom(20);
        document.add(description);

        // Monthly Data Table
        addMonthlyDataTable(document, stat, headerFont, normalFont);

        // Chart
        addChart(document, stat);

        // Trend Analysis
        addTrendAnalysis(document, stat, normalFont);
    }

    private void addMonthlyDataTable(Document document, ClinicStatisticsDTO stat,
                                   PdfFont headerFont, PdfFont normalFont) {

        // Table title
        Paragraph tableTitle = new Paragraph("Monthly Patient Visit Statistics")
                .setFont(headerFont)
                .setFontSize(12)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10);
        document.add(tableTitle);

        // Create table
        Table table = new Table(2);
        table.setWidth(UnitValue.createPercentValue(100));

        // Header row
        Cell monthHeader = new Cell().add(new Paragraph("Month").setFont(headerFont).setBold())
                .setBackgroundColor(HEADER_COLOR)
                .setFontColor(ColorConstants.WHITE)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(8);

        Cell visitHeader = new Cell().add(new Paragraph("Total No of Patients Visited").setFont(headerFont).setBold())
                .setBackgroundColor(HEADER_COLOR)
                .setFontColor(ColorConstants.WHITE)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(8);

        table.addHeaderCell(monthHeader);
        table.addHeaderCell(visitHeader);

        // Data rows
        int totalVisits = 0;
        for (MonthlyVisitDTO visit : stat.getMonthlyData()) {
            table.addCell(new Cell().add(new Paragraph(visit.getMonth()).setFont(normalFont))
                    .setPadding(5)
                    .setTextAlignment(TextAlignment.LEFT));

            table.addCell(new Cell().add(new Paragraph(visit.getVisitCount().toString()).setFont(normalFont))
                    .setPadding(5)
                    .setTextAlignment(TextAlignment.CENTER));

            totalVisits += visit.getVisitCount();
        }

        // Total row
        table.addCell(new Cell().add(new Paragraph("Total").setFont(headerFont).setBold())
                .setBackgroundColor(LIGHT_BLUE)
                .setPadding(5)
                .setTextAlignment(TextAlignment.LEFT));

        table.addCell(new Cell().add(new Paragraph(String.valueOf(totalVisits)).setFont(headerFont).setBold())
                .setBackgroundColor(LIGHT_BLUE)
                .setPadding(5)
                .setTextAlignment(TextAlignment.CENTER));

        document.add(table);
        document.add(new Paragraph("\n"));
    }

    private void addChart(Document document, ClinicStatisticsDTO stat) throws Exception {
        // Generate professional chart dataset
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        for (MonthlyVisitDTO visit : stat.getMonthlyData()) {
            // Use proper month abbreviations for cleaner x-axis
            String monthAbbr = getMonthAbbreviation(visit.getMonth());
            dataset.addValue(visit.getVisitCount(), "Patient Visits", monthAbbr);
        }

        // Create clean line chart
        JFreeChart chart = ChartFactory.createLineChart(
                null, // No title - we'll add it separately in PDF
                null, // No x-axis label
                "Number of Visits", // Y-axis label
                dataset
        );

        // Professional styling
        customizeChartForMedicalReport(chart);

        // Convert to high-quality image
        ByteArrayOutputStream chartStream = new ByteArrayOutputStream();
        ChartUtils.writeChartAsPNG(chartStream, chart, 600, 300); // Higher resolution

        // Add chart title in PDF (not in chart)
        Paragraph chartTitle = new Paragraph("Figure " + getChartNumber(stat.getUnitName()) + ": Total number of clinic patient visits to " + stat.getUnitName())
                .setFont(PdfFontFactory.createFont())
                .setFontSize(12)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20)
                .setMarginBottom(10);
        document.add(chartTitle);

        // Add chart image
        com.itextpdf.layout.element.Image chartImage = new com.itextpdf.layout.element.Image(ImageDataFactory.create(chartStream.toByteArray()));
        chartImage.setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
        chartImage.setMarginBottom(10);

        document.add(chartImage);

        // Add chart description
        Paragraph chartDescription = new Paragraph("FIGURE " + getChartNumber(stat.getUnitName()) + ": Total Clinic Patient Visits to " + stat.getUnitName() + " Over the Year")
                .setFont(PdfFontFactory.createFont())
                .setFontSize(10)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(chartDescription);
    }

    private void customizeChartForMedicalReport(JFreeChart chart) {
        // Clean white background
        chart.setBackgroundPaint(Color.WHITE);

        // Get the plot
        org.jfree.chart.plot.CategoryPlot plot = (org.jfree.chart.plot.CategoryPlot) chart.getPlot();

        // Set clean background
        plot.setBackgroundPaint(Color.WHITE);
        plot.setDomainGridlinePaint(Color.LIGHT_GRAY);
        plot.setRangeGridlinePaint(Color.LIGHT_GRAY);
        plot.setDomainGridlinesVisible(true);
        plot.setRangeGridlinesVisible(true);

        // Style the line renderer
        org.jfree.chart.renderer.category.LineAndShapeRenderer renderer =
            (org.jfree.chart.renderer.category.LineAndShapeRenderer) plot.getRenderer();

        // Professional blue line
        renderer.setSeriesPaint(0, new Color(74, 144, 226)); // Medical blue color
        renderer.setSeriesStroke(0, new java.awt.BasicStroke(2.5f)); // Thicker line
        renderer.setSeriesShapesVisible(0, true); // Show data points
        renderer.setSeriesShape(0, new java.awt.geom.Ellipse2D.Double(-3, -3, 6, 6)); // Small circles

        // Clean fonts
        java.awt.Font labelFont = new java.awt.Font("Arial", java.awt.Font.PLAIN, 11);
        java.awt.Font tickFont = new java.awt.Font("Arial", java.awt.Font.PLAIN, 10);

        // X-axis styling
        org.jfree.chart.axis.CategoryAxis domainAxis = plot.getDomainAxis();
        domainAxis.setLabelFont(labelFont);
        domainAxis.setTickLabelFont(tickFont);
        domainAxis.setCategoryLabelPositions(org.jfree.chart.axis.CategoryLabelPositions.STANDARD);

        // Y-axis styling
        org.jfree.chart.axis.NumberAxis rangeAxis = (org.jfree.chart.axis.NumberAxis) plot.getRangeAxis();
        rangeAxis.setLabelFont(labelFont);
        rangeAxis.setTickLabelFont(tickFont);
        rangeAxis.setStandardTickUnits(org.jfree.chart.axis.NumberAxis.createIntegerTickUnits());

        // Remove legend (cleaner look)
        chart.removeLegend();

        // Remove border
        chart.setBorderVisible(false);
    }

    private String getMonthAbbreviation(String monthName) {
        return switch (monthName.toLowerCase()) {
            case "january" -> "Jan";
            case "february" -> "Feb";
            case "march" -> "Mar";
            case "april" -> "Apr";
            case "may" -> "May";
            case "june" -> "Jun";
            case "july" -> "Jul";
            case "august" -> "Aug";
            case "september" -> "Sep";
            case "october" -> "Oct";
            case "november" -> "Nov";
            case "december" -> "Dec";
            default -> monthName.substring(0, Math.min(3, monthName.length()));
        };
    }

    private String getChartNumber(String unitName) {
        return switch (unitName.toLowerCase()) {
            case "nephrology unit 1" -> "5.1";
            case "nephrology unit 2" -> "5.2";
            case "professor unit" -> "5.3";
            case "urology and transplant" -> "5.4";
            case "vascular and transplant" -> "5.5";
            default -> "5.X";
        };
    }

    private void addTrendAnalysis(Document document, ClinicStatisticsDTO stat, PdfFont normalFont) {
        Paragraph analysisHeader = new Paragraph("Trends Analysis")
                .setFont(normalFont)
                .setFontSize(12)
                .setBold()
                .setMarginBottom(10);
        document.add(analysisHeader);

        Paragraph analysis = new Paragraph(stat.getTrendAnalysis())
                .setFont(normalFont)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.JUSTIFIED)
                .setMarginBottom(20);
        document.add(analysis);
    }

    private void addFooter(Document document, PdfFont normalFont, String preparedBy) {
        document.add(new Paragraph("\n\n"));

        Paragraph footer = new Paragraph("Report prepared by: " + (preparedBy != null ? preparedBy : "System"))
                .setFont(normalFont)
                .setFontSize(10)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER);

        Paragraph generated = new Paragraph("Generated on: " + LocalDate.now())
                .setFont(normalFont)
                .setFontSize(8)
                .setTextAlignment(TextAlignment.RIGHT);

        document.add(footer);
        document.add(generated);
    }
}