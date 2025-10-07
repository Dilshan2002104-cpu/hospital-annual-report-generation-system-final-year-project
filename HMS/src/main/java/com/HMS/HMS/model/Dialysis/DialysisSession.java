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

    // Additional vital signs and treatment parameters
    @Column(name = "pre_heart_rate")
    private Integer preHeartRate;

    @Column(name = "post_heart_rate")
    private Integer postHeartRate;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "patient_comfort")
    private String patientComfort;

    @Enumerated(EnumType.STRING)
    @Column(name = "dialysis_access")
    private DialysisAccess dialysisAccess;

    @Column(name = "blood_flow")
    private Integer bloodFlow;

    @Column(name = "dialysate_flow")
    private Integer dialysateFlow;

    @Column(name = "transferred_from")
    private String transferredFrom;

    @Column(name = "is_transferred")
    private Boolean isTransferred = false;

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

    public DialysisAccess getDialysisAccess() {
        return dialysisAccess;
    }

    public void setDialysisAccess(DialysisAccess dialysisAccess) {
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

    public enum DialysisAccess {
        AV_FISTULA,
        AV_GRAFT,
        CENTRAL_CATHETER,
        PERITONEAL
    }
}