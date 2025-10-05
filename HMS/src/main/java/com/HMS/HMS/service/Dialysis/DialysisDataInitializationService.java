package com.HMS.HMS.service.Dialysis;

import com.HMS.HMS.model.Dialysis.DialysisMachine;
import com.HMS.HMS.repository.Dialysis.DialysisMachineRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class DialysisDataInitializationService {
    
    private final DialysisMachineRepository machineRepository;
    
    @Autowired
    public DialysisDataInitializationService(DialysisMachineRepository machineRepository) {
        this.machineRepository = machineRepository;
    }
    
    @PostConstruct
    public void initializeDialysisData() {
        // Only initialize if no machines exist
        if (machineRepository.count() == 0) {
            createSampleMachines();
        }
    }
    
    private void createSampleMachines() {
        List<DialysisMachine> sampleMachines = Arrays.asList(
            createMachine("M001", "Fresenius 4008S - Unit 1", "4008S", "Fresenius", "Room A-101", DialysisMachine.MachineStatus.ACTIVE, 245),
            createMachine("M002", "Fresenius 4008S - Unit 2", "4008S", "Fresenius", "Room A-102", DialysisMachine.MachineStatus.ACTIVE, 198),
            createMachine("M003", "B.Braun Dialog+ - Unit 3", "Dialog+", "B.Braun", "Room A-103", DialysisMachine.MachineStatus.ACTIVE, 312),
            createMachine("M004", "Fresenius 5008S - Unit 4", "5008S", "Fresenius", "Room A-104", DialysisMachine.MachineStatus.MAINTENANCE, 89),
            createMachine("M005", "Gambro Phoenix - Unit 5", "Phoenix", "Gambro", "Room B-101", DialysisMachine.MachineStatus.ACTIVE, 176),
            createMachine("M006", "Fresenius 4008S - Unit 6", "4008S", "Fresenius", "Room B-102", DialysisMachine.MachineStatus.OUT_OF_ORDER, 203),
            createMachine("M007", "B.Braun Dialog+ - Unit 7", "Dialog+", "B.Braun", "Room B-103", DialysisMachine.MachineStatus.ACTIVE, 134),
            createMachine("M008", "Fresenius 5008S - Unit 8", "5008S", "Fresenius", "Room B-104", DialysisMachine.MachineStatus.ACTIVE, 267)
        );
        
        machineRepository.saveAll(sampleMachines);
        System.out.println("✅ Initialized " + sampleMachines.size() + " sample dialysis machines");
    }
    
    private DialysisMachine createMachine(String machineId, String machineName, String model, 
                                        String manufacturer, String location, 
                                        DialysisMachine.MachineStatus status, int totalHoursUsed) {
        DialysisMachine machine = new DialysisMachine();
        machine.setMachineId(machineId);
        machine.setMachineName(machineName);
        machine.setModel(model);
        machine.setManufacturer(manufacturer);
        machine.setLocation(location);
        machine.setStatus(status);
        machine.setInstallationDate(LocalDate.now().minusYears(2).plusDays((int)(Math.random() * 365)));
        machine.setLastMaintenance(LocalDate.now().minusDays((int)(Math.random() * 60) + 10));
        machine.setNextMaintenance(machine.getLastMaintenance().plusDays(90));
        machine.setMaintenanceIntervalDays(90);
        machine.setTotalHoursUsed(totalHoursUsed);
        machine.setNotes("Initialized machine for dialysis operations");
        
        return machine;
    }
}