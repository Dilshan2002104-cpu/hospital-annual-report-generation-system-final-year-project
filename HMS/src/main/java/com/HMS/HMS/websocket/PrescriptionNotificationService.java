package com.HMS.HMS.websocket;

import com.HMS.HMS.DTO.PrescriptionDTO.PrescriptionResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PrescriptionNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public PrescriptionNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Notify pharmacy about new prescription creation
     */
    public void notifyPrescriptionCreated(PrescriptionResponseDTO prescription) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "PRESCRIPTION_CREATED");
        notification.put("action", "NEW_PRESCRIPTION");
        notification.put("prescription", prescription);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "New prescription created for " + prescription.getPatientName());

        // Send to all pharmacy clients subscribed to /topic/prescriptions
        messagingTemplate.convertAndSend("/topic/prescriptions", notification);

        System.out.println("WebSocket notification sent for new prescription: " + prescription.getPrescriptionId());
    }

    /**
     * Notify about prescription status update
     */
    public void notifyPrescriptionUpdated(PrescriptionResponseDTO prescription) {

        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "PRESCRIPTION_UPDATED");
        notification.put("action", "UPDATE_PRESCRIPTION");
        notification.put("prescription", prescription);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "Prescription " + prescription.getPrescriptionId() + " updated");

        messagingTemplate.convertAndSend("/topic/prescriptions", notification);

        System.out.println("WebSocket notification sent for prescription update: " + prescription.getPrescriptionId());
    }

    /**
     * Notify about prescription cancellation
     */
    public void notifyPrescriptionCancelled(String prescriptionId, String patientName) {
        
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "PRESCRIPTION_CANCELLED");
        notification.put("action", "CANCEL_PRESCRIPTION");
        notification.put("prescriptionId", prescriptionId);
        notification.put("patientName", patientName);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "Prescription " + prescriptionId + " cancelled");

        messagingTemplate.convertAndSend("/topic/prescriptions", notification);

        System.out.println("WebSocket notification sent for prescription cancellation: " + prescriptionId);
    }

    /**
     * Notify about urgent prescription
     */
    public void notifyUrgentPrescription(PrescriptionResponseDTO prescription) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "PRESCRIPTION_URGENT");
        notification.put("action", "URGENT_PRESCRIPTION");
        notification.put("prescription", prescription);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "URGENT: New prescription for " + prescription.getPatientName());
        notification.put("priority", "HIGH");

        // Send to urgent prescription topic
        messagingTemplate.convertAndSend("/topic/prescriptions/urgent", notification);
        // Also send to general prescription topic
        messagingTemplate.convertAndSend("/topic/prescriptions", notification);

        System.out.println("WebSocket URGENT notification sent for prescription: " + prescription.getPrescriptionId());
    }

    /**
     * Notify about prescription dispensing (Pharmacy to Ward)
     */
    public void notifyPrescriptionDispensed(PrescriptionResponseDTO prescription) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "PRESCRIPTION_DISPENSED");
        notification.put("action", "MEDICATION_DISPENSED");
        notification.put("prescription", prescription);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "Prescription " + prescription.getPrescriptionId() + " has been dispensed for " + prescription.getPatientName());
        notification.put("status", "COMPLETED");

        // Send to general prescriptions topic (Ward will listen to this)
        messagingTemplate.convertAndSend("/topic/prescriptions", notification);

        System.out.println("WebSocket notification sent for prescription dispensing: " + prescription.getPrescriptionId());
    }

    /**
     * Notify about inventory update (when medications are dispensed)
     */
    public void notifyInventoryUpdated(String drugName, int quantityDispensed, int remainingStock) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "INVENTORY_UPDATED");
        notification.put("action", "STOCK_DECREASED");
        notification.put("drugName", drugName);
        notification.put("quantityDispensed", quantityDispensed);
        notification.put("remainingStock", remainingStock);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", drugName + " stock updated. Dispensed: " + quantityDispensed + ", Remaining: " + remainingStock);

        // Send to inventory topic for real-time inventory updates
        messagingTemplate.convertAndSend("/topic/inventory", notification);

        System.out.println("WebSocket notification sent for inventory update: " + drugName);
    }

    /**
     * Notify pharmacy about new clinic prescription creation
     */
    public void notifyClinicPrescriptionCreated(com.HMS.HMS.model.Prescription.ClinicPrescription clinicPrescription) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "CLINIC_PRESCRIPTION_CREATED");
        notification.put("action", "NEW_CLINIC_PRESCRIPTION");
        notification.put("prescriptionId", clinicPrescription.getPrescriptionId());
        notification.put("patientName", clinicPrescription.getPatient().getFirstName() + " " + clinicPrescription.getPatient().getLastName());
        notification.put("patientNationalId", clinicPrescription.getPatient().getNationalId());
        notification.put("prescribedBy", clinicPrescription.getPrescribedBy());
        notification.put("clinicName", clinicPrescription.getClinicName());
        notification.put("totalMedications", clinicPrescription.getTotalMedications());
        notification.put("status", clinicPrescription.getStatus());
        notification.put("prescribedDate", clinicPrescription.getPrescribedDate());
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "New clinic prescription created for " + 
            clinicPrescription.getPatient().getFirstName() + " " + clinicPrescription.getPatient().getLastName());

        // Send to all pharmacy clients subscribed to /topic/prescriptions
        messagingTemplate.convertAndSend("/topic/prescriptions", notification);

        System.out.println("🔔 WebSocket notification sent for new clinic prescription: " + clinicPrescription.getPrescriptionId());
    }

    /**
     * Notify about clinic prescription status update
     */
    public void notifyClinicPrescriptionStatusChanged(com.HMS.HMS.model.Prescription.ClinicPrescription clinicPrescription) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "CLINIC_PRESCRIPTION_STATUS_CHANGED");
        notification.put("action", "UPDATE_CLINIC_PRESCRIPTION");
        notification.put("prescriptionId", clinicPrescription.getPrescriptionId());
        notification.put("patientName", clinicPrescription.getPatient().getFirstName() + " " + clinicPrescription.getPatient().getLastName());
        notification.put("patientNationalId", clinicPrescription.getPatient().getNationalId());
        notification.put("status", clinicPrescription.getStatus());
        notification.put("clinicName", clinicPrescription.getClinicName());
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "Clinic prescription " + clinicPrescription.getPrescriptionId() + " status changed to " + clinicPrescription.getStatus());

        // Send to all pharmacy clients subscribed to /topic/prescriptions
        messagingTemplate.convertAndSend("/topic/prescriptions", notification);

        System.out.println("🔔 WebSocket notification sent for clinic prescription status change: " + 
            clinicPrescription.getPrescriptionId() + " -> " + clinicPrescription.getStatus());
    }
}