// API Configuration
// This file centralizes all API endpoint configurations

// Get the base URL from environment variable or default to localhost for development
const getApiBaseUrl = () => {
  // Check if we're in production (deployed)
  if (typeof window !== 'undefined') {
    const currentHost = window.location.host;
    
    // If accessing from an IP address (like EC2), use that IP
    if (currentHost.match(/^\d+\.\d+\.\d+\.\d+/)) {
      return `http://${currentHost.split(':')[0]}:8080`;
    }
    
    // If accessing from a domain, use the same domain
    if (currentHost !== 'localhost:3000' && currentHost !== 'localhost') {
      const hostWithoutPort = currentHost.split(':')[0];
      return `http://${hostWithoutPort}:8080`;
    }
  }
  
  // Environment variable override (for Docker)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:8080';
};

// Export the base URL
export const API_BASE_URL = getApiBaseUrl();

// Export common API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  
  // Patients
  PATIENTS: {
    ALL: `${API_BASE_URL}/api/patients/all`,
    REGISTER: `${API_BASE_URL}/api/patients/register`,
  },
  
  // Pharmacy
  PHARMACY: {
    MEDICATIONS: `${API_BASE_URL}/api/pharmacy/medications`,
    INVENTORY: `${API_BASE_URL}/api/pharmacy/medications/inventory`,
    ADD_MEDICATION: `${API_BASE_URL}/api/pharmacy/medications/add`,
  },
  
  // Prescriptions
  PRESCRIPTIONS: {
    ALL: `${API_BASE_URL}/api/prescriptions/all`,
    CREATE: `${API_BASE_URL}/api/prescriptions`,
    CLINIC: `${API_BASE_URL}/api/clinic/prescriptions`,
  },
  
  // Ward Management
  WARDS: {
    ALL: `${API_BASE_URL}/api/wards/getAll`,
  },
  
  // Admissions
  ADMISSIONS: {
    ADMIT: `${API_BASE_URL}/api/admissions/admit`,
    ACTIVE: `${API_BASE_URL}/api/admissions/active`,
    ALL: `${API_BASE_URL}/api/admissions/getAll`,
  },
  
  // Lab
  LAB: {
    SAMPLES: `${API_BASE_URL}/api/lab/samples`,
    RESULTS: `${API_BASE_URL}/api/lab/results`,
    TEST_ORDERS: `${API_BASE_URL}/api/lab/test-orders`,
    EQUIPMENT: `${API_BASE_URL}/api/lab/equipment`,
    REQUESTS: `${API_BASE_URL}/api/lab-requests`,
  },
  
  // Dialysis
  DIALYSIS: {
    SESSIONS: `${API_BASE_URL}/api/dialysis/sessions`,
  },
  
  // Clinic
  CLINIC: {
    DOCTORS: `${API_BASE_URL}/api/doctors`,
    APPOINTMENTS: `${API_BASE_URL}/api/appointments`,
  },
  
  // Transfers
  TRANSFERS: {
    INSTANT: `${API_BASE_URL}/api/transfers/instant`,
    ALL: `${API_BASE_URL}/api/transfers/all`,
  },
  
  // Test/Debug
  DEBUG: {
    HELLO: `${API_BASE_URL}/api/simple-test/hello`,
    DB_CONNECTION: `${API_BASE_URL}/api/debug/database-connection`,
  }
};

// Helper function to get WebSocket URL
export const getWebSocketUrl = () => {
  const baseUrl = API_BASE_URL.replace('http://', '').replace('https://', '');
  return `ws://${baseUrl}/ws`;
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

console.log('API Configuration:', {
  API_BASE_URL,
  currentHost: typeof window !== 'undefined' ? window.location.host : 'server',
  environment: import.meta.env.MODE
});