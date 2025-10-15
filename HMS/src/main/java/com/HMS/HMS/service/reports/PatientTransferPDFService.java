package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.transferDTO.TransferResponseDTO;
import com.HMS.HMS.model.Patient.Patient;
import com.HMS.HMS.repository.PatientRepository;
import com.HMS.HMS.service.TransferService;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.element.LineSeparator;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PatientTransferPDFService {

    private final TransferService transferService;
    private final PatientRepository patientRepository;

    // Professional color scheme
    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(41, 128, 185);
    private static final DeviceRgb ACCENT_COLOR = new DeviceRgb(52, 152, 219);
    private static final DeviceRgb SUCCESS_COLOR = new DeviceRgb(39, 174, 96);
    private static final DeviceRgb WARNING_COLOR = new DeviceRgb(243, 156, 18);
    private static final DeviceRgb DANGER_COLOR = new DeviceRgb(231, 76, 60);
    private static final DeviceRgb LIGHT_GRAY = new DeviceRgb(248, 249, 250);
    private static final DeviceRgb BORDER_COLOR = new DeviceRgb(222, 226, 230);

    public PatientTransferPDFService(TransferService transferService, 
                                   PatientRepository patientRepository) {
        this.transferService = transferService;
        this.patientRepository = patientRepository;
    }

    /**
     * Generate professional PDF report for patient's transfer history
     */
    public byte[] generatePatientTransferPDF(String patientNationalId) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            // Get patient data
            Patient patient = patientRepository.findByNationalId(patientNationalId);
            if (patient == null) {
                throw new IllegalArgumentException("Patient not found with ID: " + patientNationalId);
            }

            // Get transfer history
            List<TransferResponseDTO> transfers = transferService.getTransferHistory(patientNationalId);

            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);
            document.setMargins(40, 40, 40, 60);

            // Set up fonts
            PdfFont titleFont = PdfFontFactory.createFont();
            PdfFont headerFont = PdfFontFactory.createFont();
            PdfFont normalFont = PdfFontFactory.createFont();
            PdfFont boldFont = PdfFontFactory.createFont();

            // Add professional header
            addProfessionalHeader(document, titleFont, headerFont);

            // Add patient information section
            addPatientInfoSection(document, patient, headerFont, normalFont, boldFont);

            // Add executive summary
            addExecutiveSummary(document, transfers, headerFont, normalFont, boldFont);

            // Add detailed transfer history
            addDetailedTransferHistory(document, transfers, headerFont, normalFont, boldFont);

            // Add footer
            addProfessionalFooter(document, normalFont);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating professional PDF report: " + e.getMessage(), e);
        }
    }

    private void addProfessionalHeader(Document document, PdfFont titleFont, PdfFont headerFont) throws Exception {
        // Header with hospital logo placeholder and title
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{1, 3, 1}));
        headerTable.setWidth(UnitValue.createPercentValue(100));
        headerTable.setMarginBottom(20);

        // Logo placeholder
        Cell logoCell = new Cell()
                .add(new Paragraph("🏥")
                        .setFontSize(40)
                        .setTextAlignment(TextAlignment.CENTER))
                .setBorder(Border.NO_BORDER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        // Hospital information
        Cell hospitalInfoCell = new Cell()
                .add(new Paragraph("HOSPITAL MANAGEMENT SYSTEM")
                        .setFont(titleFont)
                        .setFontSize(22)
                        .setFontColor(PRIMARY_COLOR)
                        .setBold()
                        .setTextAlignment(TextAlignment.CENTER))
                .add(new Paragraph("Patient Transfer History Report")
                        .setFont(headerFont)
                        .setFontSize(16)
                        .setFontColor(ACCENT_COLOR)
                        .setTextAlignment(TextAlignment.CENTER))
                .add(new Paragraph("Confidential Medical Document")
                        .setFont(headerFont)
                        .setFontSize(10)
                        .setFontColor(ColorConstants.GRAY)
                        .setTextAlignment(TextAlignment.CENTER))
                .setBorder(Border.NO_BORDER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        // Date and reference
        Cell dateCell = new Cell()
                .add(new Paragraph("Generated:")
                        .setFont(headerFont)
                        .setFontSize(10)
                        .setFontColor(ColorConstants.GRAY))
                .add(new Paragraph(LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                        .setFont(headerFont)
                        .setFontSize(12)
                        .setBold())
                .add(new Paragraph(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                        .setFont(headerFont)
                        .setFontSize(10)
                        .setFontColor(ColorConstants.GRAY))
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.RIGHT)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        headerTable.addCell(logoCell);
        headerTable.addCell(hospitalInfoCell);
        headerTable.addCell(dateCell);
        document.add(headerTable);

        // Professional separator
        LineSeparator separator = new LineSeparator(new SolidLine());
        separator.setStrokeColor(PRIMARY_COLOR);
        separator.setStrokeWidth(2);
        document.add(separator);
        document.add(new Paragraph("\n"));
    }

    private void addPatientInfoSection(Document document, Patient patient, PdfFont headerFont, PdfFont normalFont, PdfFont boldFont) throws Exception {
        // Section header with icon
        Table sectionHeaderTable = new Table(UnitValue.createPercentArray(new float[]{1, 10}));
        sectionHeaderTable.setWidth(UnitValue.createPercentValue(100));
        sectionHeaderTable.setMarginBottom(15);

        Cell iconCell = new Cell()
                .add(new Paragraph("👤")
                        .setFontSize(20))
                .setBorder(Border.NO_BORDER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        Cell titleCell = new Cell()
                .add(new Paragraph("PATIENT INFORMATION")
                        .setFont(headerFont)
                        .setFontSize(16)
                        .setFontColor(PRIMARY_COLOR)
                        .setBold())
                .setBorder(Border.NO_BORDER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        sectionHeaderTable.addCell(iconCell);
        sectionHeaderTable.addCell(titleCell);
        document.add(sectionHeaderTable);

        // Patient details in professional layout
        Table patientTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
        patientTable.setWidth(UnitValue.createPercentValue(100));
        patientTable.setMarginBottom(20);

        // Add patient details with professional styling
        addPatientDetailRow(patientTable, "Full Name", patient.getFullName(), normalFont, boldFont, true);
        addPatientDetailRow(patientTable, "National ID", patient.getNationalId(), normalFont, boldFont, false);
        addPatientDetailRow(patientTable, "Date of Birth", patient.getDateOfBirth().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")), normalFont, boldFont, true);
        addPatientDetailRow(patientTable, "Age", calculateAge(patient.getDateOfBirth()) + " years", normalFont, boldFont, false);
        addPatientDetailRow(patientTable, "Gender", patient.getGender().toString(), normalFont, boldFont, true);
        addPatientDetailRow(patientTable, "Phone Number", patient.getContactNumber(), normalFont, boldFont, false);
        addPatientDetailRow(patientTable, "Email Address", "Not provided", normalFont, boldFont, true);
        addPatientDetailRow(patientTable, "Emergency Contact", patient.getEmergencyContactNumber(), normalFont, boldFont, false);

        document.add(patientTable);
    }

    private void addPatientDetailRow(Table table, String label, String value, PdfFont normalFont, PdfFont boldFont, boolean isEven) {
        DeviceRgb bgColor = isEven ? LIGHT_GRAY : new DeviceRgb(255, 255, 255);
        
        Cell labelCell = new Cell()
                .add(new Paragraph(label)
                        .setFont(boldFont)
                        .setFontSize(11)
                        .setFontColor(ColorConstants.DARK_GRAY))
                .setBackgroundColor(bgColor)
                .setBorder(new SolidBorder(BORDER_COLOR, 1))
                .setPadding(12);

        Cell valueCell = new Cell()
                .add(new Paragraph(value)
                        .setFont(normalFont)
                        .setFontSize(11))
                .setBackgroundColor(bgColor)
                .setBorder(new SolidBorder(BORDER_COLOR, 1))
                .setPadding(12);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void addExecutiveSummary(Document document, List<TransferResponseDTO> transfers, PdfFont headerFont, PdfFont normalFont, PdfFont boldFont) throws Exception {
        // Section header
        Table sectionHeaderTable = new Table(UnitValue.createPercentArray(new float[]{1, 10}));
        sectionHeaderTable.setWidth(UnitValue.createPercentValue(100));
        sectionHeaderTable.setMarginBottom(15);

        Cell iconCell = new Cell()
                .add(new Paragraph("📊")
                        .setFontSize(20))
                .setBorder(Border.NO_BORDER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        Cell titleCell = new Cell()
                .add(new Paragraph("EXECUTIVE SUMMARY")
                        .setFont(headerFont)
                        .setFontSize(16)
                        .setFontColor(PRIMARY_COLOR)
                        .setBold())
                .setBorder(Border.NO_BORDER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        sectionHeaderTable.addCell(iconCell);
        sectionHeaderTable.addCell(titleCell);
        document.add(sectionHeaderTable);

        // Summary statistics in cards
        Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{1, 1, 1, 1}));
        summaryTable.setWidth(UnitValue.createPercentValue(100));
        summaryTable.setMarginBottom(20);

        // Calculate statistics
        int totalTransfers = transfers.size();
        String firstTransferDate = transfers.isEmpty() ? "N/A" : 
                transfers.get(transfers.size() - 1).getTransferDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
        String lastTransferDate = transfers.isEmpty() ? "N/A" : 
                transfers.get(0).getTransferDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
        long uniqueWards = transfers.stream()
                .mapToLong(t -> t.getToWardId())
                .distinct()
                .count();

        addSummaryCard(summaryTable, "Total Transfers", String.valueOf(totalTransfers), "🔄", SUCCESS_COLOR, headerFont, boldFont);
        addSummaryCard(summaryTable, "First Transfer", firstTransferDate, "📅", ACCENT_COLOR, headerFont, boldFont);
        addSummaryCard(summaryTable, "Latest Transfer", lastTransferDate, "🕒", WARNING_COLOR, headerFont, boldFont);
        addSummaryCard(summaryTable, "Wards Involved", String.valueOf(uniqueWards), "🏥", PRIMARY_COLOR, headerFont, boldFont);

        document.add(summaryTable);
    }

    private void addSummaryCard(Table table, String label, String value, String icon, DeviceRgb color, PdfFont headerFont, PdfFont boldFont) {
        Cell card = new Cell()
                .add(new Paragraph(icon)
                        .setFontSize(16)
                        .setTextAlignment(TextAlignment.CENTER))
                .add(new Paragraph(label)
                        .setFont(headerFont)
                        .setFontSize(10)
                        .setFontColor(ColorConstants.DARK_GRAY)
                        .setTextAlignment(TextAlignment.CENTER))
                .add(new Paragraph(value)
                        .setFont(boldFont)
                        .setFontSize(14)
                        .setBold()
                        .setFontColor(color)
                        .setTextAlignment(TextAlignment.CENTER))
                .setBackgroundColor(LIGHT_GRAY)
                .setBorder(new SolidBorder(color, 2))
                .setPadding(15)
                .setTextAlignment(TextAlignment.CENTER);
        table.addCell(card);
    }

    private void addDetailedTransferHistory(Document document, List<TransferResponseDTO> transfers, PdfFont headerFont, PdfFont normalFont, PdfFont boldFont) throws Exception {
        // Section header
        Table sectionHeaderTable = new Table(UnitValue.createPercentArray(new float[]{1, 10}));
        sectionHeaderTable.setWidth(UnitValue.createPercentValue(100));
        sectionHeaderTable.setMarginBottom(15);

        Cell iconCell = new Cell()
                .add(new Paragraph("📋")
                        .setFontSize(20))
                .setBorder(Border.NO_BORDER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        Cell titleCell = new Cell()
                .add(new Paragraph("DETAILED TRANSFER HISTORY")
                        .setFont(headerFont)
                        .setFontSize(16)
                        .setFontColor(PRIMARY_COLOR)
                        .setBold())
                .setBorder(Border.NO_BORDER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        sectionHeaderTable.addCell(iconCell);
        sectionHeaderTable.addCell(titleCell);
        document.add(sectionHeaderTable);

        if (transfers.isEmpty()) {
            document.add(new Paragraph("No transfer history found for this patient.")
                    .setFont(normalFont)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20)
                    .setMarginBottom(20));
            return;
        }

        // Create professional transfer history table
        Table transferTable = new Table(UnitValue.createPercentArray(new float[]{0.8f, 2, 2.5f, 1.5f, 2.2f}));
        transferTable.setWidth(UnitValue.createPercentValue(100));
        transferTable.setMarginBottom(20);

        // Add table headers with professional styling
        String[] headers = {"#", "Date & Time", "Transfer Route", "Bed Change", "Reason"};
        for (String header : headers) {
            transferTable.addHeaderCell(new Cell()
                    .add(new Paragraph(header)
                            .setFont(boldFont)
                            .setBold()
                            .setFontColor(ColorConstants.WHITE)
                            .setFontSize(11))
                    .setBackgroundColor(PRIMARY_COLOR)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(12)
                    .setBorder(new SolidBorder(ColorConstants.WHITE, 1)));
        }

        // Add transfer records with professional styling
        for (int i = 0; i < transfers.size(); i++) {
            TransferResponseDTO transfer = transfers.get(transfers.size() - 1 - i);
            addProfessionalTransferRow(transferTable, i + 1, transfer, normalFont, boldFont);
        }

        document.add(transferTable);
    }

    private void addProfessionalTransferRow(Table table, int index, TransferResponseDTO transfer, PdfFont normalFont, PdfFont boldFont) {
        DeviceRgb rowColor = index % 2 == 0 ? new DeviceRgb(255, 255, 255) : LIGHT_GRAY;
        
        // Index
        table.addCell(new Cell()
                .add(new Paragraph(String.valueOf(index))
                        .setFont(boldFont)
                        .setFontSize(10))
                .setBackgroundColor(rowColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(10)
                .setBorder(new SolidBorder(BORDER_COLOR, 0.5f)));

        // Date & Time
        String dateTime = transfer.getTransferDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy\nHH:mm"));
        table.addCell(new Cell()
                .add(new Paragraph(dateTime)
                        .setFont(normalFont)
                        .setFontSize(9))
                .setBackgroundColor(rowColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(10)
                .setBorder(new SolidBorder(BORDER_COLOR, 0.5f)));

        // Transfer Route
        table.addCell(new Cell()
                .add(new Paragraph("FROM: " + transfer.getFromWardName())
                        .setFont(normalFont)
                        .setFontSize(9)
                        .setFontColor(DANGER_COLOR))
                .add(new Paragraph("TO: " + transfer.getToWardName())
                        .setFont(normalFont)
                        .setFontSize(9)
                        .setFontColor(SUCCESS_COLOR))
                .setBackgroundColor(rowColor)
                .setPadding(10)
                .setBorder(new SolidBorder(BORDER_COLOR, 0.5f)));

        // Bed Change
        String bedChange = transfer.getFromBedNumber() + " → " + transfer.getToBedNumber();
        table.addCell(new Cell()
                .add(new Paragraph(bedChange)
                        .setFont(boldFont)
                        .setFontSize(10)
                        .setTextAlignment(TextAlignment.CENTER))
                .setBackgroundColor(rowColor)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(10)
                .setBorder(new SolidBorder(BORDER_COLOR, 0.5f)));

        // Reason
        table.addCell(new Cell()
                .add(new Paragraph(transfer.getTransferReason())
                        .setFont(normalFont)
                        .setFontSize(9))
                .setBackgroundColor(rowColor)
                .setPadding(10)
                .setBorder(new SolidBorder(BORDER_COLOR, 0.5f)));
    }

    private void addProfessionalFooter(Document document, PdfFont normalFont) throws Exception {
        LineSeparator footerSeparator = new LineSeparator(new SolidLine());
        footerSeparator.setStrokeColor(PRIMARY_COLOR);
        footerSeparator.setStrokeWidth(1);
        footerSeparator.setMarginTop(20);
        document.add(footerSeparator);

        Table footerTable = new Table(UnitValue.createPercentArray(new float[]{1, 1, 1}));
        footerTable.setWidth(UnitValue.createPercentValue(100));
        footerTable.setMarginTop(10);

        footerTable.addCell(new Cell()
                .add(new Paragraph("🏥 Hospital Management System")
                        .setFont(normalFont)
                        .setFontSize(9)
                        .setFontColor(ColorConstants.GRAY))
                .setBorder(Border.NO_BORDER));

        footerTable.addCell(new Cell()
                .add(new Paragraph("Generated on " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                        .setFont(normalFont)
                        .setFontSize(9)
                        .setFontColor(ColorConstants.GRAY)
                        .setTextAlignment(TextAlignment.CENTER))
                .setBorder(Border.NO_BORDER));

        footerTable.addCell(new Cell()
                .add(new Paragraph("Confidential Medical Record")
                        .setFont(normalFont)
                        .setFontSize(9)
                        .setFontColor(ColorConstants.GRAY)
                        .setTextAlignment(TextAlignment.RIGHT))
                .setBorder(Border.NO_BORDER));

        document.add(footerTable);
    }

    private int calculateAge(java.time.LocalDate birthDate) {
        return java.time.Period.between(birthDate, java.time.LocalDate.now()).getYears();
    }
}