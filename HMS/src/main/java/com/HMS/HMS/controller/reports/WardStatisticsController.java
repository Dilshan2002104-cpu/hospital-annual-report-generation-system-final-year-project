package com.HMS.HMS.controller.reports;

import com.HMS.HMS.DTO.reports.WardStatisticsReportDTO;
import com.HMS.HMS.service.reports.WardStatisticsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports/ward-statistics")
@CrossOrigin(origins = "*")
public class WardStatisticsController {

    private final WardStatisticsService wardStatisticsService;

    public WardStatisticsController(WardStatisticsService wardStatisticsService) {
        this.wardStatisticsService = wardStatisticsService;
    }

    /**
     * Get comprehensive ward statistics for a specific year
     */
    @GetMapping("/ward/{wardName}/year/{year}")
    public ResponseEntity<WardStatisticsReportDTO> getWardStatistics(
            @PathVariable String wardName,
            @PathVariable int year) {
        try {
            WardStatisticsReportDTO statistics = wardStatisticsService.generateWardStatistics(wardName, year);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get current year ward statistics
     */
    @GetMapping("/ward/{wardName}/current")
    public ResponseEntity<WardStatisticsReportDTO> getCurrentWardStatistics(@PathVariable String wardName) {
        try {
            int currentYear = Year.now().getValue();
            WardStatisticsReportDTO statistics = wardStatisticsService.generateWardStatistics(wardName, currentYear);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get monthly breakdown for specific ward and year
     */
    @GetMapping("/ward/{wardName}/monthly/{year}")
    public ResponseEntity<Map<String, Object>> getMonthlyBreakdown(
            @PathVariable String wardName,
            @PathVariable int year) {
        try {
            Map<String, Object> monthlyData = wardStatisticsService.getMonthlyBreakdown(wardName, year);
            return ResponseEntity.ok(monthlyData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get ward performance KPIs
     */
    @GetMapping("/ward/{wardName}/kpis/{year}")
    public ResponseEntity<Map<String, Object>> getWardKPIs(
            @PathVariable String wardName,
            @PathVariable int year) {
        try {
            Map<String, Object> kpis = wardStatisticsService.getWardKPIs(wardName, year);
            return ResponseEntity.ok(kpis);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get comparative analysis with previous year
     */
    @GetMapping("/ward/{wardName}/comparison/{year}")
    public ResponseEntity<Map<String, Object>> getYearComparison(
            @PathVariable String wardName,
            @PathVariable int year) {
        try {
            Map<String, Object> comparison = wardStatisticsService.getYearOverYearComparison(wardName, year);
            return ResponseEntity.ok(comparison);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Export ward statistics as PDF
     */
    @GetMapping("/ward/{wardName}/export-pdf/{year}")
    public ResponseEntity<byte[]> exportWardStatisticsPDF(
            @PathVariable String wardName,
            @PathVariable int year) {
        try {
            byte[] pdfBytes = wardStatisticsService.exportWardStatisticsAsPDF(wardName, year);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment",
                String.format("Ward_%s_Statistics_%d.pdf", wardName.replaceAll("\\s+", "_"), year));

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get all wards summary for comparison
     */
    @GetMapping("/all-wards/summary/{year}")
    public ResponseEntity<Map<String, Object>> getAllWardsSummary(@PathVariable int year) {
        try {
            Map<String, Object> summary = wardStatisticsService.getAllWardsSummary(year);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get trending analysis for ward
     */
    @GetMapping("/ward/{wardName}/trends/{year}")
    public ResponseEntity<Map<String, String>> getTrendAnalysis(
            @PathVariable String wardName,
            @PathVariable int year) {
        try {
            Map<String, String> trends = wardStatisticsService.generateTrendAnalysis(wardName, year);
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get quick stats for dashboard display
     */
    @GetMapping("/ward/{wardName}/quick-stats")
    public ResponseEntity<Map<String, Object>> getQuickStats(@PathVariable String wardName) {
        try {
            int currentYear = Year.now().getValue();
            Map<String, Object> quickStats = new HashMap<>();

            WardStatisticsReportDTO currentStats = wardStatisticsService.generateWardStatistics(wardName, currentYear);

            quickStats.put("totalAdmissions", currentStats.getTotalAdmissions());
            quickStats.put("currentOccupancy", currentStats.getCurrentOccupancyRate());
            quickStats.put("averageLengthOfStay", currentStats.getAverageLengthOfStay());
            quickStats.put("monthlyAverage", currentStats.getMonthlyAverageAdmissions());

            return ResponseEntity.ok(quickStats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}