package com.HMS.HMS.repository.projection;

public interface WardOccupancyProjection {
    String getWardName();
    String getWardType();
    Long getTotalAdmissions();
    Long getActiveAdmissions();
    Double getOccupancyRate();
}