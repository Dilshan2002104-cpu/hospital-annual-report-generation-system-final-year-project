import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  FileText,
  Activity,
  Users,
  Bed,
  Clock,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const WardStatisticsReport = () => {
  const [selectedWard, setSelectedWard] = useState('Ward 1');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wards = [
    { id: 1, name: 'Ward 1 - General' },
    { id: 2, name: 'Ward 2 - General' },
    { id: 3, name: 'Ward 3 - ICU' },
    { id: 4, name: 'Ward 4 - Dialysis' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    fetchWardStatistics();
  }, [selectedWard, selectedYear]);

  const fetchWardStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/reports/ward-statistics/ward/${selectedWard}/year/${selectedYear}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ward statistics');
      }
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reports/ward-statistics/ward/${selectedWard}/export-pdf/${selectedYear}`);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedWard}_Statistics_${selectedYear}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download PDF: ' + err.message);
    }
  };

  const getAdmissionChartData = () => {
    if (!reportData?.monthlyData) return null;

    return {
      labels: reportData.monthlyData.map(month => month.monthName),
      datasets: [
        {
          label: 'Admissions',
          data: reportData.monthlyData.map(month => month.admissions),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        },
        {
          label: 'Discharges',
          data: reportData.monthlyData.map(month => month.discharges),
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const getOccupancyChartData = () => {
    if (!reportData?.monthlyData) return null;

    return {
      labels: reportData.monthlyData.map(month => month.monthName),
      datasets: [
        {
          label: 'Average Occupancy (%)',
          data: reportData.monthlyData.map(month => month.averageOccupancy),
          borderColor: 'rgba(168, 85, 247, 1)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const getGenderChartData = () => {
    if (!reportData?.genderBreakdown) return null;

    const labels = Object.keys(reportData.genderBreakdown);
    const data = Object.values(reportData.genderBreakdown);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(16, 185, 129, 0.8)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 2
        }
      ]
    };
  };

  const getAgeGroupChartData = () => {
    if (!reportData?.ageGroupBreakdown) return null;

    const labels = Object.keys(reportData.ageGroupBreakdown);
    const data = Object.values(reportData.ageGroupBreakdown);

    return {
      labels,
      datasets: [
        {
          label: 'Patients by Age Group',
          data,
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading ward statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-red-800 font-medium">Error loading statistics</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={fetchWardStatistics}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">Ward Statistics Report</h1>
              <p className="text-gray-600">Comprehensive analytics and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchWardStatistics}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} className="mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Ward</label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {wards.map(ward => (
                <option key={ward.id} value={ward.name.split(' - ')[0]}>{ward.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {reportData && (
        <>
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Admissions</p>
                  <p className="text-2xl font-bold text-blue-900">{reportData.totalAdmissions}</p>
                  {reportData.yearOverYearGrowth !== 0 && (
                    <div className="flex items-center mt-2">
                      {reportData.yearOverYearGrowth > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${reportData.yearOverYearGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(reportData.yearOverYearGrowth).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{reportData.currentOccupancyRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600 mt-1">Current rate</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Avg Length of Stay</p>
                  <p className="text-2xl font-bold text-green-900">{reportData.averageLengthOfStay.toFixed(1)}</p>
                  <p className="text-sm text-gray-600 mt-1">days</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Bed Utilization</p>
                  <p className="text-2xl font-bold text-orange-900">{reportData.bedUtilizationRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600 mt-1">Annual rate</p>
                </div>
                <Bed className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Executive Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{reportData.executiveSummary}</p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admissions and Discharges Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Admissions & Discharges</h3>
              {getAdmissionChartData() && (
                <Bar data={getAdmissionChartData()} options={chartOptions} />
              )}
            </div>

            {/* Occupancy Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Trend</h3>
              {getOccupancyChartData() && (
                <Line data={getOccupancyChartData()} options={lineChartOptions} />
              )}
            </div>

            {/* Gender Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
              {getGenderChartData() && (
                <div className="h-64 flex items-center justify-center">
                  <Doughnut data={getGenderChartData()} options={doughnutOptions} />
                </div>
              )}
            </div>

            {/* Age Group Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Group Distribution</h3>
              {getAgeGroupChartData() && (
                <Bar data={getAgeGroupChartData()} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Trend Analysis
              </h3>
              <p className="text-gray-700 leading-relaxed">{reportData.trendAnalysis}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Performance Insights
              </h3>
              <p className="text-gray-700 leading-relaxed">{reportData.performanceInsights}</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Recommendations
            </h3>
            <p className="text-gray-700 leading-relaxed">{reportData.recommendations}</p>
          </div>

          {/* Monthly Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discharges</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Occupancy</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg LOS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.monthlyData?.map((month) => (
                    <tr key={month.month} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month.monthName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.admissions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.discharges}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.averageOccupancy.toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.averageLengthOfStay.toFixed(1)} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Report Footer */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Report generated on: {new Date(reportData.generatedAt).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Ward: {reportData.wardName} | Year: {reportData.year}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Hospital Management System</p>
                <p className="text-sm text-gray-500">Ward Analytics Module</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WardStatisticsReport;