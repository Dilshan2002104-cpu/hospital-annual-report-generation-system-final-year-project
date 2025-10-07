import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useDialysisWebSocket from './useDialysisWebSocket';

const useDialysisSessions = (showToast) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialysisPatients, setDialysisPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  // Memoize showToast to prevent infinite loops
  const stableShowToast = useCallback((type, title, message) => {
    if (showToast && typeof showToast === 'function') {
      showToast(type, title, message);
    }
  }, [showToast]);

  // Real-time WebSocket integration
  const handleDialysisUpdate = useCallback((data) => {
    console.log('🔄 Real-time dialysis update received:', data);
    
    if (data.type === 'PATIENT_TRANSFERRED_TO_DIALYSIS') {
      // A new patient was transferred to dialysis ward
      if (data.newAdmission) {
        setDialysisPatients(prev => {
          const existing = prev.find(p => p.admissionId === data.newAdmission.admissionId);
          if (!existing) {
            console.log('✅ Adding new transferred patient (awaiting schedule):', data.newAdmission.patientName);
            return [data.newAdmission, ...prev];
          }
          return prev;
        });

        // NOTE: Removed auto-scheduling - patients now remain in "awaiting schedule" status
        // They must be manually scheduled using the SessionScheduler interface

        // Show toast notification for transferred patient
        if (stableShowToast) {
          stableShowToast('info', 'New Patient Transfer', 
            `${data.newAdmission.patientName} has been transferred to Dialysis ward and is awaiting schedule`);
        }
      }
    }
  }, [stableShowToast]);

  const {
    isConnected: wsConnected,
    error: wsError,
    notifications: wsNotifications,
    transferredPatients: wsTransferredPatients,
    getTransferredPatientsCount,
    requestDialysisUpdate
  } = useDialysisWebSocket(handleDialysisUpdate);

  // Real API calls - no mock data

  const fetchSessions = useCallback(async (silent = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Real API call to fetch dialysis sessions
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.get('http://localhost:8080/api/dialysis/sessions', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      setSessions(response.data);
      
      if (stableShowToast && !silent) {
        stableShowToast('success', 'Sessions Loaded', 'Dialysis sessions loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching dialysis sessions:', error);
      setError(error.message);
      
      if (stableShowToast && !silent) {
        stableShowToast('error', 'Load Failed', 'Failed to load dialysis sessions');
      }
    } finally {
      setLoading(false);
    }
  }, [stableShowToast]);  const updateSession = useCallback(async (sessionId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Real API call to update session
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.put(`http://localhost:8080/api/dialysis/sessions/${sessionId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state with response
      setSessions(prev => prev.map(session => 
        session.sessionId === sessionId 
          ? { ...session, ...response.data }
          : session
      ));
      
      if (stableShowToast) {
        stableShowToast('success', 'Session Updated', 'Session details updated successfully');
      }
    } catch (error) {
      console.error('Error updating dialysis session:', error);
      setError(error.message);
      
      if (stableShowToast) {
        stableShowToast('error', 'Update Failed', 'Failed to update session');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [stableShowToast]);

  const markAttendance = useCallback(async (sessionId, attendanceStatus) => {
    try {
      setLoading(true);
      setError(null);
      
      // Real API call to update attendance
      const jwtToken = localStorage.getItem('jwtToken');
      await axios.patch(`http://localhost:8080/api/dialysis/sessions/${sessionId}/attendance`, 
        { attendance: attendanceStatus }, 
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state
      setSessions(prev => prev.map(session => 
        session.sessionId === sessionId 
          ? { ...session, attendance: attendanceStatus }
          : session
      ));
      
      if (stableShowToast) {
        stableShowToast('success', 'Attendance Updated', `Patient marked as ${attendanceStatus}`);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      setError(error.message);

      if (stableShowToast) {
        stableShowToast('error', 'Update Failed', 'Failed to update attendance');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [stableShowToast]);

  const addSessionDetails = useCallback(async (sessionId, detailsData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Real API call to update session details
      const jwtToken = localStorage.getItem('jwtToken');
      await axios.patch(`http://localhost:8080/api/dialysis/sessions/${sessionId}/details`, 
        detailsData, 
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state
      setSessions(prev => prev.map(session => 
        session.sessionId === sessionId 
          ? { 
              ...session, 
              ...detailsData,
              status: detailsData.actualEndTime ? 'completed' : session.status
            }
          : session
      ));
      
      if (stableShowToast) {
        stableShowToast('success', 'Details Saved', 'Session details saved successfully');
      }
    } catch (error) {
      console.error('Error adding session details:', error);
      setError(error.message);

      if (stableShowToast) {
        stableShowToast('error', 'Save Failed', 'Failed to save session details');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [stableShowToast]);

  const deleteSession = useCallback(async (sessionId) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Real API call to delete session
      const jwtToken = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:8080/api/dialysis/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      // Update local state
      setSessions(prev => prev.filter(session => session.sessionId !== sessionId));

      if (stableShowToast) {
        stableShowToast('success', 'Session Deleted', 'Session deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting dialysis session:', error);
      setError(error.message);

      if (stableShowToast) {
        stableShowToast('error', 'Delete Failed', 'Failed to delete session');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [stableShowToast]);

  // Fetch current dialysis patients from Ward 4 (Dialysis Ward)
  const fetchDialysisPatients = useCallback(async () => {
    try {
      setPatientsLoading(true);
      setError(null);
      
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Fetch patients currently admitted to Ward 4 (Dialysis Ward)
      const response = await axios.get('http://localhost:8080/api/admissions/ward/4', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Transform admission data to dialysis patient format
      const transformedPatients = response.data.map(admission => ({
        patientId: admission.patientNationalId,
        patientName: admission.patientName,
        patientNationalId: admission.patientNationalId,
        admissionId: admission.admissionId,
        bedNumber: admission.bedNumber,
        admissionDate: admission.admissionDate,
        wardName: admission.wardName,
        status: admission.status
      }));

      setDialysisPatients(transformedPatients);
      
      if (stableShowToast && transformedPatients.length > 0) {
        stableShowToast('success', 'Patients Loaded', `Found ${transformedPatients.length} patients in Dialysis Ward`);
      }

      return transformedPatients;
    } catch (error) {
      console.error('Error fetching dialysis patients:', error);

      let errorMessage = 'Failed to load dialysis patients. ';

      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to view dialysis patients.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);

      if (stableShowToast) {
        stableShowToast('error', 'Load Failed', errorMessage);
      }

      throw error;
    } finally {
      setPatientsLoading(false);
    }
  }, [stableShowToast]);

  // Create a new dialysis session
  // Check machine availability for specific date and time
  const checkMachineAvailability = useCallback(async (date, startTime, duration) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `http://localhost:8080/api/dialysis/machines/available-for-time`,
        {
          params: {
            date: date,
            startTime: startTime,
            duration: duration
          },
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking machine availability:', error);
      throw error;
    }
  }, []);

  // Get all machines with their availability status
  const getMachinesWithAvailability = useCallback(async (date, startTime, duration) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `http://localhost:8080/api/dialysis/machines/availability-status`,
        {
          params: {
            date: date,
            startTime: startTime,
            duration: duration
          },
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching machines with availability:', error);
      throw error;
    }
  }, []);

  const createSession = useCallback(async (sessionData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Real API call to create session
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await axios.post('http://localhost:8080/api/dialysis/sessions', sessionData, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Add new session to local state
      setSessions(prev => [response.data, ...prev]);
      
      if (stableShowToast) {
        stableShowToast('success', 'Session Created', 'Dialysis session scheduled successfully');
      }

      return response.data;
    } catch (error) {
      console.error('Error creating dialysis session:', error);
      setError(error.message);

      if (stableShowToast) {
        stableShowToast('error', 'Create Failed', 'Failed to create session');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [stableShowToast]);

  // Load dialysis patients on component mount
  useEffect(() => {
    const loadDialysisData = async () => {
      try {
        // Load existing sessions from API
        await fetchSessions(true); // silent mode
        
        // Load current dialysis patients
        await fetchDialysisPatients();
      } catch (error) {
        console.error('Failed to load dialysis data:', error);
        setSessions([]);
      }
    };
    
    loadDialysisData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return {
    sessions,
    loading,
    error,
    dialysisPatients,
    patientsLoading,
    
    // WebSocket status and data
    wsConnected,
    wsError,
    wsNotifications,
    wsTransferredPatients,
    
    // Functions
    fetchSessions,
    fetchDialysisPatients,
    createSession,
    updateSession,
    markAttendance,
    addSessionDetails,
    deleteSession,
    
    // Machine availability functions
    checkMachineAvailability,
    getMachinesWithAvailability,
    
    // WebSocket functions
    getTransferredPatientsCount,
    requestDialysisUpdate
  };
};

export default useDialysisSessions;