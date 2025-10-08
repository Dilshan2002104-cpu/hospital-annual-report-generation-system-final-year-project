import React, { useState, useEffect } from 'react';
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
import { Bar, Doughnut, Line } from 'react-chartjs-2';
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
  Wifi,
  WifiOff
} from 'lucide-react';

// Import the new analytics hook
import useDialysisAnalytics from '../hooks/useDialysisAnalytics';

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

export default function DialysisAnalytics({ 
  sessions = [], 
  wsConnected = false,
  wsNotifications = null,
  loading: externalLoading = false,
  onRefresh 
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');
  
  // Use the new analytics hook for real API integration
  const {
    machines,
    analyticsData,
    loading: analyticsLoading,
    error: _analyticsError, // Prefixed with _ to indicate intentionally unused
    refreshAnalytics
  } = useDialysisAnalytics(sessions, (type, title, message) => {
    console.log(`${type}: ${title} - ${message}`);
  });

  // Combine loading states
  const loading = externalLoading || analyticsLoading;

  // Handle real-time WebSocket notifications
  useEffect(() => {
    if (wsNotifications?.type === 'MACHINE_STATUS_UPDATE') {
      console.log('🔄 Machine status update received:', wsNotifications);
      // Refresh analytics when machine status changes
      refreshAnalytics(timeRange);
    } else if (wsNotifications?.type === 'SESSION_UPDATE') {
      console.log('📊 Session update received:', wsNotifications);
      // Refresh analytics when sessions are updated
      refreshAnalytics(timeRange);
    }
  }, [wsNotifications, refreshAnalytics, timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        onRefresh && onRefresh(),
        refreshAnalytics(timeRange)
      ]);
    } finally {
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  // Chart configurations
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  // Machine Status Doughnut Chart
  const machineStatusData = {
    labels: ['Active', 'In Use', 'Maintenance', 'Out of Order'],
    datasets: [
      {
        data: analyticsData ? [
          analyticsData.activeMachines,
          analyticsData.inUseMachines,
          analyticsData.maintenanceMachines,
          analyticsData.machineUtilization.OUT_OF_ORDER || 0
        ] : [0, 0, 0, 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green - Active
          'rgba(59, 130, 246, 0.8)',  // Blue - In Use  
          'rgba(245, 158, 11, 0.8)',  // Yellow - Maintenance
          'rgba(239, 68, 68, 0.8)'    // Red - Out of Order
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  // Session Flow Bar Chart
  const sessionFlowData = {
    labels: analyticsData ? analyticsData.sessionsByTimeSlot.map(slot => slot.timeSlot) : [],
    datasets: [
      {
        label: 'Scheduled',
        data: analyticsData ? analyticsData.sessionsByTimeSlot.map(slot => slot.scheduled) : [],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Completed',
        data: analyticsData ? analyticsData.sessionsByTimeSlot.map(slot => slot.completed) : [],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
      {
        label: 'In Progress',
        data: analyticsData ? analyticsData.sessionsByTimeSlot.map(slot => slot.inProgress) : [],
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Daily Trends Line Chart
  const dailyTrendsData = {
    labels: analyticsData ? analyticsData.last7Days.map(d => d.date) : [],
    datasets: [
      {
        label: 'Scheduled Sessions',
        data: analyticsData ? analyticsData.last7Days.map(d => d.scheduled) : [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Completed Sessions',
        data: analyticsData ? analyticsData.last7Days.map(d => d.completed) : [],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  // Patient Types Doughnut Chart
  const patientTypesData = {
    labels: analyticsData ? Object.keys(analyticsData.patientTypes) : [],
    datasets: [
      {
        data: analyticsData ? Object.values(analyticsData.patientTypes) : [],
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)', // Purple - Regular
          'rgba(239, 68, 68, 0.8)',  // Red - Emergency
          'rgba(6, 182, 212, 0.8)',  // Cyan - Temporary
        ],
        borderColor: [
          'rgba(168, 85, 247, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(6, 182, 212, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">No dialysis session data available for analysis</p>
        </div>
      </div>
    );
  }

  const machineUtilizationRate = analyticsData.totalMachines > 0 
    ? Math.round(((analyticsData.inUseMachines + analyticsData.activeMachines) / analyticsData.totalMachines) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Activity className="w-7 h-7 mr-3 text-blue-600" />
              Dialysis Analytics Dashboard
              {wsConnected && (
                <span className="ml-3 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="ml-1 text-sm text-green-600">Live</span>
                </span>
              )}
              {!wsConnected && (
                <span className="ml-3 flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="ml-1 text-sm text-red-600">Offline</span>
                </span>
              )}
            </h2>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-gray-600">Real-time dialysis operations insights and performance metrics</p>
              {analyticsData?.dataSource && (
                <div className="flex items-center space-x-2">
                  {Object.values(analyticsData.dataSource).some(source => source === 'api') ? (
                    <div className="flex items-center text-green-600">
                      <Database className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Real API Data</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-orange-600">
                      <Wifi className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Computed Data</span>
                    </div>
                  )}
                  {analyticsData.isOffline && (
                    <div className="flex items-center text-red-600">
                      <WifiOff className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Offline Mode</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value);
                refreshAnalytics(e.target.value);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-blue-600">{analyticsData.sessionStatus.IN_PROGRESS || 0}</p>
              <p className="text-xs text-gray-500 mt-1">Currently running</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Droplet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Machine Utilization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Machine Utilization</p>
              <p className="text-3xl font-bold text-green-600">{machineUtilizationRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{analyticsData.inUseMachines + analyticsData.activeMachines}/{analyticsData.totalMachines} machines</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Treatment Efficiency */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Treatment Efficiency</p>
              <p className="text-3xl font-bold text-purple-600">{analyticsData.efficiencyRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Completion rate</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Average Session Duration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
              <p className="text-3xl font-bold text-orange-600">{Math.floor(analyticsData.avgSessionDuration / 60)}h {analyticsData.avgSessionDuration % 60}m</p>
              <p className="text-xs text-gray-500 mt-1">Treatment time</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Machine Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-600" />
            Machine Status Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={machineStatusData} options={chartOptions} />
          </div>
        </div>

        {/* Session Flow by Time Slots */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-600" />
            Session Flow by Time Slots
          </h3>
          <div className="h-64">
            <Bar data={sessionFlowData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Session Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-gray-600" />
            Daily Session Trends (Last 7 Days)
          </h3>
          <div className="h-64">
            <Line data={dailyTrendsData} options={chartOptions} />
          </div>
        </div>

        {/* Patient Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-gray-600" />
            Patient Type Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={patientTypesData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Live Operations Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-gray-600" />
          Live Operations Monitor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Machine Grid */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Machine Status Grid</h4>
            <div className="grid grid-cols-4 gap-2">
              {machines.map((machine, index) => (
                <div
                  key={machine.machineId || index}
                  className={`p-3 rounded-lg border-2 text-center ${
                    machine.status === 'ACTIVE' 
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : machine.status === 'IN_USE'
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : machine.status === 'MAINTENANCE'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <div className="text-xs font-semibold">{machine.machineId || `DM-00${index + 1}`}</div>
                  <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                    machine.status === 'ACTIVE' 
                      ? 'bg-green-500'
                      : machine.status === 'IN_USE'
                      ? 'bg-blue-500'
                      : machine.status === 'MAINTENANCE'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Summary */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Today's Summary</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="font-semibold text-gray-900">{analyticsData.totalSessions}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-600">Completed</span>
                <span className="font-semibold text-green-800">{analyticsData.completedSessions}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-600">In Progress</span>
                <span className="font-semibold text-blue-800">{analyticsData.sessionStatus.IN_PROGRESS || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-yellow-600">Scheduled</span>
                <span className="font-semibold text-yellow-800">{analyticsData.sessionStatus.SCHEDULED || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}