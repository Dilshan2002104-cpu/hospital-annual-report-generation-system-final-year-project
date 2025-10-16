// Laboratory Analytics Data Generator
// This file contains sample data for testing the Laboratory Dashboard Analytics

export const generateLabAnalyticsData = () => {
  return {
    // Monthly test volume data for 2025
    monthlyTestVolume: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      data: [145, 152, 148, 151, 149, 147, 150, 153, 146, 128],
      growth: [0, 4.8, -2.6, 2.0, -1.3, -1.3, 2.0, 2.0, -4.6, -12.3]
    },

    // Test types distribution
    testTypesDistribution: [
      { name: 'Complete Blood Count', value: 35, color: '#3B82F6' },
      { name: 'Blood Glucose', value: 25, color: '#10B981' },
      { name: 'Urine Analysis', value: 25, color: '#F59E0B' },
      { name: 'Cholesterol Level', value: 15, color: '#EF4444' },
      { name: 'Other Tests', value: 10, color: '#8B5CF6' }
    ],

    // Ward-wise test distribution
    wardDistribution: {
      labels: ['Ward 1', 'Ward 2', 'Ward 3', 'ICU', 'Emergency'],
      data: [89, 76, 82, 65, 43],
      percentages: [25.4, 21.7, 23.4, 18.6, 12.3]
    },

    // Turnaround time by priority
    turnaroundTimes: {
      emergency: { average: 3.2, target: 4.0, performance: 120 }, // 120% of target (better)
      urgent: { average: 5.8, target: 6.0, performance: 103 },
      normal: { average: 12.4, target: 24.0, performance: 194 }
    },

    // Equipment utilization rates
    equipmentUtilization: [
      { name: 'Hematology Analyzer', utilization: 85, status: 'optimal' },
      { name: 'Chemistry Analyzer', utilization: 78, status: 'good' },
      { name: 'Urine Analyzer', utilization: 72, status: 'good' },
      { name: 'Microscope', utilization: 90, status: 'high' },
      { name: 'Centrifuge', utilization: 88, status: 'optimal' }
    ],

    // Daily test volume (last 7 days)
    dailyVolume: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [45, 52, 48, 61, 55, 28, 15],
      averages: [47, 49, 46, 58, 53, 25, 18] // Historical averages for comparison
    },

    // Quality metrics
    qualityMetrics: {
      accuracy: 96.8,
      precision: 94.2,
      sampleRejectionRate: 2.1,
      repeatTestRate: 3.8,
      criticalValueNotification: 98.5,
      customerSatisfaction: 92.1
    },

    // Performance indicators
    performanceIndicators: {
      totalTests: 469,
      completedTests: 441,
      pendingTests: 28,
      completionRate: 94.0,
      avgTurnaroundTime: 6.2,
      equipmentUptime: 91.5,
      staffProductivity: 87.3
    },

    // Peak hours analysis
    peakHours: {
      busiest: '9:00-11:00 AM',
      busiestCount: 89,
      quietest: '2:00-4:00 PM',
      quietestCount: 23,
      hourlyDistribution: [
        { hour: '6:00', tests: 8 },
        { hour: '7:00', tests: 15 },
        { hour: '8:00', tests: 32 },
        { hour: '9:00', tests: 67 },
        { hour: '10:00', tests: 89 },
        { hour: '11:00', tests: 78 },
        { hour: '12:00', tests: 45 },
        { hour: '13:00', tests: 38 },
        { hour: '14:00', tests: 23 },
        { hour: '15:00', tests: 28 },
        { hour: '16:00', tests: 41 },
        { hour: '17:00', tests: 35 },
        { hour: '18:00', tests: 18 }
      ]
    },

    // Test result trends
    resultTrends: {
      normalResults: 78.5,
      abnormalResults: 18.2,
      criticalResults: 3.3,
      trendDirection: 'stable'
    },

    // Department performance comparison
    departmentComparison: {
      labels: ['Hematology', 'Chemistry', 'Microbiology', 'Pathology'],
      efficiency: [94, 87, 91, 89],
      volume: [156, 142, 89, 67],
      turnaround: [4.2, 6.8, 8.1, 12.5]
    },

    // Monthly trends
    monthlyTrends: {
      testVolumeTrend: 'increasing',
      turnaroundTrend: 'improving',
      qualityTrend: 'stable',
      equipmentTrend: 'stable'
    }
  };
};

// Generate sample lab request data
export const generateLabRequests = (count = 50) => {
  const priorities = ['EMERGENCY', 'URGENT', 'NORMAL'];
  const statuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];
  const testTypes = ['Complete Blood Count', 'Blood Glucose', 'Urine Analysis', 'Cholesterol Level'];
  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'ICU'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `LAB-2025${String(i + 1).padStart(4, '0')}`,
    patientName: `Patient ${i + 1}`,
    testType: testTypes[Math.floor(Math.random() * testTypes.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    ward: wards[Math.floor(Math.random() * wards.length)],
    requestDate: new Date(2025, Math.floor(Math.random() * 10), Math.floor(Math.random() * 28) + 1),
    completionDate: Math.random() > 0.3 ? new Date() : null,
    turnaroundTime: Math.random() * 20 + 2 // 2-22 hours
  }));
};

// Chart.js color palette
export const chartColors = {
  primary: '#8B5CF6',
  secondary: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  light: '#F8FAFC',
  dark: '#1E293B'
};

// Chart.js default options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#8B5CF6',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: '#64748B'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#64748B'
      }
    }
  }
};

export default generateLabAnalyticsData;