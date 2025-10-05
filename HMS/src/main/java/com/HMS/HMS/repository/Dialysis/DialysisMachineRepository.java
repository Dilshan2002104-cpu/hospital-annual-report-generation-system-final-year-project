package com.HMS.HMS.repository.Dialysis;

import com.HMS.HMS.model.Dialysis.DialysisMachine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DialysisMachineRepository extends JpaRepository<DialysisMachine, String> {
    
    // Find machines by status
    List<DialysisMachine> findByStatus(DialysisMachine.MachineStatus status);
    
    // Find machines by location
    List<DialysisMachine> findByLocation(String location);
    
    // Find machines by manufacturer
    List<DialysisMachine> findByManufacturer(String manufacturer);
    
    // Find machines that need maintenance
    @Query("SELECT m FROM DialysisMachine m WHERE m.nextMaintenance <= :date")
    List<DialysisMachine> findMachinesNeedingMaintenance(@Param("date") LocalDate date);
    
    // Find machines by model
    List<DialysisMachine> findByModel(String model);
    
    // Find active machines (not retired or out of order)
    @Query("SELECT m FROM DialysisMachine m WHERE m.status IN ('ACTIVE', 'MAINTENANCE')")
    List<DialysisMachine> findActiveMachines();
    
    // Search machines by name or ID
    @Query("SELECT m FROM DialysisMachine m WHERE " +
           "LOWER(m.machineName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(m.machineId) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<DialysisMachine> searchMachines(@Param("searchTerm") String searchTerm);
    
    // Check if machine ID exists
    boolean existsByMachineId(String machineId);
    
    // Find machine by ID (case insensitive)
    Optional<DialysisMachine> findByMachineIdIgnoreCase(String machineId);
    
    // Count machines by status
    @Query("SELECT COUNT(m) FROM DialysisMachine m WHERE m.status = :status")
    long countByStatus(@Param("status") DialysisMachine.MachineStatus status);
    
    // Get machine utilization statistics
    @Query("SELECT m.machineId, m.machineName, m.totalHoursUsed FROM DialysisMachine m ORDER BY m.totalHoursUsed DESC")
    List<Object[]> getMachineUtilizationStats();
}