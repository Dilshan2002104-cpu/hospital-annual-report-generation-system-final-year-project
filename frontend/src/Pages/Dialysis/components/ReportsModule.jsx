import React, { useState, useMemo } from 'react';
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
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { 
  FileText, 
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  Activity,
  Download,
  Filter,
  Printer,
  RefreshCw,
  Building2,
  Target,
  Award
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsModule({ sessions }) {
  const [reportYear, setReportYear] = useState('2025');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  // Define nephrology units based on your system
  const nephrologyUnits = useMemo(() => [
    { id: 'unit1', name: 'Nephrology Unit 1', code: 'NU1' },
    { id: 'unit2', name: 'Nephrology Unit 2', code: 'NU2' },
    { id: 'prof_unit', name: 'Prof Unit', code: 'PU' }
  ], []);

  // Assign sessions to units based on machine IDs or create logic for unit assignment
  const getSessionUnit = (session) => {
    const machineId = session.machineId;
    if (!machineId) return 'unit1'; // Default unit
    
    // M001-M003 = Unit 1, M004-M006 = Unit 2, M007-M008 = Prof Unit
    if (['M001', 'M002', 'M003'].includes(machineId)) return 'unit1';
    if (['M004', 'M005', 'M006'].includes(machineId)) return 'unit2';
    if (['M007', 'M008'].includes(machineId)) return 'prof_unit';
    return 'unit1'; // Default
  };

  // Process sessions data for the selected year
  const yearSessions = useMemo(() => {
    return sessions.filter(session => {
      const sessionYear = new Date(session.scheduledDate).getFullYear().toString();
      return sessionYear === reportYear;
    });
  }, [sessions, reportYear]);

  // Calculate monthly data for each unit
  const unitPerformanceData = useMemo(() => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const data = {};
    
    nephrologyUnits.forEach(unit => {
      data[unit.id] = {
        name: unit.name,
        code: unit.code,
        monthly: {},
        total: 0,
        average: 0,
        emergency: 0,
        completed: 0,
        attendanceRate: 0
      };

      months.forEach((month, index) => {
        const monthSessions = yearSessions.filter(session => {
          const sessionDate = new Date(session.scheduledDate);
          return sessionDate.getMonth() === index && getSessionUnit(session) === unit.id;
        });

        data[unit.id].monthly[month] = {
          total: monthSessions.length,
          completed: monthSessions.filter(s => s.status === 'completed').length,
          emergency: monthSessions.filter(s => s.sessionType === 'emergency' || s.isEmergency).length,
          present: monthSessions.filter(s => s.attendance === 'present').length,
          absent: monthSessions.filter(s => s.attendance === 'absent').length
        };
      });

      // Calculate totals
      const unitSessions = yearSessions.filter(session => getSessionUnit(session) === unit.id);
      data[unit.id].total = unitSessions.length;
      data[unit.id].average = Math.round(unitSessions.length / 12);
      data[unit.id].emergency = unitSessions.filter(s => s.sessionType === 'emergency' || s.isEmergency).length;
      data[unit.id].completed = unitSessions.filter(s => s.status === 'completed').length;
      
      const presentSessions = unitSessions.filter(s => s.attendance === 'present').length;
      data[unit.id].attendanceRate = unitSessions.length > 0 ? 
        Math.round((presentSessions / unitSessions.length) * 100) : 0;
    });

    return data;
  }, [yearSessions, nephrologyUnits]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const totalSessions = yearSessions.length;
    const totalCompleted = yearSessions.filter(s => s.status === 'completed').length;
    const totalEmergency = yearSessions.filter(s => s.sessionType === 'emergency' || s.isEmergency).length;
    const totalPresent = yearSessions.filter(s => s.attendance === 'present').length;
    
    return {
      totalSessions,
      totalCompleted,
      totalEmergency,
      completionRate: totalSessions > 0 ? Math.round((totalCompleted / totalSessions) * 100) : 0,
      emergencyRate: totalSessions > 0 ? Math.round((totalEmergency / totalSessions) * 100) : 0,
      attendanceRate: totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 100) : 0,
      averageMonthly: Math.round(totalSessions / 12),
      uniquePatients: new Set(yearSessions.map(s => s.patientId || s.patientNationalId)).size
    };
  }, [yearSessions]);

  // Prepare chart data for monthly trends
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const datasets = nephrologyUnits.map((unit, index) => {
      const colors = [
        { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)' }, // Blue
        { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgb(16, 185, 129)' }, // Green
        { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgb(245, 158, 11)' }   // Orange
      ];
      
      const unitData = unitPerformanceData[unit.id];
      const monthlyData = monthNames.map(month => unitData?.monthly[month]?.total || 0);

      return {
        label: unit.name,
        data: monthlyData,
        backgroundColor: colors[index]?.bg || 'rgba(107, 114, 128, 0.8)',
        borderColor: colors[index]?.border || 'rgb(107, 114, 128)',
        borderWidth: 2
      };
    });

    return {
      labels: months,
      datasets: datasets
    };
  }, [unitPerformanceData, nephrologyUnits]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Dialysis Sessions by Unit - ${reportYear}`
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Sessions'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    },
  };

  // Generate PDF Report
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create and download report
      const reportData = {
        title: `Unit Performance Annual Report - ${reportYear}`,
        generatedAt: new Date().toISOString(),
        year: reportYear,
        overallStats,
        unitData: unitPerformanceData
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Unit_Performance_Report_${reportYear}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Unit Performance Annual Report</h2>
            <p className="text-blue-100">
              Comprehensive analysis of nephrology unit performance for {reportYear}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{overallStats.totalSessions.toLocaleString()}</div>
            <div className="text-blue-100">Total Sessions</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Report Year
              </label>
              <select
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="w-4 h-4 inline mr-1" />
                Unit Filter
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Units</option>
                {nephrologyUnits.map(unit => (
                  <option key={unit.id} value={unit.id}>{unit.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Generate PDF</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalSessions.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Monthly avg: {overallStats.averageMonthly}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.completionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{overallStats.totalCompleted} completed</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.attendanceRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Patient attendance</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Rate</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.emergencyRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Emergency sessions</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Award className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Unit Comparison Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
            Unit Performance Comparison
          </h3>
          <div className="text-sm text-gray-500">
            Year: {reportYear}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-semibold text-gray-900 border-b">Unit</th>
                <th className="text-center p-4 font-semibold text-gray-900 border-b">Total Sessions</th>
                <th className="text-center p-4 font-semibold text-gray-900 border-b">Monthly Average</th>
                <th className="text-center p-4 font-semibold text-gray-900 border-b">Completion Rate</th>
                <th className="text-center p-4 font-semibold text-gray-900 border-b">Attendance Rate</th>
                <th className="text-center p-4 font-semibold text-gray-900 border-b">Emergency Sessions</th>
                <th className="text-center p-4 font-semibold text-gray-900 border-b">Performance</th>
              </tr>
            </thead>
            <tbody>
              {nephrologyUnits.map((unit) => {
                const data = unitPerformanceData[unit.id];
                if (!data || (selectedUnit !== 'all' && selectedUnit !== unit.id)) return null;
                
                const completionRate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                
                return (
                  <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-b">
                      <div>
                        <div className="font-medium text-gray-900">{data.name}</div>
                        <div className="text-sm text-gray-500">{data.code}</div>
                      </div>
                    </td>
                    <td className="p-4 border-b text-center">
                      <div className="font-semibold text-lg">{data.total.toLocaleString()}</div>
                    </td>
                    <td className="p-4 border-b text-center">
                      <div className="font-medium">{data.average}</div>
                    </td>
                    <td className="p-4 border-b text-center">
                      <div className={`font-medium ${completionRate >= 85 ? 'text-green-600' : completionRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {completionRate}%
                      </div>
                    </td>
                    <td className="p-4 border-b text-center">
                      <div className={`font-medium ${data.attendanceRate >= 80 ? 'text-green-600' : data.attendanceRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {data.attendanceRate}%
                      </div>
                    </td>
                    <td className="p-4 border-b text-center">
                      <div className="font-medium">{data.emergency}</div>
                    </td>
                    <td className="p-4 border-b text-center">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        completionRate >= 85 && data.attendanceRate >= 80 ? 'bg-green-100 text-green-800' :
                        completionRate >= 70 && data.attendanceRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {completionRate >= 85 && data.attendanceRate >= 80 ? 'Excellent' :
                         completionRate >= 70 && data.attendanceRate >= 60 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Breakdown Chart Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Monthly Session Trends
        </h3>
        
        <div className="mb-6">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Monthly Data Table */}
        <div className="mt-8">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Monthly Breakdown Table</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-900 border-b">Month</th>
                  {nephrologyUnits.map(unit => (
                    <th key={unit.id} className="text-center p-3 font-semibold text-gray-900 border-b">
                      {unit.code}
                    </th>
                  ))}
                  <th className="text-center p-3 font-semibold text-gray-900 border-b">Total</th>
                </tr>
              </thead>
              <tbody>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => {
                  const monthTotal = nephrologyUnits.reduce((sum, unit) => {
                    return sum + (unitPerformanceData[unit.id]?.monthly[month]?.total || 0);
                  }, 0);
                  
                  return (
                    <tr key={month} className="hover:bg-gray-50">
                      <td className="p-3 border-b font-medium">{month}</td>
                      {nephrologyUnits.map(unit => (
                        <td key={unit.id} className="p-3 border-b text-center">
                          {unitPerformanceData[unit.id]?.monthly[month]?.total || 0}
                        </td>
                      ))}
                      <td className="p-3 border-b text-center font-semibold">{monthTotal}</td>
                    </tr>
                  );
                })}
                <tr className="bg-blue-50 font-semibold">
                  <td className="p-3 border-b">Total</td>
                  {nephrologyUnits.map(unit => (
                    <td key={unit.id} className="p-3 border-b text-center">
                      {unitPerformanceData[unit.id]?.total || 0}
                    </td>
                  ))}
                  <td className="p-3 border-b text-center">{overallStats.totalSessions}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Key Insights and Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Key Insights & Performance Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Best Performing Unit */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Award className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-green-900">Top Performing Unit</h4>
            </div>
            {(() => {
              const topUnit = Object.entries(unitPerformanceData)
                .sort((a, b) => (b[1].attendanceRate + (b[1].total > 0 ? (b[1].completed / b[1].total * 100) : 0)) - 
                                (a[1].attendanceRate + (a[1].total > 0 ? (a[1].completed / a[1].total * 100) : 0)))[0];
              
              if (topUnit) {
                const [, data] = topUnit;
                const completionRate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                return (
                  <div>
                    <p className="text-green-800 font-medium">{data.name}</p>
                    <div className="text-sm text-green-700 space-y-1 mt-2">
                      <p>• Total Sessions: {data.total.toLocaleString()}</p>
                      <p>• Attendance Rate: {data.attendanceRate}%</p>
                      <p>• Completion Rate: {completionRate}%</p>
                    </div>
                  </div>
                );
              }
              return <p className="text-green-700">No data available</p>;
            })()}
          </div>

          {/* Performance Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Target className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-semibold text-blue-900">Performance Summary</h4>
            </div>
            <div className="text-sm text-blue-700 space-y-2">
              <div className="flex justify-between">
                <span>Total Annual Sessions:</span>
                <span className="font-medium">{overallStats.totalSessions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Average:</span>
                <span className="font-medium">{overallStats.averageMonthly}</span>
              </div>
              <div className="flex justify-between">
                <span>Overall Completion Rate:</span>
                <span className={`font-medium ${overallStats.completionRate >= 85 ? 'text-green-600' : 'text-blue-600'}`}>
                  {overallStats.completionRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Overall Attendance Rate:</span>
                <span className={`font-medium ${overallStats.attendanceRate >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                  {overallStats.attendanceRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Strategic Recommendations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-gray-800 mb-2">Capacity Optimization</h5>
              <ul className="text-gray-600 space-y-1">
                <li>• Peak months: May, July (plan for increased demand)</li>
                <li>• Low months: February, September (schedule maintenance)</li>
                <li>• Consider cross-unit staff allocation during peaks</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-800 mb-2">Quality Improvements</h5>
              <ul className="text-gray-600 space-y-1">
                <li>• Target: 90%+ attendance rate across all units</li>
                <li>• Implement patient reminder systems</li>
                <li>• Enhance emergency response protocols</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}