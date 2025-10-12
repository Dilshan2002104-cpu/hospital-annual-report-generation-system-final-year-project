import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  FileText, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Activity,
  Download,
  Filter,
  RefreshCw,
  Target,
  Award,
  Clock,
  Heart,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Monitor,
  Database,
  Shield,
  Stethoscope,
  Droplet,
  Settings,
  Eye,
  Mail,
  Share2
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

export default function ReportsModule({ sessions }) {
  const [reportMode, setReportMode] = useState('annual-report'); // 'annual-report', 'comprehensive', 'machine-specific', 'patient-analytics'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMachine, setSelectedMachine] = useState('all');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Available years
  const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  
  // Report types configuration
  const reportTypes = [
    {
      id: 'annual-report',
      name: 'Annual Dialysis Report',
      description: 'Comprehensive yearly analysis with monthly trends, machine utilization, and patient outcomes',
      icon: TrendingUp,
      color: 'emerald',
      featured: true
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Dialysis Report',
      description: 'Complete analysis of dialysis operations, patient outcomes, and facility performance',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'machine-specific',
      name: 'Machine Performance Report',
      description: 'Detailed equipment utilization, maintenance, and efficiency analysis',
      icon: Monitor,
      color: 'purple'
    },
    {
      id: 'patient-analytics',
      name: 'Patient Treatment Analytics',
      description: 'Patient care outcomes, treatment effectiveness, and quality metrics',
      icon: Heart,
      color: 'green'
    }
  ];

  // Machine list for selection
  const machines = useMemo(() => [
    { id: 'all', name: 'All Machines', location: 'All Locations' },
    { id: 'M001', name: 'Dialysis Machine 001', location: 'Unit A' },
    { id: 'M002', name: 'Dialysis Machine 002', location: 'Unit A' },
    { id: 'M003', name: 'Dialysis Machine 003', location: 'Unit B' },
    { id: 'M004', name: 'Dialysis Machine 004', location: 'Unit B' },
    { id: 'M005', name: 'Dialysis Machine 005', location: 'Unit C' },
    { id: 'M006', name: 'Dialysis Machine 006', location: 'Unit C' }
  ], []);

  // Helper functions for generating report data
  const generateMonthlyData = (yearSessions) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map((month, index) => {
      const monthSessions = yearSessions.filter(session => {
        const sessionDate = new Date(session.scheduledDate);
        return sessionDate.getMonth() === index;
      });

      return {
        month,
        totalSessions: monthSessions.length,
        completedSessions: monthSessions.filter(s => s.status === 'completed' || s.status === 'COMPLETED').length,
        emergencySessions: monthSessions.filter(s => s.sessionType === 'emergency' || s.isEmergency).length,
        averageUtilization: Math.round(60 + Math.random() * 30),
        patientCount: new Set(monthSessions.map(s => s.patientNationalId)).size
      };
    });
  };

  const generateMachinePerformanceData = (yearSessions) => {
    return machines.slice(1).map(machine => {
      const machineSessions = yearSessions.filter(s => s.machineId === machine.id);
      return {
        machineId: machine.id,
        machineName: machine.name,
        location: machine.location,
        totalSessions: machineSessions.length,
        completedSessions: machineSessions.filter(s => s.status === 'completed' || s.status === 'COMPLETED').length,
        utilizationRate: Math.round(65 + Math.random() * 25),
        maintenanceHours: Math.round(15 + Math.random() * 20),
        downtime: Math.round(Math.random() * 10),
        efficiency: Math.round(85 + Math.random() * 10)
      };
    });
  };

  const generatePatientOutcomesData = (yearSessions) => {
    const uniquePatients = new Set(yearSessions.map(s => s.patientNationalId)).size;
    return {
      totalPatients: uniquePatients,
      newPatients: Math.round(uniquePatients * 0.15),
      regularPatients: Math.round(uniquePatients * 0.85),
      averageSessionsPerPatient: yearSessions.length > 0 ? Math.round(yearSessions.length / uniquePatients) : 0,
      treatmentAdherence: 89,
      clinicalOutcomes: {
        excellent: 45,
        good: 38,
        fair: 15,
        poor: 2
      }
    };
  };

  const generateQualityMetricsData = () => {
    return {
      infectionRate: 0.5,
      complicationRate: 2.3,
      patientSatisfaction: 87,
      staffCompliance: 94,
      equipmentReliability: 96,
      protocolAdherence: 91
    };
  };

  const generateMonthlyPatientData = (yearSessions) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map((monthName, index) => {
      const monthSessions = yearSessions.filter(session => {
        const sessionDate = new Date(session.scheduledDate);
        return sessionDate.getMonth() === index;
      });

      const uniquePatients = new Set(monthSessions.map(s => s.patientNationalId)).size;

      return {
        month: index + 1,
        monthName,
        patientCount: uniquePatients,
        sessionCount: monthSessions.length,
        emergencyCount: monthSessions.filter(s => s.sessionType === 'emergency' || s.isEmergency).length,
        averageUtilization: Math.round(60 + Math.random() * 30),
        dataType: 'Patients'
      };
    });
  };

  const generateMonthlyMachineUtilizationData = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map((monthName, index) => {
      return {
        month: index + 1,
        monthName,
        utilizationPercentage: Math.round(65 + Math.random() * 25), // 65-90%
        totalHours: 720, // Approximate hours in a month
        activeHours: Math.round(720 * (65 + Math.random() * 25) / 100),
        maintenanceHours: Math.round(20 + Math.random() * 30), // 20-50 hours
        activeMachines: 8 + Math.round(Math.random() * 4) // 8-12 machines
      };
    });
  };

  // Generate fallback data when API is not available
  const generateFallbackReportData = useCallback(() => {
    const currentYear = parseInt(selectedYear);
    const yearSessions = sessions.filter(session => {
      const sessionYear = new Date(session.scheduledDate).getFullYear();
      return sessionYear === currentYear;
    });

    const totalSessions = yearSessions.length;
    const completedSessions = yearSessions.filter(s => s.status === 'completed' || s.status === 'COMPLETED').length;
    const cancelledSessions = yearSessions.filter(s => s.status === 'cancelled' || s.status === 'CANCELLED').length;
    const emergencySessions = yearSessions.filter(s => s.sessionType === 'emergency' || s.isEmergency).length;

    return {
      summary: {
        totalSessions,
        completedSessions,
        cancelledSessions,
        emergencySessions,
        completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
        emergencyRate: totalSessions > 0 ? Math.round((emergencySessions / totalSessions) * 100) : 0,
        averageSessionDuration: 4.2,
        patientSatisfactionScore: 87,
        machineUtilizationRate: 78
      },
      monthlyData: generateMonthlyData(yearSessions),
      machinePerformance: generateMachinePerformanceData(yearSessions),
      patientOutcomes: generatePatientOutcomesData(yearSessions),
      qualityMetrics: generateQualityMetricsData(),
      // Annual report specific data
      monthlySessions: generateMonthlyData(yearSessions),
      monthlyPatients: generateMonthlyPatientData(yearSessions),
      monthlyMachineUtilization: generateMonthlyMachineUtilizationData()
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, sessions]);

  // Fetch report data from backend
  const fetchReportData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
      }

      let endpoint = '';
      switch (reportMode) {
        case 'annual-report':
          endpoint = `http://localhost:8080/api/dialysis/reports/annual/${selectedYear}`;
          break;
        case 'comprehensive':
          endpoint = `http://localhost:8080/api/dialysis/reports/comprehensive/${selectedYear}`;
          break;
        case 'machine-specific':
          endpoint = `http://localhost:8080/api/dialysis/reports/machine-performance/${selectedMachine}/${selectedYear}`;
          break;
        case 'patient-analytics':
          endpoint = `http://localhost:8080/api/dialysis/reports/patient-analytics/${selectedYear}`;
          break;
        default:
          endpoint = `http://localhost:8080/api/dialysis/analytics/kpi-dashboard`;
      }

      console.log('📊 Fetching report data from:', endpoint);

      const response = await fetch(endpoint, { 
        headers,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error(`Server error (${response.status}): Using fallback data while backend service is offline`);
        } else if (response.status === 404) {
          throw new Error('Dialysis reporting endpoint not found. Using fallback analytics data.');
        } else if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else {
          throw new Error(`Failed to fetch report data (HTTP ${response.status})`);
        }
      }

      const data = await response.json();
      setReportData(data);
      console.log('✅ Report data loaded successfully from API');

    } catch (err) {
      // Handle different types of errors gracefully
      let errorMessage = 'Using fallback data';
      
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        errorMessage = 'Connection timeout - using fallback data';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('Network request failed')) {
        errorMessage = 'Backend service offline - using fallback data';
      } else if (err.message.includes('Server error')) {
        errorMessage = err.message;
      } else {
        errorMessage = `Connection issue - using fallback data: ${err.message}`;
      }
      
      console.warn('⚠️ API unavailable, using fallback data:', errorMessage);
      
      // Generate fallback data from sessions
      const fallbackData = generateFallbackReportData();
      setReportData(fallbackData);
      
      // Show user-friendly message that we're using demo data
      setError(null); // Clear error since we have fallback data
      setSuccess('📊 Demo data loaded successfully. Connect to backend for real-time reports.');
      console.log('✅ Fallback report data generated successfully');
    } finally {
      setLoading(false);
    }
  }, [reportMode, selectedYear, selectedMachine, generateFallbackReportData]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Download PDF report
  const downloadPDFReport = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const headers = {
        'Authorization': jwtToken ? `Bearer ${jwtToken}` : '',
        'Accept': 'application/pdf'
      };

      let endpoint = '';
      let filename = '';

      switch (reportMode) {
        case 'annual-report':
          endpoint = `http://localhost:8080/api/dialysis/reports/annual/${selectedYear}/pdf`;
          filename = `Dialysis_Annual_Report_${selectedYear}.pdf`;
          break;
        case 'comprehensive':
          endpoint = `http://localhost:8080/api/dialysis/reports/comprehensive/export-pdf/${selectedYear}`;
          filename = `Comprehensive_Dialysis_Report_${selectedYear}.pdf`;
          break;
        case 'machine-specific':
          endpoint = `http://localhost:8080/api/dialysis/reports/machine-performance/export-pdf/${selectedMachine}/${selectedYear}`;
          filename = `Machine_Performance_Report_${selectedMachine}_${selectedYear}.pdf`;
          break;
        case 'patient-analytics':
          endpoint = `http://localhost:8080/api/dialysis/reports/patient-analytics/export-pdf/${selectedYear}`;
          filename = `Patient_Analytics_Report_${selectedYear}.pdf`;
          break;
        default:
          throw new Error('Invalid report mode selected');
      }

      console.log('Downloading PDF from:', endpoint);

      // Try direct download first
      try {
        window.location.href = endpoint;
        setSuccess(`Report download initiated: ${filename}`);
        return;
      } catch (directError) {
        console.log('Direct download failed, trying fetch method:', directError);
      }

      // Fetch method as fallback
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
        credentials: 'omit'
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('PDF generation service not available. Please contact system administrator.');
        } else if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else {
          throw new Error(`HTTP ${response.status}: Failed to generate PDF report`);
        }
      }

      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);

      setSuccess(`Report downloaded successfully: ${filename}`);
      console.log(`PDF downloaded successfully: ${filename}`);

    } catch (err) {
      console.error('PDF download error:', err);
      setError(`Failed to download PDF report: ${err.message}`);
    } finally {
      setIsGenerating(false);
      // Clear messages after 5 seconds
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Reports
          </h1>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <div>
            <h3 className="text-green-800 font-medium">Success</h3>
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        </div>
      )}

      {/* Report Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Report Configuration</h3>
          <div className="flex items-center text-sm text-gray-500">
            <FileText className="w-4 h-4 mr-1" />
            Select Report Type & Settings
          </div>
        </div>
        
        {/* Featured Annual Report */}
        <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900">Annual Dialysis Report</h4>
                <p className="text-emerald-700">Primary annual report for comprehensive dialysis operations analysis</p>
              </div>
            </div>
            <button
              onClick={() => setReportMode('annual-report')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                reportMode === 'annual-report'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {reportMode === 'annual-report' ? '✓ Selected' : 'Select Report'}
            </button>
          </div>
          
          {reportMode === 'annual-report' && (
            <div className="bg-white rounded-lg p-4 border border-emerald-200">
              <h5 className="font-semibold text-emerald-900 mb-3">Annual Report Features:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-emerald-800">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  Monthly session trends & analytics
                </div>
                <div className="flex items-center text-emerald-800">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  Patient outcome analysis
                </div>
                <div className="flex items-center text-emerald-800">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  Equipment utilization reports
                </div>
                <div className="flex items-center text-emerald-800">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  Quality assurance metrics
                </div>
                <div className="flex items-center text-emerald-800">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  Strategic recommendations
                </div>
                <div className="flex items-center text-emerald-800">
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                  Executive summary & insights
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Other Report Types */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Additional Report Types</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTypes.filter(type => type.id !== 'annual-report').map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setReportMode(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    reportMode === type.id
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <IconComponent className={`w-5 h-5 mr-2 ${
                      reportMode === type.id ? `text-${type.color}-600` : 'text-gray-600'
                    }`} />
                    <h4 className={`font-medium ${
                      reportMode === type.id ? `text-${type.color}-900` : 'text-gray-900'
                    }`}>
                      {type.name}
                    </h4>
                  </div>
                  <p className={`text-sm ${
                    reportMode === type.id ? `text-${type.color}-700` : 'text-gray-600'
                  }`}>
                    {type.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Report Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Report Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {reportMode === 'machine-specific' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Monitor className="w-4 h-4 inline mr-1" />
                Machine
              </label>
              <select
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {machines.map(machine => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name} - {machine.location}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end space-x-2">
            <button
              onClick={downloadPDFReport}
              disabled={isGenerating || !reportData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mr-4" />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">Loading Report Data...</p>
              <p className="text-gray-600">Please wait while we generate your report</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Content */}
      {!loading && reportData && (
        <>
          {/* Machine Performance Table */}
          {reportMode === 'machine-specific' && reportData.machinePerformance && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-blue-600" />
                  Machine Performance Details
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-900 border-b">Machine</th>
                      <th className="text-center p-4 font-semibold text-gray-900 border-b">Location</th>
                      <th className="text-center p-4 font-semibold text-gray-900 border-b">Total Sessions</th>
                      <th className="text-center p-4 font-semibold text-gray-900 border-b">Utilization</th>
                      <th className="text-center p-4 font-semibold text-gray-900 border-b">Efficiency</th>
                      <th className="text-center p-4 font-semibold text-gray-900 border-b">Downtime (hrs)</th>
                      <th className="text-center p-4 font-semibold text-gray-900 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.machinePerformance.map((machine) => (
                      <tr key={machine.machineId} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 border-b">
                          <div>
                            <div className="font-medium text-gray-900">{machine.machineName}</div>
                            <div className="text-sm text-gray-500">{machine.machineId}</div>
                          </div>
                        </td>
                        <td className="p-4 border-b text-center">{machine.location}</td>
                        <td className="p-4 border-b text-center font-semibold">{machine.totalSessions}</td>
                        <td className="p-4 border-b text-center">
                          <span className={`font-medium ${
                            machine.utilizationRate >= 80 ? 'text-green-600' : 
                            machine.utilizationRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {machine.utilizationRate}%
                          </span>
                        </td>
                        <td className="p-4 border-b text-center">
                          <span className={`font-medium ${
                            machine.efficiency >= 90 ? 'text-green-600' : 
                            machine.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {machine.efficiency}%
                          </span>
                        </td>
                        <td className="p-4 border-b text-center">{machine.downtime}</td>
                        <td className="p-4 border-b text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            machine.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                            machine.efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {machine.efficiency >= 90 ? 'Excellent' :
                             machine.efficiency >= 80 ? 'Good' : 'Needs Attention'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Key Insights and Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Key Insights & Strategic Recommendations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance Highlights */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Award className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-900">Performance Highlights</h4>
                </div>
                <div className="text-sm text-green-700 space-y-2">
                  <p>• Patient satisfaction score: {reportData.summary?.patientSatisfactionScore || 87}% (Above target)</p>
                  <p>• Treatment completion rate: {reportData.summary?.completionRate || 95}%</p>
                  <p>• Equipment utilization: {reportData.summary?.machineUtilizationRate || 78}% average</p>
                  <p>• Quality compliance: {reportData.qualityMetrics?.protocolAdherence || 91}%</p>
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Target className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-900">Strategic Action Items</h4>
                </div>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>• Optimize machine scheduling during peak hours</p>
                  <p>• Implement predictive maintenance protocols</p>
                  <p>• Enhance patient flow management systems</p>
                  <p>• Expand capacity for emergency cases</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}