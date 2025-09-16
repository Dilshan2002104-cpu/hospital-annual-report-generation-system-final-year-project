package com.HMS.HMS.repository.reports;

import com.HMS.HMS.model.Appointment.Appointment;
import com.HMS.HMS.repository.projection.ClinicMonthlyVisitsProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicStatisticsRepository extends JpaRepository<Appointment, Long> {

    @Query(value = """
        SELECT
            d.specialization as unitName,
            MONTHNAME(a.appointment_date) as monthName,
            MONTH(a.appointment_date) as monthNumber,
            COUNT(a.appointment_id) as visitCount
        FROM appointments a
        INNER JOIN doctors d ON a.doctor_employee_id = d.employee_id
        WHERE YEAR(a.appointment_date) = :year
        AND a.status = 'COMPLETED'
        GROUP BY d.specialization, MONTH(a.appointment_date), MONTHNAME(a.appointment_date)
        ORDER BY d.specialization, MONTH(a.appointment_date)
        """, nativeQuery = true)
    List<ClinicMonthlyVisitsProjection> findClinicVisitsByYear(@Param("year") int year);

    @Query(value = """
        SELECT
            d.specialization as unitName,
            COUNT(DISTINCT p.national_id) as totalUniquePatients,
            COUNT(a.appointment_id) as totalVisits
        FROM appointments a
        INNER JOIN doctors d ON a.doctor_employee_id = d.employee_id
        INNER JOIN patient p ON a.patient_national_id = p.national_id
        WHERE YEAR(a.appointment_date) = :year
        AND a.status = 'COMPLETED'
        GROUP BY d.specialization
        """, nativeQuery = true)
    List<ClinicMonthlyVisitsProjection> findClinicSummaryByYear(@Param("year") int year);
}