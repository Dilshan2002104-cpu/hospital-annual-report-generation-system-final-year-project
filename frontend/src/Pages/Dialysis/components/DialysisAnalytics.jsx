import React, { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import { 
  Activity, 
  Users, 
  Zap, 
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Droplet,
  Calendar,
  Settings,
  Shield,
  Database,
  Monitor,
  Heart,
  Weight,
  Gauge
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DialysisAnalytics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // Add tab state

  // Analytics data state
  const [machinePerformance, setMachinePerformance] = useState(null);
  const [sessionTrends, setSessionTrends] = useState(null);
  const [patientMetrics, setPatientMetrics] = useState(null);
  const [operationalMetrics, setOperationalMetrics] = useState(null);
  const [kpiDashboard, setKpiDashboard] = useState(null);
  const [utilizationHeatmap, setUtilizationHeatmap] = useState(null);
  const [monthlyComparison, setMonthlyComparison] = useState(null);
  const [machineWiseTrends, setMachineWiseTrends] = useState(null);

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const jwtToken = localStorage.getItem('jwtToken');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header only if token exists
      if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
      }

      // Calculate date range
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

      console.log('Fetching analytics data:', {
        startDate,
        endDate,
        timeRange,
        hasToken: !!jwtToken
      });

      // Fetch all analytics data
      const [
        machineResponse,
        trendsResponse,
        metricsResponse,
        operationalResponse,
        kpiResponse,
        heatmapResponse,
        monthlyResponse,
        machineWiseResponse
      ] = await Promise.all([
        fetch(`http://localhost:8080/api/dialysis/analytics/machine-performance?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`http://localhost:8080/api/dialysis/analytics/session-trends?days=${timeRange}`, { headers }),
        fetch(`http://localhost:8080/api/dialysis/analytics/patient-metrics?startDate=${startDate}&endDate=${endDate}`, { headers }),
        fetch(`http://localhost:8080/api/dialysis/analytics/operational-metrics`, { headers }),
        fetch(`http://localhost:8080/api/dialysis/analytics/kpi-dashboard`, { headers }),
        fetch(`http://localhost:8080/api/dialysis/analytics/utilization-heatmap?days=7`, { headers }),
        fetch(`http://localhost:8080/api/dialysis/analytics/monthly-comparison?months=6`, { headers }),
        fetch(`http://localhost:8080/api/dialysis/analytics/machine-wise-trends?days=${timeRange}`, { headers })
      ]);

      if (!machineResponse.ok || !trendsResponse.ok || !metricsResponse.ok || 
          !operationalResponse.ok || !kpiResponse.ok || !heatmapResponse.ok || 
          !monthlyResponse.ok || !machineWiseResponse.ok) {
        
        // Check for specific error types
        const errorResponse = !machineResponse.ok ? machineResponse : 
                             !trendsResponse.ok ? trendsResponse :
                             !metricsResponse.ok ? metricsResponse :
                             !operationalResponse.ok ? operationalResponse :
                             !kpiResponse.ok ? kpiResponse :
                             !heatmapResponse.ok ? heatmapResponse : 
                             !monthlyResponse.ok ? monthlyResponse : machineWiseResponse;
        
        if (errorResponse.status === 401) {
          throw new Error('Authentication required. Please login again.');
        } else if (errorResponse.status === 403) {
          throw new Error('Access denied. Insufficient permissions.');
        } else if (errorResponse.status === 404) {
          throw new Error('Analytics service not found.');
        } else if (errorResponse.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Failed to fetch analytics data (${errorResponse.status})`);
        }
      }

      const [machineData, trendsData, metricsData, operationalData, kpiData, heatmapData, monthlyData, machineWiseData] = 
        await Promise.all([
          machineResponse.json(),
          trendsResponse.json(),
          metricsResponse.json(),
          operationalResponse.json(),
          kpiResponse.json(),
          heatmapResponse.json(),
          monthlyResponse.json(),
          machineWiseResponse.json()
        ]);

      setMachinePerformance(machineData);
      setSessionTrends(trendsData);
      setPatientMetrics(metricsData);
      setOperationalMetrics(operationalData);
      setKpiDashboard(kpiData);
      setUtilizationHeatmap(heatmapData);
      setMonthlyComparison(monthlyData);
      setMachineWiseTrends(machineWiseData);

    } catch (error) {
      console.error('Analytics fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Fetch data on component mount and time range change
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // KPI Card component
  const KPICard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color || 'text-gray-900'} mb-1`}>
            {value !== undefined ? value : '—'}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.abs(trend)}% vs last period
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color ? color.replace('text-', 'bg-').replace('900', '100') : 'bg-gray-100'}`}>
          {Icon && <Icon className={`w-6 h-6 ${color || 'text-gray-600'}`} />}
        </div>
      </div>
    </div>
  );

  // Machine Performance Chart
  const MachinePerformanceChart = () => {
    if (!machinePerformance?.machineUtilization?.machines) return null;

    const machines = machinePerformance.machineUtilization.machines;
    
    const chartData = {
      labels: machines.map(m => m.machineName || m.machineId),
      datasets: [{
        label: 'Sessions Count',
        data: machines.map(m => m.sessionCount),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 4,
      }]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Machine Performance - Session Count'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          }
        },
        x: {
          grid: {
            display: false,
          }
        }
      }
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Bar data={chartData} options={options} />
      </div>
    );
  };

  // Session Trends Chart
  const SessionTrendsChart = () => {
    if (!sessionTrends?.dailyVolume?.daily) return null;

    const dailyData = sessionTrends.dailyVolume.daily;
    
    const chartData = {
      labels: dailyData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Daily Sessions',
        data: dailyData.map(d => d.sessionCount),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Session Volume Trends'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          }
        },
        x: {
          grid: {
            display: false,
          }
        }
      }
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Line data={chartData} options={options} />
      </div>
    );
  };

  // Individual Machine Line Charts
  const IndividualMachineChart = ({ machine, color }) => {
    if (!machine.dailyTrends) return null;

    const dateLabels = machine.dailyTrends.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const chartData = {
      labels: dateLabels,
      datasets: [{
        label: 'Sessions',
        data: machine.dailyTrends.map(day => day.sessionCount),
        borderColor: color,
        backgroundColor: color + '20',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: `${machine.machineName} - ${machine.location}`,
          font: {
            size: 14,
            weight: 'bold'
          },
          color: color
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: color,
          borderWidth: 2,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function(context) {
              const dayData = machine.dailyTrends[context.dataIndex];
              return [
                `Sessions: ${context.parsed.y}`,
                `Completed: ${dayData.completedCount}`,
                `Utilization: ${Math.round(dayData.utilizationRate)}%`,
                `Avg Duration: ${dayData.avgSessionDuration ? dayData.avgSessionDuration.toFixed(1) : 'N/A'}h`
              ];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sessions',
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            stepSize: 1,
            font: {
              size: 11
            }
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 10
            },
            maxRotation: 45
          }
        }
      },
      elements: {
        line: {
          borderWidth: 3
        },
        point: {
          radius: 5,
          hoverRadius: 7
        }
      }
    };

    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div style={{ height: '280px' }}>
          <Line data={chartData} options={options} />
        </div>
        
        {/* Machine Stats */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-lg font-bold" style={{ color: color }}>
              {machine.totalSessions}
            </p>
            <p className="text-xs text-gray-600">Total Sessions</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-lg font-bold text-green-600">
              {Math.round(machine.completionRate)}%
            </p>
            <p className="text-xs text-gray-600">Completion Rate</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-lg font-bold text-blue-600">
              {machine.dailyTrends ? Math.round(
                machine.dailyTrends.reduce((sum, day) => sum + day.utilizationRate, 0) / machine.dailyTrends.length
              ) : 0}%
            </p>
            <p className="text-xs text-gray-600">Avg Utilization</p>
          </div>
        </div>
      </div>
    );
  };

  // Machine-Wise Trends Container
  const MachineWiseTrendsChart = () => {
    if (!machineWiseTrends?.machineWiseData) return null;

    const machineData = machineWiseTrends.machineWiseData;
    
    // Generate colors for each machine
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
    ];

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Machine-Wise Performance Trends</h3>
          <p className="text-sm text-gray-600 mb-6">Individual performance charts for each dialysis machine</p>
          
          {/* Machine Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {machineData.map((machine, index) => (
              <IndividualMachineChart
                key={machine.machineId}
                machine={machine}
                color={colors[index % colors.length]}
              />
            ))}
          </div>
          
          {/* Overall Summary */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Fleet Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {machineData.length}
                </p>
                <p className="text-sm text-gray-600">Active Machines</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {machineData.reduce((sum, machine) => sum + machine.totalSessions, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {Math.round(
                    machineData.reduce((sum, machine) => sum + machine.completionRate, 0) / machineData.length
                  )}%
                </p>
                <p className="text-sm text-gray-600">Avg Completion</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {machineData.filter(machine => machine.completionRate > 90).length}
                </p>
                <p className="text-sm text-gray-600">High Performers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Monthly Comparison Chart
  const MonthlyComparisonChart = () => {
    if (!monthlyComparison?.monthlyData) return null;

    const monthlyData = monthlyComparison.monthlyData;
    
    const chartData = {
      labels: monthlyData.map(m => m.month),
      datasets: [
        {
          label: 'Total Sessions',
          data: monthlyData.map(m => m.totalSessions),
          backgroundColor: 'rgba(99, 102, 241, 0.6)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Completed Sessions',
          data: monthlyData.map(m => m.completedSessions),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          borderRadius: 4,
        }
      ]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Monthly Performance Comparison'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          }
        },
        x: {
          grid: {
            display: false,
          }
        }
      }
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <Bar data={chartData} options={options} />
      </div>
    );
  };

  // Patient Metrics Component
  const PatientMetricsCard = () => {
    if (!patientMetrics) return null;
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 text-green-600 mr-2" />
          Patient Care Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {patientMetrics.totalPatients || 0}
            </p>
            <p className="text-sm text-gray-600">Total Patients</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {patientMetrics.averageSessionDuration || 0}min
            </p>
            <p className="text-sm text-gray-600">Avg Session Duration</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(patientMetrics.completionRate || 0)}%
            </p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>
      </div>
    );
  };

  // Utilization Heatmap Component
  const UtilizationHeatmapCard = () => {
    if (!utilizationHeatmap) return null;
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 text-orange-600 mr-2" />
          Utilization Heatmap
        </h3>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">Peak Hours Analysis</p>
          <p className="text-2xl font-bold text-orange-600">
            {utilizationHeatmap.peakHours || 'N/A'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Maximum utilization period
          </p>
        </div>
      </div>
    );
  };

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Analytics</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive dialysis management insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
          </select>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('machine-trends')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'machine-trends'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Monitor className="w-4 h-4 mr-2" />
                Machine-Wise Performance Trends
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

      {/* KPI Dashboard */}
      {kpiDashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Available Machines"
            value={`${kpiDashboard.availableMachines}/${kpiDashboard.totalMachines}`}
            subtitle="Ready for use"
            icon={Monitor}
            color="text-green-600"
          />
          <KPICard
            title="Today's Sessions"
            value={kpiDashboard.scheduledToday}
            subtitle={`${kpiDashboard.completedToday} completed`}
            icon={Calendar}
            color="text-blue-600"
          />
          <KPICard
            title="Completion Rate"
            value={`${Math.round(kpiDashboard.completionRate || 0)}%`}
            subtitle="Today's performance"
            icon={CheckCircle}
            color="text-emerald-600"
          />
          <KPICard
            title="Active Sessions"
            value={kpiDashboard.activeSessions}
            subtitle="Currently in progress"
            icon={Activity}
            color="text-orange-600"
          />
        </div>
      )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MachinePerformanceChart />
            <SessionTrendsChart />
            <MonthlyComparisonChart />
          </div>

          {/* Patient Metrics and Utilization Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatientMetricsCard />
            <UtilizationHeatmapCard />
          </div>

          {/* Additional Metrics */}
          {operationalMetrics && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 text-blue-600 mr-2" />
                Operational Metrics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {operationalMetrics.todayStats && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Today's Statistics</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Total: {operationalMetrics.todayStats.total}</p>
                      <p>Completed: {operationalMetrics.todayStats.completed}</p>
                      <p>In Progress: {operationalMetrics.todayStats.inProgress}</p>
                      <p>Scheduled: {operationalMetrics.todayStats.scheduled}</p>
                    </div>
                  </div>
                )}
                
                {operationalMetrics.weeklyStats && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Weekly Performance</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Total Sessions: {operationalMetrics.weeklyStats.totalSessions}</p>
                      <p>Completion Rate: {Math.round(operationalMetrics.weeklyStats.completionRate)}%</p>
                      <p>Avg Daily: {Math.round(operationalMetrics.weeklyStats.averageDaily)}</p>
                    </div>
                  </div>
                )}
                
                {operationalMetrics.resourceUtilization && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Resource Utilization</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Machine Utilization: {Math.round(operationalMetrics.resourceUtilization.machineUtilization)}%</p>
                      <p>Available Capacity: {operationalMetrics.resourceUtilization.availableCapacity}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Machine-Wise Performance Trends Tab */}
      {activeTab === 'machine-trends' && (
        <div className="space-y-6">
          <MachineWiseTrendsChart />
        </div>
      )}
    </div>
  );
}