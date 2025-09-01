import { useState, useEffect, useCallback } from 'react';

export default function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock prescription data
  const generateMockPrescriptions = () => {
    return [
      {
        prescriptionId: 'RX001',
        patientId: 'PT001',
        patientName: 'John Smith',
        patientAge: 45,
        patientPhone: '555-0101',
        doctorName: 'Dr. Sarah Johnson',
        receivedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        readyDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ready',
        priority: 'normal',
        medications: [
          {
            drugName: 'Lisinopril',
            genericName: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            quantity: 30,
            instructions: 'Take with food',
            category: 'cardiovascular'
          },
          {
            drugName: 'Metformin',
            genericName: 'Metformin HCl',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '90 days',
            quantity: 180,
            instructions: 'Take with meals',
            category: 'diabetes'
          }
        ],
        warnings: []
      },
      {
        prescriptionId: 'RX002',
        patientId: 'PT002',
        patientName: 'Emma Wilson',
        patientAge: 32,
        patientPhone: '555-0102',
        doctorName: 'Dr. Michael Chen',
        receivedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        readyDate: new Date().toISOString(),
        status: 'processing',
        priority: 'urgent',
        medications: [
          {
            drugName: 'Amoxicillin',
            genericName: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'Three times daily',
            duration: '7 days',
            quantity: 21,
            instructions: 'Complete full course',
            category: 'antibiotics'
          }
        ],
        warnings: ['Patient allergic to penicillin - verify alternative']
      },
      {
        prescriptionId: 'RX003',
        patientId: 'PT003',
        patientName: 'Robert Davis',
        patientAge: 67,
        patientPhone: '555-0103',
        doctorName: 'Dr. Lisa Anderson',
        receivedDate: new Date().toISOString(),
        readyDate: null,
        status: 'pending',
        priority: 'normal',
        medications: [
          {
            drugName: 'Atorvastatin',
            genericName: 'Atorvastatin Calcium',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '90 days',
            quantity: 90,
            instructions: 'Take at bedtime',
            category: 'cardiovascular'
          },
          {
            drugName: 'Omeprazole',
            genericName: 'Omeprazole',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '30 days',
            quantity: 30,
            instructions: 'Take before breakfast',
            category: 'gastrointestinal'
          }
        ],
        warnings: []
      },
      {
        prescriptionId: 'RX004',
        patientId: 'PT004',
        patientName: 'Maria Garcia',
        patientAge: 28,
        patientPhone: '555-0104',
        doctorName: 'Dr. James Wilson',
        receivedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        readyDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'dispensed',
        priority: 'normal',
        medications: [
          {
            drugName: 'Ibuprofen',
            genericName: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'As needed',
            duration: '14 days',
            quantity: 20,
            instructions: 'Take with food, max 3 times daily',
            category: 'analgesics'
          }
        ],
        warnings: [],
        dispensedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        dispensedBy: 'John Pharmacist'
      },
      {
        prescriptionId: 'RX005',
        patientId: 'PT005',
        patientName: 'David Thompson',
        patientAge: 54,
        patientPhone: '555-0105',
        doctorName: 'Dr. Rachel Green',
        receivedDate: new Date().toISOString(),
        readyDate: new Date().toISOString(),
        status: 'ready',
        priority: 'high',
        medications: [
          {
            drugName: 'Warfarin',
            genericName: 'Warfarin Sodium',
            dosage: '5mg',
            frequency: 'Once daily',
            duration: '90 days',
            quantity: 90,
            instructions: 'Monitor INR regularly',
            category: 'cardiovascular'
          }
        ],
        warnings: ['High-risk medication - requires counseling']
      }
    ];
  };

  // Initialize prescriptions
  useEffect(() => {
    const initializePrescriptions = () => {
      try {
        setLoading(true);
        const mockData = generateMockPrescriptions();
        setPrescriptions(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load prescriptions');
        console.error('Error loading prescriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    initializePrescriptions();
  }, []);

  // Process prescription
  const processPrescription = useCallback(async (prescriptionId) => {
    try {
      setPrescriptions(prev => prev.map(p => 
        p.prescriptionId === prescriptionId 
          ? { ...p, status: 'processing' }
          : p
      ));
      
      // Simulate processing time
      setTimeout(() => {
        setPrescriptions(prev => prev.map(p => 
          p.prescriptionId === prescriptionId 
            ? { ...p, status: 'ready', readyDate: new Date().toISOString() }
            : p
        ));
      }, 2000);
      
      return { success: true };
    } catch (err) {
      setError('Failed to process prescription');
      throw err;
    }
  }, []);

  // Dispense medication
  const dispenseMedication = useCallback(async (dispensingRecord) => {
    try {
      setPrescriptions(prev => prev.map(p => 
        p.prescriptionId === dispensingRecord.prescriptionId 
          ? { 
              ...p, 
              status: 'dispensed',
              dispensedDate: dispensingRecord.dispensedAt,
              dispensedBy: dispensingRecord.dispensedBy
            }
          : p
      ));
      
      return { success: true };
    } catch (err) {
      setError('Failed to dispense medication');
      throw err;
    }
  }, []);

  // Verify drug interactions
  const verifyInteractions = useCallback(async (medications) => {
    try {
      // Mock interaction checking logic
      const interactions = [];
      
      // Check for common dangerous interactions
      const drugNames = medications.map(med => med.drugName.toLowerCase());
      
      if (drugNames.includes('warfarin') && drugNames.includes('aspirin')) {
        interactions.push({
          severity: 'major',
          drugs: ['Warfarin', 'Aspirin'],
          description: 'Increased risk of bleeding',
          recommendation: 'Monitor INR closely and consider alternative'
        });
      }
      
      if (drugNames.includes('metformin') && drugNames.includes('contrast')) {
        interactions.push({
          severity: 'moderate',
          drugs: ['Metformin', 'Contrast Agent'],
          description: 'Risk of lactic acidosis',
          recommendation: 'Discontinue metformin before contrast procedure'
        });
      }
      
      return interactions;
    } catch (err) {
      setError('Failed to verify drug interactions');
      throw err;
    }
  }, []);

  // Add prescription
  const addPrescription = useCallback(async (prescriptionData) => {
    try {
      const newPrescription = {
        ...prescriptionData,
        prescriptionId: `RX${String(Date.now()).slice(-3)}`,
        receivedDate: new Date().toISOString(),
        status: 'pending'
      };
      
      setPrescriptions(prev => [newPrescription, ...prev]);
      return { success: true };
    } catch (err) {
      setError('Failed to add prescription');
      throw err;
    }
  }, []);

  // Get prescriptions by status
  const getPrescriptionsByStatus = useCallback((status) => {
    return prescriptions.filter(p => p.status === status);
  }, [prescriptions]);

  // Get prescriptions statistics
  const getStats = useCallback(() => {
    const total = prescriptions.length;
    const pending = prescriptions.filter(p => p.status === 'pending').length;
    const processing = prescriptions.filter(p => p.status === 'processing').length;
    const ready = prescriptions.filter(p => p.status === 'ready').length;
    const dispensed = prescriptions.filter(p => p.status === 'dispensed').length;
    
    const today = new Date().toDateString();
    const dispensedToday = prescriptions.filter(p => 
      p.status === 'dispensed' && 
      p.dispensedDate && 
      new Date(p.dispensedDate).toDateString() === today
    ).length;
    
    return {
      totalPrescriptions: total,
      pendingPrescriptions: pending,
      processingPrescriptions: processing,
      readyPrescriptions: ready,
      dispensedPrescriptions: dispensed,
      dispensedToday,
      processingRate: total > 0 ? Math.round(((ready + dispensed) / total) * 100) : 0
    };
  }, [prescriptions]);

  return {
    prescriptions,
    loading,
    error,
    processPrescription,
    dispenseMedication,
    verifyInteractions,
    addPrescription,
    getPrescriptionsByStatus,
    getStats
  };
}