package com.HMS.HMS.repository.projection;

public interface ClinicMonthlyVisitsProjection {
    String getUnitName();
    String getMonthName();
    Integer getMonthNumber();
    Integer getVisitCount();
    Integer getTotalUniquePatients();
    Integer getTotalVisits();
}