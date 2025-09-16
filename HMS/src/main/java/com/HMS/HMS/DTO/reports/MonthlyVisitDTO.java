package com.HMS.HMS.DTO.reports;

public class MonthlyVisitDTO {
    private String month;
    private Integer visitCount;
    private Integer monthNumber;

    // Constructors
    public MonthlyVisitDTO() {}

    public MonthlyVisitDTO(String month, Integer visitCount, Integer monthNumber) {
        this.month = month;
        this.visitCount = visitCount;
        this.monthNumber = monthNumber;
    }

    // Getters and Setters
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public Integer getVisitCount() { return visitCount; }
    public void setVisitCount(Integer visitCount) { this.visitCount = visitCount; }

    public Integer getMonthNumber() { return monthNumber; }
    public void setMonthNumber(Integer monthNumber) { this.monthNumber = monthNumber; }
}