package com.HMS.HMS.repository;

import com.HMS.HMS.model.Pharmacy.MedicineDispenseItem;
import com.HMS.HMS.model.Pharmacy.MedicineDispenseRequest;
import com.HMS.HMS.model.Medication.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineDispenseItemRepository extends JpaRepository<MedicineDispenseItem, Long> {

    // Find by dispense request
    List<MedicineDispenseItem> findByDispenseRequest(MedicineDispenseRequest dispenseRequest);
    
    List<MedicineDispenseItem> findByDispenseRequestId(Long dispenseRequestId);

    // Find by medication
    List<MedicineDispenseItem> findByMedication(Medication medication);
    
    List<MedicineDispenseItem> findByMedicationId(Long medicationId);

    // Find by item status
    List<MedicineDispenseItem> findByItemStatus(MedicineDispenseItem.ItemStatus itemStatus);

    // Find by dispense request and medication
    List<MedicineDispenseItem> findByDispenseRequestAndMedication(MedicineDispenseRequest dispenseRequest, Medication medication);

    // Find out of stock items
    List<MedicineDispenseItem> findByItemStatusIn(List<MedicineDispenseItem.ItemStatus> statuses);

    // Find items that need dispensing
    @Query("SELECT di FROM MedicineDispenseItem di WHERE di.itemStatus IN ('AVAILABLE', 'PARTIALLY_AVAILABLE') AND di.dispensedQuantity < di.requestedQuantity")
    List<MedicineDispenseItem> findItemsNeedingDispensing();

    // Find partially dispensed items
    @Query("SELECT di FROM MedicineDispenseItem di WHERE di.dispensedQuantity > 0 AND di.dispensedQuantity < di.requestedQuantity")
    List<MedicineDispenseItem> findPartiallyDispensedItems();

    // Find items by medication name (case insensitive)
    @Query("SELECT di FROM MedicineDispenseItem di WHERE LOWER(di.medication.drugName) LIKE LOWER(CONCAT('%', :medicationName, '%'))")
    List<MedicineDispenseItem> findByMedicationNameContaining(@Param("medicationName") String medicationName);

    // Get total quantity requested for a medication
    @Query("SELECT COALESCE(SUM(di.requestedQuantity), 0) FROM MedicineDispenseItem di WHERE di.medication.id = :medicationId AND di.dispenseRequest.status NOT IN ('CANCELLED')")
    Long getTotalRequestedQuantityForMedication(@Param("medicationId") Long medicationId);

    // Get total quantity dispensed for a medication
    @Query("SELECT COALESCE(SUM(di.dispensedQuantity), 0) FROM MedicineDispenseItem di WHERE di.medication.id = :medicationId AND di.dispenseRequest.status NOT IN ('CANCELLED')")
    Long getTotalDispensedQuantityForMedication(@Param("medicationId") Long medicationId);

    // Find items requiring substitution
    @Query("SELECT di FROM MedicineDispenseItem di WHERE di.itemStatus = 'OUT_OF_STOCK' AND di.substitutionReason IS NULL")
    List<MedicineDispenseItem> findItemsRequiringSubstitution();
}