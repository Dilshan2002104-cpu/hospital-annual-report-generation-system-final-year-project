// Complete API Configuration for HMS
// This file centralizes ALL API endpoints and provides dynamic URL resolution

// Dynamic API base URL detection
const getApiBaseUrl = () => {
  // In production, detect the current host and use port 8080
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    
    // If accessing from an IP address (like EC2), use that IP
    if (currentHost.match(/^\d+\.\d+\.\d+\.\d+/) || 
        (currentHost !== 'localhost' && currentHost !== '127.0.0.1')) {
      return `http://${currentHost}:8080`;
    }
  }
  
  // Environment variable override (for Docker builds)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();

// Complete API Endpoints Configuration
export const API_ENDPOINTS = {
  // Base URLs
  BASE: API_BASE_URL,
  API: `${API_BASE_URL}/api`,

  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },

  // Patient Management
  PATIENTS: {
    ALL: `${API_BASE_URL}/api/patients/all`,
    BY_ID: (nationalId) => `${API_BASE_URL}/api/patients/${nationalId}`,
    REGISTER: `${API_BASE_URL}/api/patients/register`,
  },

  // Ward Management
  WARDS: {
    GET_ALL: `${API_BASE_URL}/api/wards/getAll`,
  },

  // Admissions
  ADMISSIONS: {
    ADMIT: `${API_BASE_URL}/api/admissions/admit`,
    ACTIVE: `${API_BASE_URL}/api/admissions/active`,
    ALL: `${API_BASE_URL}/api/admissions/getAll`,
    BY_WARD: (wardId) => `${API_BASE_URL}/api/admissions/ward/${wardId}`,
    DISCHARGE: (admissionId) => `${API_BASE_URL}/api/admissions/discharge/${admissionId}`,
  },

  // Pharmacy Management
  PHARMACY: {
    MEDICATIONS: {
      GET_ALL: `${API_BASE_URL}/api/pharmacy/medications/getAll`,
      INVENTORY: `${API_BASE_URL}/api/pharmacy/medications/inventory`,
      ADD: `${API_BASE_URL}/api/pharmacy/medications/add`,
      UPDATE_STOCK: (medicationId) => `${API_BASE_URL}/api/pharmacy/medications/${medicationId}/stock`,
      ALERTS: `${API_BASE_URL}/api/pharmacy/medications/alerts`,
    },
    ANALYTICS: {
      MONTHLY_DISPENSING: (year) => `${API_BASE_URL}/api/pharmacy/analytics/annual/monthly-dispensing?year=${year}`,
      TOP_MEDICATIONS: (year, limit = 20) => `${API_BASE_URL}/api/pharmacy/analytics/annual/top-medications?year=${year}&limit=${limit}`,
    },
  },

  // Prescriptions
  PRESCRIPTIONS: {
    ALL: `${API_BASE_URL}/api/prescriptions/all`,
    CREATE: `${API_BASE_URL}/api/prescriptions`,
    BY_ID: (prescriptionId) => `${API_BASE_URL}/api/prescriptions/${prescriptionId}`,
    ITEMS: (prescriptionId) => `${API_BASE_URL}/api/prescriptions/${prescriptionId}/items`,
    ITEM_BY_ID: (prescriptionId, itemId) => `${API_BASE_URL}/api/prescriptions/${prescriptionId}/items/${itemId}`,
    UPDATE_STATUS: (prescriptionId) => `${API_BASE_URL}/api/prescriptions/${prescriptionId}/status`,
    PROCESS: (prescriptionId) => `${API_BASE_URL}/api/prescriptions/prescription-id/${prescriptionId}/process`,
    DISPENSE: (prescriptionId) => `${API_BASE_URL}/api/prescriptions/prescription-id/${prescriptionId}/dispense`,
    CANCEL: (prescriptionId) => `${API_BASE_URL}/api/prescriptions/prescription-id/${prescriptionId}/cancel`,
    CHECK_INTERACTIONS: (prescriptionId) => `${API_BASE_URL}/api/prescriptions/prescription-id/${prescriptionId}/check-interactions`,
    PDF: (prescriptionId) => `${API_BASE_URL}/api/prescriptions/${prescriptionId}/pdf`,
  },

  // Clinic Prescriptions
  CLINIC: {
    PRESCRIPTIONS: {
      ALL: `${API_BASE_URL}/api/clinic/prescriptions`,
      BY_ID: (prescriptionId) => `${API_BASE_URL}/api/clinic/prescriptions/prescription/${prescriptionId}`,
      UPDATE_STATUS: (id) => `${API_BASE_URL}/api/clinic/prescriptions/${id}/status`,
      DISPENSE: (prescriptionId) => `${API_BASE_URL}/api/clinic/prescriptions/prescription/${prescriptionId}/dispense`,
      CANCEL: (prescriptionId) => `${API_BASE_URL}/api/clinic/prescriptions/prescription/${prescriptionId}/cancel`,
      PDF: (prescriptionId) => `${API_BASE_URL}/api/clinic/prescriptions/${prescriptionId}/pdf`,
    },
  },

  // Laboratory
  LAB: {
    SAMPLES: {
      ALL: `${API_BASE_URL}/api/lab/samples`,
      CREATE: `${API_BASE_URL}/api/lab/samples`,
      UPDATE_STATUS: (sampleId) => `${API_BASE_URL}/api/lab/samples/${sampleId}/status`,
      SEARCH: `${API_BASE_URL}/api/lab/samples/search`,
    },
    RESULTS: {
      ALL: `${API_BASE_URL}/api/lab/results`,
      CREATE: `${API_BASE_URL}/api/lab/results`,
      VALIDATE: (resultId) => `${API_BASE_URL}/api/lab/results/${resultId}/validate`,
      APPROVE: (resultId) => `${API_BASE_URL}/api/lab/results/${resultId}/approve`,
    },
    TEST_ORDERS: {
      ALL: `${API_BASE_URL}/api/lab/test-orders`,
      CREATE: `${API_BASE_URL}/api/lab/test-orders`,
      UPDATE: (orderId) => `${API_BASE_URL}/api/lab/test-orders/${orderId}`,
      PROCESS: (orderId) => `${API_BASE_URL}/api/lab/test-orders/${orderId}/process`,
    },
    EQUIPMENT: {
      ALL: `${API_BASE_URL}/api/lab/equipment`,
      UPDATE: (equipmentId) => `${API_BASE_URL}/api/lab/equipment/${equipmentId}`,
      MAINTENANCE: (equipmentId) => `${API_BASE_URL}/api/lab/equipment/${equipmentId}/maintenance`,
    },
    REQUESTS: {
      ALL: `${API_BASE_URL}/api/lab-requests/all`,
      CREATE: `${API_BASE_URL}/api/lab-requests/create`,
      BY_WARD: (wardName) => `${API_BASE_URL}/api/lab-requests/ward/${encodeURIComponent(wardName)}`,
      BY_PATIENT: (patientNationalId) => `${API_BASE_URL}/api/lab-requests/patient/${patientNationalId}`,
      PENDING: `${API_BASE_URL}/api/lab-requests/pending`,
    },
  },

  // Dialysis
  DIALYSIS: {
    SESSIONS: {
      ALL: `${API_BASE_URL}/api/dialysis/sessions`,
      CREATE: `${API_BASE_URL}/api/dialysis/sessions`,
      UPDATE: (sessionId) => `${API_BASE_URL}/api/dialysis/sessions/${sessionId}`,
      DELETE: (sessionId) => `${API_BASE_URL}/api/dialysis/sessions/${sessionId}`,
      ATTENDANCE: (sessionId) => `${API_BASE_URL}/api/dialysis/sessions/${sessionId}/attendance`,
      DETAILS: (sessionId) => `${API_BASE_URL}/api/dialysis/sessions/${sessionId}/details`,
      PDF_REPORT: (sessionId) => `${API_BASE_URL}/api/dialysis/sessions/${sessionId}/report/pdf`,
    },
    MACHINES: {
      STATUS: (machineId) => `${API_BASE_URL}/api/dialysis/machines/${machineId}/status`,
      AVAILABLE_FOR_TIME: `${API_BASE_URL}/api/dialysis/machines/available-for-time`,
      AVAILABILITY_STATUS: `${API_BASE_URL}/api/dialysis/machines/availability-status`,
    },
    ANALYTICS: {
      MACHINE_PERFORMANCE: (startDate, endDate) => `${API_BASE_URL}/api/dialysis/analytics/machine-performance?startDate=${startDate}&endDate=${endDate}`,
      SESSION_TRENDS: (days) => `${API_BASE_URL}/api/dialysis/analytics/session-trends?days=${days}`,
    },
  },

  // Appointments
  APPOINTMENTS: {
    CREATE: `${API_BASE_URL}/api/appointments/create`,
    ALL: `${API_BASE_URL}/api/appointments/getAll`,
    BY_ID: (appointmentId) => `${API_BASE_URL}/api/appointments/${appointmentId}`,
    BY_DOCTOR: (doctorId) => `${API_BASE_URL}/api/appointments/doctor/${doctorId}`,
    BY_PATIENT: (patientId) => `${API_BASE_URL}/api/appointments/patient/${patientId}`,
    BY_DATE: (date) => `${API_BASE_URL}/api/appointments/date/${date}`,
    DOCTOR_BY_DATE: (doctorId, date) => `${API_BASE_URL}/api/appointments/doctor/${doctorId}/date/${date}`,
    UPCOMING_DOCTOR: (doctorId) => `${API_BASE_URL}/api/appointments/doctor/${doctorId}/upcoming`,
    UPCOMING_PATIENT: (patientId) => `${API_BASE_URL}/api/appointments/patient/${patientId}/upcoming`,
    UPDATE_STATUS: (appointmentId) => `${API_BASE_URL}/api/appointments/${appointmentId}/status`,
    CANCEL: (appointmentId) => `${API_BASE_URL}/api/appointments/${appointmentId}/cancel`,
    CONFIRM: (appointmentId) => `${API_BASE_URL}/api/appointments/${appointmentId}/confirm`,
    COMPLETE: (appointmentId) => `${API_BASE_URL}/api/appointments/${appointmentId}/complete`,
    DELETE: (appointmentId) => `${API_BASE_URL}/api/appointments/${appointmentId}`,
    BY_STATUS: (status) => `${API_BASE_URL}/api/appointments/status/${status}`,
    BETWEEN_DATES: `${API_BASE_URL}/api/appointments/between`,
  },

  // Doctors
  DOCTORS: {
    ALL: `${API_BASE_URL}/api/doctors/getAll`,
    ADD: `${API_BASE_URL}/api/doctors/add`,
  },

  // Transfers
  TRANSFERS: {
    INSTANT: `${API_BASE_URL}/api/transfers/instant`,
    ALL: `${API_BASE_URL}/api/transfers/all`,
    PATIENT_HISTORY: (patientNationalId) => `${API_BASE_URL}/api/transfers/patient/${patientNationalId}/history`,
  },

  // Test Results
  TEST_RESULTS: {
    ALL: `${API_BASE_URL}/api/test-results/all`,
    BY_PATIENT_RECENT: (patientNationalId) => `${API_BASE_URL}/api/test-results/patient/${patientNationalId}/recent`,
    BY_PATIENT: (patientNationalId) => `${API_BASE_URL}/api/test-results/patient/${patientNationalId}`,
    CREATE_SAMPLE_DATA: `${API_BASE_URL}/api/test-results/create-sample-data`,
    SAVE: `${API_BASE_URL}/api/test-results/save`,
  },

  // Reports
  REPORTS: {
    WARD_STATISTICS: {
      BY_WARD_YEAR: (ward, year) => `${API_BASE_URL}/api/reports/ward-statistics/ward/${ward}/year/${year}`,
      HOSPITAL_WIDE_YEAR: (year) => `${API_BASE_URL}/api/reports/ward-statistics/hospital-wide/${year}`,
      EXPORT_PDF_HOSPITAL: (year) => `${API_BASE_URL}/api/reports/ward-statistics/hospital-wide/export-pdf/${year}`,
      EXPORT_PDF_WARD: (ward, year) => `${API_BASE_URL}/api/reports/ward-statistics/ward/${ward}/export-pdf/${year}`,
    },
  },

  // Debug/Testing
  DEBUG: {
    HELLO: `${API_BASE_URL}/api/simple-test/hello`,
    DATABASE_CONNECTION: `${API_BASE_URL}/api/debug/database-connection`,
    LAB_REQUEST: (requestId) => `${API_BASE_URL}/api/debug/lab-request/${requestId}`,
    TEST_SIMPLE_SAVE: `${API_BASE_URL}/api/test-simple/save-basic`,
    TEST_RESULTS_SIMPLE: `${API_BASE_URL}/api/test-results-simple/test-save`,
  },
};

// WebSocket Configuration
export const getWebSocketUrl = () => {
  const baseUrl = API_BASE_URL.replace('http://', '').replace('https://', '');
  return `ws://${baseUrl}/ws`;
};

// Helper Functions
export const buildApiUrl = (endpoint) => {
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

// Query parameter builder
export const buildQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      query.append(key, value);
    }
  });
  return query.toString();
};

// Common API configurations
export const getAuthHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Log configuration for debugging
console.log('🔧 HMS API Configuration:', {
  API_BASE_URL,
  currentHost: typeof window !== 'undefined' ? window.location.host : 'server',
  environment: import.meta.env?.MODE || 'unknown'
});