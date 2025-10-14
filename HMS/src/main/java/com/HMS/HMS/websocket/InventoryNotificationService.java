package com.HMS.HMS.websocket;

import com.HMS.HMS.model.Medication.Medication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class InventoryNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public InventoryNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Notify about stock update
     */
    public void notifyStockUpdated(Medication medication, Integer previousStock, Integer newStock) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "STOCK_UPDATED");
        notification.put("action", "UPDATE_STOCK");
        notification.put("medicationId", medication.getId());
        notification.put("drugId", "INV" + String.format("%06d", medication.getId()));
        notification.put("drugName", medication.getDrugName());
        notification.put("batchNumber", medication.getBatchNumber());
        notification.put("previousStock", previousStock);
        notification.put("currentStock", newStock);
        notification.put("stockChange", newStock - previousStock);
        notification.put("minimumStock", medication.getMinimumStock());
        notification.put("maximumStock", medication.getMaximumStock());
        notification.put("isLowStock", newStock <= medication.getMinimumStock());
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("lastUpdated", medication.getUpdatedAt());
        
        String message = String.format("Stock updated for %s: %d → %d (%+d)", 
            medication.getDrugName(), previousStock, newStock, newStock - previousStock);
        notification.put("message", message);

        // Send to all clients subscribed to /topic/inventory
        messagingTemplate.convertAndSend("/topic/inventory", notification);

        System.out.println("WebSocket notification sent for stock update: " + message);
    }

    /**
     * Notify about new medication added to inventory
     */
    public void notifyMedicationAdded(Medication medication) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "MEDICATION_ADDED");
        notification.put("action", "NEW_MEDICATION");
        notification.put("medicationId", medication.getId());
        notification.put("drugId", "INV" + String.format("%06d", medication.getId()));
        notification.put("drugName", medication.getDrugName());
        notification.put("batchNumber", medication.getBatchNumber());
        notification.put("currentStock", medication.getCurrentStock());
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "New medication added: " + medication.getDrugName());

        messagingTemplate.convertAndSend("/topic/inventory", notification);
        
        System.out.println("WebSocket notification sent for new medication: " + medication.getDrugName());
    }

    /**
     * Notify about low stock alert
     */
    public void notifyLowStock(Medication medication) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "LOW_STOCK_ALERT");
        notification.put("action", "LOW_STOCK");
        notification.put("medicationId", medication.getId());
        notification.put("drugId", "INV" + String.format("%06d", medication.getId()));
        notification.put("drugName", medication.getDrugName());
        notification.put("currentStock", medication.getCurrentStock());
        notification.put("minimumStock", medication.getMinimumStock());
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", String.format("Low stock alert: %s (Current: %d, Minimum: %d)", 
            medication.getDrugName(), medication.getCurrentStock(), medication.getMinimumStock()));

        messagingTemplate.convertAndSend("/topic/inventory/alerts", notification);
        
        System.out.println("WebSocket low stock alert sent: " + medication.getDrugName());
    }
}