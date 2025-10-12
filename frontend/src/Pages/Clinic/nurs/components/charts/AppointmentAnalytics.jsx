import React, { useMemo } from 'react';
import { Line, Bar, Doughnut, PolarArea } from 'react-chartjs-2';
import { Calendar, Clock, Activity, AlertCircle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { chartColors, lineChartOptions, barChartOptions, doughnutChartOptions, chartUtils } from '../../utils/chartConfig';

const AppointmentAnalytics = ({ appointments }) => {
  // Appointment status distribution
  const statusDistribution = useMemo(() => {
    if (!appointments.length) return null;

    const statusCounts = appointments.reduce((acc, apt) => {
      const status = apt.status || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusColors = {
      'COMPLETED': chartColors.success,
      'SCHEDULED': chartColors.primary,
      'IN_PROGRESS': chartColors.warning,
      'CANCELLED': chartColors.danger,
      'NO_SHOW': chartColors.warning,
      'CONFIRMED': chartColors.info,
      'UNKNOWN': chartColors.secondary
    };

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: Object.keys(statusCounts).map(status => statusColors[status] || chartColors.secondary),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }, [appointments]);


  // Daily appointments trend (last 14 days)
  const dailyTrend = useMemo(() => {
    if (!appointments.length) return null;

    const last14Days = chartUtils.getLastNDays(14);
    const appointmentsByDate = chartUtils.groupByDate(appointments, 'appointmentDate');

    const trendData = last14Days.map(date => {
      const dayAppointments = appointmentsByDate[date] || [];
      const completed = dayAppointments.filter(apt => apt.status === 'COMPLETED').length;
      const scheduled = dayAppointments.filter(apt => apt.status === 'SCHEDULED').length;
      const cancelled = dayAppointments.filter(apt => apt.status === 'CANCELLED').length;

      return {
        date: chartUtils.formatDateForChart(date),
        total: dayAppointments.length,
        completed,
        scheduled,
        cancelled
      };
    });

    return {
      labels: trendData.map(d => d.date),
      datasets: [
        {
          label: 'Total Appointments',
          data: trendData.map(d => d.total),
          borderColor: chartColors.primary,
          backgroundColor: chartColors.backgrounds.blue,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Completed',
          data: trendData.map(d => d.completed),
          borderColor: chartColors.success,
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Scheduled',
          data: trendData.map(d => d.scheduled),
          borderColor: chartColors.info,
          backgroundColor: 'transparent',
          borderWidth: 2,
          tension: 0.4,
        }
      ]
    };
  }, [appointments]);

  // Hourly distribution
  const hourlyDistribution = useMemo(() => {
    if (!appointments.length) return null;

    const hourCounts = Array(24).fill(0);

    appointments.forEach(apt => {
      if (apt.appointmentTime) {
        const hour = parseInt(apt.appointmentTime.split(':')[0]);
        hourCounts[hour]++;
      }
    });

    // Filter to only show hours with appointments (typically 8 AM to 6 PM)
    const activeHours = [];
    const activeCounts = [];
    hourCounts.forEach((count, hour) => {
      if (count > 0) {
        activeHours.push(`${hour}:00`);
        activeCounts.push(count);
      }
    });

    return {
      labels: activeHours,
      datasets: [{
        label: 'Appointments by Hour',
        data: activeCounts,
        backgroundColor: chartColors.primary,
        borderColor: chartColors.gradients.blue[1],
        borderWidth: 2,
        borderRadius: 4,
      }]
    };
  }, [appointments]);

  // Monthly comparison (last 6 months)
  const monthlyComparison = useMemo(() => {
    if (!appointments.length) return null;

    const last6Months = chartUtils.getLastNMonths(6);
    const appointmentsByMonth = chartUtils.groupByMonth(appointments, 'appointmentDate');

    const monthlyData = last6Months.map(month => {
      const monthAppointments = appointmentsByMonth[month] || [];
      const completed = monthAppointments.filter(apt => apt.status === 'COMPLETED').length;
      const total = monthAppointments.length;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      return {
        month: chartUtils.formatMonthForChart(month + '-01'),
        total,
        completed,
        completionRate
      };
    });

    return {
      labels: monthlyData.map(d => d.month),
      datasets: [
        {
          label: 'Total Appointments',
          data: monthlyData.map(d => d.total),
          backgroundColor: chartColors.primary,
          borderRadius: 6,
          yAxisID: 'y',
        },
        {
          label: 'Completion Rate (%)',
          data: monthlyData.map(d => d.completionRate),
          type: 'line',
          borderColor: chartColors.success,
          backgroundColor: 'transparent',
          borderWidth: 3,
          tension: 0.4,
          yAxisID: 'y1',
          pointBackgroundColor: chartColors.success,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }
      ]
    };
  }, [appointments]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    if (!appointments.length) return null;

    const completed = appointments.filter(apt => apt.status === 'COMPLETED').length;
    const cancelled = appointments.filter(apt => apt.status === 'CANCELLED').length;
    const noShow = appointments.filter(apt => apt.status === 'NO_SHOW').length;
    const scheduled = appointments.filter(apt => apt.status === 'SCHEDULED').length;

    const completionRate = chartUtils.calculatePercentage(completed, appointments.length);
    const cancellationRate = chartUtils.calculatePercentage(cancelled, appointments.length);
    const noShowRate = chartUtils.calculatePercentage(noShow, appointments.length);

    // Today's appointments
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.appointmentDate === today);

    return {
      total: appointments.length,
      completed,
      cancelled,
      noShow,
      scheduled,
      completionRate,
      cancellationRate,
      noShowRate,
      todayTotal: todayAppointments.length,
      todayCompleted: todayAppointments.filter(apt => apt.status === 'COMPLETED').length
    };
  }, [appointments]);

  if (!appointments.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">No appointment data available</p>
        <p className="text-sm">Charts will appear when appointment data is loaded</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Appointments</p>
                <p className="text-2xl font-bold">{metrics.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold">{metrics.completionRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Today's Total</p>
                <p className="text-2xl font-bold">{metrics.todayTotal}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Cancellation Rate</p>
                <p className="text-2xl font-bold">{metrics.cancellationRate}%</p>
              </div>
              <XCircle className="h-8 w-8 text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">No-Show Rate</p>
                <p className="text-2xl font-bold">{metrics.noShowRate}%</p>
              </div>
              <AlertCircle className="h-8 w-8 text-purple-200" />
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend */}
        {dailyTrend && (
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2 text-blue-600" />
              Appointment Trends (Last 14 Days)
            </h3>
            <div className="h-64">
              <Line data={dailyTrend} options={lineChartOptions} />
            </div>
          </div>
        )}

        {/* Status Distribution */}
        {statusDistribution && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity size={20} className="mr-2 text-green-600" />
              Appointment Status Distribution
            </h3>
            <div className="h-64">
              <Doughnut data={statusDistribution} options={doughnutChartOptions} />
            </div>
          </div>
        )}


        {/* Hourly Distribution */}
        {hourlyDistribution && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock size={20} className="mr-2 text-orange-600" />
              Appointment Times Distribution
            </h3>
            <div className="h-64">
              <Bar data={hourlyDistribution} options={barChartOptions} />
            </div>
          </div>
        )}

        {/* Monthly Comparison */}
        {monthlyComparison && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2 text-indigo-600" />
              Monthly Performance
            </h3>
            <div className="h-64">
              <Bar
                data={monthlyComparison}
                options={{
                  ...barChartOptions,
                  scales: {
                    ...barChartOptions.scales,
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Appointments'
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Completion Rate (%)'
                      },
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Analytics Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Peak Hour</h4>
            <p className="text-indigo-600 font-semibold">
              {hourlyDistribution && hourlyDistribution.labels.length > 0
                ? hourlyDistribution.labels[hourlyDistribution.datasets[0].data.indexOf(Math.max(...hourlyDistribution.datasets[0].data))]
                : 'N/A'
              }
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Efficiency Score</h4>
            <p className="text-green-600 font-semibold">
              {metrics ? Math.round(metrics.completionRate - metrics.cancellationRate - metrics.noShowRate) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentAnalytics;