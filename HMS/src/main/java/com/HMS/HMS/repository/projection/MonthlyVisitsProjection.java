package com.HMS.HMS.repository.projection;

public interface MonthlyVisitsProjection {
    Integer getMonth();
    Long getVisitCount();
    String getUnitType();
}