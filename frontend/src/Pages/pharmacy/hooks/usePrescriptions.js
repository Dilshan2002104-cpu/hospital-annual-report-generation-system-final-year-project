import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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

  // Helper function to map prescription status to pharmacy workflow status
  const mapPrescriptionStatus = useCallback((originalStatus) => {
    switch (originalStatus?.toLowerCase()) {
      case 'active':
        return 'received'; // New prescriptions are received in pharmacy
      case 'completed':
        return 'dispensed';
      case 'discontinued':
        return 'cancelled';
      case 'expired':
        return 'expired';
      default:
        return 'received';
    }
  }, []);

  // Helper function to determine prescription urgency
  const determinePrescriptionUrgency = useCallback((prescription) => {
    const urgentKeywords = ['emergency', 'urgent', 'stat', 'asap', 'critical'];
    const instructions = prescription.instructions?.toLowerCase() || '';
    const notes = prescription.notes?.toLowerCase() || '';
    
    if (urgentKeywords.some(keyword => 
      instructions.includes(keyword) || notes.includes(keyword)
    )) {
      return 'urgent';
    }
    
    const urgentMedications = prescription.medications?.some(med => 
      med.drugName?.toLowerCase().includes('insulin') ||
      med.drugName?.toLowerCase().includes('epinephrine') ||
      med.drugName?.toLowerCase().includes('nitroglycerin')
    );
    
    return urgentMedications ? 'urgent' : 'normal';
  }, []);

  // TODO: Add the rest of the functions here

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
        doctorName: prescription.doctorName || prescription.prescribedBy,
        
        // Prescription details
        medications: prescription.medications || [],
        status: mapPrescriptionStatus(prescription.status),
        prescribedDate: prescription.prescribedDate,
        startDate: prescription.startDate,
        endDate: prescription.endDate,
        instructions: prescription.instructions,
        notes: prescription.notes,
        
        // Pharmacy-specific fields
        urgency: determinePrescriptionUrgency(prescription),
        needsReview: prescription.medications?.some(med => med.isHighRisk) || false,
        interactions: [], // To be populated by drug interaction checks
        
        // Status tracking
        receivedAt: prescription.prescribedDate || prescription.createdAt || new Date().toISOString(),
        processedAt: null,
        dispensedAt: null,
        processedBy: null
      }));

      return transformedPrescriptions;
    } catch (error) {
      console.error('Failed to fetch prescriptions from API:', error);
      throw error;
    }
  }, [getAuthHeaders, mapPrescriptionStatus, determinePrescriptionUrgency]);

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
    refreshPrescriptions
  };
};