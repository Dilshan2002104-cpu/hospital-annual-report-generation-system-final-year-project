package com.HMS.HMS.service.Dialysis;

import com.HMS.HMS.DTO.Dialysis.DialysisSessionDTO;
import com.HMS.HMS.model.Dialysis.DialysisSession;
import com.HMS.HMS.repository.Dialysis.DialysisSessionRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DialysisSessionService {
    
    private final DialysisSessionRepository sessionRepository;
    
    @Autowired
    public DialysisSessionService(DialysisSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    
    // Get all sessions
    public List<DialysisSessionDTO> getAllSessions() {
        return sessionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get session by ID
    public Optional<DialysisSessionDTO> getSessionById(String sessionId) {
        return sessionRepository.findById(sessionId)
                .map(this::convertToDTO);
    }
    
    // Create new session
    public DialysisSessionDTO createSession(DialysisSessionDTO sessionDTO) {
        // Check if session ID already exists
        if (sessionRepository.existsBySessionId(sessionDTO.getSessionId())) {
            throw new IllegalArgumentException("Session with ID " + sessionDTO.getSessionId() + " already exists");
        }
        
        // Check for scheduling conflicts if machine is assigned
        if (sessionDTO.getMachineId() != null) {
            List<DialysisSession> conflicts = sessionRepository.findConflictingSessions(
                sessionDTO.getMachineId(),
                sessionDTO.getScheduledDate(),
                sessionDTO.getStartTime(),
                sessionDTO.getEndTime()
            );
            if (!conflicts.isEmpty()) {
                throw new IllegalArgumentException("Scheduling conflict detected for machine " + sessionDTO.getMachineId());
            }
        }
        
        DialysisSession session = convertToEntity(sessionDTO);
        
        // Set default values if not provided
        if (session.getStatus() == null) {
            session.setStatus(DialysisSession.SessionStatus.SCHEDULED);
        }
        if (session.getAttendance() == null) {
            session.setAttendance(DialysisSession.AttendanceStatus.PENDING);
        }
        if (session.getSessionType() == null) {
            session.setSessionType(DialysisSession.SessionType.HEMODIALYSIS);
        }
        if (session.getPriority() == null) {
            session.setPriority(DialysisSession.Priority.NORMAL);
        }
        if (session.getIsTransferred() == null) {
            session.setIsTransferred(false);
        }
        
        DialysisSession savedSession = sessionRepository.save(session);
        return convertToDTO(savedSession);
    }
    
    // Update session
    public DialysisSessionDTO updateSession(String sessionId, DialysisSessionDTO sessionDTO) {
        DialysisSession existingSession = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));
        
        // Update fields
        if (sessionDTO.getMachineId() != null) {
            // Check for conflicts if machine is being changed
            if (!sessionDTO.getMachineId().equals(existingSession.getMachineId())) {
                List<DialysisSession> conflicts = sessionRepository.findConflictingSessions(
                    sessionDTO.getMachineId(),
                    existingSession.getScheduledDate(),
                    existingSession.getStartTime(),
                    existingSession.getEndTime()
                );
                if (!conflicts.isEmpty()) {
                    throw new IllegalArgumentException("Scheduling conflict detected for machine " + sessionDTO.getMachineId());
                }
            }
            existingSession.setMachineId(sessionDTO.getMachineId());
        }
        if (sessionDTO.getMachineName() != null) {
            existingSession.setMachineName(sessionDTO.getMachineName());
        }
        if (sessionDTO.getScheduledDate() != null) {
            existingSession.setScheduledDate(sessionDTO.getScheduledDate());
        }
        if (sessionDTO.getStartTime() != null) {
            existingSession.setStartTime(sessionDTO.getStartTime());
        }
        if (sessionDTO.getEndTime() != null) {
            existingSession.setEndTime(sessionDTO.getEndTime());
        }
        if (sessionDTO.getActualStartTime() != null) {
            existingSession.setActualStartTime(sessionDTO.getActualStartTime());
        }
        if (sessionDTO.getActualEndTime() != null) {
            existingSession.setActualEndTime(sessionDTO.getActualEndTime());
        }
        if (sessionDTO.getStatus() != null) {
            existingSession.setStatus(sessionDTO.getStatus());
        }
        if (sessionDTO.getAttendance() != null) {
            existingSession.setAttendance(sessionDTO.getAttendance());
        }
        if (sessionDTO.getPriority() != null) {
            existingSession.setPriority(sessionDTO.getPriority());
        }
        if (sessionDTO.getPreWeight() != null) {
            existingSession.setPreWeight(sessionDTO.getPreWeight());
        }
        if (sessionDTO.getPostWeight() != null) {
            existingSession.setPostWeight(sessionDTO.getPostWeight());
        }
        if (sessionDTO.getFluidRemoval() != null) {
            existingSession.setFluidRemoval(sessionDTO.getFluidRemoval());
        }
        if (sessionDTO.getPreBloodPressure() != null) {
            existingSession.setPreBloodPressure(sessionDTO.getPreBloodPressure());
        }
        if (sessionDTO.getPostBloodPressure() != null) {
            existingSession.setPostBloodPressure(sessionDTO.getPostBloodPressure());
        }
        if (sessionDTO.getComplications() != null) {
            existingSession.setComplications(sessionDTO.getComplications());
        }
        if (sessionDTO.getNotes() != null) {
            existingSession.setNotes(sessionDTO.getNotes());
        }
        
        DialysisSession updatedSession = sessionRepository.save(existingSession);
        return convertToDTO(updatedSession);
    }
    
    // Delete session
    public void deleteSession(String sessionId) {
        if (!sessionRepository.existsById(sessionId)) {
            throw new IllegalArgumentException("Session not found with ID: " + sessionId);
        }
        sessionRepository.deleteById(sessionId);
    }
    
    // Update attendance
    public DialysisSessionDTO updateAttendance(String sessionId, DialysisSession.AttendanceStatus attendance) {
        DialysisSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));
        
        session.setAttendance(attendance);
        
        // Update status based on attendance
        if (attendance == DialysisSession.AttendanceStatus.PRESENT && 
            session.getStatus() == DialysisSession.SessionStatus.SCHEDULED) {
            session.setStatus(DialysisSession.SessionStatus.IN_PROGRESS);
            session.setActualStartTime(LocalTime.now());
        } else if (attendance == DialysisSession.AttendanceStatus.ABSENT) {
            session.setStatus(DialysisSession.SessionStatus.NO_SHOW);
        }
        
        DialysisSession updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }
    
    // Update session details (post-session)
    public DialysisSessionDTO updateSessionDetails(String sessionId, DialysisSessionDTO detailsDTO) {
        DialysisSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with ID: " + sessionId));
        
        // Update session details
        if (detailsDTO.getPreWeight() != null) {
            session.setPreWeight(detailsDTO.getPreWeight());
        }
        if (detailsDTO.getPostWeight() != null) {
            session.setPostWeight(detailsDTO.getPostWeight());
        }
        if (detailsDTO.getFluidRemoval() != null) {
            session.setFluidRemoval(detailsDTO.getFluidRemoval());
        }
        if (detailsDTO.getPreBloodPressure() != null) {
            session.setPreBloodPressure(detailsDTO.getPreBloodPressure());
        }
        if (detailsDTO.getPostBloodPressure() != null) {
            session.setPostBloodPressure(detailsDTO.getPostBloodPressure());
        }
        if (detailsDTO.getComplications() != null) {
            session.setComplications(detailsDTO.getComplications());
        }
        if (detailsDTO.getNotes() != null) {
            session.setNotes(detailsDTO.getNotes());
        }
        if (detailsDTO.getActualEndTime() != null) {
            session.setActualEndTime(detailsDTO.getActualEndTime());
            session.setStatus(DialysisSession.SessionStatus.COMPLETED);
        }
        
        DialysisSession updatedSession = sessionRepository.save(session);
        return convertToDTO(updatedSession);
    }
    
    // Get sessions by patient
    public List<DialysisSessionDTO> getSessionsByPatient(String patientNationalId) {
        return sessionRepository.findByPatientNationalId(patientNationalId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get sessions by machine
    public List<DialysisSessionDTO> getSessionsByMachine(String machineId) {
        return sessionRepository.findByMachineId(machineId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get sessions by date
    public List<DialysisSessionDTO> getSessionsByDate(LocalDate date) {
        return sessionRepository.findByScheduledDate(date).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get today's sessions
    public List<DialysisSessionDTO> getTodaysSessions() {
        return sessionRepository.findTodaysSessions().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get upcoming sessions
    public List<DialysisSessionDTO> getUpcomingSessions() {
        return sessionRepository.findUpcomingSessions().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get active sessions
    public List<DialysisSessionDTO> getActiveSessions() {
        return sessionRepository.findActiveSessions().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Search sessions
    public List<DialysisSessionDTO> searchSessions(String searchTerm) {
        return sessionRepository.searchSessions(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get session statistics
    public long getSessionCountByStatus(DialysisSession.SessionStatus status) {
        return sessionRepository.countByStatus(status);
    }
    
    public long getSessionCountByAttendance(DialysisSession.AttendanceStatus attendance) {
        return sessionRepository.countByAttendance(attendance);
    }
    
    // Convert entity to DTO
    private DialysisSessionDTO convertToDTO(DialysisSession session) {
        DialysisSessionDTO dto = new DialysisSessionDTO();
        BeanUtils.copyProperties(session, dto);
        return dto;
    }
    
    // Convert DTO to entity
    private DialysisSession convertToEntity(DialysisSessionDTO dto) {
        DialysisSession session = new DialysisSession();
        BeanUtils.copyProperties(dto, session);
        return session;
    }
}