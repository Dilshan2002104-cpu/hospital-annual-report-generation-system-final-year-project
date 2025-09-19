import React, { useMemo } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Users, TrendingUp, Calendar, UserCheck } from 'lucide-react';
import { chartColors, barChartOptions, doughnutChartOptions, lineChartOptions, chartUtils } from '../../utils/chartConfig';

const PatientStatsChart = ({ patients, appointments }) => {
  // Calculate patient demographics
  const demographicsData = useMemo(() => {
    if (!patients.length) return null;

    const genderCounts = patients.reduce((acc, patient) => {
      acc[patient.gender] = (acc[patient.gender] || 0) + 1;
      return acc;
    }, {});

    const ageCounts = patients.reduce((acc, patient) => {
      const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
      let ageGroup;
      if (age < 18) ageGroup = '0-17';
      else if (age < 35) ageGroup = '18-34';
      else if (age < 50) ageGroup = '35-49';
      else if (age < 65) ageGroup = '50-64';
      else ageGroup = '65+';

      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {});

    return { genderCounts, ageCounts };
  }, [patients]);

  // Calculate monthly registrations
  const monthlyRegistrations = useMemo(() => {
    if (!patients.length) return null;

    const last6Months = chartUtils.getLastNMonths(6);
    const registrationsByMonth = chartUtils.groupByMonth(patients, 'registrationDate');

    const data = last6Months.map(month => ({
      month: chartUtils.formatMonthForChart(month + '-01'),
      count: registrationsByMonth[month]?.length || 0
    }));

    return {
      labels: data.map(d => d.month),
      datasets: [{
        label: 'New Patient Registrations',
        data: data.map(d => d.count),
        backgroundColor: chartColors.gradients.blue[0],
        borderColor: chartColors.gradients.blue[1],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }]
    };
  }, [patients]);

  // Calculate patient activity trends
  const patientActivityTrend = useMemo(() => {
    if (!appointments.length) return null;

    const last7Days = chartUtils.getLastNDays(7);
    const appointmentsByDate = chartUtils.groupByDate(appointments, 'appointmentDate');

    const activityData = last7Days.map(date => {
      const dayAppointments = appointmentsByDate[date] || [];
      const uniquePatients = new Set(dayAppointments.map(apt => apt.patientNationalId)).size;
      return {
        date: chartUtils.formatDateForChart(date),
        patients: uniquePatients,
        appointments: dayAppointments.length
      };
    });

    return {
      labels: activityData.map(d => d.date),
      datasets: [
        {
          label: 'Unique Patients',
          data: activityData.map(d => d.patients),
          borderColor: chartColors.primary,
          backgroundColor: chartColors.backgrounds.blue,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: chartColors.primary,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'Total Appointments',
          data: activityData.map(d => d.appointments),
          borderColor: chartColors.secondary,
          backgroundColor: chartColors.backgrounds.green,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: chartColors.secondary,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }
      ]
    };
  }, [appointments]);

  // Gender distribution chart data
  const genderChartData = useMemo(() => {
    if (!demographicsData) return null;

    return {
      labels: Object.keys(demographicsData.genderCounts),
      datasets: [{
        data: Object.values(demographicsData.genderCounts),
        backgroundColor: [
          chartColors.primary,
          chartColors.pink,
          chartColors.purple
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }, [demographicsData]);

  // Age distribution chart data
  const ageChartData = useMemo(() => {
    if (!demographicsData) return null;

    const ageGroups = ['0-17', '18-34', '35-49', '50-64', '65+'];
    return {
      labels: ageGroups,
      datasets: [{
        label: 'Patients by Age Group',
        data: ageGroups.map(group => demographicsData.ageCounts[group] || 0),
        backgroundColor: chartUtils.generateColorArray(ageGroups.length),
        borderRadius: 6,
        borderSkipped: false,
      }]
    };
  }, [demographicsData]);

  if (!patients.length && !appointments.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Users size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">No patient data available</p>
        <p className="text-sm">Charts will appear when patient data is loaded</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Patients</p>
              <p className="text-2xl font-bold">{patients.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Patients</p>
              <p className="text-2xl font-bold">
                {appointments.length > 0 ? new Set(appointments.map(apt => apt.patientNationalId)).size : 0}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">This Month</p>
              <p className="text-2xl font-bold">
                {patients.filter(p => {
                  const regMonth = p.registrationDate?.slice(0, 7);
                  const currentMonth = new Date().toISOString().slice(0, 7);
                  return regMonth === currentMonth;
                }).length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Avg Age</p>
              <p className="text-2xl font-bold">
                {patients.length > 0 ? Math.round(
                  patients.reduce((sum, p) => {
                    const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
                    return sum + age;
                  }, 0) / patients.length
                ) : 0}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Registrations */}
        {monthlyRegistrations && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2 text-blue-600" />
              Monthly Patient Registrations
            </h3>
            <div className="h-64">
              <Bar data={monthlyRegistrations} options={barChartOptions} />
            </div>
          </div>
        )}

        {/* Gender Distribution */}
        {genderChartData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users size={20} className="mr-2 text-pink-600" />
              Gender Distribution
            </h3>
            <div className="h-64">
              <Doughnut data={genderChartData} options={doughnutChartOptions} />
            </div>
          </div>
        )}

        {/* Patient Activity Trend */}
        {patientActivityTrend && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-green-600" />
              Patient Activity (Last 7 Days)
            </h3>
            <div className="h-64">
              <Line data={patientActivityTrend} options={lineChartOptions} />
            </div>
          </div>
        )}

        {/* Age Distribution */}
        {ageChartData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users size={20} className="mr-2 text-purple-600" />
              Age Distribution
            </h3>
            <div className="h-64">
              <Bar data={ageChartData} options={barChartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Patient Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Demographics Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Most Common Age Group</h4>
            <p className="text-blue-600 font-semibold">
              {demographicsData && Object.entries(demographicsData.ageCounts).length > 0
                ? Object.entries(demographicsData.ageCounts).reduce((a, b) =>
                    demographicsData.ageCounts[a[0]] > demographicsData.ageCounts[b[0]] ? a : b
                  )[0] + ' years'
                : 'N/A'
              }
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Growth Rate</h4>
            <p className="text-green-600 font-semibold">
              {patients.length > 0 ? '+' + Math.round((patients.filter(p => {
                const regDate = new Date(p.registrationDate);
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                return regDate >= lastMonth;
              }).length / patients.length) * 100) + '%' : '0%'} this month
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Patient Engagement</h4>
            <p className="text-purple-600 font-semibold">
              {appointments.length > 0 && patients.length > 0
                ? Math.round((new Set(appointments.map(apt => apt.patientNationalId)).size / patients.length) * 100) + '%'
                : '0%'
              } active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientStatsChart;