package com.HMS.HMS.model.Dialysis;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "dialysis_session")
public class DialysisSession {
    
    @Id
    @Column(name = "session_id", length = 50)
    private String sessionId;
    
    @Column(name = "patient_national_id", nullable = false)
    private String patientNationalId;
    
    @Column(name = "patient_name", nullable = false)
    private String patientName;
    
    @Column(name = "admission_id")
    private Long admissionId;
    
    @Column(name = "machine_id")
    private String machineId;
    
    @Column(name = "machine_name")
    private String machineName;
    
    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(name = "actual_start_time")
    private LocalTime actualStartTime;
    
    @Column(name = "actual_end_time")
    private LocalTime actualEndTime;
    
    @Column(name = "duration", length = 20)
    private String duration;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SessionStatus status = SessionStatus.SCHEDULED;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "attendance", nullable = false)
    private AttendanceStatus attendance = AttendanceStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "session_type", nullable = false)
    private SessionType sessionType = SessionType.HEMODIALYSIS;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority = Priority.NORMAL;
    
    @Column(name = "pre_weight")
    private String preWeight;
    
    @Column(name = "post_weight")
    private String postWeight;
    
    @Column(name = "fluid_removal")
    private String fluidRemoval;
    
    @Column(name = "pre_blood_pressure")
    private String preBloodPressure;
    
    @Column(name = "post_blood_pressure")
    private String postBloodPressure;
    
    @Column(name = "complications", columnDefinition = "TEXT")
    private String complications;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "transferred_from")
    private String transferredFrom;
    
    @Column(name = "transfer_date")
    private LocalDateTime transferDate;
    
    @Column(name = "is_transferred")
    private Boolean isTransferred = false;
    
    @Column(name = "ward_id")
    private Long wardId;
    
    @Column(name = "ward_name")
    private String wardName;
    
    @Column(name = "bed_number")
    private String bedNumber;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public DialysisSession() {}
    
    public DialysisSession(String sessionId, String patientNationalId, String patientName, LocalDate scheduledDate, LocalTime startTime, LocalTime endTime) {
        this.sessionId = sessionId;
        this.patientNationalId = patientNationalId;
        this.patientName = patientName;
        this.scheduledDate = scheduledDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // JPA Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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
    
    public SessionStatus getStatus() {
        return status;
    }
    
    public void setStatus(SessionStatus status) {
        this.status = status;
    }
    
    public AttendanceStatus getAttendance() {
        return attendance;
    }
    
    public void setAttendance(AttendanceStatus attendance) {
        this.attendance = attendance;
    }
    
    public SessionType getSessionType() {
        return sessionType;
    }
    
    public void setSessionType(SessionType sessionType) {
        this.sessionType = sessionType;
    }
    
    public Priority getPriority() {
        return priority;
    }
    
    public void setPriority(Priority priority) {
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
    
    // Enums
    public enum SessionStatus {
        SCHEDULED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        NO_SHOW
    }
    
    public enum AttendanceStatus {
        PENDING,
        PRESENT,
        ABSENT,
        LATE
    }
    
    public enum SessionType {
        HEMODIALYSIS,
        PERITONEAL_DIALYSIS,
        CONTINUOUS_RENAL_REPLACEMENT,
        PLASMAPHERESIS
    }
    
    public enum Priority {
        LOW,
        NORMAL,
        HIGH,
        URGENT
    }
}