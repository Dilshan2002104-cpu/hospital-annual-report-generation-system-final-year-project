import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export default function LabReports() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [availableYears, setAvailableYears] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportPreview, setReportPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch available years on component mount
  useEffect(() => {
    fetchAvailableYears();
  }, []);

  const fetchAvailableYears = async () => {
    try {
      const response = await fetch('/api/lab-reports/available-years', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const years = await response.json();
        setAvailableYears(years);
      }
    } catch (error) {
      console.error('Error fetching available years:', error);
      // Fallback years if API fails
      setAvailableYears([2025, 2024, 2023, 2022, 2021, 2020]);
    }
  };

  const generateReportPreview = async (year) => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch(`/api/lab-reports/annual/${year}/preview`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportPreview(data);
        setSuccess(`Report preview generated for ${year}`);
      } else {
        throw new Error('Failed to generate report preview');
      }
    } catch (error) {
      console.error('Error generating report preview:', error);
      setError('Failed to generate report preview. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAnnualReportPDF = async (year) => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch(`/api/lab-reports/annual/${year}/pdf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Laboratory_Annual_Report_${year}_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setSuccess(`Annual report for ${year} downloaded successfully!`);
      } else {
        throw new Error('Failed to download report');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Laboratory Reports</h2>
            <p className="text-sm text-gray-600 mt-1">Generate comprehensive annual reports with analytics and insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-500">Report Management</span>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
          <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
          <button onClick={clearMessages} className="text-green-500 hover:text-green-700">
            ×
          </button>
        </div>
      )}

      {/* Annual Report Generator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Annual Laboratory Report</h3>
            <p className="text-sm text-gray-600">Comprehensive analysis with charts, statistics, and performance metrics</p>
          </div>
        </div>

        {/* Year Selection */}
        <div className="flex items-center space-x-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Select Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year} {year === new Date().getFullYear() && '(Current)'}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => generateReportPreview(selectedYear)}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>Preview Report</span>
              </>
            )}
          </button>

          <button
            onClick={() => downloadAnnualReportPDF(selectedYear)}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {reportPreview && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Report Preview - {reportPreview.year}</h3>
              <p className="text-sm text-gray-600">Overview of key statistics and metrics</p>
            </div>
          </div>

          {reportPreview.overallStatistics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Tests</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {reportPreview.overallStatistics.totalTests?.toLocaleString()}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Patients Served</p>
                    <p className="text-2xl font-bold text-green-900">
                      {reportPreview.overallStatistics.totalPatients?.toLocaleString()}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Avg. Turnaround</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {reportPreview.overallStatistics.avgTurnaroundTime}h
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Quality Score</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {reportPreview.overallStatistics.qualityScore?.toFixed(1)}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>
          )}

          {/* Additional Preview Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Monthly Trends</h4>
              <p className="text-sm text-gray-600">
                {reportPreview.monthlyVolumes?.length || 0} months of data
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Test Types</h4>
              <p className="text-sm text-gray-600">
                {reportPreview.testTypeStatistics?.length || 0} different test categories
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Equipment</h4>
              <p className="text-sm text-gray-600">
                {reportPreview.equipmentUtilization?.length || 0} pieces tracked
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Reports Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { 
              title: 'Monthly Summary', 
              description: 'Current month performance', 
              icon: Calendar,
              color: 'bg-blue-600 hover:bg-blue-700'
            },
            { 
              title: 'Quality Metrics', 
              description: 'QC and accuracy reports', 
              icon: CheckCircle,
              color: 'bg-green-600 hover:bg-green-700'
            },
            { 
              title: 'Equipment Status', 
              description: 'Utilization and maintenance', 
              icon: Activity,
              color: 'bg-purple-600 hover:bg-purple-700'
            }
          ].map((report, index) => (
            <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <report.icon className="w-6 h-6 text-gray-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">{report.title}</h4>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
              <button 
                className={`w-full ${report.color} text-white py-2 px-4 rounded-lg transition-colors text-sm`}
                onClick={() => setError('Feature coming soon!')}
              >
                Generate Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}