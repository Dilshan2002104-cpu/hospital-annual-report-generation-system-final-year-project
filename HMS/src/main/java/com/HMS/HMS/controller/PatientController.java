package com.HMS.HMS.controller;

import com.HMS.HMS.DTO.CommonResponseDTO;
import com.HMS.HMS.DTO.PatientDTO.PatientRequestDTO;
import com.HMS.HMS.DTO.PatientDTO.PatientResponseDTO;
import com.HMS.HMS.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/register")
    public CommonResponseDTO addPatient(@RequestBody PatientRequestDTO patientRequestDTO){
        try{
            patientService.addPatient(patientRequestDTO);
            return new CommonResponseDTO(true,"Patient added successfully.");
        }catch (RuntimeException e){
            return new CommonResponseDTO(false,e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity <List<PatientResponseDTO>> getAllPatients(){
        try{
            List<PatientResponseDTO> patients = patientService.getAllPatients();
            return ResponseEntity.ok(patients);
        }catch (Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }
}
