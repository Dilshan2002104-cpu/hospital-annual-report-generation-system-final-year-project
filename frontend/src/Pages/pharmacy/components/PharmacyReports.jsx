import { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Download,
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

export default function PharmacyReports() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate years for dropdown (current year and previous 5 years)
  const availableYears = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

  // Define fetchReportData function before useEffect
  const fetchReportData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Calculate start and end dates for the selected year
      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;

      const response = await axios.get('http://localhost:8080/api/reports/pharmacy/prescription/dispensing', {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      });
      setReportData(response.data);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  // Fetch report data when year changes
  useEffect(() => {
    fetchReportData();
  }, [selectedYear, fetchReportData]);

  const handleDownloadPDF = async () => {
    try {
      if (!reportData) {
        console.error('No report data available for PDF generation');
        return;
      }

      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;
      
      console.log(`Downloading PDF for year: ${selectedYear}`);
      
      const response = await fetch(`/api/reports/pharmacy/prescription/dispensing/pdf?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription-dispensing-report-${selectedYear}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('PDF download completed successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // You could add a toast notification here to inform the user of the error
    }
  };

  // eslint-disable-next-line no-unused-vars
  const StatCard = ({ title, value, subtitle, color, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Prescription Dispensing Report
            </h3>
            <p className="text-gray-600 text-sm mt-1">Annual prescription dispensing statistics and performance metrics</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>

        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">Select the year for statistical analysis</p>
        </div>
      </div>

      {/* Summary Statistics */}
      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Prescriptions"
              value={reportData.totalPrescriptions || 0}
              icon={FileText}
              color="text-blue-600"
            />
            <StatCard
              title="Completed"
              value={reportData.completedPrescriptions || 0}
              subtitle={`${reportData.completionRate?.toFixed(1) || 0}% completion rate`}
              icon={CheckCircle}
              color="text-green-600"
            />
            <StatCard
              title="Pending"
              value={reportData.pendingPrescriptions || 0}
              icon={Clock}
              color="text-yellow-600"
            />
            <StatCard
              title="Avg Processing Time"
              value={`${reportData.averageProcessingTimeHours?.toFixed(1) || 0}h`}
              icon={Activity}
              color="text-purple-600"
            />
          </div>

          {/* Status Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Status Distribution
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{reportData.completedPrescriptions || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Completed</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{reportData.pendingPrescriptions || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Pending</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{reportData.inProgressPrescriptions || 0}</p>
                <p className="text-sm text-gray-600 mt-1">In Progress</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{reportData.readyPrescriptions || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Ready</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{reportData.cancelledPrescriptions || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Cancelled</p>
              </div>
            </div>
          </div>

          {/* Daily Breakdown Chart */}
          {reportData.dailyBreakdown && reportData.dailyBreakdown.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Daily Breakdown
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Completed</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Pending</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Completion %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.dailyBreakdown.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{day.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{day.totalPrescriptions}</td>
                        <td className="px-4 py-3 text-sm text-green-600 text-right">{day.completedPrescriptions}</td>
                        <td className="px-4 py-3 text-sm text-yellow-600 text-right">{day.pendingPrescriptions}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{day.completionRate?.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Ward Breakdown */}
          {reportData.wardBreakdown && reportData.wardBreakdown.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Ward-wise Statistics</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ward</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Completed</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Avg Time (hrs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.wardBreakdown.map((ward, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{ward.wardName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{ward.totalPrescriptions}</td>
                        <td className="px-4 py-3 text-sm text-green-600 text-right">{ward.completedPrescriptions}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{ward.averageProcessingTime?.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Insights */}
          {(reportData.summaryText || reportData.trendsText || reportData.performanceText) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Insights & Analysis</h4>
              <div className="space-y-4">
                {reportData.summaryText && (
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">Summary</h5>
                    <p className="text-gray-600">{reportData.summaryText}</p>
                  </div>
                )}
                {reportData.trendsText && (
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">Trends</h5>
                    <p className="text-gray-600">{reportData.trendsText}</p>
                  </div>
                )}
                {reportData.performanceText && (
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-2">Performance</h5>
                    <p className="text-gray-600">{reportData.performanceText}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
