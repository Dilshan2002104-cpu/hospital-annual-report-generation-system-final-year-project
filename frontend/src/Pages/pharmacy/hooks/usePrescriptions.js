import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import usePrescriptionWebSocket from './usePrescriptionWebSocket';

export const usePrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      throw new Error('Authentication required. Please log in again.');
    }
    return {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    };
  }, []);

  // Helper function to determine prescription urgency
  const determinePrescriptionUrgency = useCallback((prescription) => {
    const urgentKeywords = ['emergency', 'urgent', 'stat', 'asap', 'critical'];
    const instructions = prescription.instructions?.toLowerCase() || '';
    const notes = (prescription.prescriptionNotes || prescription.notes)?.toLowerCase() || '';
    
    if (urgentKeywords.some(keyword => 
      instructions.includes(keyword) || notes.includes(keyword)
    )) {
      return 'urgent';
    }
    
    const urgentMedications = (prescription.prescriptionItems || prescription.medications || []).some(med => 
      med.drugName?.toLowerCase().includes('insulin') ||
      med.drugName?.toLowerCase().includes('epinephrine') ||
      med.drugName?.toLowerCase().includes('nitroglycerin') ||
      med.isUrgent === true
    );
    
    return urgentMedications ? 'urgent' : 'normal';
  }, []);

  // Fetch prescriptions from the main API
  const fetchPrescriptionsFromAPI = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get('http://localhost:8080/api/prescriptions/all', { headers });
      
      // Handle different response structures
      let prescriptionsData = [];
      if (response.data.success && Array.isArray(response.data.data)) {
        prescriptionsData = response.data.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        prescriptionsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        prescriptionsData = response.data;
      }

      // Transform prescriptions for pharmacy use
      const transformedPrescriptions = prescriptionsData.map(prescription => ({
        // Core prescription data
        id: prescription.prescriptionId || prescription.id,
        prescriptionId: prescription.prescriptionId,
        patientName: prescription.patientName,
        patientId: prescription.patientId,
        patientNationalId: prescription.patientNationalId,
        doctorName: prescription.doctorName || prescription.prescribedBy,
        admissionId: prescription.admissionId,
        wardName: prescription.wardName,
        bedNumber: prescription.bedNumber,
        
        // Prescription details - map prescriptionItems to medications for compatibility
        medications: prescription.prescriptionItems || prescription.medications || [],
        prescriptionItems: prescription.prescriptionItems || [],
        totalMedications: prescription.totalMedications || prescription.prescriptionItems?.length || prescription.medications?.length || 0,
        status: prescription.status || 'ACTIVE', // Keep original backend status
        prescribedDate: prescription.prescribedDate,
        startDate: prescription.startDate,
        endDate: prescription.endDate,
        instructions: prescription.instructions,
        notes: prescription.prescriptionNotes || prescription.notes,
        prescriptionNotes: prescription.prescriptionNotes,
        
        // Pharmacy-specific fields
        urgency: determinePrescriptionUrgency(prescription),
        needsReview: (prescription.prescriptionItems || prescription.medications || []).some(med => med.isHighRisk) || false,
        interactions: [], // To be populated by drug interaction checks
        
        // Status tracking
        receivedAt: prescription.prescribedDate || prescription.createdAt || new Date().toISOString(),
        processedAt: null,
        dispensedAt: null,
        processedBy: null,
        createdAt: prescription.createdAt,
        lastModified: prescription.lastModified
      }));

      return transformedPrescriptions;
    } catch (error) {
      console.error('Failed to fetch prescriptions from API:', error);
      throw error;
    }
  }, [getAuthHeaders, determinePrescriptionUrgency]);

  // Initialize prescriptions
  const initializePrescriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPrescriptionsFromAPI();
      setPrescriptions(data);
    } catch (err) {
      setError('Failed to load prescriptions');
      console.error('Error loading prescriptions:', err);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, [fetchPrescriptionsFromAPI]);

  // WebSocket handler for real-time prescription updates
  const handlePrescriptionWebSocketUpdate = useCallback((data) => {
    console.log('🔄 Processing WebSocket update:', data);

    if (data.type === 'PRESCRIPTION_CREATED' || data.type === 'PRESCRIPTION_URGENT') {
      // Transform the prescription data
      const transformedPrescription = {
        id: data.prescription.prescriptionId || data.prescription.id,
        prescriptionId: data.prescription.prescriptionId,
        patientName: data.prescription.patientName,
        patientId: data.prescription.patientId,
        patientNationalId: data.prescription.patientNationalId,
        doctorName: data.prescription.doctorName || data.prescription.prescribedBy,
        admissionId: data.prescription.admissionId,
        wardName: data.prescription.wardName,
        bedNumber: data.prescription.bedNumber,
        medications: data.prescription.prescriptionItems || data.prescription.medications || [],
        prescriptionItems: data.prescription.prescriptionItems || [],
        totalMedications: data.prescription.totalMedications,
        status: data.prescription.status || 'ACTIVE',
        prescribedDate: data.prescription.prescribedDate,
        startDate: data.prescription.startDate,
        endDate: data.prescription.endDate,
        instructions: data.prescription.instructions,
        notes: data.prescription.prescriptionNotes || data.prescription.notes,
        prescriptionNotes: data.prescription.prescriptionNotes,
        urgency: data.priority === 'HIGH' ? 'urgent' : determinePrescriptionUrgency(data.prescription),
        needsReview: (data.prescription.prescriptionItems || []).some(med => med.isHighRisk) || false,
        interactions: [],
        receivedAt: data.prescription.prescribedDate || new Date().toISOString(),
        processedAt: null,
        dispensedAt: null,
        processedBy: null,
        createdAt: data.prescription.createdAt,
        lastModified: data.prescription.lastModified
      };

      // Add to prescription list (prepend to show newest first)
      setPrescriptions(prev => {
        // Check if prescription already exists
        const exists = prev.some(p => p.prescriptionId === transformedPrescription.prescriptionId);
        if (exists) {
          return prev; // Don't add duplicates
        }
        return [transformedPrescription, ...prev];
      });

      console.log('✅ New prescription added to pharmacy list:', transformedPrescription.prescriptionId);
    } else if (data.type === 'PRESCRIPTION_UPDATED') {
      // Update existing prescription
      setPrescriptions(prev => prev.map(p =>
        p.prescriptionId === data.prescription.prescriptionId
          ? { ...p, ...data.prescription }
          : p
      ));
      console.log('✅ Prescription updated:', data.prescription.prescriptionId);
    } else if (data.type === 'PRESCRIPTION_CANCELLED') {
      // Update status to cancelled
      setPrescriptions(prev => prev.map(p =>
        p.prescriptionId === data.prescriptionId
          ? { ...p, status: 'cancelled' }
          : p
      ));
      console.log('✅ Prescription cancelled:', data.prescriptionId);
    }
  }, [determinePrescriptionUrgency]);

  // Initialize WebSocket for real-time updates
  const webSocket = usePrescriptionWebSocket(handlePrescriptionWebSocketUpdate);

  useEffect(() => {
    initializePrescriptions();
  }, [initializePrescriptions]);

  // Process prescription (update status)
  const processPrescription = useCallback(async (prescriptionId) => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`http://localhost:8080/api/prescriptions/prescription-id/${prescriptionId}/process`, {}, { headers });
      
      setPrescriptions(prev => prev.map(p => 
        p.prescriptionId === prescriptionId 
          ? { ...p, status: 'processing', processedAt: new Date().toISOString() }
          : p
      ));
      return { success: true };
    } catch (err) {
      setError('Failed to process prescription');
      throw err;
    }
  }, [getAuthHeaders]);

  // Dispense medication (complete the prescription)
  const dispenseMedication = useCallback(async (prescriptionId, dispensingData = {}) => {
    try {
      const headers = getAuthHeaders();
      await axios.post(`http://localhost:8080/api/prescriptions/prescription-id/${prescriptionId}/dispense`, dispensingData, { headers });
      
      setPrescriptions(prev => prev.map(p => 
        p.prescriptionId === prescriptionId 
          ? { 
              ...p, 
              status: 'dispensed',
              dispensedAt: new Date().toISOString(),
              processedBy: dispensingData.pharmacistName || 'Pharmacist'
            }
          : p
      ));
      return { success: true };
    } catch (err) {
      setError('Failed to dispense medication');
      throw err;
    }
  }, [getAuthHeaders]);

  // Cancel prescription
  const cancelPrescription = useCallback(async (prescriptionId, cancellationReason = '') => {
    try {
      const headers = getAuthHeaders();
      await axios.put(`http://localhost:8080/api/prescriptions/prescription-id/${prescriptionId}/cancel`, 
        { reason: cancellationReason }, { headers });
      
      setPrescriptions(prev => prev.map(p => 
        p.prescriptionId === prescriptionId 
          ? { ...p, status: 'cancelled', cancelledAt: new Date().toISOString() }
          : p
      ));
      return { success: true };
    } catch (err) {
      setError('Failed to cancel prescription');
      throw err;
    }
  }, [getAuthHeaders]);

  // Check drug interactions
  const verifyInteractions = useCallback(async (prescriptionId) => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.post(`http://localhost:8080/api/prescriptions/prescription-id/${prescriptionId}/check-interactions`, {}, { headers });
      
      // Handle different response structures
      let interactions = [];
      if (response.data.success && Array.isArray(response.data.data)) {
        interactions = response.data.data;
      } else if (Array.isArray(response.data)) {
        interactions = response.data;
      }
      
      return interactions;
    } catch (err) {
      setError('Failed to verify drug interactions');
      throw err;
    }
  }, [getAuthHeaders]);

  // Get prescriptions by status
  const getPrescriptionsByStatus = useCallback((status) => {
    return prescriptions.filter(p => p.status === status);
  }, [prescriptions]);

  // Get prescriptions statistics
  const getStats = useCallback(() => {
    const total = prescriptions.length;
    const received = prescriptions.filter(p => p.status === 'received').length;
    const processing = prescriptions.filter(p => p.status === 'processing').length;
    const ready = prescriptions.filter(p => p.status === 'ready').length;
    const dispensed = prescriptions.filter(p => p.status === 'dispensed').length;
    
    const today = new Date().toDateString();
    const dispensedToday = prescriptions.filter(p => 
      p.status === 'dispensed' && 
      p.dispensedAt && 
      new Date(p.dispensedAt).toDateString() === today
    ).length;
    
    return {
      totalPrescriptions: total,
      receivedPrescriptions: received,
      processingPrescriptions: processing,
      readyPrescriptions: ready,
      dispensedPrescriptions: dispensed,
      dispensedToday,
      processingRate: total > 0 ? Math.round(((ready + dispensed) / total) * 100) : 0
    };
  }, [prescriptions]);

  // Refresh prescriptions
  const refreshPrescriptions = useCallback(() => {
    initializePrescriptions();
  }, [initializePrescriptions]);

  return {
    prescriptions,
    loading,
    error,
    processPrescription,
    dispenseMedication,
    cancelPrescription,
    verifyInteractions,
    getPrescriptionsByStatus,
    getStats,
    refreshPrescriptions,
    // WebSocket properties
    wsConnected: webSocket.isConnected,
    wsError: webSocket.error,
    wsNotifications: webSocket.notifications,
    wsUnreadCount: webSocket.unreadCount,
    markNotificationAsRead: webSocket.markAsRead,
    markAllNotificationsAsRead: webSocket.markAllAsRead,
    clearNotifications: webSocket.clearNotifications
  };
};