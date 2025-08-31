package com.HMS.HMS.DTO.reports;

public class MonthlyAdmissionsRowDTO {
    private Long wardId;
    private String wardName;
    private String month;
    private Long totalAdmissions;

    private MonthlyAdmissionsRowDTO(){

    }

    public MonthlyAdmissionsRowDTO(Long wardId, String wardName, String month, Long totalAdmissions) {
        this.wardId = wardId;
        this.wardName = wardName;
        this.month = month;
        this.totalAdmissions = totalAdmissions;
    }


    public Long getWardId() {
        return wardId;
    }

    public void setWardId(Long wardId) {
        this.wardId = wardId;
    }

    public String getWardName() {
        return wardName;
    }

    public void setWardName(String wardName) {
        this.wardName = wardName;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Long getTotalAdmissions() {
        return totalAdmissions;
    }

    public void setTotalAdmissions(Long totalAdmissions) {
        this.totalAdmissions = totalAdmissions;
    }
}
