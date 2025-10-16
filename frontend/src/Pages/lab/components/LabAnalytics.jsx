import React, { useMemo } from 'react';
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
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
  TrendingUp, 
  PieChart, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Users,
  Calendar,
  Microscope,
  Download,
  RefreshCw,
  Clock
} from 'lucide-react';
import { generateLabAnalyticsData, defaultChartOptions } from '../utils/analyticsData';

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
  Filler
);

export default function LabAnalytics({ loading, stats }) {
  // Generate analytics data using utility function
  const data = useMemo(() => generateLabAnalyticsData(), []);
  
  const analyticsData = useMemo(() => {
    
    // Monthly test volume data
    const monthlyData = {
      labels: data.monthlyTestVolume.labels,
      datasets: [{
        label: 'Total Tests',
        data: data.monthlyTestVolume.data,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    // Test types distribution
    const testTypesData = {
      labels: data.testTypesDistribution.map(item => item.name),
      datasets: [{
        data: data.testTypesDistribution.map(item => item.value),
        backgroundColor: data.testTypesDistribution.map(item => `${item.color}CC`),
        borderColor: data.testTypesDistribution.map(item => item.color),
        borderWidth: 2
      }]
    };

    // Ward-wise test distribution
    const wardDistributionData = {
      labels: data.wardDistribution.labels,
      datasets: [{
        label: 'Tests Completed',
        data: data.wardDistribution.data,
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 2,
        borderRadius: 4
      }]
    };



    // Daily test volume (last 7 days)
    const dailyVolumeData = {
      labels: data.dailyVolume.labels,
      datasets: [{
        label: 'Tests Processed',
        data: data.dailyVolume.data,
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
        borderWidth: 2,
        borderRadius: 4
      }, {
        label: 'Historical Average',
        data: data.dailyVolume.averages,
        backgroundColor: 'rgba(100, 116, 139, 0.4)',
        borderColor: 'rgb(100, 116, 139)',
        borderWidth: 1,
        borderRadius: 4
      }]
    };

    return {
      monthlyData,
      testTypesData,
      wardDistributionData,
      dailyVolumeData
    };
  }, [data]); // Depend on data

  // Chart options
  const chartOptions = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      tooltip: {
        ...defaultChartOptions.plugins.tooltip,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}${context.datasetIndex === 0 && context.chart.canvas.id.includes('turnaround') ? 'h' : ''}`;
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Laboratory Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">Comprehensive performance metrics and data visualization</p>
          </div>
          <div className="flex items-center space-x-4">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Tests</p>
              <p className="text-3xl font-bold">{stats?.totalTests || 469}</p>
              <p className="text-blue-100 text-xs mt-1">+12% from last month</p>
            </div>
            <Activity className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completion Rate</p>
              <p className="text-3xl font-bold">{stats?.completionRate || 94}%</p>
              <p className="text-green-100 text-xs mt-1">+3% improvement</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Avg. Turnaround</p>
              <p className="text-3xl font-bold">6.2h</p>
              <p className="text-yellow-100 text-xs mt-1">-0.8h faster</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Equipment Uptime</p>
              <p className="text-3xl font-bold">{stats?.equipmentUtilization || 85}%</p>
              <p className="text-purple-100 text-xs mt-1">Excellent status</p>
            </div>
            <Microscope className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Test Volume Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Test Volume</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="h-80">
            <Line data={analyticsData.monthlyData} options={chartOptions} />
          </div>
        </div>

        {/* Test Types Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Test Types Distribution</h3>
            <PieChart className="w-5 h-5 text-purple-600" />
          </div>
          <div className="h-80">
            <Pie data={analyticsData.testTypesData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ward-wise Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ward-wise Test Distribution</h3>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="h-80">
            <Bar data={analyticsData.wardDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Daily Volume (Last 7 Days) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Daily Test Volume</h3>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="h-80">
            <Bar data={analyticsData.dailyVolumeData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Quality Score</h4>
              <p className="text-3xl font-bold text-green-600 mt-2">{data.qualityMetrics.accuracy}%</p>
              <p className="text-sm text-gray-600 mt-1">Accuracy & Precision</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${data.qualityMetrics.accuracy}%` }}
                ></div>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Sample Rejection</h4>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{data.qualityMetrics.sampleRejectionRate}%</p>
              <p className="text-sm text-gray-600 mt-1">Within acceptable range</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${data.qualityMetrics.sampleRejectionRate * 10}%` }}
                ></div>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Peak Hours</h4>
              <p className="text-3xl font-bold text-blue-600 mt-2">{data.peakHours.busiest}</p>
              <p className="text-sm text-gray-600 mt-1">{data.peakHours.busiestCount} tests/hour</p>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Quietest: {data.peakHours.quietest}</span>
                <span>{data.peakHours.quietestCount} tests</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}