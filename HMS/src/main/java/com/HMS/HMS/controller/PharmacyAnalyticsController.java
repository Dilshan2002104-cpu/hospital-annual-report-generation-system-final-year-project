package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.PharmacyAnalyticsDTO.PharmacyAnalyticsDTO;
import com.HMS.HMS.service.PharmacyAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacy/analytics")
@CrossOrigin(origins = "*")
public class PharmacyAnalyticsController {

    private final PharmacyAnalyticsService analyticsService;

    @Autowired
    public PharmacyAnalyticsController(PharmacyAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * Get comprehensive pharmacy analytics
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getPharmacyAnalytics(
            @RequestParam(defaultValue = "7d") String period) {
        try {
            PharmacyAnalyticsDTO analytics = analyticsService.getPharmacyAnalytics(period);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Pharmacy analytics retrieved successfully");
            response.put("data", analytics);
            response.put("period", period);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve pharmacy analytics: " + e.getMessage());
            errorResponse.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get prescription analytics only
     */
    @GetMapping("/prescriptions")
    public ResponseEntity<Map<String, Object>> getPrescriptionAnalytics(
            @RequestParam(defaultValue = "7d") String period) {
        try {
            PharmacyAnalyticsDTO analytics = analyticsService.getPharmacyAnalytics(period);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Prescription analytics retrieved successfully");
            response.put("data", analytics.getPrescriptionAnalytics());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve prescription analytics: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get inventory analytics only
     */
    @GetMapping("/inventory")
    public ResponseEntity<Map<String, Object>> getInventoryAnalytics() {
        try {
            PharmacyAnalyticsDTO analytics = analyticsService.getPharmacyAnalytics("7d");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Inventory analytics retrieved successfully");
            response.put("data", analytics.getInventoryAnalytics());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve inventory analytics: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get performance metrics only
     */
    @GetMapping("/performance")
    public ResponseEntity<Map<String, Object>> getPerformanceMetrics(
            @RequestParam(defaultValue = "7d") String period) {
        try {
            PharmacyAnalyticsDTO analytics = analyticsService.getPharmacyAnalytics(period);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Performance metrics retrieved successfully");
            response.put("data", analytics.getPerformanceMetrics());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve performance metrics: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get revenue analytics only
     */
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics(
            @RequestParam(defaultValue = "7d") String period) {
        try {
            PharmacyAnalyticsDTO analytics = analyticsService.getPharmacyAnalytics(period);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Revenue analytics retrieved successfully");
            response.put("data", analytics.getRevenueAnalytics());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve revenue analytics: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get alerts only
     */
    @GetMapping("/alerts")
    public ResponseEntity<Map<String, Object>> getAlerts() {
        try {
            PharmacyAnalyticsDTO analytics = analyticsService.getPharmacyAnalytics("7d");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Alerts retrieved successfully");
            response.put("data", analytics.getAlerts());
            response.put("count", analytics.getAlerts().size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to retrieve alerts: " + e.getMessage());
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}