package com.HMS.HMS.service.PharmacyService;

import com.HMS.HMS.DTO.PharmacyDTO.MedicineDispenseRequestDTO;
import com.HMS.HMS.DTO.PharmacyDTO.MedicineDispenseResponseDTO;
import com.HMS.HMS.model.Medication.Medication;
import com.HMS.HMS.model.Pharmacy.MedicineDispenseItem;
import com.HMS.HMS.model.Pharmacy.MedicineDispenseRequest;
import com.HMS.HMS.model.Prescription.Prescription;
import com.HMS.HMS.repository.MedicationRepository;
import com.HMS.HMS.repository.MedicineDispenseItemRepository;
import com.HMS.HMS.repository.MedicineDispenseRequestRepository;
import com.HMS.HMS.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MedicineDispenseService {

    @Autowired
    private MedicineDispenseRequestRepository dispenseRequestRepository;

    @Autowired
    private MedicineDispenseItemRepository dispenseItemRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    // Create new dispense request
    public MedicineDispenseResponseDTO createDispenseRequest(MedicineDispenseRequestDTO requestDTO) {
        // Validate prescription exists
        Prescription prescription = prescriptionRepository.findById(requestDTO.getPrescriptionId())
                .orElseThrow(() -> new RuntimeException("Prescription not found with ID: " + requestDTO.getPrescriptionId()));

        // Generate unique request ID
        String requestId = generateRequestId();

        // Create dispense request entity
        MedicineDispenseRequest dispenseRequest = new MedicineDispenseRequest(
                requestId,
                prescription,
                requestDTO.getRequestedBy(),
                requestDTO.getWardLocation(),
                requestDTO.getDeliveryLocation(),
                requestDTO.getUrgencyLevel(),
                requestDTO.getRequestNotes()
        );

        // Save the request first to get the ID
        dispenseRequest = dispenseRequestRepository.save(dispenseRequest);

        // Create dispense items
        BigDecimal totalCost = BigDecimal.ZERO;
        for (MedicineDispenseRequestDTO.DispenseItemRequestDTO itemDTO : requestDTO.getMedications()) {
            Medication medication = medicationRepository.findById(itemDTO.getMedicationId())
                    .orElseThrow(() -> new RuntimeException("Medication not found with ID: " + itemDTO.getMedicationId()));

            MedicineDispenseItem dispenseItem = new MedicineDispenseItem(
                    dispenseRequest,
                    medication,
                    itemDTO.getQuantity(),
                    itemDTO.getDosageInstructions()
            );

            // Check stock availability
            if (medication.getCurrentStock() >= itemDTO.getQuantity()) {
                dispenseItem.setItemStatus(MedicineDispenseItem.ItemStatus.AVAILABLE);
            } else if (medication.getCurrentStock() > 0) {
                dispenseItem.setItemStatus(MedicineDispenseItem.ItemStatus.PARTIALLY_AVAILABLE);
            } else {
                dispenseItem.setItemStatus(MedicineDispenseItem.ItemStatus.OUT_OF_STOCK);
            }

            dispenseRequest.addDispenseItem(dispenseItem);
            totalCost = totalCost.add(dispenseItem.getTotalPrice());
        }

        // Save the complete request with items
        dispenseRequest = dispenseRequestRepository.save(dispenseRequest);

        return convertToResponseDTO(dispenseRequest, totalCost);
    }

    // Get dispense request by ID
    public Optional<MedicineDispenseResponseDTO> getDispenseRequestById(Long id) {
        return dispenseRequestRepository.findById(id)
                .map(request -> convertToResponseDTO(request, calculateTotalCost(request)));
    }

    // Get dispense request by request ID
    public Optional<MedicineDispenseResponseDTO> getDispenseRequestByRequestId(String requestId) {
        return dispenseRequestRepository.findByRequestId(requestId)
                .map(request -> convertToResponseDTO(request, calculateTotalCost(request)));
    }

    // Get dispense requests by prescription ID
    public List<MedicineDispenseResponseDTO> getDispenseRequestsByPrescriptionId(Long prescriptionId) {
        return dispenseRequestRepository.findByPrescriptionId(prescriptionId)
                .stream()
                .map(request -> convertToResponseDTO(request, calculateTotalCost(request)))
                .collect(Collectors.toList());
    }

    // Get pending requests for pharmacy
    public Page<MedicineDispenseResponseDTO> getPendingRequests(Pageable pageable) {
        List<MedicineDispenseRequest.DispenseStatus> pendingStatuses = Arrays.asList(
                MedicineDispenseRequest.DispenseStatus.PENDING,
                MedicineDispenseRequest.DispenseStatus.PROCESSING,
                MedicineDispenseRequest.DispenseStatus.PREPARED
        );

        return dispenseRequestRepository.findPendingRequests(pendingStatuses, pageable)
                .map(request -> convertToResponseDTO(request, calculateTotalCost(request)));
    }

    // Get urgent requests
    public List<MedicineDispenseResponseDTO> getUrgentRequests() {
        return dispenseRequestRepository.findUrgentRequests()
                .stream()
                .map(request -> convertToResponseDTO(request, calculateTotalCost(request)))
                .collect(Collectors.toList());
    }

    // Update dispense request status
    public MedicineDispenseResponseDTO updateDispenseStatus(Long requestId, MedicineDispenseRequest.DispenseStatus newStatus, String processedBy, String pharmacyNotes) {
        MedicineDispenseRequest request = dispenseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Dispense request not found with ID: " + requestId));

        request.setStatus(newStatus);
        request.setProcessedBy(processedBy);
        if (pharmacyNotes != null) {
            request.setPharmacyNotes(pharmacyNotes);
        }

        // Set timestamps based on status
        LocalDateTime now = LocalDateTime.now();
        switch (newStatus) {
            case PROCESSING:
                request.setProcessedAt(now);
                break;
            case DISPATCHED:
                request.setDispatchedAt(now);
                break;
            case DELIVERED:
                request.setDeliveredAt(now);
                break;
            case PENDING:
            case PREPARED:
            case CANCELLED:
            case PARTIALLY_DISPENSED:
                // No specific timestamp for these statuses
                break;
        }

        request = dispenseRequestRepository.save(request);
        return convertToResponseDTO(request, calculateTotalCost(request));
    }

    // Dispense medication items
    public MedicineDispenseResponseDTO dispenseMedications(Long requestId, List<Long> itemIds, List<Integer> quantities, String processedBy) {
        MedicineDispenseRequest request = dispenseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Dispense request not found with ID: " + requestId));

        for (int i = 0; i < itemIds.size(); i++) {
            Long itemId = itemIds.get(i);
            Integer quantity = quantities.get(i);

            MedicineDispenseItem item = dispenseItemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Dispense item not found with ID: " + itemId));

            // Validate and dispense
            if (quantity > item.getRemainingQuantity()) {
                throw new RuntimeException("Cannot dispense more than remaining quantity for item: " + itemId);
            }

            // Update medication stock
            Medication medication = item.getMedication();
            if (medication.getCurrentStock() < quantity) {
                throw new RuntimeException("Insufficient stock for medication: " + medication.getDrugName());
            }

            medication.setCurrentStock(medication.getCurrentStock() - quantity);
            medicationRepository.save(medication);

            // Update dispense item
            item.dispense(quantity);
            dispenseItemRepository.save(item);
        }

        // Update request status if all items are dispensed
        boolean allItemsDispensed = request.getDispenseItems().stream()
                .allMatch(MedicineDispenseItem::isFullyDispensed);

        if (allItemsDispensed) {
            request.setStatus(MedicineDispenseRequest.DispenseStatus.PREPARED);
        } else {
            request.setStatus(MedicineDispenseRequest.DispenseStatus.PARTIALLY_DISPENSED);
        }

        request.setProcessedBy(processedBy);
        request.setProcessedAt(LocalDateTime.now());
        request = dispenseRequestRepository.save(request);

        return convertToResponseDTO(request, calculateTotalCost(request));
    }

    // Cancel dispense request
    public MedicineDispenseResponseDTO cancelDispenseRequest(Long requestId, String reason) {
        MedicineDispenseRequest request = dispenseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Dispense request not found with ID: " + requestId));

        if (!request.canBeCancelled()) {
            throw new RuntimeException("Request cannot be cancelled in current status: " + request.getStatus());
        }

        request.setStatus(MedicineDispenseRequest.DispenseStatus.CANCELLED);
        request.setPharmacyNotes(request.getPharmacyNotes() + "\nCancellation reason: " + reason);

        request = dispenseRequestRepository.save(request);
        return convertToResponseDTO(request, calculateTotalCost(request));
    }

    // Get requests by status
    public Page<MedicineDispenseResponseDTO> getRequestsByStatus(MedicineDispenseRequest.DispenseStatus status, Pageable pageable) {
        return dispenseRequestRepository.findByStatus(status, pageable)
                .map(request -> convertToResponseDTO(request, calculateTotalCost(request)));
    }

    // Search requests
    public Page<MedicineDispenseResponseDTO> searchRequests(
            MedicineDispenseRequest.DispenseStatus status,
            MedicineDispenseRequest.UrgencyLevel urgencyLevel,
            String wardLocation,
            String requestedBy,
            Pageable pageable) {

        return dispenseRequestRepository.findBySearchCriteria(status, urgencyLevel, wardLocation, requestedBy, pageable)
                .map(request -> convertToResponseDTO(request, calculateTotalCost(request)));
    }

    // Helper methods
    private String generateRequestId() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "DR" + timestamp;
    }

    private BigDecimal calculateTotalCost(MedicineDispenseRequest request) {
        return request.getDispenseItems().stream()
                .map(MedicineDispenseItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private MedicineDispenseResponseDTO convertToResponseDTO(MedicineDispenseRequest request, BigDecimal totalCost) {
        MedicineDispenseResponseDTO dto = new MedicineDispenseResponseDTO();

        dto.setId(request.getId());
        dto.setRequestId(request.getRequestId());
        dto.setPrescriptionId(request.getPrescription().getId());
        dto.setPrescriptionNumber(request.getPrescription().getPrescriptionId());
        dto.setPatientName(request.getPrescription().getPatient().getFirstName() + " " + request.getPrescription().getPatient().getLastName());
        dto.setPatientId(request.getPrescription().getPatient().getNationalId());
        dto.setRequestedBy(request.getRequestedBy());
        dto.setWardLocation(request.getWardLocation());
        dto.setDeliveryLocation(request.getDeliveryLocation());
        dto.setUrgencyLevel(request.getUrgencyLevel());
        dto.setStatus(request.getStatus());
        dto.setRequestNotes(request.getRequestNotes());
        dto.setPharmacyNotes(request.getPharmacyNotes());
        dto.setProcessedBy(request.getProcessedBy());
        dto.setProcessedAt(request.getProcessedAt());
        dto.setDispatchedAt(request.getDispatchedAt());
        dto.setDeliveredAt(request.getDeliveredAt());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        dto.setTotalCost(totalCost);

        // Convert dispense items
        List<MedicineDispenseResponseDTO.DispenseItemResponseDTO> itemDTOs = request.getDispenseItems().stream()
                .map(this::convertToItemResponseDTO)
                .collect(Collectors.toList());
        dto.setDispenseItems(itemDTOs);

        return dto;
    }

    private MedicineDispenseResponseDTO.DispenseItemResponseDTO convertToItemResponseDTO(MedicineDispenseItem item) {
        MedicineDispenseResponseDTO.DispenseItemResponseDTO dto = new MedicineDispenseResponseDTO.DispenseItemResponseDTO();

        dto.setId(item.getId());
        dto.setMedicationId(item.getMedication().getId());
        dto.setMedicationName(item.getMedication().getDrugName());
        dto.setGenericName(item.getMedication().getGenericName());
        dto.setStrength(item.getMedication().getStrength());
        dto.setDosageForm(item.getMedication().getDosageForm());
        dto.setRequestedQuantity(item.getRequestedQuantity());
        dto.setDispensedQuantity(item.getDispensedQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        dto.setItemStatus(item.getItemStatus());
        dto.setDosageInstructions(item.getDosageInstructions());
        dto.setPharmacyNotes(item.getPharmacyNotes());
        dto.setSubstitutionReason(item.getSubstitutionReason());

        return dto;
    }
}