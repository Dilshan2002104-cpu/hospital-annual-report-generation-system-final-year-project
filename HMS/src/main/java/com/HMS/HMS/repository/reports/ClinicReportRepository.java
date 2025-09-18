package com.HMS.HMS.repository.reports;

import com.HMS.HMS.repository.projection.MonthlyVisitsProjection;
import com.HMS.HMS.repository.projection.SpecializationVisitsProjection;
import com.HMS.HMS.repository.projection.WardOccupancyProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicReportRepository extends JpaRepository<com.HMS.HMS.model.Appointment.Appointment, Long> {

    @Query(value = """
        SELECT
            MONTH(a.appointment_date) as month,
            COUNT(*) as visitCount,
            d.specialization as unitType
        FROM appointments a
        JOIN doctors d ON a.doctor_employee_id = d.employee_id
        WHERE YEAR(a.appointment_date) = :year
        GROUP BY MONTH(a.appointment_date), d.specialization
        ORDER BY month, d.specialization
        """, nativeQuery = true)
    List<MonthlyVisitsProjection> getMonthlyAppointmentsBySpecialization(@Param("year") int year);

    // Monthly admission visits by ward type
    @Query(value = """
        SELECT
            MONTH(adm.admission_date) as month,
            COUNT(*) as visitCount,
            w.ward_type as unitType
        FROM admission adm
        JOIN ward w ON adm.ward_id = w.ward_id
        WHERE YEAR(adm.admission_date) = :year
        GROUP BY MONTH(adm.admission_date), w.ward_type
        ORDER BY month, w.ward_type
        """, nativeQuery = true)
    List<MonthlyVisitsProjection> getMonthlyAdmissionsByWardType(@Param("year") int year);

    // Specialization summary
    @Query(value = """
        SELECT
            d.specialization as specialization,
            COUNT(*) as visitCount,
            ROUND(COUNT(*) / 12.0, 2) as averageVisitsPerMonth
        FROM appointments a
        JOIN doctors d ON a.doctor_employee_id = d.employee_id
        WHERE YEAR(a.appointment_date) = :year
        GROUP BY d.specialization
        ORDER BY visitCount DESC
        """, nativeQuery = true)
    List<SpecializationVisitsProjection> getSpecializationSummary(@Param("year") int year);

    // Ward occupancy analysis
    @Query(value = """
        SELECT
            w.ward_name as wardName,
            w.ward_type as wardType,
            COUNT(adm.admission_id) as totalAdmissions,
            SUM(CASE WHEN adm.status = 'ACTIVE' THEN 1 ELSE 0 END) as activeAdmissions,
            ROUND((SUM(CASE WHEN adm.status = 'ACTIVE' THEN 1 ELSE 0 END) * 100.0 / COUNT(adm.admission_id)), 2) as occupancyRate
        FROM ward w
        LEFT JOIN admission adm ON w.ward_id = adm.ward_id
        WHERE YEAR(adm.admission_date) = :year OR adm.admission_date IS NULL
        GROUP BY w.ward_id, w.ward_name, w.ward_type
        ORDER BY totalAdmissions DESC
        """, nativeQuery = true)
    List<WardOccupancyProjection> getWardOccupancyAnalysis(@Param("year") int year);

    // Total appointments by year
    @Query(value = """
        SELECT COUNT(*)
        FROM appointments
        WHERE YEAR(appointment_date) = :year
        """, nativeQuery = true)
    Long getTotalAppointmentsByYear(@Param("year") int year);

    // Total admissions by year
    @Query(value = """
        SELECT COUNT(*)
        FROM admission
        WHERE YEAR(admission_date) = :year
        """, nativeQuery = true)
    Long getTotalAdmissionsByYear(@Param("year") int year);

    // Compare with previous year
    @Query(value = """
        SELECT
            YEAR(appointment_date) as year,
            COUNT(*) as totalVisits
        FROM appointments
        WHERE YEAR(appointment_date) IN (:currentYear, :previousYear)
        GROUP BY YEAR(appointment_date)
        """, nativeQuery = true)
    List<Object[]> getYearlyComparison(@Param("currentYear") int currentYear, @Param("previousYear") int previousYear);
}