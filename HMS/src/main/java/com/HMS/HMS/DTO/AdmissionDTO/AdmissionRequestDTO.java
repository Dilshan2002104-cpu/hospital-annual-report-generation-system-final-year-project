package com.HMS.HMS.DTO.AdmissionDTO;

public class AdmissionRequestDTO {
    private String patientNationalId;
    private Long wardId;
    private String bedNumber;


    // Constructors
    public AdmissionRequestDTO() {}

    public AdmissionRequestDTO(String patientNationalId, Long wardId, String bedNumber) {
        this.patientNationalId = patientNationalId;
        this.wardId = wardId;
        this.bedNumber = bedNumber;
    }

    // Getters and Setters
    public String getPatientNationalId() {
        return patientNationalId;
    }

    public void setPatientNationalId(String patientNationalId) {
        this.patientNationalId = patientNationalId;
    }

    public Long getWardId() {
        return wardId;
    }

    public void setWardId(Long wardId) {
        this.wardId = wardId;
    }

    public String getBedNumber(){
        return bedNumber;
    }

    public void setBedNumber(String bedNumber){
        this.bedNumber = bedNumber;
    }

}
