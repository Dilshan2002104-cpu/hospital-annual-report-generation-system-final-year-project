package com.HMS.HMS.repository;

import com.HMS.HMS.model.Admission.Admission;
import com.HMS.HMS.model.Admission.AdmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission,Long> {
    List<Admission> findByPatientNationalId(Long nationalId);

    List<Admission> findByWardWardId(Long wardId);

    List<Admission> findByStatus(AdmissionStatus status);

    @Query("SELECT a FROM Admission a WHERE a.patient.nationalId = :nationalId AND a.status = :status")
    Optional<Admission> findActiveAdmissionByPatient(@Param("nationalId") Long nationalId, @Param("status") AdmissionStatus status);

    @Query("SELECT COUNT(a) FROM Admission a WHERE a.ward.wardId = :wardId AND a.status = 'ACTIVE'")
    int countActiveAdmissionsByWard(@Param("wardId") Long wardId);
}
