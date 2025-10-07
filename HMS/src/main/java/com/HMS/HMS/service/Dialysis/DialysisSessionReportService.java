package com.HMS.HMS.service.Dialysis;

import com.HMS.HMS.model.Dialysis.DialysisSession;
import com.HMS.HMS.repository.Dialysis.DialysisSessionRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class DialysisSessionReportService {

    private final DialysisSessionRepository sessionRepository;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy HH:mm");
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

    // Professional medical document colors
    private final DeviceRgb primaryColor = new DeviceRgb(0, 102, 204); // Medical Blue
    private final DeviceRgb accentColor = new DeviceRgb(0, 153, 153); // Teal
    private final DeviceRgb headerBgColor = new DeviceRgb(240, 248, 255); // Alice Blue
    private final DeviceRgb sectionBgColor = new DeviceRgb(248, 250, 252); // Light Gray

    public DialysisSessionReportService(DialysisSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    /**
     * Generate comprehensive medical report for dialysis session
     */
    public byte[] generateDialysisSessionReport(String sessionId) {
        try {
            DialysisSession session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Add document header
            addDocumentHeader(document);

            // Add report title section
            addReportTitle(document, session);

            // Add patient information section
            addPatientInformationSection(document, session);

            // Add session details section
            addSessionDetailsSection(document, session);

            // Add vital signs monitoring section
            addVitalSignsSection(document, session);

            // Add treatment parameters section
            addTreatmentParametersSection(document, session);

            // Add weight and fluid management section
            addWeightFluidSection(document, session);

            // Add session summary section
            addSessionSummarySection(document, session);

            // Add signature section
            addSignatureSection(document);

            // Add footer
            addDocumentFooter(document);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating dialysis session report: " + e.getMessage(), e);
        }
    }

    private void addDocumentHeader(Document document) {
        Table headerTable = new Table(1).setWidth(UnitValue.createPercentValue(100));
        headerTable.setBorder(new SolidBorder(primaryColor, 3));
        headerTable.setBackgroundColor(headerBgColor);

        Paragraph hospitalName = new Paragraph("HOSPITAL MANAGEMENT SYSTEM")
                .setFontSize(22)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(primaryColor)
                .setMarginBottom(5);

        Paragraph departmentName = new Paragraph("Department of Nephrology & Dialysis")
                .setFontSize(12)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(accentColor)
                .setMarginBottom(3);

        Paragraph address = new Paragraph("123 Medical Center Drive | Phone: (555) 123-4567 | Fax: (555) 123-4568")
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(0);

        Cell headerCell = new Cell()
                .add(hospitalName)
                .add(departmentName)
                .add(address)
                .setPadding(15)
                .setBorder(Border.NO_BORDER);

        headerTable.addCell(headerCell);
        document.add(headerTable);
        document.add(new Paragraph("\n"));
    }

    private void addReportTitle(Document document, DialysisSession session) {
        Table titleTable = new Table(1).setWidth(UnitValue.createPercentValue(100));
        titleTable.setBackgroundColor(primaryColor);

        Paragraph title = new Paragraph("DIALYSIS SESSION REPORT")
                .setFontSize(16)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.WHITE);

        Cell titleCell = new Cell()
                .add(title)
                .setPadding(10)
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.CENTER);

        titleTable.addCell(titleCell);
        document.add(titleTable);

        // Session ID bar
        Table idTable = new Table(1).setWidth(UnitValue.createPercentValue(100));
        idTable.setBackgroundColor(sectionBgColor);

        Paragraph sessionIdPara = new Paragraph("Session ID: " + session.getSessionId() +
                " | Report Generated: " + LocalDateTime.now().format(dateTimeFormatter))
                .setFontSize(9)
                .setTextAlignment(TextAlignment.CENTER);

        Cell idCell = new Cell()
                .add(sessionIdPara)
                .setPadding(8)
                .setBorder(Border.NO_BORDER);

        idTable.addCell(idCell);
        document.add(idTable);
        document.add(new Paragraph("\n"));
    }

    private void addPatientInformationSection(Document document, DialysisSession session) {
        addSectionHeader(document, "PATIENT INFORMATION");

        Table patientTable = new Table(UnitValue.createPercentArray(new float[]{3, 5, 3, 5}))
                .setWidth(UnitValue.createPercentValue(100));

        addLabelValueRow(patientTable, "Patient Name:", session.getPatientName(),
                "National ID:", session.getPatientNationalId());

        String admissionInfo = session.getAdmissionId() != null ?
                "Admission #" + session.getAdmissionId() : "Outpatient";
        String transferStatus = Boolean.TRUE.equals(session.getIsTransferred()) ?
                "Transferred from: " + (session.getTransferredFrom() != null ? session.getTransferredFrom() : "Unknown Ward")
                : "Direct Admission";

        addLabelValueRow(patientTable, "Admission Status:", admissionInfo,
                "Transfer Status:", transferStatus);

        document.add(patientTable);
        document.add(new Paragraph("\n"));
    }

    private void addSessionDetailsSection(Document document, DialysisSession session) {
        addSectionHeader(document, "SESSION DETAILS");

        Table sessionTable = new Table(UnitValue.createPercentArray(new float[]{3, 5, 3, 5}))
                .setWidth(UnitValue.createPercentValue(100));

        addLabelValueRow(sessionTable, "Session Date:",
                session.getScheduledDate().format(dateFormatter),
                "Session Type:", formatEnum(session.getSessionType()));

        String scheduledTime = session.getStartTime().format(timeFormatter) + " - " +
                session.getEndTime().format(timeFormatter);
        String status = formatEnum(session.getStatus());
        addLabelValueRow(sessionTable, "Scheduled Time:", scheduledTime,
                "Status:", status);

        String actualStart = session.getActualStartTime() != null ?
                session.getActualStartTime().format(timeFormatter) : "Not Recorded";
        String actualEnd = session.getActualEndTime() != null ?
                session.getActualEndTime().format(timeFormatter) : "Not Recorded";

        addLabelValueRow(sessionTable, "Actual Start Time:", actualStart,
                "Actual End Time:", actualEnd);

        String duration = session.getDuration() != null ? session.getDuration() : "Not Calculated";
        String machineId = session.getMachineId() != null ? "Machine " + session.getMachineId() : "Not Assigned";

        addLabelValueRow(sessionTable, "Session Duration:", duration,
                "Dialysis Machine:", machineId);

        addLabelValueRow(sessionTable, "Session Status:", formatEnum(session.getStatus()),
                "Attendance Status:", formatEnum(session.getAttendance()));

        document.add(sessionTable);
        document.add(new Paragraph("\n"));
    }

    private void addVitalSignsSection(Document document, DialysisSession session) {
        addSectionHeader(document, "VITAL SIGNS MONITORING");

        Table vitalTable = new Table(UnitValue.createPercentArray(new float[]{4, 3, 3, 2}))
                .setWidth(UnitValue.createPercentValue(100));

        // Header row with background
        vitalTable.addHeaderCell(createTableHeaderCell("Vital Sign"));
        vitalTable.addHeaderCell(createTableHeaderCell("Pre-Treatment"));
        vitalTable.addHeaderCell(createTableHeaderCell("Post-Treatment"));
        vitalTable.addHeaderCell(createTableHeaderCell("Unit"));

        // Blood Pressure
        addVitalRow(vitalTable, "Blood Pressure",
                session.getPreBloodPressure(),
                session.getPostBloodPressure(), "mmHg");

        // Heart Rate
        addVitalRow(vitalTable, "Heart Rate",
                session.getPreHeartRate() != null ? session.getPreHeartRate().toString() : null,
                session.getPostHeartRate() != null ? session.getPostHeartRate().toString() : null,
                "bpm");

        // Temperature (spanning pre/post columns)
        Cell tempLabel = new Cell().add(new Paragraph("Body Temperature").setBold()).setPadding(8);
        String tempValue = session.getTemperature() != null ? session.getTemperature().toString() : "Not Recorded";
        Cell tempData = new Cell(1, 2).add(new Paragraph(tempValue))
                .setPadding(8)
                .setTextAlignment(TextAlignment.CENTER);
        Cell tempUnit = new Cell().add(new Paragraph("°C")).setPadding(8).setTextAlignment(TextAlignment.CENTER);

        vitalTable.addCell(tempLabel);
        vitalTable.addCell(tempData);
        vitalTable.addCell(tempUnit);

        document.add(vitalTable);
        document.add(new Paragraph("\n"));
    }

    private void addTreatmentParametersSection(Document document, DialysisSession session) {
        addSectionHeader(document, "TREATMENT PARAMETERS");

        Table treatmentTable = new Table(UnitValue.createPercentArray(new float[]{3, 5, 3, 5}))
                .setWidth(UnitValue.createPercentValue(100));

        String dialysisAccess = session.getDialysisAccess() != null ?
                formatEnum(session.getDialysisAccess()) : "Not Documented";
        String patientComfort = session.getPatientComfort() != null ?
                capitalizeFirst(session.getPatientComfort()) : "Not Assessed";

        addLabelValueRow(treatmentTable, "Dialysis Access Type:", dialysisAccess,
                "Patient Comfort Level:", patientComfort);

        String bloodFlow = session.getBloodFlow() != null ?
                session.getBloodFlow() + " ml/min" : "Not Recorded";
        String dialysateFlow = session.getDialysateFlow() != null ?
                session.getDialysateFlow() + " ml/min" : "Not Recorded";

        addLabelValueRow(treatmentTable, "Blood Flow Rate:", bloodFlow,
                "Dialysate Flow Rate:", dialysateFlow);

        document.add(treatmentTable);
        document.add(new Paragraph("\n"));
    }

    private void addWeightFluidSection(Document document, DialysisSession session) {
        addSectionHeader(document, "WEIGHT & FLUID MANAGEMENT");

        Table weightTable = new Table(UnitValue.createPercentArray(new float[]{5, 3, 2}))
                .setWidth(UnitValue.createPercentValue(100));

        // Header
        weightTable.addHeaderCell(createTableHeaderCell("Parameter"));
        weightTable.addHeaderCell(createTableHeaderCell("Value"));
        weightTable.addHeaderCell(createTableHeaderCell("Unit"));

        // Pre-treatment Weight
        addMeasurementRow(weightTable, "Pre-Treatment Weight",
                session.getPreWeight(), "kg");

        // Post-treatment Weight
        addMeasurementRow(weightTable, "Post-Treatment Weight",
                session.getPostWeight(), "kg");

        // Weight Difference (calculated)
        if (session.getPreWeight() != null && session.getPostWeight() != null) {
            try {
                double preWeight = Double.parseDouble(session.getPreWeight());
                double postWeight = Double.parseDouble(session.getPostWeight());
                double difference = preWeight - postWeight;
                addMeasurementRow(weightTable, "Weight Loss During Session",
                        String.format("%.2f", difference), "kg");
            } catch (NumberFormatException e) {
                addMeasurementRow(weightTable, "Weight Loss During Session", "Unable to Calculate", "kg");
            }
        } else {
            addMeasurementRow(weightTable, "Weight Loss During Session", "Not Available", "kg");
        }

        // Fluid Removal
        addMeasurementRow(weightTable, "Total Fluid Removed",
                session.getFluidRemoval(), "ml");

        // Ultrafiltration rate (if calculable)
        if (session.getFluidRemoval() != null && session.getDuration() != null) {
            try {
                double fluidRemoved = Double.parseDouble(session.getFluidRemoval());
                // Extract hours from duration string (e.g., "4h 30m")
                String durationStr = session.getDuration();
                double hours = extractHoursFromDuration(durationStr);
                if (hours > 0) {
                    double ufRate = fluidRemoved / hours;
                    addMeasurementRow(weightTable, "Ultrafiltration Rate",
                            String.format("%.0f", ufRate), "ml/hr");
                }
            } catch (Exception e) {
                // Skip if calculation fails
            }
        }

        document.add(weightTable);
        document.add(new Paragraph("\n"));
    }

    private void addSessionSummarySection(Document document, DialysisSession session) {
        addSectionHeader(document, "SESSION SUMMARY");

        Table summaryTable = new Table(1).setWidth(UnitValue.createPercentValue(100));
        summaryTable.setBackgroundColor(sectionBgColor);

        StringBuilder summary = new StringBuilder();
        summary.append("This dialysis session was ");

        // Status description
        if (session.getStatus() == DialysisSession.SessionStatus.COMPLETED) {
            summary.append("successfully completed");
        } else {
            summary.append("recorded with status: ").append(formatEnum(session.getStatus()));
        }

        summary.append(" on ").append(session.getScheduledDate().format(dateFormatter));

        // Duration
        if (session.getDuration() != null) {
            summary.append(". The session lasted ").append(session.getDuration());
        }

        // Attendance
        if (session.getAttendance() != null) {
            summary.append(". Patient attendance: ").append(formatEnum(session.getAttendance()));
        }

        // Clinical outcome summary
        if (session.getStatus() == DialysisSession.SessionStatus.COMPLETED) {
            summary.append(".\n\nClinical Outcome: ");
            if (session.getFluidRemoval() != null) {
                summary.append("Target fluid removal of ").append(session.getFluidRemoval())
                       .append(" ml was achieved");
            }
            if (session.getPatientComfort() != null) {
                summary.append(". Patient reported ")
                       .append(session.getPatientComfort())
                       .append(" comfort level throughout the procedure");
            }
            summary.append(".");
        }

        Paragraph summaryPara = new Paragraph(summary.toString())
                .setFontSize(10)
                .setPadding(15);

        Cell summaryCell = new Cell()
                .add(summaryPara)
                .setBorder(new SolidBorder(primaryColor, 1));

        summaryTable.addCell(summaryCell);
        document.add(summaryTable);
        document.add(new Paragraph("\n"));
    }

    private void addSignatureSection(Document document) {
        document.add(new Paragraph("\n"));

        Table signatureTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                .setWidth(UnitValue.createPercentValue(100));

        // Healthcare Provider Signature
        Cell providerCell = new Cell()
                .add(new Paragraph("_________________________________"))
                .add(new Paragraph("Healthcare Provider Signature").setFontSize(9).setItalic())
                .add(new Paragraph("\nDate: _________________").setFontSize(9))
                .setBorder(Border.NO_BORDER)
                .setPaddingRight(30);

        // Nurse/Technician Signature
        Cell nurseCell = new Cell()
                .add(new Paragraph("_________________________________"))
                .add(new Paragraph("Dialysis Nurse/Technician Signature").setFontSize(9).setItalic())
                .add(new Paragraph("\nDate: _________________").setFontSize(9))
                .setBorder(Border.NO_BORDER)
                .setPaddingLeft(30);

        signatureTable.addCell(providerCell);
        signatureTable.addCell(nurseCell);

        document.add(signatureTable);
    }

    private void addDocumentFooter(Document document) {
        document.add(new Paragraph("\n"));

        Table footerTable = new Table(1).setWidth(UnitValue.createPercentValue(100));
        footerTable.setBorder(new SolidBorder(ColorConstants.LIGHT_GRAY, 1));

        Paragraph disclaimer = new Paragraph(
                "This is a confidential medical document. Distribution is restricted to authorized healthcare personnel only.\n" +
                "This document was computer-generated and is considered valid without a physical signature."
        )
                .setFontSize(8)
                .setTextAlignment(TextAlignment.CENTER)
                .setFontColor(ColorConstants.GRAY)
                .setPadding(10);

        Cell footerCell = new Cell()
                .add(disclaimer)
                .setBorder(Border.NO_BORDER);

        footerTable.addCell(footerCell);
        document.add(footerTable);
    }

    // Helper methods
    private void addSectionHeader(Document document, String title) {
        Table headerTable = new Table(1).setWidth(UnitValue.createPercentValue(100));
        headerTable.setBackgroundColor(accentColor);

        Paragraph header = new Paragraph(title)
                .setFontSize(12)
                .setBold()
                .setFontColor(ColorConstants.WHITE);

        Cell headerCell = new Cell()
                .add(header)
                .setPadding(8)
                .setBorder(Border.NO_BORDER);

        headerTable.addCell(headerCell);
        document.add(headerTable);
    }

    private void addLabelValueRow(Table table, String label1, String value1, String label2, String value2) {
        table.addCell(new Cell().add(new Paragraph(label1).setBold().setFontSize(9))
                .setPadding(8).setBackgroundColor(sectionBgColor));
        table.addCell(new Cell().add(new Paragraph(value1 != null ? value1 : "Not Recorded").setFontSize(9))
                .setPadding(8));
        table.addCell(new Cell().add(new Paragraph(label2).setBold().setFontSize(9))
                .setPadding(8).setBackgroundColor(sectionBgColor));
        table.addCell(new Cell().add(new Paragraph(value2 != null ? value2 : "Not Recorded").setFontSize(9))
                .setPadding(8));
    }

    private void addVitalRow(Table table, String vitalName, String preValue, String postValue, String unit) {
        table.addCell(new Cell().add(new Paragraph(vitalName).setBold().setFontSize(9))
                .setPadding(8).setBackgroundColor(sectionBgColor));
        table.addCell(new Cell().add(new Paragraph(preValue != null ? preValue : "Not Recorded").setFontSize(9))
                .setPadding(8).setTextAlignment(TextAlignment.CENTER));
        table.addCell(new Cell().add(new Paragraph(postValue != null ? postValue : "Not Recorded").setFontSize(9))
                .setPadding(8).setTextAlignment(TextAlignment.CENTER));
        table.addCell(new Cell().add(new Paragraph(unit).setFontSize(9))
                .setPadding(8).setTextAlignment(TextAlignment.CENTER));
    }

    private void addMeasurementRow(Table table, String measurement, String value, String unit) {
        table.addCell(new Cell().add(new Paragraph(measurement).setBold().setFontSize(9))
                .setPadding(8).setBackgroundColor(sectionBgColor));
        String displayValue = value != null ? value : "Not Recorded";
        table.addCell(new Cell().add(new Paragraph(displayValue).setFontSize(9))
                .setPadding(8).setTextAlignment(TextAlignment.CENTER));
        table.addCell(new Cell().add(new Paragraph(unit).setFontSize(9))
                .setPadding(8).setTextAlignment(TextAlignment.CENTER));
    }

    private Cell createTableHeaderCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold().setFontSize(10).setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(primaryColor)
                .setPadding(10)
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);
    }

    private String formatEnum(Enum<?> enumValue) {
        if (enumValue == null) return "Not Specified";
        String name = enumValue.name();
        String[] words = name.toLowerCase().split("_");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            if (word.length() > 0) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1))
                        .append(" ");
            }
        }
        return result.toString().trim();
    }

    private String capitalizeFirst(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }

    private double extractHoursFromDuration(String duration) {
        try {
            // Parse duration like "4h 30m"
            double hours = 0;
            if (duration.contains("h")) {
                String hourPart = duration.substring(0, duration.indexOf("h")).trim();
                hours = Double.parseDouble(hourPart);
            }
            if (duration.contains("m")) {
                String minutePart = duration.substring(duration.indexOf("h") + 1, duration.indexOf("m")).trim();
                hours += Double.parseDouble(minutePart) / 60.0;
            }
            return hours;
        } catch (Exception e) {
            return 0;
        }
    }
}
