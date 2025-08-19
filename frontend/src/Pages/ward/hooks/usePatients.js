import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const usePatients = (showToast = null) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        
        console.warn('No JWT token found');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/patients/all', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      
      let errorMessage = 'Failed to load patient data. ';
      
      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to view patient data.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      if (showToast) {
        if (error.response?.status === 401) {
          showToast('error', 'Session Expired', errorMessage);
        } else if (error.response?.status === 403) {
          showToast('error', 'Access Denied', errorMessage);
        } else if (error.response?.status === 500) {
          showToast('error', 'Server Error', errorMessage);
        } else {
          showToast('error', 'Loading Failed', errorMessage);
        }
      } else {
        console.error(errorMessage);
      }
      
      setLastError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Search and filter patients
  const searchPatients = useCallback((searchTerm) => {
    if (!searchTerm) {
      return patients;
    }
    
    const term = searchTerm.toLowerCase();
    return patients.filter(patient => 
      patient.fullName.toLowerCase().includes(term) ||
      patient.nationalId.toString().includes(term) ||
      patient.contactNumber.includes(term)
    );
  }, [patients]);

  // Calculate age from date of birth
  const calculateAge = useCallback((dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, []);

  return {
    patients,
    loading,
    lastError,
    fetchPatients,
    searchPatients,
    calculateAge
  };
};

export default usePatients;