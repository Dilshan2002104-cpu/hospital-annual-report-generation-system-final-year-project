package com.HMS.HMS.service;

import com.HMS.HMS.DTO.LabRequest.LabRequestDTO;
import com.HMS.HMS.model.LabRequest.LabRequest;
import com.HMS.HMS.model.LabRequest.LabRequestStatus;
import com.HMS.HMS.model.LabRequest.LabTest;
import com.HMS.HMS.repository.LabRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LabRequestService {
    
    @Autowired
    private LabRequestRepository labRequestRepository;
    
    @Autowired
    private LabRequestWebSocketService webSocketService;
    
    public LabRequest createLabRequest(LabRequestDTO labRequestDTO) {
        // Convert DTO to Entity
        LabRequest labRequest = new LabRequest();
        labRequest.setRequestId(labRequestDTO.getRequestId());
        labRequest.setPatientNationalId(labRequestDTO.getPatientNationalId());
        labRequest.setPatientName(labRequestDTO.getPatientName());
        labRequest.setWardName(labRequestDTO.getWardName());
        labRequest.setBedNumber(labRequestDTO.getBedNumber());
        labRequest.setPriority("normal"); // Always set to normal - user doesn't select priority
        labRequest.setRequestedBy(labRequestDTO.getRequestedBy());
        labRequest.setRequestDate(labRequestDTO.getRequestDate());
        labRequest.setStatus(LabRequestStatus.PENDING);
        
        // Convert test DTOs to entities
        List<LabTest> tests = labRequestDTO.getTests().stream()
            .map(testDTO -> {
                LabTest test = new LabTest();
                test.setTestId(testDTO.getId());
                test.setTestName(testDTO.getName());
                test.setCategory(testDTO.getCategory());
                test.setUrgent(testDTO.getUrgent());
                test.setLabRequest(labRequest);
                return test;
            })
            .collect(Collectors.toList());
        
        labRequest.setTests(tests);
        
        // Save to database
        LabRequest savedRequest = labRequestRepository.save(labRequest);
        
        // Send real-time notification
        webSocketService.notifyNewLabRequest(savedRequest);
        
        return savedRequest;
    }
    
    public List<LabRequest> getAllLabRequests() {
        return labRequestRepository.findAll();
    }
    
    public List<LabRequest> getLabRequestsByStatus(LabRequestStatus status) {
        return labRequestRepository.findByStatusOrderByRequestDateAsc(status);
    }
    
    public List<LabRequest> getPendingLabRequests() {
        return labRequestRepository.findByStatusOrderByRequestDateAsc(LabRequestStatus.PENDING);
    }
    
    public List<LabRequest> getInProgressLabRequests() {
        return labRequestRepository.findByStatusOrderByRequestDateAsc(LabRequestStatus.IN_PROGRESS);
    }
    
    public List<LabRequest> getCompletedLabRequests() {
        return labRequestRepository.findByStatusOrderByRequestDateAsc(LabRequestStatus.COMPLETED);
    }
    
    public Optional<LabRequest> getLabRequestById(String requestId) {
        return labRequestRepository.findByRequestId(requestId);
    }
    
    public LabRequest updateLabRequestStatus(String requestId, LabRequestStatus status) {
        Optional<LabRequest> optionalLabRequest = labRequestRepository.findByRequestId(requestId);
        if (optionalLabRequest.isPresent()) {
            LabRequest labRequest = optionalLabRequest.get();
            labRequest.setStatus(status);
            LabRequest updatedRequest = labRequestRepository.save(labRequest);
            
            // Send real-time status update notification
            webSocketService.notifyLabRequestStatusUpdate(updatedRequest);
            
            return updatedRequest;
        }
        throw new RuntimeException("Lab request not found with ID: " + requestId);
    }
    
    public List<LabRequest> getLabRequestsByPatient(String patientNationalId) {
        return labRequestRepository.findByPatientNationalId(patientNationalId);
    }
    
    public List<LabRequest> getLabRequestsByWard(String wardName) {
        return labRequestRepository.findByWardName(wardName);
    }
    
    public Long getLabRequestCountByStatus(LabRequestStatus status) {
        return labRequestRepository.countByStatus(status);
    }
    
    public List<LabRequest> getRecentLabRequests() {
        List<LabRequestStatus> activeStatuses = List.of(
            LabRequestStatus.PENDING, 
            LabRequestStatus.IN_PROGRESS
        );
        return labRequestRepository.findByStatusInOrderByRequestDateDesc(activeStatuses);
    }
}