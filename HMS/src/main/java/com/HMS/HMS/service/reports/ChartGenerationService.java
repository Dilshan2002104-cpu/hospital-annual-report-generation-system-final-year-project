package com.HMS.HMS.service.reports;

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
        DefaultPieDataset dataset = new DefaultPieDataset();

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

    private void customizePieChart(JFreeChart chart) {
        chart.setBackgroundPaint(CHART_BACKGROUND_COLOR);
        chart.getTitle().setFont(new Font("Arial", Font.BOLD, 16));

        PiePlot plot = (PiePlot) chart.getPlot();
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

        DefaultPieDataset dataset = (DefaultPieDataset) plot.getDataset();
        int colorIndex = 0;
        for (Object key : dataset.getKeys()) {
            plot.setSectionPaint((Comparable) key, colors[colorIndex % colors.length]);
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
        DefaultPieDataset dataset = new DefaultPieDataset();
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
}