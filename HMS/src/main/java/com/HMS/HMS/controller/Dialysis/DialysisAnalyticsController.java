package com.HMS.HMS.controller.Dialysis;

import com.HMS.HMS.service.Dialysis.DialysisAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/dialysis/analytics")
@CrossOrigin(origins = "*")
public class DialysisAnalyticsController {

    private final DialysisAnalyticsService analyticsService;

    @Autowired
    public DialysisAnalyticsController(DialysisAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * Get comprehensive machine performance analytics
     */
    @GetMapping("/machine-performance")
    public ResponseEntity<Map<String, Object>> getMachinePerformance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        if (startDate == null) startDate = LocalDate.now().minusDays(30);
        if (endDate == null) endDate = LocalDate.now();
        
        Map<String, Object> performance = analyticsService.getMachinePerformanceAnalytics(startDate, endDate);
        return ResponseEntity.ok(performance);
    }

    /**
     * Get session volume and trends analytics
     */
    @GetMapping("/session-trends")
    public ResponseEntity<Map<String, Object>> getSessionTrends(
            @RequestParam(defaultValue = "30") int days) {
        
        Map<String, Object> trends = analyticsService.getSessionTrends(days);
        return ResponseEntity.ok(trends);
    }

    /**
     * Get patient care metrics and clinical analytics
     */
    @GetMapping("/patient-metrics")
    public ResponseEntity<Map<String, Object>> getPatientMetrics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        if (startDate == null) startDate = LocalDate.now().minusDays(30);
        if (endDate == null) endDate = LocalDate.now();
        
        Map<String, Object> metrics = analyticsService.getPatientCareMetrics(startDate, endDate);
        return ResponseEntity.ok(metrics);
    }

    /**
     * Get operational efficiency metrics
     */
    @GetMapping("/operational-metrics")
    public ResponseEntity<Map<String, Object>> getOperationalMetrics() {
        Map<String, Object> metrics = analyticsService.getOperationalMetrics();
        return ResponseEntity.ok(metrics);
    }

    /**
     * Get real-time dashboard KPIs
     */
    @GetMapping("/kpi-dashboard")
    public ResponseEntity<Map<String, Object>> getKPIDashboard() {
        Map<String, Object> kpis = analyticsService.getRealtimeKPIs();
        return ResponseEntity.ok(kpis);
    }

    /**
     * Get machine utilization heatmap data
     */
    @GetMapping("/utilization-heatmap")
    public ResponseEntity<Map<String, Object>> getUtilizationHeatmap(
            @RequestParam(defaultValue = "7") int days) {
        
        Map<String, Object> heatmap = analyticsService.getUtilizationHeatmap(days);
        return ResponseEntity.ok(heatmap);
    }

    /**
     * Get monthly performance comparison
     */
    @GetMapping("/monthly-comparison")
    public ResponseEntity<Map<String, Object>> getMonthlyComparison(
            @RequestParam(defaultValue = "12") int months) {
        
        Map<String, Object> comparison = analyticsService.getMonthlyComparison(months);
        return ResponseEntity.ok(comparison);
    }

    /**
     * Get treatment effectiveness analytics
     */
    @GetMapping("/treatment-effectiveness")
    public ResponseEntity<Map<String, Object>> getTreatmentEffectiveness() {
        Map<String, Object> effectiveness = analyticsService.getTreatmentEffectiveness();
        return ResponseEntity.ok(effectiveness);
    }

    /**
     * Get machine-wise performance trends over time
     */
    @GetMapping("/machine-wise-trends")
    public ResponseEntity<Map<String, Object>> getMachineWiseTrends(
            @RequestParam(defaultValue = "7") int days) {
        
        Map<String, Object> trends = analyticsService.getMachineWiseTrends(days);
        return ResponseEntity.ok(trends);
    }
}