import { useState, useEffect, useCallback } from 'react';

const usePharmacyAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate mock data for testing purposes
  const generateMockData = useCallback(() => {
    const mockData = {
      prescriptionAnalytics: {
        totalPrescriptions: 450,
        activePrescriptions: 89,
        completedPrescriptions: 361,
        urgentPrescriptions: 12,
        averageProcessingTimeHours: 2.3,
        processingRate: 92.5,
        dailyVolume: [
          { date: '2024-01-01', totalPrescriptions: 65, urgentPrescriptions: 3 },
          { date: '2024-01-02', totalPrescriptions: 72, urgentPrescriptions: 5 },
          { date: '2024-01-03', totalPrescriptions: 58, urgentPrescriptions: 2 },
          { date: '2024-01-04', totalPrescriptions: 83, urgentPrescriptions: 4 },
          { date: '2024-01-05', totalPrescriptions: 79, urgentPrescriptions: 6 },
          { date: '2024-01-06', totalPrescriptions: 45, urgentPrescriptions: 1 },
          { date: '2024-01-07', totalPrescriptions: 48, urgentPrescriptions: 2 }
        ],
        statusDistribution: {
          'ACTIVE': 89,
          'COMPLETED': 361,
          'CANCELLED': 12,
          'PENDING': 23
        }
      },
      inventoryAnalytics: {
        totalMedications: 1250,
        lowStockCount: 15,
        outOfStockCount: 3,
        expiringCount: 8,
        totalInventoryValue: 125750.50,
        stockStatusDistribution: {
          'IN_STOCK': 1224,
          'LOW_STOCK': 15,
          'OUT_OF_STOCK': 3,
          'EXPIRING_SOON': 8
        },
        topDispensedMedications: [
          { drugName: 'Paracetamol', totalDispensed: 245, revenue: 1225.50 },
          { drugName: 'Amoxicillin', totalDispensed: 189, revenue: 2835.75 },
          { drugName: 'Ibuprofen', totalDispensed: 167, revenue: 1003.50 },
          { drugName: 'Metformin', totalDispensed: 143, revenue: 2145.25 },
          { drugName: 'Aspirin', totalDispensed: 128, revenue: 640.00 }
        ],
        expiringMedications: [
          {
            drugName: 'Amoxicillin',
            batchNumber: 'AMX2024001',
            expiryDate: '2024-02-15',
            currentStock: 25,
            daysUntilExpiry: 15
          },
          {
            drugName: 'Insulin',
            batchNumber: 'INS2024003',
            expiryDate: '2024-01-28',
            currentStock: 12,
            daysUntilExpiry: 3
          }
        ]
      },
      performanceMetrics: {
        dispensingEfficiency: 94.2,
        averageWaitTime: 12.5,
        totalPatientsServed: 361,
        customerSatisfactionScore: 4.3
      },
      revenueAnalytics: {
        totalRevenue: 18750.25,
        monthlyRevenue: 15240.80,
        dailyRevenue: 520.15,
        averageTransactionValue: 52.08,
        revenueHistory: [
          { date: '2024-01-01', revenue: 1845.30 },
          { date: '2024-01-02', revenue: 2156.75 },
          { date: '2024-01-03', revenue: 1923.50 },
          { date: '2024-01-04', revenue: 2489.20 },
          { date: '2024-01-05', revenue: 2234.90 },
          { date: '2024-01-06', revenue: 1678.45 },
          { date: '2024-01-07', revenue: 1422.15 }
        ]
      }
    };
    
    setAnalyticsData(mockData);
    setLoading(false);
    setError(null);
  }, []);

  const fetchAnalyticsData = useCallback(async (period = '7d') => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from all available endpoints
      const [
        prescriptionResponse,
        inventoryResponse,
        performanceResponse,
        revenueResponse
      ] = await Promise.all([
        fetch(`/api/pharmacy/analytics/prescriptions?period=${period}`),
        fetch('/api/pharmacy/analytics/inventory'),
        fetch(`/api/pharmacy/analytics/performance?period=${period}`),
        fetch(`/api/pharmacy/analytics/revenue?period=${period}`)
      ]);

      const [
        prescriptionResult,
        inventoryResult,
        performanceResult,
        revenueResult
      ] = await Promise.all([
        prescriptionResponse.json(),
        inventoryResponse.json(),
        performanceResponse.json(),
        revenueResponse.json()
      ]);

      // Check if all requests were successful
      if (prescriptionResponse.ok && inventoryResponse.ok && 
          performanceResponse.ok && revenueResponse.ok) {
        
        const combinedData = {
          prescriptionAnalytics: prescriptionResult.data || prescriptionResult,
          inventoryAnalytics: inventoryResult.data || inventoryResult,
          performanceMetrics: performanceResult.data || performanceResult,
          revenueAnalytics: revenueResult.data || revenueResult
        };

        setAnalyticsData(combinedData);
      } else {
        // If any request fails, fall back to mock data
        console.warn('Some API calls failed, using mock data');
        generateMockData();
      }
    } catch (err) {
      console.warn('Network error, falling back to mock data:', err);
      generateMockData();
    } finally {
      setLoading(false);
    }
  }, [generateMockData]);

  const fetchPrescriptionAnalytics = useCallback(async (period = '7d') => {
    try {
      const response = await fetch(`/api/pharmacy/analytics/prescriptions?period=${period}`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch prescription analytics');
      }
    } catch (err) {
      console.error('Prescription analytics fetch error:', err);
      throw err;
    }
  }, []);

  const fetchInventoryAnalytics = useCallback(async () => {
    try {
      const response = await fetch('/api/pharmacy/analytics/inventory');
      const result = await response.json();
      
      if (response.ok && result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch inventory analytics');
      }
    } catch (err) {
      console.error('Inventory analytics fetch error:', err);
      throw err;
    }
  }, []);

  const fetchPerformanceMetrics = useCallback(async (period = '7d') => {
    try {
      const response = await fetch(`/api/pharmacy/analytics/performance?period=${period}`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch performance metrics');
      }
    } catch (err) {
      console.error('Performance metrics fetch error:', err);
      throw err;
    }
  }, []);

  const fetchRevenueAnalytics = useCallback(async (period = '7d') => {
    try {
      const response = await fetch(`/api/pharmacy/analytics/revenue?period=${period}`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch revenue analytics');
      }
    } catch (err) {
      console.error('Revenue analytics fetch error:', err);
      throw err;
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await fetch('/api/pharmacy/analytics/alerts');
      const result = await response.json();
      
      if (response.ok && result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch alerts');
      }
    } catch (err) {
      console.error('Alerts fetch error:', err);
      throw err;
    }
  }, []);

  const refreshAnalytics = useCallback((period = '7d') => {
    fetchAnalyticsData(period);
  }, [fetchAnalyticsData]);

  // Initialize with real data first, fallback to mock data if needed
  useEffect(() => {
    fetchAnalyticsData().catch(() => {
      console.log('Using mock analytics data for development');
      generateMockData();
    });
  }, [fetchAnalyticsData, generateMockData]);

  return {
    analyticsData,
    loading,
    error,
    fetchAnalyticsData,
    fetchPrescriptionAnalytics,
    fetchInventoryAnalytics,
    fetchPerformanceMetrics,
    fetchRevenueAnalytics,
    fetchAlerts,
    refreshAnalytics,
    generateMockData
  };
};

export default usePharmacyAnalytics;