// Mock API Service for Dialysis Analytics
// This simulates backend endpoints until they are implemented

class MockDialysisAnalyticsAPI {
  constructor() {
    this.baseURL = 'http://localhost:8080';
    this.isEnabled = false; // Set to true to enable mock responses
  }

  // Mock machine data
  generateMockMachineData() {
    return [
      {
        machineId: 'DM-001',
        status: 'ACTIVE',
        location: 'Room A1',
        lastMaintenance: '2024-12-01',
        totalSessions: 145,
        hoursUsed: 1200,
        efficiency: 98
      },
      {
        machineId: 'DM-002',
        status: 'IN_USE',
        location: 'Room A2',
        lastMaintenance: '2024-12-02',
        totalSessions: 132,
        hoursUsed: 1180,
        efficiency: 95
      },
      {
        machineId: 'DM-003',
        status: 'ACTIVE',
        location: 'Room A3',
        lastMaintenance: '2024-12-03',
        totalSessions: 128,
        hoursUsed: 1050,
        efficiency: 97
      },
      {
        machineId: 'DM-004',
        status: 'IN_USE',
        location: 'Room B1',
        lastMaintenance: '2024-11-28',
        totalSessions: 156,
        hoursUsed: 1340,
        efficiency: 92
      },
      {
        machineId: 'DM-005',
        status: 'MAINTENANCE',
        location: 'Room B2',
        lastMaintenance: '2024-11-25',
        totalSessions: 98,
        hoursUsed: 890,
        efficiency: 89
      },
      {
        machineId: 'DM-006',
        status: 'ACTIVE',
        location: 'Room B3',
        lastMaintenance: '2024-12-01',
        totalSessions: 142,
        hoursUsed: 1220,
        efficiency: 96
      },
      {
        machineId: 'DM-007',
        status: 'IN_USE',
        location: 'Room C1',
        lastMaintenance: '2024-11-30',
        totalSessions: 134,
        hoursUsed: 1150,
        efficiency: 94
      },
      {
        machineId: 'DM-008',
        status: 'ACTIVE',
        location: 'Room C2',
        lastMaintenance: '2024-12-02',
        totalSessions: 139,
        hoursUsed: 1190,
        efficiency: 97
      }
    ];
  }

  // Mock session analytics data
  generateMockSessionAnalytics(timeRange = '7days') {
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        scheduledSessions: Math.floor(Math.random() * 20) + 15,
        completedSessions: Math.floor(Math.random() * 18) + 12,
        cancelledSessions: Math.floor(Math.random() * 3),
        averageDuration: Math.floor(Math.random() * 60) + 210, // 210-270 minutes
        efficiencyRate: Math.floor(Math.random() * 15) + 85 // 85-100%
      });
    }
    
    return data;
  }

  // Mock treatment outcomes
  generateMockTreatmentOutcomes() {
    return {
      totalTreatments: 2847,
      successfulTreatments: 2785,
      incompletetreatments: 45,
      emergencyInterventions: 17,
      averageFluidRemoval: 2.3, // liters
      averageTreatmentTime: 242, // minutes
      patientSatisfactionScore: 4.6,
      complicationRate: 1.2, // percentage
      byTimeSlot: {
        '06:00': { completed: 145, scheduled: 152, efficiency: 95.4 },
        '10:00': { completed: 198, scheduled: 205, efficiency: 96.6 },
        '14:00': { completed: 223, scheduled: 230, efficiency: 97.0 },
        '18:00': { completed: 167, scheduled: 172, efficiency: 97.1 },
        '22:00': { completed: 89, scheduled: 95, efficiency: 93.7 }
      }
    };
  }

  // Mock patient demographics
  generateMockPatientDemographics() {
    return {
      totalPatients: 156,
      ageGroups: {
        '18-30': 12,
        '31-45': 28,
        '46-60': 45,
        '61-75': 52,
        '75+': 19
      },
      genderDistribution: {
        male: 89,
        female: 67
      },
      treatmentTypes: {
        regular: 134,
        emergency: 15,
        temporary: 7
      },
      chronicConditions: {
        diabetes: 89,
        hypertension: 72,
        kidney_disease: 156,
        heart_disease: 34
      },
      averageSessionsPerWeek: 2.8,
      newPatientsThisMonth: 8,
      dischargedPatientsThisMonth: 5
    };
  }

  // Mock machine utilization data
  generateMockMachineUtilization() {
    return {
      totalMachines: 8,
      activeCount: 3,
      inUseCount: 3,
      maintenanceCount: 1,
      outOfOrderCount: 1,
      utilizationRate: 87.5, // percentage
      peakHours: ['10:00', '14:00', '18:00'],
      lowUtilizationHours: ['22:00', '06:00'],
      maintenanceScheduled: [
        {
          machineId: 'DM-005',
          scheduledDate: '2024-12-15',
          type: 'routine',
          estimatedDuration: '4 hours'
        }
      ],
      performanceMetrics: {
        averageUptime: 96.2,
        averageEfficiency: 94.8,
        maintenanceFrequency: 'monthly',
        lastCalibration: '2024-11-30'
      }
    };
  }

  // API endpoint simulation methods
  async getMachineData() {
    if (!this.isEnabled) {
      throw new Error('Mock API disabled');
    }
    
    // Simulate API delay
    await this.delay(500);
    return this.generateMockMachineData();
  }

  async getSessionAnalytics(timeRange = '7days') {
    if (!this.isEnabled) {
      throw new Error('Mock API disabled');
    }
    
    await this.delay(300);
    return this.generateMockSessionAnalytics(timeRange);
  }

  async getTreatmentOutcomes() {
    if (!this.isEnabled) {
      throw new Error('Mock API disabled');
    }
    
    await this.delay(400);
    return this.generateMockTreatmentOutcomes();
  }

  async getPatientDemographics() {
    if (!this.isEnabled) {
      throw new Error('Mock API disabled');
    }
    
    await this.delay(350);
    return this.generateMockPatientDemographics();
  }

  async getMachineUtilization() {
    if (!this.isEnabled) {
      throw new Error('Mock API disabled');
    }
    
    await this.delay(250);
    return this.generateMockMachineUtilization();
  }

  // Utility methods
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Enable/disable mock API
  enableMockAPI(enable = true) {
    this.isEnabled = enable;
    console.log(`Mock Dialysis Analytics API ${enable ? 'enabled' : 'disabled'}`);
  }

  // Get all analytics data at once
  async getAllAnalytics(timeRange = '7days') {
    if (!this.isEnabled) {
      throw new Error('Mock API disabled');
    }

    const [
      machines,
      sessions,
      treatments,
      demographics,
      utilization
    ] = await Promise.all([
      this.getMachineData(),
      this.getSessionAnalytics(timeRange),
      this.getTreatmentOutcomes(),
      this.getPatientDemographics(),
      this.getMachineUtilization()
    ]);

    return {
      machines,
      sessions,
      treatments,
      demographics,
      utilization,
      timestamp: new Date().toISOString(),
      timeRange
    };
  }
}

// Export singleton instance
const mockDialysisAnalyticsAPI = new MockDialysisAnalyticsAPI();

export default mockDialysisAnalyticsAPI;

// Usage example:
// import mockAPI from './mockDialysisAnalyticsAPI';
// 
// // Enable mock API for testing
// mockAPI.enableMockAPI(true);
// 
// // Fetch analytics data
// const analyticsData = await mockAPI.getAllAnalytics('7days');
// console.log(analyticsData);