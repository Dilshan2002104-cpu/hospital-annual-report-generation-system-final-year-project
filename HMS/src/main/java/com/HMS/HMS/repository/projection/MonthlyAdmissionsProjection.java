package com.HMS.HMS.repository.projection;

public interface MonthlyAdmissionsProjection {
    Long getWardId();
    String getWardName();
    String getMonth();
    Long getTotalAdmissions();
}
