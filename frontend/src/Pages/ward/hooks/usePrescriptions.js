import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const usePrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [activePatients, setActivePatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get JWT token for authentication
  const getAuthHeaders = () => {
    const jwtToken = localStorage.getItem('jwtToken');
    return {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch active patients/admissions
  const fetchActivePatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await axios.get('http://localhost:8080/api/admissions/active', {
        headers: getAuthHeaders()
      });

      // Transform API response to match component expectations
      const transformedPatients = response.data.map(admission => ({
        // Original API fields
        admissionId: admission.admissionId,
        patientNationalId: admission.patientNationalId,
        patientName: admission.patientName,
        wardId: admission.wardId,
        wardName: admission.wardName,
        bedNumber: admission.bedNumber,
        admissionDate: admission.admissionDate,
        dischargeDate: admission.dischargeDate,
        status: admission.status,

        // Additional fields for prescription management
        patientId: `P${admission.patientNationalId}`, // Create a patient ID format
        wardNumber: `W${admission.wardId}`, // Create ward number format
        fullName: admission.patientName, // Alias for consistency
        nationalId: admission.patientNationalId,

        // Calculated fields
        admissionDays: Math.floor((new Date() - new Date(admission.admissionDate)) / (1000 * 60 * 60 * 24)),
        isActive: admission.status === 'ACTIVE'
      }));

      setActivePatients(transformedPatients);
      setError(null);
      return transformedPatients;

    } catch (err) {
      console.error('Error fetching active patients:', err);

      let errorMessage = 'Failed to fetch active patients. ';

      if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to view patient data.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (!err.response) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch prescriptions from API
  const fetchPrescriptions = useCallback(async () => {
    try {
      setLoading(true);

      // First fetch active patients
      const patients = await fetchActivePatients();

      // TODO: Replace with actual prescription API call
      // For now, start with empty prescriptions until API is available
      // const response = await axios.get('http://localhost:8080/api/prescriptions', {
      //   headers: getAuthHeaders()
      // });
      // setPrescriptions(response.data);

      setPrescriptions([]);
      setError(null);
      return [];

    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchActivePatients]);

  // Add new prescription
  const addPrescription = useCallback(async (prescriptionData) => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await axios.post('http://localhost:8080/api/prescriptions', prescriptionData, {
      //   headers: getAuthHeaders()
      // });
      // const newPrescription = response.data;

      // Temporary: Add to local state until API is ready
      const newPrescription = {
        id: `RX${String(prescriptions.length + 1).padStart(3, '0')}`,
        ...prescriptionData,
        prescribedDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'active'
      };

      setPrescriptions(prev => [newPrescription, ...prev]);
      setError(null);
      return newPrescription;

    } catch (err) {
      console.error('Error adding prescription:', err);
      setError('Failed to add prescription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [prescriptions.length]);

  // Update prescription
  const updatePrescription = useCallback(async (prescriptionId, updateData) => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await axios.put(`http://localhost:8080/api/prescriptions/${prescriptionId}`, updateData, {
      //   headers: getAuthHeaders()
      // });

      // Temporary: Update local state until API is ready
      setPrescriptions(prev =>
        prev.map(prescription =>
          prescription.id === prescriptionId
            ? { ...prescription, ...updateData, lastModified: new Date().toISOString() }
            : prescription
        )
      );

      setError(null);
      return true;

    } catch (err) {
      console.error('Error updating prescription:', err);
      setError('Failed to update prescription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete prescription
  const deletePrescription = useCallback(async (prescriptionId) => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // await axios.delete(`http://localhost:8080/api/prescriptions/${prescriptionId}`, {
      //   headers: getAuthHeaders()
      // });

      // Temporary: Update local state until API is ready
      setPrescriptions(prev => prev.filter(prescription => prescription.id !== prescriptionId));

      setError(null);
      return true;

    } catch (err) {
      console.error('Error deleting prescription:', err);
      setError('Failed to delete prescription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate prescription statistics
  const getStats = useCallback(() => {
    return {
      total: prescriptions.length,
      active: prescriptions.filter(p => p.status === 'active').length,
      completed: prescriptions.filter(p => p.status === 'completed').length,
      expired: prescriptions.filter(p => p.status === 'expired').length,
      discontinued: prescriptions.filter(p => p.status === 'discontinued').length,
      todaysPrescriptions: prescriptions.filter(p => {
        const prescDate = new Date(p.prescribedDate);
        const today = new Date();
        return prescDate.toDateString() === today.toDateString();
      }).length,
      urgentPrescriptions: prescriptions.filter(p => p.isUrgent).length,
      activePatients: activePatients.length
    };
  }, [prescriptions, activePatients]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  return {
    // Data
    prescriptions,
    activePatients,
    loading,
    error,

    // Functions
    fetchActivePatients,
    fetchPrescriptions,
    addPrescription,
    updatePrescription,
    deletePrescription,
    getStats,

    // Refresh function
    refresh: fetchPrescriptions
  };
};

export default usePrescriptions;