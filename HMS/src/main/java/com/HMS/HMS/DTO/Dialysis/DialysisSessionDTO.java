package com.HMS.HMS.DTO.Dialysis;

import com.HMS.HMS.model.Dialysis.DialysisSession;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class DialysisSessionDTO {
    
    private String sessionId;
    private String patientNationalId;
    private String patientName;
    private Long admissionId;
    private String machineId;
    private LocalDate scheduledDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalTime actualStartTime;
    private LocalTime actualEndTime;
    private String duration;
    private DialysisSession.SessionStatus status;
    private DialysisSession.AttendanceStatus attendance;
    private DialysisSession.SessionType sessionType;
    private String preWeight;
    private String postWeight;
    private String fluidRemoval;
    private String preBloodPressure;
    private String postBloodPressure;

    // Additional vital signs and treatment parameters
    private Integer preHeartRate;
    private Integer postHeartRate;
    private Double temperature;
    private String patientComfort;
    private DialysisSession.DialysisAccess dialysisAccess;
    private Integer bloodFlow;
    private Integer dialysateFlow;

    private String transferredFrom;
    private Boolean isTransferred;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public DialysisSessionDTO() {}
    
    public DialysisSessionDTO(String sessionId, String patientNationalId, String patientName, LocalDate scheduledDate, LocalTime startTime, LocalTime endTime) {
        this.sessionId = sessionId;
        this.patientNationalId = patientNationalId;
        this.patientName = patientName;
        this.scheduledDate = scheduledDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    
    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    public String getPatientNationalId() {
        return patientNationalId;
    }
    
    public void setPatientNationalId(String patientNationalId) {
        this.patientNationalId = patientNationalId;
    }
    
    public String getPatientName() {
        return patientName;
    }
    
    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }
    
    public Long getAdmissionId() {
        return admissionId;
    }
    
    public void setAdmissionId(Long admissionId) {
        this.admissionId = admissionId;
    }
    
    public String getMachineId() {
        return machineId;
    }

    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }
    
    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }
    
    public LocalTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
    
    public LocalTime getActualStartTime() {
        return actualStartTime;
    }
    
    public void setActualStartTime(LocalTime actualStartTime) {
        this.actualStartTime = actualStartTime;
    }
    
    public LocalTime getActualEndTime() {
        return actualEndTime;
    }
    
    public void setActualEndTime(LocalTime actualEndTime) {
        this.actualEndTime = actualEndTime;
    }
    
    public String getDuration() {
        return duration;
    }
    
    public void setDuration(String duration) {
        this.duration = duration;
    }
    
    public DialysisSession.SessionStatus getStatus() {
        return status;
    }
    
    public void setStatus(DialysisSession.SessionStatus status) {
        this.status = status;
    }
    
    public DialysisSession.AttendanceStatus getAttendance() {
        return attendance;
    }
    
    public void setAttendance(DialysisSession.AttendanceStatus attendance) {
        this.attendance = attendance;
    }
    
    public DialysisSession.SessionType getSessionType() {
        return sessionType;
    }
    
    public void setSessionType(DialysisSession.SessionType sessionType) {
        this.sessionType = sessionType;
    }
    
    public String getPreWeight() {
        return preWeight;
    }
    
    public void setPreWeight(String preWeight) {
        this.preWeight = preWeight;
    }
    
    public String getPostWeight() {
        return postWeight;
    }
    
    public void setPostWeight(String postWeight) {
        this.postWeight = postWeight;
    }
    
    public String getFluidRemoval() {
        return fluidRemoval;
    }
    
    public void setFluidRemoval(String fluidRemoval) {
        this.fluidRemoval = fluidRemoval;
    }
    
    public String getPreBloodPressure() {
        return preBloodPressure;
    }
    
    public void setPreBloodPressure(String preBloodPressure) {
        this.preBloodPressure = preBloodPressure;
    }
    
    public String getPostBloodPressure() {
        return postBloodPressure;
    }
    
    public void setPostBloodPressure(String postBloodPressure) {
        this.postBloodPressure = postBloodPressure;
    }

    public String getTransferredFrom() {
        return transferredFrom;
    }
    
    public void setTransferredFrom(String transferredFrom) {
        this.transferredFrom = transferredFrom;
    }

    public Boolean getIsTransferred() {
        return isTransferred;
    }
    
    public void setIsTransferred(Boolean isTransferred) {
        this.isTransferred = isTransferred;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Getters and Setters for new fields
    public Integer getPreHeartRate() {
        return preHeartRate;
    }

    public void setPreHeartRate(Integer preHeartRate) {
        this.preHeartRate = preHeartRate;
    }

    public Integer getPostHeartRate() {
        return postHeartRate;
    }

    public void setPostHeartRate(Integer postHeartRate) {
        this.postHeartRate = postHeartRate;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public String getPatientComfort() {
        return patientComfort;
    }

    public void setPatientComfort(String patientComfort) {
        this.patientComfort = patientComfort;
    }

    public DialysisSession.DialysisAccess getDialysisAccess() {
        return dialysisAccess;
    }

    public void setDialysisAccess(DialysisSession.DialysisAccess dialysisAccess) {
        this.dialysisAccess = dialysisAccess;
    }

    public Integer getBloodFlow() {
        return bloodFlow;
    }

    public void setBloodFlow(Integer bloodFlow) {
        this.bloodFlow = bloodFlow;
    }

    public Integer getDialysateFlow() {
        return dialysateFlow;
    }

    public void setDialysateFlow(Integer dialysateFlow) {
        this.dialysateFlow = dialysateFlow;
    }
}