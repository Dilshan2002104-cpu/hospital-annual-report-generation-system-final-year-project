import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format, parseISO } from 'date-fns';
import usePharmacyAnalytics from '../hooks/usePharmacyAnalytics';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

const PharmacyAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  const {
    analyticsData,
    loading,
    error,
    refreshAnalytics,
    generateMockData
  } = usePharmacyAnalytics();

  useEffect(() => {
    refreshAnalytics(selectedPeriod);
  }, [selectedPeriod, refreshAnalytics]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleRefresh = () => {
    refreshAnalytics(selectedPeriod);
  };

  const handleUseMockData = () => {
    generateMockData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Analytics</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <div className="mt-3 space-x-3">
              <button
                onClick={handleRefresh}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={handleUseMockData}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Use Demo Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return <div className="text-center p-8">No analytics data available</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Pharmacy Analytics Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
            <button
              onClick={handleUseMockData}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Demo Data</span>
            </button>
            <div className="text-sm text-gray-500">
              Generated: {analyticsData?.generatedAt ? format(new Date(analyticsData.generatedAt), 'PPp') : 'N/A'}
            </div>
          </div>
        </div>

        {/* Period Selection */}
        <div className="flex space-x-2 mb-4">
          {[
            { value: '7d', label: '7 Days' },
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: '1y', label: '1 Year' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => handlePeriodChange(period.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'prescriptions', label: 'Prescriptions' },
              { id: 'inventory', label: 'Inventory' },
              { id: 'performance', label: 'Performance' },
              { id: 'revenue', label: 'Revenue' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Alerts Section */}
      {analyticsData.alerts && analyticsData.alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Critical Alerts</h2>
          <div className="grid gap-3">
            {analyticsData.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-red-50 border-red-400 text-red-700'
                    : alert.severity === 'WARNING'
                    ? 'bg-yellow-50 border-yellow-400 text-yellow-700'
                    : 'bg-blue-50 border-blue-400 text-blue-700'
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{alert.type.replace('_', ' ')}</span>
                    <p className="mt-1">{alert.message}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-100 text-red-800'
                      : alert.severity === 'WARNING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab data={analyticsData} />}
      {activeTab === 'prescriptions' && <PrescriptionsTab data={analyticsData.prescriptionAnalytics} />}
      {activeTab === 'inventory' && <InventoryTab data={analyticsData.inventoryAnalytics} />}
      {activeTab === 'performance' && <PerformanceTab data={analyticsData.performanceMetrics} />}
      {activeTab === 'revenue' && <RevenueTab data={analyticsData.revenueAnalytics} />}
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ data }) => {
  const kpiCards = [
    {
      title: 'Total Prescriptions',
      value: data.prescriptionAnalytics?.totalPrescriptions || 0,
      change: '+12%',
      changeType: 'increase',
      icon: '📋'
    },
    {
      title: 'Active Prescriptions',
      value: data.prescriptionAnalytics?.activePrescriptions || 0,
      change: '+5%',
      changeType: 'increase',
      icon: '🔄'
    },
    {
      title: 'Low Stock Items',
      value: data.inventoryAnalytics?.lowStockCount || 0,
      change: '-8%',
      changeType: 'decrease',
      icon: '⚠️'
    },
    {
      title: 'Revenue',
      value: `$${data.revenueAnalytics?.totalRevenue?.toFixed(2) || '0.00'}`,
      change: '+15%',
      changeType: 'increase',
      icon: '💰'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">{kpi.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{kpi.value}</p>
                <p className={`text-sm ${
                  kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.change} from last period
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prescription Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription Status</h3>
          {data.prescriptionAnalytics?.statusDistribution && (
            <PrescriptionStatusChart data={data.prescriptionAnalytics.statusDistribution} />
          )}
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Status</h3>
          {data.inventoryAnalytics?.stockStatusDistribution && (
            <InventoryStatusChart data={data.inventoryAnalytics.stockStatusDistribution} />
          )}
        </div>
      </div>
    </div>
  );
};

// Prescriptions Tab Component
const PrescriptionsTab = ({ data }) => {
  if (!data) return <div>No prescription data available</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Processing Rate</h3>
          <p className="text-3xl font-bold text-blue-600">{data.processingRate?.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Avg Processing Time</h3>
          <p className="text-3xl font-bold text-green-600">{data.averageProcessingTimeHours?.toFixed(1)}h</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Urgent Prescriptions</h3>
          <p className="text-3xl font-bold text-red-600">{data.urgentPrescriptions}</p>
        </div>
      </div>

      {/* Daily Volume Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Prescription Volume</h3>
        {data.dailyVolume && <DailyVolumeChart data={data.dailyVolume} />}
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
        {data.statusDistribution && <PrescriptionStatusChart data={data.statusDistribution} />}
      </div>
    </div>
  );
};

// Inventory Tab Component
const InventoryTab = ({ data }) => {
  if (!data) return <div>No inventory data available</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Medications</h3>
          <p className="text-3xl font-bold text-blue-600">{data.totalMedications}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Low Stock</h3>
          <p className="text-3xl font-bold text-yellow-600">{data.lowStockCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-600">{data.outOfStockCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Value</h3>
          <p className="text-3xl font-bold text-green-600">${data.totalInventoryValue?.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Status Distribution</h3>
          {data.stockStatusDistribution && <InventoryStatusChart data={data.stockStatusDistribution} />}
        </div>

        {/* Top Dispensed Medications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Dispensed Medications</h3>
          {data.topDispensedMedications && <TopMedicationsChart data={data.topDispensedMedications} />}
        </div>
      </div>

      {/* Expiring Medications Table */}
      {data.expiringMedications && data.expiringMedications.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medications Expiring Soon</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drug Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Left
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.expiringMedications.map((medication, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medication.drugName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medication.batchNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        try {
                          return format(parseISO(medication.expiryDate), 'PP');
                        } catch {
                          return medication.expiryDate;
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {medication.currentStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        medication.daysUntilExpiry <= 7
                          ? 'bg-red-100 text-red-800'
                          : medication.daysUntilExpiry <= 30
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {medication.daysUntilExpiry} days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Performance Tab Component
const PerformanceTab = ({ data }) => {
  if (!data) return <div>No performance data available</div>;

  return (
    <div className="space-y-6">
      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Dispensing Efficiency</h3>
          <p className="text-3xl font-bold text-blue-600">{data.dispensingEfficiency?.toFixed(1)}%</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${data.dispensingEfficiency}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Average Wait Time</h3>
          <p className="text-3xl font-bold text-green-600">{data.averageWaitTime?.toFixed(1)}m</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Patients Served</h3>
          <p className="text-3xl font-bold text-purple-600">{data.totalPatientsServed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Satisfaction Score</h3>
          <p className="text-3xl font-bold text-yellow-600">{data.customerSatisfactionScore?.toFixed(1)}/5</p>
          <div className="mt-2 flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${
                  star <= data.customerSatisfactionScore ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
        <div className="text-center text-gray-500 py-8">
          Performance trend charts will be implemented based on historical data
        </div>
      </div>
    </div>
  );
};

// Revenue Tab Component
const RevenueTab = ({ data }) => {
  if (!data) return <div>No revenue data available</div>;

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">${data.totalRevenue?.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">${data.monthlyRevenue?.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Daily Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">${data.dailyRevenue?.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Avg Transaction</h3>
          <p className="text-3xl font-bold text-yellow-600">${data.averageTransactionValue?.toFixed(2)}</p>
        </div>
      </div>

      {/* Revenue History Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue History</h3>
        {data.revenueHistory && <RevenueHistoryChart data={data.revenueHistory} />}
      </div>
    </div>
  );
};

// Chart Components
const PrescriptionStatusChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data).map(status => status.replace('_', ' ')),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#8B5CF6', // Purple
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

const InventoryStatusChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data).map(status => status.replace('_', ' ')),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          '#10B981', // Green - In Stock
          '#F59E0B', // Yellow - Low Stock
          '#EF4444', // Red - Out of Stock
          '#8B5CF6', // Purple - Expiring Soon
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

const DailyVolumeChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => {
      try {
        return format(parseISO(item.date), 'MMM dd');
      } catch {
        return item.date;
      }
    }),
    datasets: [
      {
        label: 'Total Prescriptions',
        data: data.map(item => item.totalPrescriptions),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Urgent Prescriptions',
        data: data.map(item => item.urgentPrescriptions),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

const TopMedicationsChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.drugName),
    datasets: [
      {
        label: 'Total Dispensed',
        data: data.map(item => item.totalDispensed),
        backgroundColor: '#3B82F6',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

const RevenueHistoryChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => {
      try {
        return format(parseISO(item.date), 'MMM dd');
      } catch {
        return item.date;
      }
    }),
    datasets: [
      {
        label: 'Daily Revenue',
        data: data.map(item => item.revenue),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PharmacyAnalytics;
