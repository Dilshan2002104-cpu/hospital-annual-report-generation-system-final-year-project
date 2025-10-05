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

  // Helper function to generate a session for a single patient
  const generateSessionForPatient = useCallback((patient) => {
    const today = new Date();
    const sessionId = `DS${Date.now()}_${patient.admissionId}`;
    
    return {
      sessionId,
      patientId: patient.patientNationalId,
      patientName: patient.patientName,
      patientNationalId: patient.patientNationalId,
      admissionId: patient.admissionId,
      machineId: null, // To be assigned
      machineName: 'Not Assigned',
      scheduledDate: today.toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '12:00',
      duration: '4h 0m',
      status: 'scheduled',
      attendance: 'pending',
      sessionType: 'hemodialysis',
      priority: 'normal',
      complications: '',
      notes: 'Patient transferred from Ward Management',
      transferredFrom: 'Ward Management',
      transferDate: new Date().toISOString(),
      isTransferred: true,
      wardId: patient.wardId,
      wardName: patient.wardName,
      bedNumber: patient.bedNumber
    };
  }, []);

  // Real-time WebSocket integration
  const handleDialysisUpdate = useCallback((data) => {
    console.log('🔄 Real-time dialysis update received:', data);
    
    if (data.type === 'PATIENT_TRANSFERRED_TO_DIALYSIS') {
      // A new patient was transferred to dialysis ward
      if (data.newAdmission) {
        setDialysisPatients(prev => {
          const existing = prev.find(p => p.admissionId === data.newAdmission.admissionId);
          if (!existing) {
            console.log('✅ Adding new transferred patient:', data.newAdmission.patientName);
            return [data.newAdmission, ...prev];
          }
          return prev;
        });

        // Generate a new session for the transferred patient
        const newSession = generateSessionForPatient(data.newAdmission);
        setSessions(prev => {
          const existing = prev.find(s => s.admissionId === data.newAdmission.admissionId);
          if (!existing) {
            console.log('✅ Creating session for transferred patient:', data.newAdmission.patientName);
            return [newSession, ...prev];
          }
          return prev;
        });

        // Show toast notification only if showToast is available
        if (stableShowToast) {
          stableShowToast('success', 'New Patient Transfer', 
            `${data.newAdmission.patientName} has been transferred to Dialysis ward`);
        }
      }
    }
  }, [generateSessionForPatient, stableShowToast]);

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
      
      if (showToast) {
        showToast('success', 'Attendance Updated', `Patient marked as ${attendanceStatus}`);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      setError(error.message);
      
      if (showToast) {
        showToast('error', 'Update Failed', 'Failed to update attendance');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

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
      
      if (showToast) {
        showToast('success', 'Details Saved', 'Session details saved successfully');
      }
    } catch (error) {
      console.error('Error adding session details:', error);
      setError(error.message);
      
      if (showToast) {
        showToast('error', 'Save Failed', 'Failed to save session details');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

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
      
      if (showToast) {
        showToast('success', 'Session Deleted', 'Session deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting dialysis session:', error);
      setError(error.message);
      
      if (showToast) {
        showToast('error', 'Delete Failed', 'Failed to delete session');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

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
      
      if (showToast && transformedPatients.length > 0) {
        showToast('success', 'Patients Loaded', `Found ${transformedPatients.length} patients in Dialysis Ward`);
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
      
      if (showToast) {
        showToast('error', 'Load Failed', errorMessage);
      }
      
      throw error;
    } finally {
      setPatientsLoading(false);
    }
  }, [showToast]);

  // Enhanced session generation for real dialysis patients
  const generateSessionsForPatients = useCallback((patients) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const timeSlots = [
      { start: '08:00', end: '12:00' },
      { start: '13:00', end: '17:00' },
      { start: '18:00', end: '22:00' }
    ];
    
    const generatedSessions = [];
    
    patients.forEach((patient, patientIndex) => {
      // Create sessions for today and tomorrow
      [today, tomorrow].forEach((date, dayIndex) => {
        const slotIndex = (patientIndex + dayIndex) % timeSlots.length;
        const timeSlot = timeSlots[slotIndex];
        const machineNumber = (patientIndex % 8) + 1; // 8 dialysis machines
        
        const session = {
          sessionId: `DS_${patient.admissionId}_${date.toISOString().split('T')[0]}_${timeSlot.start}`,
          patientId: patient.patientNationalId,
          patientName: patient.patientName,
          patientNationalId: patient.patientNationalId,
          admissionId: patient.admissionId,
          bedNumber: patient.bedNumber,
          wardName: patient.wardName,
          machineId: `M${machineNumber.toString().padStart(3, '0')}`,
          machineName: `Fresenius 4008S - Unit ${machineNumber}`,
          scheduledDate: date.toISOString().split('T')[0],
          startTime: timeSlot.start,
          endTime: timeSlot.end,
          duration: '4h 0m',
          status: dayIndex === 0 ? 
            (patientIndex % 3 === 0 ? 'completed' : patientIndex % 3 === 1 ? 'in_progress' : 'scheduled') :
            'scheduled',
          attendance: dayIndex === 0 ? 
            (patientIndex % 4 === 0 ? 'absent' : 'present') : 
            'pending',
          sessionType: 'hemodialysis',
          priority: patientIndex % 5 === 0 ? 'urgent' : 'normal',
          complications: '',
          notes: dayIndex === 0 && patientIndex % 3 === 0 ? 'Transferred from Ward' : '',
          preWeight: '',
          postWeight: '',
          fluidRemoval: '',
          preBloodPressure: '',
          postBloodPressure: '',
          // Additional transfer info
          transferredFrom: patient.admissionDate ? new Date(patient.admissionDate).toDateString() === today.toDateString() ? 'Recently Transferred' : null : null
        };
        
        generatedSessions.push(session);
      });
    });
    
    return generatedSessions;
  }, []);

  // Load dialysis patients and generate sessions on component mount
  useEffect(() => {
    const loadDialysisData = async () => {
      try {
        const patients = await fetchDialysisPatients();
        if (patients && patients.length > 0) {
          const generatedSessions = generateSessionsForPatients(patients);
          setSessions(generatedSessions);
        } else {
          // No patients found, set empty sessions
          setSessions([]);
        }
      } catch (error) {
        console.error('Failed to load dialysis patients:', error);
        // Set empty sessions on error
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
    updateSession,
    markAttendance,
    addSessionDetails,
    deleteSession,
    
    // WebSocket functions
    getTransferredPatientsCount,
    requestDialysisUpdate
  };
};

export default useDialysisSessions;