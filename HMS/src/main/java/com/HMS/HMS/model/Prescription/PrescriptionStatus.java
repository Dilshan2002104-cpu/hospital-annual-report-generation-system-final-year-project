package com.HMS.HMS.model.Prescription;

public enum PrescriptionStatus {
    PENDING,        // Newly created prescription waiting for pharmacy processing
    ACTIVE,         // Approved and active prescription
    IN_PROGRESS,    // Being processed by pharmacy
    READY,          // Ready for dispensing
    COMPLETED,      // Medication dispensed/completed
    DISCONTINUED,   // Cancelled or discontinued
    EXPIRED         // Expired prescription
}