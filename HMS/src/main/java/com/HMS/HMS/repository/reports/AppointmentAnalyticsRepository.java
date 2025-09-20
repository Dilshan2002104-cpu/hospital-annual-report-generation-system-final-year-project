package com.HMS.HMS.repository.reports;

import com.HMS.HMS.model.Appointment.Appointment;
import com.HMS.HMS.model.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentAnalyticsRepository extends JpaRepository<Appointment, Long> {

    // Count appointments by type for a specific year
    @Query("SELECT a.appointmentType, COUNT(a) FROM Appointment a " +
           "WHERE a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate " +
           "GROUP BY a.appointmentType")
    List<Object[]> countAppointmentsByTypeForYear(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Count appointments by status for a specific year
    @Query("SELECT a.status, COUNT(a) FROM Appointment a " +
           "WHERE a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate " +
           "GROUP BY a.status")
    List<Object[]> countAppointmentsByStatusForYear(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Monthly appointment trends for a specific year - simplified
    @Query("SELECT a FROM Appointment a " +
           "WHERE a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate " +
           "ORDER BY a.appointmentDate")
    List<Appointment> getAppointmentsForYear(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Daily pattern analysis - simplified
    @Query("SELECT a FROM Appointment a " +
           "WHERE a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate " +
           "ORDER BY a.appointmentDate")
    List<Appointment> getAppointmentsForPatternAnalysis(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Doctor performance stats - simplified
    @Query("SELECT a FROM Appointment a JOIN FETCH a.doctor " +
           "WHERE a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate " +
           "ORDER BY a.doctor.employeeId")
    List<Appointment> getAppointmentsWithDoctorsForYear(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Total appointments count for year
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate")
    long getTotalAppointmentsForYear(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Appointments between date range
    @Query("SELECT a FROM Appointment a " +
           "WHERE a.appointmentDate BETWEEN :startDate AND :endDate " +
           "ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findAppointmentsByDateRange(@Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);
}