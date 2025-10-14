package com.HMS.HMS.service.MedicationService;

import com.HMS.HMS.DTO.MedicationDTO.ApiResponse;
import com.HMS.HMS.DTO.MedicationDTO.MedicationCompleteResponseDTO;
import com.HMS.HMS.DTO.MedicationDTO.MedicationInventoryApiResponseDTO;
import com.HMS.HMS.DTO.MedicationDTO.MedicationInventoryResponseDTO;
import com.HMS.HMS.DTO.MedicationDTO.MedicationRequestDTO;
import com.HMS.HMS.DTO.MedicationDTO.MedicationResponseDTO;
import com.HMS.HMS.DTO.MedicationDTO.PaginationResponseDTO;
import com.HMS.HMS.DTO.MedicationDTO.StockUpdateResponseDTO;
import com.HMS.HMS.DTO.MedicationDTO.UpdateStockRequestDTO;
import com.HMS.HMS.DTO.MedicationDTO.InventoryAlertsResponseDTO;
import com.HMS.HMS.Exception_Handler.DomainValidationException;
import com.HMS.HMS.Exception_Handler.DuplicateBatchNumberException;
import com.HMS.HMS.model.Medication.Medication;
import com.HMS.HMS.repository.MedicationRepository;
import com.HMS.HMS.util.Sanitizer;
import com.HMS.HMS.websocket.InventoryNotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MedicationServiceImpl implements MedicationService{

    private static final Logger log = LoggerFactory.getLogger(MedicationServiceImpl.class);
    private final MedicationRepository repository;
    private final InventoryNotificationService notificationService;

    public MedicationServiceImpl(MedicationRepository repository, InventoryNotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public MedicationResponseDTO addMedication(MedicationRequestDTO request){
        if (repository.existsByBatchNumber(request.getBatchNumber().trim())){
            throw new DuplicateBatchNumberException(request.getBatchNumber());
        }
        if (request.getExpiryDate() == null || !request.getExpiryDate().isAfter(LocalDate.now())) {
            throw new DomainValidationException("Expiry date must be in the future");
        }
        if (request.getMinimumStock() > request.getMaximumStock()) {
            throw new DomainValidationException("minimumStock must be ≤ maximumStock");
        }

        Medication m = new Medication();
        m.setDrugName(Sanitizer.clean(request.getDrugName()));
        m.setGenericName(Sanitizer.clean(request.getGenericName()));
        m.setCategory(Sanitizer.clean(request.getCategory()));
        m.setStrength(Sanitizer.clean(request.getStrength()));
        m.setDosageForm(Sanitizer.clean(request.getDosageForm()));
        m.setManufacturer(Sanitizer.clean(request.getManufacturer()));
        m.setBatchNumber(Sanitizer.clean(request.getBatchNumber()));
        // Current stock can be 0 for medications added without initial inventory
        m.setCurrentStock(request.getCurrentStock() != null ? request.getCurrentStock() : 0);
        m.setMinimumStock(request.getMinimumStock());
        m.setMaximumStock(request.getMaximumStock());
        m.setUnitCost(request.getUnitCost());
        m.setExpiryDate(request.getExpiryDate());
        m.setIsActive(Boolean.TRUE);

        Medication saved = repository.save(m);
        
        // Send WebSocket notification for new medication
        notificationService.notifyMedicationAdded(saved);
        
        log.info("Medication created: id={}, drugName={}, batch={}, stock={}",
                saved.getId(), saved.getDrugName(), saved.getBatchNumber(), saved.getCurrentStock());

        return new MedicationResponseDTO(saved.getId(), saved.getDrugName(), saved.getBatchNumber(), saved.getCreatedAt());
    }

    @Override
    public Page<MedicationResponseDTO> getAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(e -> new MedicationResponseDTO(e.getId(), e.getDrugName(), e.getBatchNumber(), e.getCreatedAt()));
    }

    @Override
    public Page<MedicationCompleteResponseDTO> getAllComplete(Pageable pageable) {
        return repository.findAll(pageable)
                .map(this::convertToCompleteDTO);
    }

    @Override
    public Page<MedicationResponseDTO> search(String query, String category, Pageable pageable) {
        if (query != null && !query.isBlank() && category != null && !category.isBlank()) {
            return repository.findByDrugNameContainingIgnoreCaseAndCategoryIgnoreCase(query.trim(), category.trim(), pageable)
                    .map(e -> new MedicationResponseDTO(e.getId(), e.getDrugName(), e.getBatchNumber(), e.getCreatedAt()));
        } else if (query != null && !query.isBlank()) {
            return repository.findByDrugNameContainingIgnoreCase(query.trim(), pageable)
                    .map(e -> new MedicationResponseDTO(e.getId(), e.getDrugName(), e.getBatchNumber(), e.getCreatedAt()));
        } else if (category != null && !category.isBlank()) {
            return repository.findByCategoryIgnoreCase(category.trim(), pageable)
                    .map(e -> new MedicationResponseDTO(e.getId(), e.getDrugName(), e.getBatchNumber(), e.getCreatedAt()));
        } else {
            return getAll(pageable);
        }
    }

    @Override
    public MedicationInventoryApiResponseDTO getMedicationInventory(String search, String category, 
                                                                   Boolean lowStock, Integer expiringSoon, 
                                                                   Pageable pageable) {
        try {
            LocalDate expiringDate = null;
            if (expiringSoon != null && expiringSoon > 0) {
                expiringDate = LocalDate.now().plusDays(expiringSoon);
            }

            // Use the comprehensive filter query
            Page<Medication> medicationPage = repository.findMedicationsWithFilters(
                search != null ? search.trim() : null,
                category != null ? category.trim() : null,
                lowStock,
                expiringSoon,
                expiringDate,
                pageable
            );

            // Convert to DTOs
            List<MedicationInventoryResponseDTO> medicationDTOs = medicationPage.getContent().stream()
                    .map(this::convertToInventoryDTO)
                    .collect(Collectors.toList());

            // Create pagination info
            PaginationResponseDTO pagination = new PaginationResponseDTO(
                    medicationPage.getNumber(),
                    medicationPage.getSize(),
                    medicationPage.getTotalElements(),
                    medicationPage.getTotalPages()
            );

            String message = medicationDTOs.isEmpty() ? 
                    "No medications found matching the criteria" : 
                    "Medications retrieved successfully";

            log.info("Retrieved {} medications with filters - search: {}, category: {}, lowStock: {}, expiringSoon: {}", 
                    medicationDTOs.size(), search, category, lowStock, expiringSoon);

            return new MedicationInventoryApiResponseDTO(true, message, medicationDTOs, pagination);

        } catch (Exception e) {
            log.error("Error retrieving medication inventory: {}", e.getMessage(), e);
            throw new DomainValidationException("Failed to retrieve medication inventory: " + e.getMessage());
        }
    }

    private MedicationCompleteResponseDTO convertToCompleteDTO(Medication medication) {
        return new MedicationCompleteResponseDTO(
                medication.getId(),
                medication.getDrugName(),
                medication.getGenericName(),
                medication.getCategory(),
                medication.getStrength(),
                medication.getDosageForm(),
                medication.getManufacturer(),
                medication.getBatchNumber(),
                medication.getCurrentStock(),
                medication.getMinimumStock(),
                medication.getMaximumStock(),
                medication.getUnitCost(),
                medication.getExpiryDate(),
                medication.getCreatedAt(),
                medication.getUpdatedAt(),
                medication.getIsActive()
        );
    }

    private MedicationInventoryResponseDTO convertToInventoryDTO(Medication medication) {
        return new MedicationInventoryResponseDTO(
                medication.getId(),
                medication.getDrugName(),
                medication.getGenericName(),
                medication.getCategory(),
                medication.getStrength(),
                medication.getDosageForm(),
                medication.getManufacturer(),
                medication.getBatchNumber(),
                medication.getCurrentStock(),
                medication.getMinimumStock(),
                medication.getMaximumStock(),
                medication.getUnitCost(),
                medication.getExpiryDate(),
                medication.getCreatedAt(),
                medication.getUpdatedAt(),
                medication.getIsActive()
        );
    }

    @Override
    @Transactional
    public ApiResponse<StockUpdateResponseDTO> updateStock(Long medicationId, UpdateStockRequestDTO request) {
        try {
            log.info("Adding stock for medication ID: {} with quantity: {}", medicationId, request.getNewStock());
            
            // Validate input parameters
            if (medicationId == null) {
                throw new DomainValidationException("Medication ID cannot be null");
            }
            
            if (request.getNewStock() == null) {
                throw new DomainValidationException("Stock quantity to add is required");
            }
            
            if (request.getNewStock() < 0) {
                throw new DomainValidationException("Stock quantity to add cannot be negative");
            }
            
            if (request.getNewStock() > 999999) {
                throw new DomainValidationException("Stock quantity to add seems too high (max: 999,999)");
            }
            
            // Find the medication
            Optional<Medication> medicationOpt = repository.findById(medicationId);
            if (medicationOpt.isEmpty()) {
                throw new DomainValidationException("Medication not found with ID: " + medicationId);
            }
            
            Medication medication = medicationOpt.get();
            
            // Validate batch number if provided
            if (request.getBatchNumber() != null && !request.getBatchNumber().trim().isEmpty()) {
                String batchNumber = request.getBatchNumber().trim();
                
                if (batchNumber.length() < 3) {
                    throw new DomainValidationException("Batch number must be at least 3 characters long");
                }
                
                if (!batchNumber.matches("^[A-Z0-9]+$")) {
                    throw new DomainValidationException("Batch number should contain only letters and numbers");
                }
                
                // Check if batch number already exists for a different medication
                if (repository.existsByBatchNumberAndIdNot(batchNumber, medicationId)) {
                    throw new DuplicateBatchNumberException(batchNumber);
                }
                
                // Update batch number if provided
                medication.setBatchNumber(Sanitizer.clean(batchNumber));
            }
            
            // Add the new stock quantity to current stock (instead of replacing)
            Integer currentStock = medication.getCurrentStock();
            Integer newTotalStock = currentStock + request.getNewStock();
            
            // Validate against medication limits after adding
            if (newTotalStock > medication.getMaximumStock()) {
                throw new DomainValidationException(
                    "Adding " + request.getNewStock() + " units would exceed maximum limit (" + 
                    medication.getMaximumStock() + "). Current stock: " + currentStock
                );
            }
            
            medication.setCurrentStock(newTotalStock);
            
            // Save the updated medication (updatedAt will be set automatically by @UpdateTimestamp)
            Medication savedMedication = repository.save(medication);
            
            // Send WebSocket notification for real-time updates
            notificationService.notifyStockUpdated(savedMedication, currentStock, newTotalStock);
            
            // Check for low stock and send alert if needed
            if (newTotalStock <= savedMedication.getMinimumStock()) {
                notificationService.notifyLowStock(savedMedication);
            }
            
            log.info("Successfully added {} units to medication ID: {} (from {} to {})", 
                    request.getNewStock(), medicationId, currentStock, newTotalStock);
            
            // Convert to response DTO with stock information
            StockUpdateResponseDTO responseDTO = new StockUpdateResponseDTO(
                savedMedication.getId(), 
                savedMedication.getDrugName(), 
                savedMedication.getBatchNumber(), 
                newTotalStock,  // currentStock
                currentStock,   // previousStock
                newTotalStock <= savedMedication.getMinimumStock(), // isLowStock
                savedMedication.getUpdatedAt() // lastUpdated
            );
            
            return new ApiResponse<>(
                true, 
                "Stock added successfully", 
                responseDTO
            );
            
        } catch (DomainValidationException | DuplicateBatchNumberException e) {
            log.warn("Validation error updating stock for medication ID {}: {}", medicationId, e.getMessage());
            return new ApiResponse<>(false, e.getMessage(), null);
        } catch (Exception e) {
            log.error("Unexpected error updating stock for medication ID {}: {}", medicationId, e.getMessage(), e);
            return new ApiResponse<>(false, "Failed to update stock: " + e.getMessage(), null);
        }
    }
    
    @Override
    public InventoryAlertsResponseDTO getInventoryAlerts() {
        return getInventoryAlerts(90); // Default to 90 days (3 months) for near expiry
    }
    
    @Override
    public InventoryAlertsResponseDTO getInventoryAlerts(Integer daysUntilExpiry) {
        LocalDate currentDate = LocalDate.now();
        LocalDate futureDate = currentDate.plusDays(daysUntilExpiry);
        
        // Fetch different types of alerts
        List<Medication> expiredMedications = repository.findExpiredMedications(currentDate);
        List<Medication> nearExpiryMedications = repository.findNearExpiryMedications(currentDate, futureDate);
        List<Medication> outOfStockMedications = repository.findOutOfStockMedications();
        List<Medication> lowStockMedications = repository.findLowStockMedicationsForAlerts();
        
        // Convert to DTOs
        List<InventoryAlertsResponseDTO.MedicationAlertDTO> expiredDTOs = expiredMedications.stream()
            .map(med -> createMedicationAlertDTO(med, "EXPIRED", calculateDaysUntilExpiry(med.getExpiryDate(), currentDate), "HIGH"))
            .collect(Collectors.toList());
            
        List<InventoryAlertsResponseDTO.MedicationAlertDTO> nearExpiryDTOs = nearExpiryMedications.stream()
            .map(med -> createMedicationAlertDTO(med, "NEAR_EXPIRY", calculateDaysUntilExpiry(med.getExpiryDate(), currentDate), "MEDIUM"))
            .collect(Collectors.toList());
            
        List<InventoryAlertsResponseDTO.MedicationAlertDTO> outOfStockDTOs = outOfStockMedications.stream()
            .map(med -> createMedicationAlertDTO(med, "OUT_OF_STOCK", null, "HIGH"))
            .collect(Collectors.toList());
            
        List<InventoryAlertsResponseDTO.MedicationAlertDTO> lowStockDTOs = lowStockMedications.stream()
            .map(med -> createMedicationAlertDTO(med, "LOW_STOCK", null, "MEDIUM"))
            .collect(Collectors.toList());
        
        // Create summary
        InventoryAlertsResponseDTO.AlertSummaryDTO summary = new InventoryAlertsResponseDTO.AlertSummaryDTO(
            expiredDTOs.size() + nearExpiryDTOs.size() + outOfStockDTOs.size() + lowStockDTOs.size(),
            expiredDTOs.size(),
            nearExpiryDTOs.size(),
            outOfStockDTOs.size(),
            lowStockDTOs.size(),
            expiredDTOs.size() + outOfStockDTOs.size(), // High priority
            nearExpiryDTOs.size() + lowStockDTOs.size(), // Medium priority
            0 // Low priority
        );
        
        return new InventoryAlertsResponseDTO(expiredDTOs, nearExpiryDTOs, outOfStockDTOs, lowStockDTOs, summary);
    }
    
    private InventoryAlertsResponseDTO.MedicationAlertDTO createMedicationAlertDTO(
            Medication medication, String alertType, Integer daysUntilExpiry, String priority) {
        return new InventoryAlertsResponseDTO.MedicationAlertDTO(
            medication.getId(),
            medication.getDrugName(),
            medication.getGenericName(),
            medication.getCategory(),
            medication.getStrength(),
            medication.getBatchNumber(),
            medication.getCurrentStock(),
            medication.getMinimumStock(),
            medication.getMaximumStock(),
            medication.getExpiryDate(),
            alertType,
            daysUntilExpiry,
            priority
        );
    }
    
    private Integer calculateDaysUntilExpiry(LocalDate expiryDate, LocalDate currentDate) {
        if (expiryDate == null) return null;
        return (int) ChronoUnit.DAYS.between(currentDate, expiryDate);
    }
}
