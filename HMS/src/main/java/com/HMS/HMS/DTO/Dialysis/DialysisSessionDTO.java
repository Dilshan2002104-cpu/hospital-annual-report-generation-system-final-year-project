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
    private String machineName;
    private LocalDate scheduledDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalTime actualStartTime;
    private LocalTime actualEndTime;
    private String duration;
    private DialysisSession.SessionStatus status;
    private DialysisSession.AttendanceStatus attendance;
    private DialysisSession.SessionType sessionType;
    private DialysisSession.Priority priority;
    private String preWeight;
    private String postWeight;
    private String fluidRemoval;
    private String preBloodPressure;
    private String postBloodPressure;
    private String complications;
    private String notes;
    private String transferredFrom;
    private LocalDateTime transferDate;
    private Boolean isTransferred;
    private Long wardId;
    private String wardName;
    private String bedNumber;
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
    
    public String getMachineName() {
        return machineName;
    }
    
    public void setMachineName(String machineName) {
        this.machineName = machineName;
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
    
    public DialysisSession.Priority getPriority() {
        return priority;
    }
    
    public void setPriority(DialysisSession.Priority priority) {
        this.priority = priority;
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
    
    public String getComplications() {
        return complications;
    }
    
    public void setComplications(String complications) {
        this.complications = complications;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getTransferredFrom() {
        return transferredFrom;
    }
    
    public void setTransferredFrom(String transferredFrom) {
        this.transferredFrom = transferredFrom;
    }
    
    public LocalDateTime getTransferDate() {
        return transferDate;
    }
    
    public void setTransferDate(LocalDateTime transferDate) {
        this.transferDate = transferDate;
    }
    
    public Boolean getIsTransferred() {
        return isTransferred;
    }
    
    public void setIsTransferred(Boolean isTransferred) {
        this.isTransferred = isTransferred;
    }
    
    public Long getWardId() {
        return wardId;
    }
    
    public void setWardId(Long wardId) {
        this.wardId = wardId;
    }
    
    public String getWardName() {
        return wardName;
    }
    
    public void setWardName(String wardName) {
        this.wardName = wardName;
    }
    
    public String getBedNumber() {
        return bedNumber;
    }
    
    public void setBedNumber(String bedNumber) {
        this.bedNumber = bedNumber;
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
}