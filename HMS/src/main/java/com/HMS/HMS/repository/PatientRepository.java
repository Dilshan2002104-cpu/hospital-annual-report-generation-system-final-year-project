package com.HMS.HMS.repository;

import com.HMS.HMS.model.Patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient,Long> {
    boolean existsByNationalId(Long nationalId);
    Patient findByNationalId(Long nationalId);
    List<Patient> findByFullNameContainingIgnoreCase(String name);
    Optional<Patient> findByContactNumber(String contactNumber);
    List<Patient> findByGender(String gender);

}
