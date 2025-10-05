package com.HMS.HMS.websocket;

import com.HMS.HMS.DTO.AdmissionDTO.AdmissionResponseDTO;
import com.HMS.HMS.DTO.transferDTO.TransferResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdmissionNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public AdmissionNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Notify about new patient admission
     */
    public void notifyPatientAdmitted(AdmissionResponseDTO admission) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "PATIENT_ADMITTED");
        notification.put("action", "NEW_ADMISSION");
        notification.put("admission", admission);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "New patient admitted to " + admission.getWardName());

        // Send to general admissions topic
        messagingTemplate.convertAndSend("/topic/admissions", notification);
        
        // Send to specific ward topic
        messagingTemplate.convertAndSend("/topic/admissions/ward/" + admission.getWardId(), notification);

        System.out.println("WebSocket notification sent for new admission: " + admission.getAdmissionId());
    }

    /**
     * Notify about patient transfer to dialysis ward
     */
    public void notifyPatientTransferredToDialysis(TransferResponseDTO transfer, AdmissionResponseDTO newAdmission) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "PATIENT_TRANSFERRED_TO_DIALYSIS");
        notification.put("action", "DIALYSIS_TRANSFER");
        notification.put("transfer", transfer);
        notification.put("newAdmission", newAdmission);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "Patient " + transfer.getPatientName() + " transferred to Dialysis ward");

        // Send to dialysis-specific topic
        messagingTemplate.convertAndSend("/topic/dialysis/transfers", notification);
        
        // Send to general dialysis topic
        messagingTemplate.convertAndSend("/topic/dialysis", notification);
        
        // Send to admissions topic for the dialysis ward (Ward 4)
        messagingTemplate.convertAndSend("/topic/admissions/ward/4", notification);

        System.out.println("WebSocket notification sent for dialysis transfer: " + transfer.getPatientName());
    }

    /**
     * Notify about patient transfer (general)
     */
    public void notifyPatientTransferred(TransferResponseDTO transfer, AdmissionResponseDTO newAdmission) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "PATIENT_TRANSFERRED");
        notification.put("action", "PATIENT_TRANSFER");
        notification.put("transfer", transfer);
        notification.put("newAdmission", newAdmission);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "Patient " + transfer.getPatientName() + " transferred from " + 
                       transfer.getFromWardName() + " to " + transfer.getToWardName());

        // Send to general transfers topic
        messagingTemplate.convertAndSend("/topic/transfers", notification);
        
        // Send to specific ward topics
        messagingTemplate.convertAndSend("/topic/admissions/ward/" + transfer.getFromWardId(), notification);
        messagingTemplate.convertAndSend("/topic/admissions/ward/" + transfer.getToWardId(), notification);

        // Special handling for dialysis ward transfers
        if (transfer.getToWardId() == 4L) { // Ward 4 is Dialysis ward
            notifyPatientTransferredToDialysis(transfer, newAdmission);
        }

        System.out.println("WebSocket notification sent for transfer: " + transfer.getTransferId());
    }

    /**
     * Notify about patient discharge
     */
    public void notifyPatientDischarged(AdmissionResponseDTO admission) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "PATIENT_DISCHARGED");
        notification.put("action", "PATIENT_DISCHARGE");
        notification.put("admission", admission);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "Patient " + admission.getPatientName() + " discharged from " + admission.getWardName());

        // Send to general admissions topic
        messagingTemplate.convertAndSend("/topic/admissions", notification);
        
        // Send to specific ward topic
        messagingTemplate.convertAndSend("/topic/admissions/ward/" + admission.getWardId(), notification);

        System.out.println("WebSocket notification sent for discharge: " + admission.getAdmissionId());
    }

    /**
     * Notify dialysis department about real-time updates
     */
    public void notifyDialysisUpdate(Map<String, Object> updateData) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "DIALYSIS_UPDATE");
        notification.put("action", "REALTIME_UPDATE");
        notification.put("data", updateData);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", "Dialysis department real-time update");

        messagingTemplate.convertAndSend("/topic/dialysis", notification);

        System.out.println("WebSocket notification sent for dialysis update");
    }

    /**
     * Broadcast general hospital updates
     */
    public void broadcastHospitalUpdate(String message, Object data) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "HOSPITAL_UPDATE");
        notification.put("action", "GENERAL_UPDATE");
        notification.put("data", data);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("message", message);

        messagingTemplate.convertAndSend("/topic/hospital", notification);

        System.out.println("WebSocket notification sent for hospital update: " + message);
    }
}