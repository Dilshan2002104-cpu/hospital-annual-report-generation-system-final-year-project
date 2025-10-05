package com.HMS.HMS.service.Dialysis;

import com.HMS.HMS.DTO.Dialysis.DialysisMachineDTO;
import com.HMS.HMS.model.Dialysis.DialysisMachine;
import com.HMS.HMS.repository.Dialysis.DialysisMachineRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DialysisMachineService {
    
    private final DialysisMachineRepository machineRepository;
    
    @Autowired
    public DialysisMachineService(DialysisMachineRepository machineRepository) {
        this.machineRepository = machineRepository;
    }
    
    // Get all machines
    public List<DialysisMachineDTO> getAllMachines() {
        return machineRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get machine by ID
    public Optional<DialysisMachineDTO> getMachineById(String machineId) {
        return machineRepository.findById(machineId)
                .map(this::convertToDTO);
    }
    
    // Create new machine
    public DialysisMachineDTO createMachine(DialysisMachineDTO machineDTO) {
        // Check if machine ID already exists
        if (machineRepository.existsByMachineId(machineDTO.getMachineId())) {
            throw new IllegalArgumentException("Machine with ID " + machineDTO.getMachineId() + " already exists");
        }
        
        DialysisMachine machine = convertToEntity(machineDTO);
        
        // Set default values if not provided
        if (machine.getStatus() == null) {
            machine.setStatus(DialysisMachine.MachineStatus.ACTIVE);
        }
        if (machine.getMaintenanceIntervalDays() == null) {
            machine.setMaintenanceIntervalDays(90);
        }
        if (machine.getTotalHoursUsed() == null) {
            machine.setTotalHoursUsed(0);
        }
        
        // Calculate next maintenance date if last maintenance is provided
        if (machine.getLastMaintenance() != null && machine.getNextMaintenance() == null) {
            machine.setNextMaintenance(
                machine.getLastMaintenance().plusDays(machine.getMaintenanceIntervalDays())
            );
        }
        
        DialysisMachine savedMachine = machineRepository.save(machine);
        return convertToDTO(savedMachine);
    }
    
    // Update machine
    public DialysisMachineDTO updateMachine(String machineId, DialysisMachineDTO machineDTO) {
        DialysisMachine existingMachine = machineRepository.findById(machineId)
                .orElseThrow(() -> new IllegalArgumentException("Machine not found with ID: " + machineId));
        
        // Update fields
        if (machineDTO.getMachineName() != null) {
            existingMachine.setMachineName(machineDTO.getMachineName());
        }
        if (machineDTO.getModel() != null) {
            existingMachine.setModel(machineDTO.getModel());
        }
        if (machineDTO.getManufacturer() != null) {
            existingMachine.setManufacturer(machineDTO.getManufacturer());
        }
        if (machineDTO.getLocation() != null) {
            existingMachine.setLocation(machineDTO.getLocation());
        }
        if (machineDTO.getStatus() != null) {
            existingMachine.setStatus(machineDTO.getStatus());
        }
        if (machineDTO.getLastMaintenance() != null) {
            existingMachine.setLastMaintenance(machineDTO.getLastMaintenance());
            // Recalculate next maintenance
            existingMachine.setNextMaintenance(
                machineDTO.getLastMaintenance().plusDays(existingMachine.getMaintenanceIntervalDays())
            );
        }
        if (machineDTO.getMaintenanceIntervalDays() != null) {
            existingMachine.setMaintenanceIntervalDays(machineDTO.getMaintenanceIntervalDays());
            // Recalculate next maintenance if last maintenance exists
            if (existingMachine.getLastMaintenance() != null) {
                existingMachine.setNextMaintenance(
                    existingMachine.getLastMaintenance().plusDays(machineDTO.getMaintenanceIntervalDays())
                );
            }
        }
        if (machineDTO.getTotalHoursUsed() != null) {
            existingMachine.setTotalHoursUsed(machineDTO.getTotalHoursUsed());
        }
        if (machineDTO.getNotes() != null) {
            existingMachine.setNotes(machineDTO.getNotes());
        }
        
        DialysisMachine updatedMachine = machineRepository.save(existingMachine);
        return convertToDTO(updatedMachine);
    }
    
    // Delete machine
    public void deleteMachine(String machineId) {
        if (!machineRepository.existsById(machineId)) {
            throw new IllegalArgumentException("Machine not found with ID: " + machineId);
        }
        machineRepository.deleteById(machineId);
    }
    
    // Get machines by status
    public List<DialysisMachineDTO> getMachinesByStatus(DialysisMachine.MachineStatus status) {
        return machineRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get active machines
    public List<DialysisMachineDTO> getActiveMachines() {
        return machineRepository.findActiveMachines().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get machines needing maintenance
    public List<DialysisMachineDTO> getMachinesNeedingMaintenance() {
        return machineRepository.findMachinesNeedingMaintenance(LocalDate.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Search machines
    public List<DialysisMachineDTO> searchMachines(String searchTerm) {
        return machineRepository.searchMachines(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Schedule maintenance
    public DialysisMachineDTO scheduleMaintenance(String machineId, LocalDate maintenanceDate, String notes) {
        DialysisMachine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new IllegalArgumentException("Machine not found with ID: " + machineId));
        
        machine.setLastMaintenance(maintenanceDate);
        machine.setNextMaintenance(maintenanceDate.plusDays(machine.getMaintenanceIntervalDays()));
        machine.setStatus(DialysisMachine.MachineStatus.MAINTENANCE);
        
        if (notes != null && !notes.trim().isEmpty()) {
            String existingNotes = machine.getNotes() != null ? machine.getNotes() : "";
            machine.setNotes(existingNotes + "\n[" + maintenanceDate + "] " + notes);
        }
        
        DialysisMachine updatedMachine = machineRepository.save(machine);
        return convertToDTO(updatedMachine);
    }
    
    // Complete maintenance
    public DialysisMachineDTO completeMaintenance(String machineId, String notes) {
        DialysisMachine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new IllegalArgumentException("Machine not found with ID: " + machineId));
        
        machine.setStatus(DialysisMachine.MachineStatus.ACTIVE);
        machine.setLastMaintenance(LocalDate.now());
        machine.setNextMaintenance(LocalDate.now().plusDays(machine.getMaintenanceIntervalDays()));
        
        if (notes != null && !notes.trim().isEmpty()) {
            String existingNotes = machine.getNotes() != null ? machine.getNotes() : "";
            machine.setNotes(existingNotes + "\n[" + LocalDate.now() + "] Maintenance completed: " + notes);
        }
        
        DialysisMachine updatedMachine = machineRepository.save(machine);
        return convertToDTO(updatedMachine);
    }
    
    // Get machine statistics
    public long getMachineCountByStatus(DialysisMachine.MachineStatus status) {
        return machineRepository.countByStatus(status);
    }
    
    // Convert entity to DTO
    private DialysisMachineDTO convertToDTO(DialysisMachine machine) {
        DialysisMachineDTO dto = new DialysisMachineDTO();
        BeanUtils.copyProperties(machine, dto);
        return dto;
    }
    
    // Convert DTO to entity
    private DialysisMachine convertToEntity(DialysisMachineDTO dto) {
        DialysisMachine machine = new DialysisMachine();
        BeanUtils.copyProperties(dto, machine);
        return machine;
    }
}