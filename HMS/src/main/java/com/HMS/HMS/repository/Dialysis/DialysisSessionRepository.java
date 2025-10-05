package com.HMS.HMS.repository.Dialysis;

import com.HMS.HMS.model.Dialysis.DialysisSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DialysisSessionRepository extends JpaRepository<DialysisSession, String> {
    
    // Find sessions by patient
    List<DialysisSession> findByPatientNationalId(String patientNationalId);
    
    // Find sessions by machine
    List<DialysisSession> findByMachineId(String machineId);
    
    // Find sessions by date
    List<DialysisSession> findByScheduledDate(LocalDate scheduledDate);
    
    // Find sessions by date range
    List<DialysisSession> findByScheduledDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Find sessions by status
    List<DialysisSession> findByStatus(DialysisSession.SessionStatus status);
    
    // Find sessions by attendance status
    List<DialysisSession> findByAttendance(DialysisSession.AttendanceStatus attendance);
    
    // Find sessions by admission ID
    List<DialysisSession> findByAdmissionId(Long admissionId);
    
    // Find transferred patients' sessions
    List<DialysisSession> findByIsTransferredTrue();
    
    // Find sessions by ward
    List<DialysisSession> findByWardId(Long wardId);
    
    // Find today's sessions
    @Query("SELECT s FROM DialysisSession s WHERE s.scheduledDate = CURRENT_DATE ORDER BY s.startTime")
    List<DialysisSession> findTodaysSessions();
    
    // Find upcoming sessions
    @Query("SELECT s FROM DialysisSession s WHERE s.scheduledDate >= CURRENT_DATE AND s.status = 'SCHEDULED' ORDER BY s.scheduledDate, s.startTime")
    List<DialysisSession> findUpcomingSessions();
    
    // Find active sessions (in progress)
    @Query("SELECT s FROM DialysisSession s WHERE s.status = 'IN_PROGRESS'")
    List<DialysisSession> findActiveSessions();
    
    // Find sessions by patient and date range
    @Query("SELECT s FROM DialysisSession s WHERE s.patientNationalId = :patientId AND s.scheduledDate BETWEEN :startDate AND :endDate ORDER BY s.scheduledDate DESC")
    List<DialysisSession> findPatientSessionsInDateRange(@Param("patientId") String patientId, 
                                                         @Param("startDate") LocalDate startDate, 
                                                         @Param("endDate") LocalDate endDate);
    
    // Find sessions by machine and date
    @Query("SELECT s FROM DialysisSession s WHERE s.machineId = :machineId AND s.scheduledDate = :date ORDER BY s.startTime")
    List<DialysisSession> findMachineSessionsForDate(@Param("machineId") String machineId, @Param("date") LocalDate date);
    
    // Check for scheduling conflicts
    @Query("SELECT s FROM DialysisSession s WHERE s.machineId = :machineId AND s.scheduledDate = :date AND " +
           "((s.startTime <= :startTime AND s.endTime > :startTime) OR " +
           "(s.startTime < :endTime AND s.endTime >= :endTime) OR " +
           "(s.startTime >= :startTime AND s.endTime <= :endTime)) AND " +
           "s.status IN ('SCHEDULED', 'IN_PROGRESS')")
    List<DialysisSession> findConflictingSessions(@Param("machineId") String machineId, 
                                                 @Param("date") LocalDate date,
                                                 @Param("startTime") java.time.LocalTime startTime, 
                                                 @Param("endTime") java.time.LocalTime endTime);
    
    // Count sessions by status
    @Query("SELECT COUNT(s) FROM DialysisSession s WHERE s.status = :status")
    long countByStatus(@Param("status") DialysisSession.SessionStatus status);
    
    // Count sessions by attendance
    @Query("SELECT COUNT(s) FROM DialysisSession s WHERE s.attendance = :attendance")
    long countByAttendance(@Param("attendance") DialysisSession.AttendanceStatus attendance);
    
    // Get session statistics for date range
    @Query("SELECT s.status, COUNT(s) FROM DialysisSession s WHERE s.scheduledDate BETWEEN :startDate AND :endDate GROUP BY s.status")
    List<Object[]> getSessionStatsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Search sessions
    @Query("SELECT s FROM DialysisSession s WHERE " +
           "LOWER(s.patientName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.patientNationalId) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.sessionId) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<DialysisSession> searchSessions(@Param("searchTerm") String searchTerm);
    
    // Check if session ID exists
    boolean existsBySessionId(String sessionId);
    
    // Find sessions that need follow-up (completed sessions without post-session notes)
    @Query("SELECT s FROM DialysisSession s WHERE s.status = 'COMPLETED' AND (s.notes IS NULL OR s.notes = '')")
    List<DialysisSession> findSessionsNeedingFollowUp();
}