package com.HMS.HMS.controller.Dialysis;

import com.HMS.HMS.model.Dialysis.DialysisSession;
import com.HMS.HMS.model.Dialysis.DialysisMachine;
import com.HMS.HMS.repository.Dialysis.DialysisSessionRepository;
import com.HMS.HMS.repository.Dialysis.DialysisMachineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/dialysis/test")
@CrossOrigin(origins = "*")
public class DialysisTestController {

    private final DialysisSessionRepository sessionRepository;
    private final DialysisMachineRepository machineRepository;

    @Autowired
    public DialysisTestController(DialysisSessionRepository sessionRepository,
                                  DialysisMachineRepository machineRepository) {
        this.sessionRepository = sessionRepository;
        this.machineRepository = machineRepository;
    }

    /**
     * Create sample data for testing analytics
     */
    @PostMapping("/create-sample-data")
    public ResponseEntity<String> createSampleData() {
        try {
            // Create sample machines if they don't exist
            createSampleMachines();
            
            // Create sample sessions for the last 30 days
            createSampleSessions();
            
            return ResponseEntity.ok("Sample data created successfully for analytics testing");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating sample data: " + e.getMessage());
        }
    }

    private void createSampleMachines() {
        List<String> machineIds = List.of("M001", "M002", "M003", "M004", "M005", "M006", "M007", "M008");
        
        for (String machineId : machineIds) {
            if (!machineRepository.existsById(machineId)) {
                DialysisMachine machine = new DialysisMachine();
                machine.setMachineId(machineId);
                machine.setMachineName("Dialysis Machine " + machineId);
                machine.setManufacturer("Fresenius Medical Care");
                machine.setModel("4008S");
                machine.setInstallationDate(LocalDate.of(2020, 1, 1));
                machine.setLastMaintenance(LocalDate.now().minusDays(30));
                machine.setNextMaintenance(LocalDate.now().plusDays(60));
                machine.setStatus(DialysisMachine.MachineStatus.ACTIVE);
                machine.setLocation("Ward A");
                
                machineRepository.save(machine);
            }
        }
    }

    private void createSampleSessions() {
        Random random = new Random();
        LocalDate today = LocalDate.now();
        
        // Create sessions for the last 30 days
        for (int i = 0; i < 30; i++) {
            LocalDate sessionDate = today.minusDays(i);
            
            // Create 3-6 sessions per day
            int sessionsPerDay = 3 + random.nextInt(4);
            
            for (int j = 0; j < sessionsPerDay; j++) {
                DialysisSession session = new DialysisSession();
                
                // Generate unique session ID
                String sessionId = "DS" + sessionDate.toString().replace("-", "") + String.format("%02d", j + 1);
                session.setSessionId(sessionId);
                
                // Random machine assignment
                String machineId = "M00" + (1 + random.nextInt(8));
                session.setMachineId(machineId);
                
                // Random patient data
                session.setPatientNationalId("P" + String.format("%06d", random.nextInt(999999)));
                session.setPatientName("Patient " + (random.nextInt(100) + 1));
                session.setAdmissionId((long) (random.nextInt(1000) + 1));
                
                // Session timing
                session.setScheduledDate(sessionDate);
                int startHour = 8 + random.nextInt(12); // 8 AM to 8 PM
                session.setStartTime(LocalTime.of(startHour, 0));
                session.setEndTime(LocalTime.of(startHour + 4, 0)); // 4-hour sessions
                
                // Session status based on date
                if (sessionDate.isBefore(today)) {
                    session.setStatus(random.nextBoolean() ? 
                        DialysisSession.SessionStatus.COMPLETED : 
                        DialysisSession.SessionStatus.CANCELLED);
                } else if (sessionDate.equals(today)) {
                    session.setStatus(random.nextBoolean() ? 
                        DialysisSession.SessionStatus.IN_PROGRESS : 
                        DialysisSession.SessionStatus.SCHEDULED);
                } else {
                    session.setStatus(DialysisSession.SessionStatus.SCHEDULED);
                }
                
                // Attendance status
                if (session.getStatus() == DialysisSession.SessionStatus.COMPLETED) {
                    session.setAttendance(DialysisSession.AttendanceStatus.PRESENT);
                } else if (session.getStatus() == DialysisSession.SessionStatus.CANCELLED) {
                    session.setAttendance(random.nextBoolean() ? 
                        DialysisSession.AttendanceStatus.ABSENT : 
                        DialysisSession.AttendanceStatus.ABSENT);
                } else {
                    session.setAttendance(DialysisSession.AttendanceStatus.PENDING);
                }
                
                // Other fields
                session.setIsTransferred(false);
                
                // Only save if session doesn't already exist
                if (!sessionRepository.existsBySessionId(sessionId)) {
                    sessionRepository.save(session);
                }
            }
        }
    }

    /**
     * Get analytics data count for verification
     */
    @GetMapping("/data-count")
    public ResponseEntity<String> getDataCount() {
        long machineCount = machineRepository.count();
        long sessionCount = sessionRepository.count();
        long todaySessionCount = sessionRepository.findTodaysSessions().size();
        
        return ResponseEntity.ok(String.format(
            "Data Count - Machines: %d, Total Sessions: %d, Today's Sessions: %d", 
            machineCount, sessionCount, todaySessionCount));
    }
}