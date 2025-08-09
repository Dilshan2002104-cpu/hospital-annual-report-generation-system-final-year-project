package com.HMS.HMS.service;

import com.HMS.HMS.DTO.PatientDTO.PatientRequestDTO;
import com.HMS.HMS.DTO.PatientDTO.PatientResponseDTO;
import com.HMS.HMS.model.Patient.Patient;
import com.HMS.HMS.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public void addPatient(PatientRequestDTO dto){
        if (patientRepository.existsByNationalId(dto.getNationalId())){
            throw new RuntimeException("Patient with this National ID already exists.");
        }

        Patient patient = new Patient();

        patient.setNationalId(dto.getNationalId());
        patient.setFullName(dto.getFullName());
        patient.setAddress(dto.getAddress());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setContactNumber(dto.getContactNumber());
        patient.setEmergencyContactNumber(dto.getEmergencyContactNumber());
        patient.setGender(dto.getGender());

        patientRepository.save(patient);

    }

    public List<PatientResponseDTO> getAllPatients(){
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }


    private PatientResponseDTO convertToResponseDTO(Patient patient){
        return new PatientResponseDTO(
                patient.getId(),
                patient.getNationalId(),
                patient.getFullName(),
                patient.getAddress(),
                patient.getDateOfBirth(),
                patient.getContactNumber(),
                patient.getEmergencyContactNumber(),
                patient.getGender(),
                patient.getRegistrationDate()
        );
    }
}
