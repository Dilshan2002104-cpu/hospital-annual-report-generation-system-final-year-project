package com.HMS.HMS.service.reports;

import com.HMS.HMS.DTO.reports.*;
import com.HMS.HMS.DTO.reports.MonthlyVisitDataDTO;
import com.HMS.HMS.DTO.reports.SpecializationDataDTO;
import com.HMS.HMS.DTO.reports.WardOccupancyDataDTO;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.CategoryAxis;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PiePlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.LineAndShapeRenderer;
import org.jfree.chart.title.TextTitle;
import org.jfree.chart.util.Rotation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ChartGenerationService {

    private static final int CHART_WIDTH = 800;
    private static final int CHART_HEIGHT = 600;
    private static final Color CHART_BACKGROUND_COLOR = Color.WHITE;
    private static final Color PLOT_BACKGROUND_COLOR = new Color(248, 248, 248);

    public byte[] generateMonthlyVisitsLineChart(List<MonthlyVisitDataDTO> monthlyData, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (MonthlyVisitDataDTO data : monthlyData) {
            dataset.addValue(data.getPatientCount(), "Patients", getMonthShortName(data.getMonth()));
        }

        JFreeChart chart = ChartFactory.createLineChart(
            title,
            "Month",
            "Number of Patients",
            dataset,
            PlotOrientation.VERTICAL,
            true,
            true,
            false
        );

        customizeLineChart(chart);
        return chartToByteArray(chart);
    }

    public byte[] generateMonthlyVisitsBarChart(List<MonthlyVisitDataDTO> monthlyData, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (MonthlyVisitDataDTO data : monthlyData) {
            dataset.addValue(data.getPatientCount(), "Visits", getMonthShortName(data.getMonth()));
        }

        JFreeChart chart = ChartFactory.createBarChart(
            title,
            "Month",
            "Number of Patients",
            dataset,
            PlotOrientation.VERTICAL,
            true,
            true,
            false
        );

        customizeBarChart(chart);
        return chartToByteArray(chart);
    }

    public byte[] generateSpecializationPieChart(List<SpecializationDataDTO> specializationData, String title) {
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();

        for (SpecializationDataDTO data : specializationData) {
            dataset.setValue(data.getSpecialization(), data.getTotalVisits());
        }

        JFreeChart chart = ChartFactory.createPieChart(
            title,
            dataset,
            true,
            true,
            false
        );

        customizePieChart(chart);
        return chartToByteArray(chart);
    }

    public byte[] generateWardOccupancyChart(List<WardOccupancyDataDTO> wardData, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (WardOccupancyDataDTO data : wardData) {
            dataset.addValue(data.getOccupancyRate(), "Occupancy Rate", data.getWardName());
            dataset.addValue(data.getTotalAdmissions(), "Total Admissions", data.getWardName());
        }

        JFreeChart chart = ChartFactory.createBarChart(
            title,
            "Ward",
            "Count / Percentage",
            dataset,
            PlotOrientation.VERTICAL,
            true,
            true,
            false
        );

        customizeBarChart(chart);
        return chartToByteArray(chart);
    }

    public byte[] generateComparisonChart(List<MonthlyVisitDataDTO> appointmentsData,
                                         List<MonthlyVisitDataDTO> admissionsData,
                                         String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        // Add appointments data
        for (MonthlyVisitDataDTO data : appointmentsData) {
            dataset.addValue(data.getPatientCount(), "Appointments", getMonthShortName(data.getMonth()));
        }

        // Add admissions data
        for (MonthlyVisitDataDTO data : admissionsData) {
            dataset.addValue(data.getPatientCount(), "Admissions", getMonthShortName(data.getMonth()));
        }

        JFreeChart chart = ChartFactory.createLineChart(
            title,
            "Month",
            "Number of Patients",
            dataset,
            PlotOrientation.VERTICAL,
            true,
            true,
            false
        );

        customizeLineChart(chart);
        return chartToByteArray(chart);
    }

    private void customizeLineChart(JFreeChart chart) {
        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);
        chart.getTitle().setFont(new Font("Arial", Font.BOLD, 16));

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);
        plot.setDomainGridlinesVisible(true);
        plot.setRangeGridlinesVisible(true);
        plot.setDomainGridlinePaint(Color.LIGHT_GRAY);
        plot.setRangeGridlinePaint(Color.LIGHT_GRAY);

        LineAndShapeRenderer renderer = new LineAndShapeRenderer();
        renderer.setSeriesPaint(0, new Color(54, 162, 235));
        renderer.setSeriesPaint(1, new Color(255, 99, 132));
        renderer.setSeriesStroke(0, new BasicStroke(3.0f));
        renderer.setSeriesStroke(1, new BasicStroke(3.0f));
        renderer.setSeriesShapesVisible(0, true);
        renderer.setSeriesShapesVisible(1, true);
        plot.setRenderer(renderer);

        CategoryAxis domainAxis = plot.getDomainAxis();
        domainAxis.setTickLabelFont(new Font("Arial", Font.PLAIN, 10));
        domainAxis.setCategoryLabelPositions(
            org.jfree.chart.axis.CategoryLabelPositions.UP_45);

        NumberAxis rangeAxis = (NumberAxis) plot.getRangeAxis();
        rangeAxis.setTickLabelFont(new Font("Arial", Font.PLAIN, 10));
    }

    private void customizeBarChart(JFreeChart chart) {
        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);
        chart.getTitle().setFont(new Font("Arial", Font.BOLD, 16));

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);
        plot.setDomainGridlinesVisible(false);
        plot.setRangeGridlinesVisible(true);
        plot.setRangeGridlinePaint(Color.LIGHT_GRAY);

        // Set custom colors
        plot.getRenderer().setSeriesPaint(0, new Color(75, 192, 192));
        plot.getRenderer().setSeriesPaint(1, new Color(255, 159, 64));

        CategoryAxis domainAxis = plot.getDomainAxis();
        domainAxis.setTickLabelFont(new Font("Arial", Font.PLAIN, 10));
        domainAxis.setCategoryLabelPositions(
            org.jfree.chart.axis.CategoryLabelPositions.UP_45);

        NumberAxis rangeAxis = (NumberAxis) plot.getRangeAxis();
        rangeAxis.setTickLabelFont(new Font("Arial", Font.PLAIN, 10));
    }

    @SuppressWarnings("unchecked")
    private void customizePieChart(JFreeChart chart) {
        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);
        chart.getTitle().setFont(new Font("Arial", Font.BOLD, 16));

        PiePlot<String> plot = (PiePlot<String>) chart.getPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);
        plot.setLabelFont(new Font("Arial", Font.PLAIN, 10));
        plot.setNoDataMessage("No data available");
        plot.setCircular(false);
        plot.setLabelGap(0.02);

        // Set custom colors for pie chart sections
        Color[] colors = {
            new Color(255, 99, 132),
            new Color(54, 162, 235),
            new Color(255, 205, 86),
            new Color(75, 192, 192),
            new Color(153, 102, 255),
            new Color(255, 159, 64)
        };

        DefaultPieDataset<String> dataset = (DefaultPieDataset<String>) plot.getDataset();
        int colorIndex = 0;
        for (Object key : dataset.getKeys()) {
            plot.setSectionPaint((Comparable<String>) key, colors[colorIndex % colors.length]);
            colorIndex++;
        }
    }

    private byte[] chartToByteArray(JFreeChart chart) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ChartUtils.writeChartAsPNG(baos, chart, CHART_WIDTH, CHART_HEIGHT);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error generating chart image", e);
        }
    }

    private String getMonthShortName(int month) {
        String[] monthNames = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        return monthNames[month - 1];
    }

    // Utility method to create a simple chart with custom data
    public byte[] generateCustomChart(String title, String xAxisLabel, String yAxisLabel,
                                     String[] categories, double[] values, ChartType chartType) {
        switch (chartType) {
            case LINE:
                return generateCustomLineChart(title, xAxisLabel, yAxisLabel, categories, values);
            case BAR:
                return generateCustomBarChart(title, xAxisLabel, yAxisLabel, categories, values);
            case PIE:
                return generateCustomPieChart(title, categories, values);
            default:
                throw new IllegalArgumentException("Unsupported chart type: " + chartType);
        }
    }

    private byte[] generateCustomLineChart(String title, String xAxisLabel, String yAxisLabel,
                                          String[] categories, double[] values) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        for (int i = 0; i < categories.length && i < values.length; i++) {
            dataset.addValue(values[i], "Series", categories[i]);
        }

        JFreeChart chart = ChartFactory.createLineChart(
            title, xAxisLabel, yAxisLabel, dataset, PlotOrientation.VERTICAL, false, true, false);
        customizeLineChart(chart);
        return chartToByteArray(chart);
    }

    private byte[] generateCustomBarChart(String title, String xAxisLabel, String yAxisLabel,
                                         String[] categories, double[] values) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        for (int i = 0; i < categories.length && i < values.length; i++) {
            dataset.addValue(values[i], "Series", categories[i]);
        }

        JFreeChart chart = ChartFactory.createBarChart(
            title, xAxisLabel, yAxisLabel, dataset, PlotOrientation.VERTICAL, false, true, false);
        customizeBarChart(chart);
        return chartToByteArray(chart);
    }

    private byte[] generateCustomPieChart(String title, String[] categories, double[] values) {
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();
        for (int i = 0; i < categories.length && i < values.length; i++) {
            dataset.setValue(categories[i], values[i]);
        }

        JFreeChart chart = ChartFactory.createPieChart(title, dataset, true, true, false);
        customizePieChart(chart);
        return chartToByteArray(chart);
    }

    public enum ChartType {
        LINE, BAR, PIE
    }

    // ===== APPOINTMENT ANALYTICS CHART METHODS =====

    /**
     * Generate colorful donut chart for appointment types
     */
    @SuppressWarnings("unchecked")
    public byte[] generateAppointmentTypesDonutChart(List<AppointmentTypeChartDataDTO> data, String title) {
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();

        for (AppointmentTypeChartDataDTO item : data) {
            dataset.setValue(item.getAppointmentType(), item.getCount());
        }

        JFreeChart chart = ChartFactory.createPieChart(title, dataset, true, true, false);

        // Customize for donut effect and colors
        PiePlot<String> plot = (PiePlot<String>) chart.getPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        // Set custom colors
        String[] colors = {"#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#F44336", "#00BCD4"};
        for (int i = 0; i < data.size(); i++) {
            plot.setSectionPaint(data.get(i).getAppointmentType(), Color.decode(colors[i % colors.length]));
        }

        // Create donut effect
        plot.setCircular(true);
        plot.setStartAngle(90);
        plot.setDirection(Rotation.CLOCKWISE);
        plot.setLabelGenerator(new org.jfree.chart.labels.StandardPieSectionLabelGenerator("{0}: {1} ({2})"));

        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);
        chart.addSubtitle(new TextTitle("Distribution of appointment types with total counts and percentages"));

        return chartToByteArray(chart);
    }

    /**
     * Generate colorful pie chart for appointment types
     */
    @SuppressWarnings("unchecked")
    public byte[] generateAppointmentTypesPieChart(List<AppointmentTypeChartDataDTO> data, String title) {
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();

        for (AppointmentTypeChartDataDTO item : data) {
            dataset.setValue(item.getAppointmentType(), item.getCount());
        }

        JFreeChart chart = ChartFactory.createPieChart(title, dataset, true, true, false);

        PiePlot<String> plot = (PiePlot<String>) chart.getPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        // Vibrant colors for appointment types
        String[] colors = {"#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#FF9FF3"};
        for (int i = 0; i < data.size(); i++) {
            plot.setSectionPaint(data.get(i).getAppointmentType(), Color.decode(colors[i % colors.length]));
        }

        plot.setLabelGenerator(new org.jfree.chart.labels.StandardPieSectionLabelGenerator("{0}\n{1} ({2})"));
        plot.setExplodePercent(data.get(0).getAppointmentType(), 0.1); // Explode largest segment

        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);

        return chartToByteArray(chart);
    }

    /**
     * Generate appointment status pie chart with status-specific colors
     */
    @SuppressWarnings("unchecked")
    public byte[] generateAppointmentStatusPieChart(List<AppointmentStatusChartDataDTO> data, String title) {
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();

        for (AppointmentStatusChartDataDTO item : data) {
            dataset.setValue(item.getStatus(), item.getCount());
        }

        JFreeChart chart = ChartFactory.createPieChart(title, dataset, true, true, false);

        PiePlot<String> plot = (PiePlot<String>) chart.getPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        // Status-specific colors: COMPLETED=Green, CANCELLED=Red, SCHEDULED=Blue
        for (AppointmentStatusChartDataDTO item : data) {
            Color color;
            switch (item.getStatus()) {
                case "COMPLETED":
                    color = new Color(76, 175, 80); // Green
                    break;
                case "CANCELLED":
                    color = new Color(244, 67, 54); // Red
                    break;
                case "SCHEDULED":
                    color = new Color(33, 150, 243); // Blue
                    break;
                default:
                    color = new Color(158, 158, 158); // Gray
            }
            plot.setSectionPaint(item.getStatus(), color);
        }

        plot.setLabelGenerator(new org.jfree.chart.labels.StandardPieSectionLabelGenerator("{0}\n{1} appointments\n({2})"));

        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);
        chart.addSubtitle(new TextTitle("Status breakdown showing completion and cancellation rates"));

        return chartToByteArray(chart);
    }

    /**
     * Generate monthly trends line chart with gradient
     */
    public byte[] generateMonthlyTrendsLineChart(List<MonthlyAppointmentTrendDTO> data, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (MonthlyAppointmentTrendDTO item : data) {
            dataset.addValue(item.getTotalAppointments(), "Total", item.getMonthName());
            dataset.addValue(item.getCompletedAppointments(), "Completed", item.getMonthName());
        }

        JFreeChart chart = ChartFactory.createLineChart(
            title, "Month", "Number of Appointments", dataset,
            PlotOrientation.VERTICAL, true, true, false);

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        LineAndShapeRenderer renderer = new LineAndShapeRenderer();
        renderer.setSeriesPaint(0, new Color(33, 150, 243)); // Blue for total
        renderer.setSeriesPaint(1, new Color(76, 175, 80));  // Green for completed
        renderer.setSeriesStroke(0, new BasicStroke(3.0f));
        renderer.setSeriesStroke(1, new BasicStroke(3.0f));
        renderer.setSeriesShapesVisible(0, true);
        renderer.setSeriesShapesVisible(1, true);

        plot.setRenderer(renderer);
        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);

        return chartToByteArray(chart);
    }

    /**
     * Generate monthly trends area chart
     */
    public byte[] generateMonthlyTrendsAreaChart(List<MonthlyAppointmentTrendDTO> data, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (MonthlyAppointmentTrendDTO item : data) {
            dataset.addValue(item.getCompletedAppointments(), "Completed", item.getMonthName());
            dataset.addValue(item.getCancelledAppointments(), "Cancelled", item.getMonthName());
            dataset.addValue(item.getScheduledAppointments(), "Scheduled", item.getMonthName());
        }

        JFreeChart chart = ChartFactory.createStackedAreaChart(
            title, "Month", "Number of Appointments", dataset,
            PlotOrientation.VERTICAL, true, true, false);

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        // Beautiful gradient colors
        plot.getRenderer().setSeriesPaint(0, new Color(76, 175, 80, 180));   // Green with transparency
        plot.getRenderer().setSeriesPaint(1, new Color(244, 67, 54, 180));   // Red with transparency
        plot.getRenderer().setSeriesPaint(2, new Color(33, 150, 243, 180));  // Blue with transparency

        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);

        return chartToByteArray(chart);
    }

    /**
     * Generate monthly trends bar chart
     */
    public byte[] generateMonthlyTrendsBarChart(List<MonthlyAppointmentTrendDTO> data, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (MonthlyAppointmentTrendDTO item : data) {
            dataset.addValue(item.getTotalAppointments(), "Total Appointments", item.getMonthName());
        }

        JFreeChart chart = ChartFactory.createBarChart(
            title, "Month", "Number of Appointments", dataset,
            PlotOrientation.VERTICAL, true, true, false);

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        // Gradient color for bars
        GradientPaint gradient = new GradientPaint(0, 0, new Color(33, 150, 243), 0, 300, new Color(3, 169, 244));
        plot.getRenderer().setSeriesPaint(0, gradient);

        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);

        return chartToByteArray(chart);
    }

    /**
     * Generate daily patterns bar chart
     */
    public byte[] generateDailyPatternsBarChart(List<DailyAppointmentPatternDTO> data, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (DailyAppointmentPatternDTO item : data) {
            dataset.addValue(item.getAppointmentCount(), "Appointments", item.getDayOfWeek());
        }

        JFreeChart chart = ChartFactory.createBarChart(
            title, "Day of Week", "Number of Appointments", dataset,
            PlotOrientation.VERTICAL, false, true, false);

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        // Rainbow colors for each day
        String[] dayColors = {"#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#FF9FF3", "#6C5CE7"};
        for (int i = 0; i < data.size(); i++) {
            plot.getRenderer().setSeriesPaint(i, Color.decode(dayColors[i % dayColors.length]));
        }

        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);
        chart.addSubtitle(new TextTitle("Weekly appointment distribution pattern"));

        return chartToByteArray(chart);
    }

    /**
     * Generate radar chart for daily patterns (placeholder - would need additional library)
     */
    public byte[] generateDailyPatternsRadarChart(List<DailyAppointmentPatternDTO> data, String title) {
        // For now, return a circular bar chart as radar alternative
        return generateDailyPatternsBarChart(data, title + " (Radar View)");
    }

    /**
     * Generate doctor performance horizontal bar chart
     */
    public byte[] generateDoctorPerformanceHorizontalBarChart(List<DoctorAppointmentStatsDTO> data, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (DoctorAppointmentStatsDTO doctor : data) {
            dataset.addValue(doctor.getTotalAppointments(), "Total", doctor.getDoctorName());
            dataset.addValue(doctor.getCompletedAppointments(), "Completed", doctor.getDoctorName());
        }

        JFreeChart chart = ChartFactory.createBarChart(
            title, "Number of Appointments", "Doctor", dataset,
            PlotOrientation.HORIZONTAL, true, true, false);

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        // Professional colors
        plot.getRenderer().setSeriesPaint(0, new Color(63, 81, 181));  // Indigo
        plot.getRenderer().setSeriesPaint(1, new Color(76, 175, 80));  // Green

        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);

        return chartToByteArray(chart);
    }

    /**
     * Generate doctor performance stacked chart
     */
    public byte[] generateDoctorPerformanceStackedChart(List<DoctorAppointmentStatsDTO> data, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (DoctorAppointmentStatsDTO doctor : data) {
            dataset.addValue(doctor.getCompletedAppointments(), "Completed", doctor.getDoctorName());
            dataset.addValue(doctor.getCancelledAppointments(), "Cancelled", doctor.getDoctorName());
            long scheduled = doctor.getTotalAppointments() - doctor.getCompletedAppointments() - doctor.getCancelledAppointments();
            dataset.addValue(scheduled, "Scheduled", doctor.getDoctorName());
        }

        JFreeChart chart = ChartFactory.createStackedBarChart(
            title, "Doctor", "Number of Appointments", dataset,
            PlotOrientation.VERTICAL, true, true, false);

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        // Status colors
        plot.getRenderer().setSeriesPaint(0, new Color(76, 175, 80));   // Green - Completed
        plot.getRenderer().setSeriesPaint(1, new Color(244, 67, 54));   // Red - Cancelled
        plot.getRenderer().setSeriesPaint(2, new Color(33, 150, 243));  // Blue - Scheduled

        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);

        return chartToByteArray(chart);
    }

    /**
     * Generate time slot heat map (simplified as bar chart)
     */
    public byte[] generateTimeSlotHeatMap(List<TimeSlotAnalysisDTO> data, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (TimeSlotAnalysisDTO slot : data) {
            dataset.addValue(slot.getAppointmentCount(), "Appointments", slot.getTimeSlot());
        }

        JFreeChart chart = ChartFactory.createBarChart(
            title, "Time Slot", "Number of Appointments", dataset,
            PlotOrientation.VERTICAL, false, true, false);

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        // Heat map colors based on utilization
        for (int i = 0; i < data.size(); i++) {
            TimeSlotAnalysisDTO slot = data.get(i);
            Color heatColor;
            if (slot.getUtilizationRate() >= 80) {
                heatColor = new Color(211, 47, 47); // Dark red
            } else if (slot.getUtilizationRate() >= 60) {
                heatColor = new Color(245, 124, 0); // Orange
            } else if (slot.getUtilizationRate() >= 40) {
                heatColor = new Color(251, 192, 45); // Yellow
            } else {
                heatColor = new Color(56, 142, 60); // Green
            }
            plot.getRenderer().setSeriesPaint(i, heatColor);
        }

        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);
        chart.addSubtitle(new TextTitle("Heat map showing appointment density by time slots"));

        return chartToByteArray(chart);
    }

    /**
     * Generate weekly patterns area chart
     */
    public byte[] generateWeeklyPatternsAreaChart(List<WeeklyPatternDTO> data, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (WeeklyPatternDTO week : data) {
            dataset.addValue(week.getTotalAppointments(), "Total", "Week " + week.getWeekNumber());
            dataset.addValue(week.getCompletedAppointments(), "Completed", "Week " + week.getWeekNumber());
        }

        JFreeChart chart = ChartFactory.createAreaChart(
            title, "Week", "Number of Appointments", dataset,
            PlotOrientation.VERTICAL, true, true, false);

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        // Gradient fill for area
        plot.getRenderer().setSeriesPaint(0, new Color(33, 150, 243, 100));  // Light blue
        plot.getRenderer().setSeriesPaint(1, new Color(76, 175, 80, 150));   // Light green

        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);

        return chartToByteArray(chart);
    }

    /**
     * Generate weekly patterns line chart
     */
    public byte[] generateWeeklyPatternsLineChart(List<WeeklyPatternDTO> data, String title) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (WeeklyPatternDTO week : data) {
            dataset.addValue(week.getTotalAppointments(), "Appointments", "Week " + week.getWeekNumber());
        }

        JFreeChart chart = ChartFactory.createLineChart(
            title, "Week", "Number of Appointments", dataset,
            PlotOrientation.VERTICAL, false, true, false);

        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);

        LineAndShapeRenderer renderer = new LineAndShapeRenderer();
        renderer.setSeriesPaint(0, new Color(156, 39, 176)); // Purple
        renderer.setSeriesStroke(0, new BasicStroke(3.0f));
        renderer.setSeriesShapesVisible(0, true);

        plot.setRenderer(renderer);
        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);

        return chartToByteArray(chart);
    }

    /**
     * Generate dialysis monthly line chart for sessions or patients
     */
    public byte[] generateDialysisMonthlyLineChart(List<MonthlyDialysisDataDTO> monthlyData, String title, String yAxisLabel) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (MonthlyDialysisDataDTO data : monthlyData) {
            if ("Sessions".equals(data.getDataType())) {
                dataset.addValue(data.getSessionCount(), "Sessions", getMonthShortName(data.getMonth()));
            } else if ("Patients".equals(data.getDataType())) {
                dataset.addValue(data.getPatientCount(), "Patients", getMonthShortName(data.getMonth()));
            }
        }

        JFreeChart chart = ChartFactory.createLineChart(
            title,
            "Month",
            yAxisLabel,
            dataset,
            PlotOrientation.VERTICAL,
            true,
            true,
            false
        );

        // Customize the chart
        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);
        chart.getTitle().setFont(new Font("Arial", Font.BOLD, 16));

        CategoryPlot plot = (CategoryPlot) chart.getPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);
        plot.setDomainGridlinesVisible(true);
        plot.setRangeGridlinesVisible(true);
        plot.setDomainGridlinePaint(Color.LIGHT_GRAY);
        plot.setRangeGridlinePaint(Color.LIGHT_GRAY);

        LineAndShapeRenderer renderer = new LineAndShapeRenderer();
        renderer.setSeriesPaint(0, new Color(41, 84, 144)); // Hospital blue
        renderer.setSeriesStroke(0, new BasicStroke(3.0f));
        renderer.setSeriesShapesVisible(0, true);

        plot.setRenderer(renderer);

        return chartToByteArray(chart);
    }

    /**
     * Generate machine utilization line chart
     */
    public byte[] generateMachineUtilizationLineChart(List<MonthlyMachineUtilizationDTO> utilizationData) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        for (MonthlyMachineUtilizationDTO data : utilizationData) {
            dataset.addValue(data.getUtilizationPercentage(), "Utilization %", getMonthShortName(data.getMonth()));
        }

        JFreeChart chart = ChartFactory.createLineChart(
            "Monthly Machine Utilization",
            "Month",
            "Utilization Percentage (%)",
            dataset,
            PlotOrientation.VERTICAL,
            true,
            true,
            false
        );

        // Customize the chart
        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);
        chart.getTitle().setFont(new Font("Arial", Font.BOLD, 16));

        CategoryPlot plot = (CategoryPlot) chart.getPlot();
        plot.setBackgroundPaint(PLOT_BACKGROUND_COLOR);
        plot.setDomainGridlinesVisible(true);
        plot.setRangeGridlinesVisible(true);
        plot.setDomainGridlinePaint(Color.LIGHT_GRAY);
        plot.setRangeGridlinePaint(Color.LIGHT_GRAY);

        // Set Y-axis range for percentage (0-100)
        NumberAxis rangeAxis = (NumberAxis) plot.getRangeAxis();
        rangeAxis.setRange(0, 100);

        LineAndShapeRenderer renderer = new LineAndShapeRenderer();
        renderer.setSeriesPaint(0, new Color(70, 130, 180)); // Steel blue
        renderer.setSeriesStroke(0, new BasicStroke(3.0f));
        renderer.setSeriesShapesVisible(0, true);

        plot.setRenderer(renderer);

        return chartToByteArray(chart);
    }
}