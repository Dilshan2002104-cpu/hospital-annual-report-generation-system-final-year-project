package com.HMS.HMS.service;

import com.HMS.HMS.model.LabRequest.LabRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class LabRequestWebSocketService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    /**
     * Notify all clients when a new lab request is created
     */
    public void notifyNewLabRequest(LabRequest labRequest) {
        // Send to all lab dashboard clients
        messagingTemplate.convertAndSend("/topic/lab-requests/new", labRequest);
        
        // Send to all ward dashboard clients
        messagingTemplate.convertAndSend("/topic/ward-requests/created", labRequest);
        
        System.out.println("WebSocket: New lab request notification sent - " + labRequest.getRequestId());
    }
    
    /**
     * Notify all clients when a lab request status is updated
     */
    public void notifyLabRequestStatusUpdate(LabRequest labRequest) {
        // Send to all lab dashboard clients
        messagingTemplate.convertAndSend("/topic/lab-requests/status-update", labRequest);
        
        // Send to all ward dashboard clients  
        messagingTemplate.convertAndSend("/topic/ward-requests/status-update", labRequest);
        
        System.out.println("WebSocket: Lab request status update sent - " + 
                         labRequest.getRequestId() + " -> " + labRequest.getStatus());
    }
    
    /**
     * Send lab request statistics update
     */
    public void notifyLabRequestStats(Object stats) {
        messagingTemplate.convertAndSend("/topic/lab-requests/stats", stats);
        System.out.println("WebSocket: Lab request stats update sent");
    }
    
    /**
     * Send urgent lab request notification
     */
    public void notifyUrgentLabRequest(LabRequest labRequest) {
        messagingTemplate.convertAndSend("/topic/lab-requests/urgent", labRequest);
        System.out.println("WebSocket: Urgent lab request notification sent - " + labRequest.getRequestId());
    }
}