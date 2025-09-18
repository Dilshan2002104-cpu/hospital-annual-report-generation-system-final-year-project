package com.HMS.HMS.DTO.reports;

public class MonthlyVisitDTO {
    private String month;
    private int monthNumber;
    private Long visitCount;

    public MonthlyVisitDTO() {}

    public MonthlyVisitDTO(String month, int monthNumber, Long visitCount) {
        this.month = month;
        this.monthNumber = monthNumber;
        this.visitCount = visitCount != null ? visitCount : 0L;
    }

    // Constructor for JPA query results
    public MonthlyVisitDTO(int monthNumber, Long visitCount) {
        this.monthNumber = monthNumber;
        this.visitCount = visitCount != null ? visitCount : 0L;
        this.month = getMonthName(monthNumber);
    }

    private String getMonthName(int monthNumber) {
        String[] months = {"Jan", "Feb", "Mar", "April", "May", "June",
                          "July", "Aug", "Sep", "Oct", "Nov", "Dec"};
        return months[monthNumber - 1];
    }

    // Getters and Setters
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public int getMonthNumber() {
        return monthNumber;
    }

    public void setMonthNumber(int monthNumber) {
        this.monthNumber = monthNumber;
    }

    public Long getVisitCount() {
        return visitCount;
    }

    public void setVisitCount(Long visitCount) {
        this.visitCount = visitCount;
    }
}