import { useState, useEffect, useCallback, useMemo } from 'react';

const useClinicPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Mock WebSocket connection status
  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setWsConnected(true);
      
      // Simulate occasional disconnections
      const disconnectInterval = setInterval(() => {
        if (Math.random() > 0.95) {
          setWsConnected(false);
          setTimeout(() => setWsConnected(true), 2000);
        }
      }, 10000);

      return () => clearInterval(disconnectInterval);
    };

    const cleanup = connectWebSocket();
    return cleanup;
  }, []);

  // Sample prescription data for demonstration
  const samplePrescriptions = useMemo(() => [
    {
      id: 'PRESC-001',
      prescriptionId: 'CP-2024-001',
      patientId: 'P001',
      patientName: 'John Smith',
      patientNationalId: '123456789',
      prescribedBy: 'Dr. Sarah Johnson',
      prescribedDate: new Date().toISOString(),
      status: 'active',
      isUrgent: false,
      consultationType: 'outpatient',
      totalMedications: 2,
      notes: 'Follow up in 1 week if symptoms persist',
      medications: [
        {
          drugName: 'Amoxicillin',
          dose: '500mg',
          frequency: 'Three times daily',
          duration: '7 days',
          quantity: 21,
          quantityUnit: 'tablets',
          route: 'oral',
          instructions: 'Take with food'
        },
        {
          drugName: 'Ibuprofen',
          dose: '200mg',
          frequency: 'As needed',
          duration: '5 days',
          quantity: 10,
          quantityUnit: 'tablets',
          route: 'oral',
          instructions: 'Take for pain relief'
        }
      ]
    },
    {
      id: 'PRESC-002',
      prescriptionId: 'CP-2024-002',
      patientId: 'P002',
      patientName: 'Maria Garcia',
      patientNationalId: '987654321',
      prescribedBy: 'Dr. Michael Chen',
      prescribedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      status: 'completed',
      isUrgent: true,
      consultationType: 'outpatient',
      totalMedications: 3,
      notes: 'Patient has allergies to penicillin',
      medications: [
        {
          drugName: 'Azithromycin',
          dose: '250mg',
          frequency: 'Once daily',
          duration: '5 days',
          quantity: 5,
          quantityUnit: 'tablets',
          route: 'oral',
          instructions: 'Take on empty stomach'
        },
        {
          drugName: 'Cough Syrup',
          dose: '10ml',
          frequency: 'Three times daily',
          duration: '7 days',
          quantity: 1,
          quantityUnit: 'bottles',
          route: 'oral',
          instructions: 'Shake well before use'
        },
        {
          drugName: 'Lozenges',
          dose: '1 lozenge',
          frequency: 'Every 4 hours',
          duration: '5 days',
          quantity: 20,
          quantityUnit: 'tablets',
          route: 'oral',
          instructions: 'Dissolve slowly in mouth'
        }
      ]
    },
    {
      id: 'PRESC-003',
      prescriptionId: 'CP-2024-003',
      patientId: 'P003',
      patientName: 'Ahmed Hassan',
      patientNationalId: '456789123',
      prescribedBy: 'Dr. Emily Davis',
      prescribedDate: new Date().toISOString(),
      status: 'pending',
      isUrgent: false,
      consultationType: 'outpatient',
      totalMedications: 1,
      notes: 'Regular diabetes checkup',
      medications: [
        {
          drugName: 'Metformin',
          dose: '500mg',
          frequency: 'Twice daily',
          duration: '30 days',
          quantity: 60,
          quantityUnit: 'tablets',
          route: 'oral',
          instructions: 'Take with meals'
        }
      ]
    },
    {
      id: 'PRESC-004',
      prescriptionId: 'CP-2024-004',
      patientId: 'P004',
      patientName: 'Lisa Thompson',
      patientNationalId: '789123456',
      prescribedBy: 'Dr. Robert Wilson',
      prescribedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: 'ready',
      isUrgent: false,
      consultationType: 'outpatient',
      totalMedications: 2,
      notes: 'Hypertension management',
      medications: [
        {
          drugName: 'Lisinopril',
          dose: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          quantityUnit: 'tablets',
          route: 'oral',
          instructions: 'Take in the morning'
        },
        {
          drugName: 'Amlodipine',
          dose: '5mg',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          quantityUnit: 'tablets',
          route: 'oral',
          instructions: 'Take at the same time daily'
        }
      ]
    }
  ], []);

  // Initialize with sample data
  useEffect(() => {
    setPrescriptions(samplePrescriptions);
  }, [samplePrescriptions]);

  // Fetch prescriptions function
  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/prescriptions/clinic?page=0&size=100');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.success) {
        // Extract prescriptions from paginated response
        const prescriptionsData = data.data.content || [];
        setPrescriptions(prescriptionsData);
      } else {
        throw new Error(data.message || 'Failed to fetch prescriptions');
      }
    } catch (err) {
      setError('Failed to fetch prescriptions');
      console.error('Error fetching prescriptions:', err);
      // Fallback to sample data for development
      setPrescriptions(samplePrescriptions);
    } finally {
      setLoading(false);
    }
  }, [samplePrescriptions]);

  // Add prescription function
  const addPrescription = useCallback(async (prescriptionData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert frontend data to backend format
      const backendData = {
        patientNationalId: prescriptionData.patientNationalId,
        patientName: prescriptionData.patientName,
        prescribedBy: prescriptionData.prescribedBy,
        startDate: prescriptionData.prescribedDate ? prescriptionData.prescribedDate.split('T')[0] : new Date().toISOString().split('T')[0],
        prescriptionNotes: prescriptionData.notes,
        consultationType: 'outpatient',
        isUrgent: prescriptionData.isUrgent || false,
        prescriptionItems: prescriptionData.medications.map(med => ({
          drugName: med.drugName,
          dose: med.dose,
          frequency: med.frequency,
          quantity: parseInt(med.quantity),
          quantityUnit: med.quantityUnit || 'tablets',
          route: med.route || 'oral',
          instructions: med.instructions || ''
        }))
      };

      const response = await fetch('/api/prescriptions/clinic', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Add authorization header if needed
        },
        body: JSON.stringify(backendData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.success) {
        const newPrescription = responseData.data;
        setPrescriptions(prev => [newPrescription, ...prev]);
        return newPrescription;
      } else {
        throw new Error(responseData.message || 'Failed to create prescription');
      }
    } catch (err) {
      setError('Failed to create prescription: ' + err.message);
      console.error('Error creating prescription:', err);
      
      // For development, fall back to mock creation
      const mockPrescription = {
        id: `PRESC-${Date.now()}`,
        prescriptionId: `CP-2024-${String(prescriptions.length + 5).padStart(3, '0')}`,
        ...prescriptionData,
        prescribedDate: new Date().toISOString(),
        status: 'pending'
      };
      
      setPrescriptions(prev => [mockPrescription, ...prev]);
      return mockPrescription;
    } finally {
      setLoading(false);
    }
  }, [prescriptions.length]);

  // Update prescription status function
  const updatePrescriptionStatus = useCallback(async (prescriptionId, newStatus) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, this would be an API call:
      // const response = await fetch(`/api/clinic/prescriptions/${prescriptionId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // });
      // const updatedPrescription = await response.json();
      
      setPrescriptions(prev => 
        prev.map(prescription => 
          prescription.id === prescriptionId 
            ? { ...prescription, status: newStatus }
            : prescription
        )
      );
    } catch (err) {
      setError('Failed to update prescription status');
      console.error('Error updating prescription:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get statistics function
  const getStats = useCallback(() => {
    const total = prescriptions.length;
    const active = prescriptions.filter(p => p.status?.toLowerCase() === 'active').length;
    const pending = prescriptions.filter(p => p.status?.toLowerCase() === 'pending').length;
    const completed = prescriptions.filter(p => p.status?.toLowerCase() === 'completed').length;
    const ready = prescriptions.filter(p => p.status?.toLowerCase() === 'ready').length;
    
    // Today's prescriptions
    const today = new Date();
    const todaysPrescriptions = prescriptions.filter(p => {
      if (!p.prescribedDate) return false;
      try {
        const prescDate = new Date(p.prescribedDate);
        return prescDate.toDateString() === today.toDateString();
      } catch {
        return false;
      }
    }).length;
    
    // Urgent prescriptions
    const urgentPrescriptions = prescriptions.filter(p => p.isUrgent).length;
    
    return {
      total,
      active,
      pending,
      completed,
      ready,
      todaysPrescriptions,
      urgentPrescriptions
    };
  }, [prescriptions]);

  // Load prescriptions on mount
  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  return {
    prescriptions,
    loading,
    error,
    wsConnected,
    fetchPrescriptions,
    addPrescription,
    updatePrescriptionStatus,
    getStats
  };
};

export default useClinicPrescriptions;