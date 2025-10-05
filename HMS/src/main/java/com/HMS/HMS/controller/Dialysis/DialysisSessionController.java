package com.HMS.HMS.controller.Dialysis;

import com.HMS.HMS.DTO.Dialysis.DialysisSessionDTO;
import com.HMS.HMS.model.Dialysis.DialysisSession;
import com.HMS.HMS.service.Dialysis.DialysisSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dialysis/sessions")
@CrossOrigin(origins = "*")
public class DialysisSessionController {
    
    private final DialysisSessionService sessionService;
    
    @Autowired
    public DialysisSessionController(DialysisSessionService sessionService) {
        this.sessionService = sessionService;
    }
    
    // Get all sessions
    @GetMapping
    public ResponseEntity<List<DialysisSessionDTO>> getAllSessions() {
        try {
            List<DialysisSessionDTO> sessions = sessionService.getAllSessions();
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get session by ID
    @GetMapping("/{sessionId}")
    public ResponseEntity<DialysisSessionDTO> getSessionById(@PathVariable String sessionId) {
        try {
            Optional<DialysisSessionDTO> session = sessionService.getSessionById(sessionId);
            return session.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Create new session
    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody DialysisSessionDTO sessionDTO) {
        try {
            DialysisSessionDTO createdSession = sessionService.createSession(sessionDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSession);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to create session"));
        }
    }
    
    // Update session
    @PutMapping("/{sessionId}")
    public ResponseEntity<?> updateSession(@PathVariable String sessionId, 
                                          @RequestBody DialysisSessionDTO sessionDTO) {
        try {
            DialysisSessionDTO updatedSession = sessionService.updateSession(sessionId, sessionDTO);
            return ResponseEntity.ok(updatedSession);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to update session"));
        }
    }
    
    // Delete session
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> deleteSession(@PathVariable String sessionId) {
        try {
            sessionService.deleteSession(sessionId);
            return ResponseEntity.ok(Map.of("message", "Session deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to delete session"));
        }
    }
    
    // Update attendance
    @PatchMapping("/{sessionId}/attendance")
    public ResponseEntity<?> updateAttendance(@PathVariable String sessionId,
                                            @RequestBody Map<String, String> request) {
        try {
            String attendanceStr = request.get("attendance");
            DialysisSession.AttendanceStatus attendance = DialysisSession.AttendanceStatus.valueOf(attendanceStr.toUpperCase());
            
            DialysisSessionDTO updatedSession = sessionService.updateAttendance(sessionId, attendance);
            return ResponseEntity.ok(updatedSession);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to update attendance"));
        }
    }
    
    // Update session details
    @PatchMapping("/{sessionId}/details")
    public ResponseEntity<?> updateSessionDetails(@PathVariable String sessionId,
                                                @RequestBody DialysisSessionDTO detailsDTO) {
        try {
            DialysisSessionDTO updatedSession = sessionService.updateSessionDetails(sessionId, detailsDTO);
            return ResponseEntity.ok(updatedSession);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to update session details"));
        }
    }
    
    // Get sessions by patient
    @GetMapping("/patient/{patientNationalId}")
    public ResponseEntity<List<DialysisSessionDTO>> getSessionsByPatient(@PathVariable String patientNationalId) {
        try {
            List<DialysisSessionDTO> sessions = sessionService.getSessionsByPatient(patientNationalId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get sessions by machine
    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<DialysisSessionDTO>> getSessionsByMachine(@PathVariable String machineId) {
        try {
            List<DialysisSessionDTO> sessions = sessionService.getSessionsByMachine(machineId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get sessions by date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<DialysisSessionDTO>> getSessionsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<DialysisSessionDTO> sessions = sessionService.getSessionsByDate(date);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get today's sessions
    @GetMapping("/today")
    public ResponseEntity<List<DialysisSessionDTO>> getTodaysSessions() {
        try {
            List<DialysisSessionDTO> sessions = sessionService.getTodaysSessions();
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get upcoming sessions
    @GetMapping("/upcoming")
    public ResponseEntity<List<DialysisSessionDTO>> getUpcomingSessions() {
        try {
            List<DialysisSessionDTO> sessions = sessionService.getUpcomingSessions();
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get active sessions
    @GetMapping("/active")
    public ResponseEntity<List<DialysisSessionDTO>> getActiveSessions() {
        try {
            List<DialysisSessionDTO> sessions = sessionService.getActiveSessions();
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get sessions by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<DialysisSessionDTO>> getSessionsByStatus(@PathVariable String status) {
        try {
            DialysisSession.SessionStatus sessionStatus = DialysisSession.SessionStatus.valueOf(status.toUpperCase());
            List<DialysisSessionDTO> sessions = sessionService.getAllSessions().stream()
                .filter(session -> session.getStatus() == sessionStatus)
                .toList();
            return ResponseEntity.ok(sessions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search sessions
    @GetMapping("/search")
    public ResponseEntity<List<DialysisSessionDTO>> searchSessions(@RequestParam String q) {
        try {
            List<DialysisSessionDTO> sessions = sessionService.searchSessions(q);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get session statistics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getSessionStatistics() {
        try {
            Map<String, Object> stats = Map.of(
                "totalSessions", sessionService.getAllSessions().size(),
                "scheduledSessions", sessionService.getSessionCountByStatus(DialysisSession.SessionStatus.SCHEDULED),
                "inProgressSessions", sessionService.getSessionCountByStatus(DialysisSession.SessionStatus.IN_PROGRESS),
                "completedSessions", sessionService.getSessionCountByStatus(DialysisSession.SessionStatus.COMPLETED),
                "cancelledSessions", sessionService.getSessionCountByStatus(DialysisSession.SessionStatus.CANCELLED),
                "noShowSessions", sessionService.getSessionCountByStatus(DialysisSession.SessionStatus.NO_SHOW),
                "presentAttendance", sessionService.getSessionCountByAttendance(DialysisSession.AttendanceStatus.PRESENT),
                "absentAttendance", sessionService.getSessionCountByAttendance(DialysisSession.AttendanceStatus.ABSENT),
                "pendingAttendance", sessionService.getSessionCountByAttendance(DialysisSession.AttendanceStatus.PENDING)
            );
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}