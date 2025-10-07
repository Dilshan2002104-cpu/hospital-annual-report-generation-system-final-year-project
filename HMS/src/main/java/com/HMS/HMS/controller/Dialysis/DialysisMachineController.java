package com.HMS.HMS.controller.Dialysis;

import com.HMS.HMS.DTO.Dialysis.DialysisMachineDTO;
import com.HMS.HMS.model.Dialysis.DialysisMachine;
import com.HMS.HMS.service.Dialysis.DialysisMachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dialysis/machines")
@CrossOrigin(origins = "*")
public class DialysisMachineController {
    
    private final DialysisMachineService machineService;
    
    @Autowired
    public DialysisMachineController(DialysisMachineService machineService) {
        this.machineService = machineService;
    }
    
    // Get all machines
    @GetMapping
    public ResponseEntity<List<DialysisMachineDTO>> getAllMachines() {
        try {
            List<DialysisMachineDTO> machines = machineService.getAllMachines();
            return ResponseEntity.ok(machines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get machine by ID
    @GetMapping("/{machineId}")
    public ResponseEntity<DialysisMachineDTO> getMachineById(@PathVariable String machineId) {
        try {
            Optional<DialysisMachineDTO> machine = machineService.getMachineById(machineId);
            return machine.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Create new machine
    @PostMapping
    public ResponseEntity<?> createMachine(@RequestBody DialysisMachineDTO machineDTO) {
        try {
            DialysisMachineDTO createdMachine = machineService.createMachine(machineDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMachine);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to create machine"));
        }
    }
    
    // Update machine
    @PutMapping("/{machineId}")
    public ResponseEntity<?> updateMachine(@PathVariable String machineId, 
                                          @RequestBody DialysisMachineDTO machineDTO) {
        try {
            DialysisMachineDTO updatedMachine = machineService.updateMachine(machineId, machineDTO);
            return ResponseEntity.ok(updatedMachine);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to update machine"));
        }
    }
    
    // Delete machine
    @DeleteMapping("/{machineId}")
    public ResponseEntity<?> deleteMachine(@PathVariable String machineId) {
        try {
            machineService.deleteMachine(machineId);
            return ResponseEntity.ok(Map.of("message", "Machine deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to delete machine"));
        }
    }
    
    // Get machines by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<DialysisMachineDTO>> getMachinesByStatus(@PathVariable String status) {
        try {
            DialysisMachine.MachineStatus machineStatus = DialysisMachine.MachineStatus.valueOf(status.toUpperCase());
            List<DialysisMachineDTO> machines = machineService.getMachinesByStatus(machineStatus);
            return ResponseEntity.ok(machines);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get active machines
    @GetMapping("/active")
    public ResponseEntity<List<DialysisMachineDTO>> getActiveMachines() {
        try {
            List<DialysisMachineDTO> machines = machineService.getActiveMachines();
            return ResponseEntity.ok(machines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get machines needing maintenance
    @GetMapping("/maintenance/needed")
    public ResponseEntity<List<DialysisMachineDTO>> getMachinesNeedingMaintenance() {
        try {
            List<DialysisMachineDTO> machines = machineService.getMachinesNeedingMaintenance();
            return ResponseEntity.ok(machines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Search machines
    @GetMapping("/search")
    public ResponseEntity<List<DialysisMachineDTO>> searchMachines(@RequestParam String q) {
        try {
            List<DialysisMachineDTO> machines = machineService.searchMachines(q);
            return ResponseEntity.ok(machines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Schedule maintenance
    @PostMapping("/{machineId}/maintenance/schedule")
    public ResponseEntity<?> scheduleMaintenance(@PathVariable String machineId,
                                               @RequestBody Map<String, Object> request) {
        try {
            LocalDate maintenanceDate = LocalDate.parse((String) request.get("maintenanceDate"));
            String notes = (String) request.get("notes");
            
            DialysisMachineDTO machine = machineService.scheduleMaintenance(machineId, maintenanceDate, notes);
            return ResponseEntity.ok(machine);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to schedule maintenance"));
        }
    }
    
    // Complete maintenance
    @PostMapping("/{machineId}/maintenance/complete")
    public ResponseEntity<?> completeMaintenance(@PathVariable String machineId,
                                               @RequestBody Map<String, String> request) {
        try {
            String notes = request.get("notes");
            DialysisMachineDTO machine = machineService.completeMaintenance(machineId, notes);
            return ResponseEntity.ok(machine);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Failed to complete maintenance"));
        }
    }
    
    // Get machine statistics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getMachineStatistics() {
        try {
            Map<String, Object> stats = Map.of(
                "totalMachines", machineService.getAllMachines().size(),
                "activeMachines", machineService.getMachineCountByStatus(DialysisMachine.MachineStatus.ACTIVE),
                "maintenanceMachines", machineService.getMachineCountByStatus(DialysisMachine.MachineStatus.MAINTENANCE),
                "outOfOrderMachines", machineService.getMachineCountByStatus(DialysisMachine.MachineStatus.OUT_OF_ORDER),
                "retiredMachines", machineService.getMachineCountByStatus(DialysisMachine.MachineStatus.RETIRED),
                "machinesNeedingMaintenance", machineService.getMachinesNeedingMaintenance().size()
            );
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get available machines for a specific time slot
    @GetMapping("/available-for-time")
    public ResponseEntity<?> getAvailableMachinesForTime(
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam int duration) {
        try {
            LocalDate sessionDate = LocalDate.parse(date);
            java.time.LocalTime sessionStartTime = java.time.LocalTime.parse(startTime);

            List<DialysisMachineDTO> availableMachines = machineService.getAvailableMachinesForTime(
                    sessionDate, sessionStartTime, duration);

            return ResponseEntity.ok(availableMachines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get available machines: " + e.getMessage()));
        }
    }

    // Get all machines with their availability status for a specific time slot
    @GetMapping("/availability-status")
    public ResponseEntity<?> getMachinesWithAvailabilityStatus(
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam int duration) {
        try {
            LocalDate sessionDate = LocalDate.parse(date);
            java.time.LocalTime sessionStartTime = java.time.LocalTime.parse(startTime);

            List<Map<String, Object>> machinesWithStatus = machineService.getMachinesWithAvailabilityStatus(
                    sessionDate, sessionStartTime, duration);

            return ResponseEntity.ok(machinesWithStatus);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get machine availability status: " + e.getMessage()));
        }
    }
}