import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale
);

// Color palette for charts
export const chartColors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F97316',
  info: '#06B6D4',
  success: '#22C55E',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',

  // Gradient colors
  gradients: {
    blue: ['#3B82F6', '#1D4ED8'],
    green: ['#10B981', '#059669'],
    orange: ['#F59E0B', '#D97706'],
    red: ['#EF4444', '#DC2626'],
    purple: ['#8B5CF6', '#7C3AED'],
    pink: ['#EC4899', '#DB2777']
  },

  // Background colors with transparency
  backgrounds: {
    blue: 'rgba(59, 130, 246, 0.1)',
    green: 'rgba(16, 185, 129, 0.1)',
    orange: 'rgba(245, 158, 11, 0.1)',
    red: 'rgba(239, 68, 68, 0.1)',
    purple: 'rgba(139, 92, 246, 0.1)',
    pink: 'rgba(236, 72, 153, 0.1)'
  }
};

// Default chart options
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          family: 'Inter, sans-serif'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#374151',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      font: {
        family: 'Inter, sans-serif'
      }
    }
  },
  elements: {
    bar: {
      borderRadius: 4,
      borderSkipped: false,
    },
    line: {
      tension: 0.4
    },
    point: {
      radius: 4,
      hoverRadius: 6
    }
  }
};

// Line chart specific options
export const lineChartOptions = {
  ...defaultChartOptions,
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        font: {
          size: 11
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
};

// Bar chart specific options
export const barChartOptions = {
  ...defaultChartOptions,
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        font: {
          size: 11
        }
      }
    }
  }
};

// Doughnut chart specific options
export const doughnutChartOptions = {
  ...defaultChartOptions,
  cutout: '60%',
  plugins: {
    ...defaultChartOptions.plugins,
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12
        }
      }
    }
  }
};

// Polar area chart options
export const polarAreaOptions = {
  ...defaultChartOptions,
  scales: {
    r: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        display: false
      }
    }
  }
};

// Utility functions for data processing
export const chartUtils = {
  // Generate gradient
  createGradient: (ctx, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  },

  // Format date for charts
  formatDateForChart: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  },

  // Format month for charts
  formatMonthForChart: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit'
    });
  },

  // Get last N days
  getLastNDays: (n) => {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  },

  // Get last N months
  getLastNMonths: (n) => {
    const months = [];
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push(date.toISOString().slice(0, 7)); // YYYY-MM format
    }
    return months;
  },

  // Calculate percentage
  calculatePercentage: (part, total) => {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  },

  // Group data by date
  groupByDate: (data, dateField) => {
    return data.reduce((acc, item) => {
      const date = item[dateField]?.split('T')[0] || item[dateField];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});
  },

  // Group data by month
  groupByMonth: (data, dateField) => {
    return data.reduce((acc, item) => {
      const month = item[dateField]?.slice(0, 7) || item[dateField]?.slice(0, 7);
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(item);
      return acc;
    }, {});
  },

  // Get random color from palette
  getRandomColor: () => {
    const colors = Object.values(chartColors).filter(color => typeof color === 'string');
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // Generate color array
  generateColorArray: (count) => {
    const colors = [];
    const baseColors = [
      chartColors.primary,
      chartColors.secondary,
      chartColors.accent,
      chartColors.purple,
      chartColors.pink,
      chartColors.info
    ];

    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  }
};

export default ChartJS;