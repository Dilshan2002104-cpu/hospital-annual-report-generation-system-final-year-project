package com.HMS.HMS.repository.reports;

import com.HMS.HMS.model.Admission.Admission;
import com.HMS.HMS.repository.projection.MonthlyAdmissionsProjection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AdmissionsReportRepository extends Repository<Admission,Long> {
    @Query(value = """
        SELECT 
          w.ward_id      AS wardId,
          w.ward_name    AS wardName,
          DATE_FORMAT(a.admission_date, '%Y-%m') AS month,
          COUNT(*)       AS totalAdmissions
        FROM admission a
        JOIN ward w ON w.ward_id = a.ward_id
        WHERE a.admission_date >= :start
          AND a.admission_date <  :end
        GROUP BY w.ward_id, w.ward_name, DATE_FORMAT(a.admission_date, '%Y-%m')
        ORDER BY w.ward_name
        """, nativeQuery = true)
    List<MonthlyAdmissionsProjection> findMonthlyAdmissionsByWard(
            @Param("start")LocalDateTime start,
            @Param("end") LocalDateTime end
            );
}
