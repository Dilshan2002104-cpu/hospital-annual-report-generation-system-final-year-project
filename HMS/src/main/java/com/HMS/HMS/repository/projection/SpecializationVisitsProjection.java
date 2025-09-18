package com.HMS.HMS.repository.projection;

public interface SpecializationVisitsProjection {
    String getSpecialization();
    Long getVisitCount();
    Double getAverageVisitsPerMonth();
}