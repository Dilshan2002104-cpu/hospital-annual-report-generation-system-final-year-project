package com.HMS.HMS.model.doctor;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    private Long employeeId;

    private String doctorName;
    private String specialization;

    public Doctor() {
    }

    public Doctor(Long employeeId, String doctorName, String specialization) {
        this.employeeId = employeeId;
        this.doctorName = doctorName;
        this.specialization = specialization;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
}
