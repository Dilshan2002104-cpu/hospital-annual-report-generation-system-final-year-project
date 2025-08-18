package com.HMS.HMS.model.Patient;

import com.HMS.HMS.model.Appointment.Appointment;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Patient {

    @Id
    @Column(unique = true, nullable = false)
    private Long nationalId;

    private String fullName;
    private String address;
    private LocalDate dateOfBirth;
    private String contactNumber;
    private String emergencyContactNumber;
    private String gender;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime registrationDate;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("patient-appointments") // This prevents circular reference
    private List<Appointment> appointments = new ArrayList<>();

    public Patient() {
    }

    public Patient(Long nationalId, String fullName, String address, LocalDate dateOfBirth,
                   String contactNumber, String emergencyContactNumber, String gender) {
        this.nationalId = nationalId;
        this.fullName = fullName;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.contactNumber = contactNumber;
        this.emergencyContactNumber = emergencyContactNumber;
        this.gender = gender;
    }

    public void addAppointment(Appointment appointment){
        appointments.add(appointment);
        appointment.setPatient(this);
    }

    public void removeAppointment(Appointment appointment){
        appointments.remove(appointment);
        appointment.setPatient(null);
    }

    // Getters and Setters
    public Long getNationalId() {
        return nationalId;
    }

    public void setNationalId(Long nationalId) {
        this.nationalId = nationalId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmergencyContactNumber() {
        return emergencyContactNumber;
    }

    public void setEmergencyContactNumber(String emergencyContactNumber) {
        this.emergencyContactNumber = emergencyContactNumber;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public List<Appointment> getAppointments(){
        return appointments;
    }

    public void setAppointments(List<Appointment> appointments){
        this.appointments = appointments;
    }
}