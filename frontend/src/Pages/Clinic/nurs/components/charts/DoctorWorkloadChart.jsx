import React, { useMemo } from 'react';
import { Bar, Radar, Line, Doughnut } from 'react-chartjs-2';
import { Stethoscope, Users, Clock, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import { chartColors, barChartOptions, lineChartOptions, doughnutChartOptions, chartUtils } from '../../utils/chartConfig';

const DoctorWorkloadChart = ({ doctors, appointments }) => {
  // Doctor appointment statistics
  const doctorStats = useMemo(() => {
    if (!doctors.length || !appointments.length) return null;

    return doctors.map(doctor => {
      const doctorAppointments = appointments.filter(apt => apt.doctorEmployeeId === doctor.empId);
      const completed = doctorAppointments.filter(apt => apt.status === 'COMPLETED').length;
      const scheduled = doctorAppointments.filter(apt => apt.status === 'SCHEDULED').length;
      const cancelled = doctorAppointments.filter(apt => apt.status === 'CANCELLED').length;
      const total = doctorAppointments.length;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      // Today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = doctorAppointments.filter(apt => apt.appointmentDate === today);
      const todayCompleted = todayAppointments.filter(apt => apt.status === 'COMPLETED').length;

      // This week's appointments
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekStartStr = weekStart.toISOString().split('T')[0];
      const weekAppointments = doctorAppointments.filter(apt => apt.appointmentDate >= weekStartStr);

      return {
        ...doctor,
        totalAppointments: total,
        completed,
        scheduled,
        cancelled,
        completionRate: Math.round(completionRate),
        todayTotal: todayAppointments.length,
        todayCompleted,
        todayPending: todayAppointments.length - todayCompleted,
        weeklyTotal: weekAppointments.length,
        efficiency: total > 0 ? Math.round(((completed + scheduled) / total) * 100) : 0
      };
    });
  }, [doctors, appointments]);

  // Doctor workload comparison
  const workloadComparison = useMemo(() => {
    if (!doctorStats) return null;

    return {
      labels: doctorStats.map(doctor => doctor.name.replace('Dr. ', '')),
      datasets: [
        {
          label: 'Completed',
          data: doctorStats.map(doctor => doctor.completed),
          backgroundColor: chartColors.success,
          borderRadius: 4,
        },
        {
          label: 'Scheduled',
          data: doctorStats.map(doctor => doctor.scheduled),
          backgroundColor: chartColors.primary,
          borderRadius: 4,
        },
        {
          label: 'Cancelled',
          data: doctorStats.map(doctor => doctor.cancelled),
          backgroundColor: chartColors.danger,
          borderRadius: 4,
        }
      ]
    };
  }, [doctorStats]);

  // Doctor efficiency radar chart
  const efficiencyRadar = useMemo(() => {
    if (!doctorStats) return null;

    const topDoctors = doctorStats
      .sort((a, b) => b.totalAppointments - a.totalAppointments)
      .slice(0, 6); // Top 6 doctors

    return {
      labels: topDoctors.map(doctor => doctor.name.replace('Dr. ', '')),
      datasets: [{
        label: 'Completion Rate (%)',
        data: topDoctors.map(doctor => doctor.completionRate),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: chartColors.primary,
        borderWidth: 2,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }]
    };
  }, [doctorStats]);

  // Daily workload trend for top doctors
  const dailyWorkloadTrend = useMemo(() => {
    if (!doctorStats || !appointments.length) return null;

    const last7Days = chartUtils.getLastNDays(7);
    const topDoctors = doctorStats
      .sort((a, b) => b.totalAppointments - a.totalAppointments)
      .slice(0, 3); // Top 3 doctors

    const datasets = topDoctors.map((doctor, index) => {
      const colors = [chartColors.primary, chartColors.secondary, chartColors.accent];
      const dailyData = last7Days.map(date => {
        const dayAppointments = appointments.filter(apt =>
          apt.doctorEmployeeId === doctor.empId && apt.appointmentDate === date
        );
        return dayAppointments.length;
      });

      return {
        label: doctor.name.replace('Dr. ', ''),
        data: dailyData,
        borderColor: colors[index],
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: colors[index],
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      };
    });

    return {
      labels: last7Days.map(date => chartUtils.formatDateForChart(date)),
      datasets
    };
  }, [doctorStats, appointments]);

  // Specialization workload distribution
  const specializationWorkload = useMemo(() => {
    if (!doctorStats) return null;

    const specializationCounts = doctorStats.reduce((acc, doctor) => {
      const spec = doctor.specialization || 'Unknown';
      acc[spec] = (acc[spec] || 0) + doctor.totalAppointments;
      return acc;
    }, {});

    return {
      labels: Object.keys(specializationCounts),
      datasets: [{
        data: Object.values(specializationCounts),
        backgroundColor: chartUtils.generateColorArray(Object.keys(specializationCounts).length),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }, [doctorStats]);

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    if (!doctorStats) return null;

    const totalAppointments = doctorStats.reduce((sum, doctor) => sum + doctor.totalAppointments, 0);
    const totalCompleted = doctorStats.reduce((sum, doctor) => sum + doctor.completed, 0);
    const todayTotal = doctorStats.reduce((sum, doctor) => sum + doctor.todayTotal, 0);
    const averageCompletionRate = doctorStats.length > 0
      ? Math.round(doctorStats.reduce((sum, doctor) => sum + doctor.completionRate, 0) / doctorStats.length)
      : 0;

    const activeDoctors = doctorStats.filter(doctor => doctor.totalAppointments > 0).length;
    const busyDoctors = doctorStats.filter(doctor => doctor.todayTotal > 5).length;

    return {
      totalAppointments,
      totalCompleted,
      todayTotal,
      averageCompletionRate,
      activeDoctors,
      busyDoctors,
      totalDoctors: doctorStats.length
    };
  }, [doctorStats]);

  if (!doctors.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Stethoscope size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">No doctor data available</p>
        <p className="text-sm">Charts will appear when doctor data is loaded</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Metrics Cards */}
      {overallMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Doctors</p>
                <p className="text-2xl font-bold">{overallMetrics.activeDoctors}/{overallMetrics.totalDoctors}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Avg Completion Rate</p>
                <p className="text-2xl font-bold">{overallMetrics.averageCompletionRate}%</p>
              </div>
              <Award className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Today's Load</p>
                <p className="text-2xl font-bold">{overallMetrics.todayTotal}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">High Workload</p>
                <p className="text-2xl font-bold">{overallMetrics.busyDoctors}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-purple-200" />
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Comparison */}
        {workloadComparison && (
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users size={20} className="mr-2 text-blue-600" />
              Doctor Workload Comparison
            </h3>
            <div className="h-80">
              <Bar
                data={workloadComparison}
                options={{
                  ...barChartOptions,
                  scales: {
                    ...barChartOptions.scales,
                    x: {
                      ...barChartOptions.scales.x,
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Efficiency Radar */}
        {efficiencyRadar && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award size={20} className="mr-2 text-green-600" />
              Doctor Efficiency Radar
            </h3>
            <div className="h-64">
              <Radar
                data={efficiencyRadar}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Specialization Distribution */}
        {specializationWorkload && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Stethoscope size={20} className="mr-2 text-purple-600" />
              Workload by Specialization
            </h3>
            <div className="h-64">
              <Doughnut data={specializationWorkload} options={doughnutChartOptions} />
            </div>
          </div>
        )}

        {/* Daily Workload Trend */}
        {dailyWorkloadTrend && (
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2 text-indigo-600" />
              Daily Workload Trend (Top 3 Doctors)
            </h3>
            <div className="h-64">
              <Line data={dailyWorkloadTrend} options={lineChartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Doctor Performance Table */}
      {doctorStats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users size={20} className="mr-2 text-blue-600" />
              Doctor Performance Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Today</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctorStats
                  .sort((a, b) => b.totalAppointments - a.totalAppointments)
                  .map((doctor, index) => (
                  <tr key={doctor.empId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br ${doctor.color || 'from-blue-200 to-blue-300'} flex items-center justify-center`}>
                          <span className={`${doctor.textColor || 'text-blue-700'} font-semibold text-sm`}>
                            {doctor.avatar || doctor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">ID: {doctor.empId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doctor.specialization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {doctor.totalAppointments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {doctor.completed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                      {doctor.todayTotal}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 mr-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                doctor.completionRate >= 80 ? 'bg-green-500' :
                                doctor.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(doctor.completionRate, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{doctor.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        doctor.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                        doctor.efficiency >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doctor.efficiency}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Workload Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Top Performer</h4>
            <p className="text-green-600 font-semibold">
              {doctorStats && doctorStats.length > 0
                ? doctorStats.reduce((top, current) =>
                    current.completionRate > top.completionRate ? current : top
                  ).name.replace('Dr. ', '')
                : 'N/A'
              }
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Busiest Doctor</h4>
            <p className="text-blue-600 font-semibold">
              {doctorStats && doctorStats.length > 0
                ? doctorStats.reduce((busiest, current) =>
                    current.totalAppointments > busiest.totalAppointments ? current : busiest
                  ).name.replace('Dr. ', '')
                : 'N/A'
              }
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Workload Balance</h4>
            <p className={`font-semibold ${
              overallMetrics && overallMetrics.busyDoctors / overallMetrics.totalDoctors < 0.5
                ? 'text-green-600' : 'text-orange-600'
            }`}>
              {overallMetrics && overallMetrics.busyDoctors / overallMetrics.totalDoctors < 0.5
                ? 'Well Balanced' : 'High Load'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorWorkloadChart;