import React, { useState, useEffect } from 'react';
import { X, Pill, AlertCircle, FileText, User, Search, Minus, AlertTriangle } from 'lucide-react';
import useClinicPrescriptions from '../hooks/useClinicPrescriptionsApi';

const ClinicPrescriptionModal = ({ isOpen, onClose, onPrescriptionAdded }) => {
  // API Hook
  const { 
    patients: apiPatients, 
    medications: apiMedications, 
    fetchPatients, 
    fetchMedications 
  } = useClinicPrescriptions();

  // Patient search state
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState(null);

  // Medication selection state
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [medicationSearchTerm, setMedicationSearchTerm] = useState('');
  const [availableMedications, setAvailableMedications] = useState([]);
  const [medicationsLoading, setMedicationsLoading] = useState(false);
  const [medicationsFetched, setMedicationsFetched] = useState(false);

  // Validation states
  const [validationErrors, setValidationErrors] = useState({});

  // Prescription metadata (simplified - removed duration and general notes)
  const [prescriptionData, setPrescriptionData] = useState({
    startDate: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch patients and medications when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          setPatientsLoading(true);
          setMedicationsLoading(true);
          setPatientsError(null);
          
          console.log('🔄 Loading patients and medications...');
          
          // Fetch both patients and medications
          await Promise.all([
            fetchPatients(),
            fetchMedications()
          ]);
          
          setMedicationsFetched(true);
        } catch (error) {
          console.error('❌ Error loading data:', error);
          setPatientsError('Failed to load patient data. Please try again.');
        } finally {
          setPatientsLoading(false);
          setMedicationsLoading(false);
        }
      };
      
      loadData();
    }
  }, [isOpen, fetchPatients, fetchMedications]);

  // Debug useEffect to monitor patients data
  useEffect(() => {
    if (apiPatients) {
      console.log('✅ Patients updated:', apiPatients.length);
      console.log('📋 First 3 patients:', apiPatients.slice(0, 3));
    }
  }, [apiPatients]);

  // Validation functions
  const validatePatientSelection = () => {
    if (!selectedPatient) {
      return 'Please select a patient before proceeding';
    }
    if (!selectedPatient.name || !selectedPatient.nationalId) {
      return 'Selected patient has incomplete information';
    }
    return null;
  };

  const validateMedications = () => {
    const errors = {};

    if (selectedMedications.length === 0) {
      errors.medications = 'Please add at least one medication';
      return errors;
    }

    if (selectedMedications.length > 10) {
      errors.medications = 'Maximum 10 medications allowed per prescription';
    }

    selectedMedications.forEach((medication, index) => {
      const medicationErrors = {};

      // Validate medication name
      if (!medication.name || medication.name.trim() === '') {
        medicationErrors.name = 'Medication name is required';
      }

      // Validate dosage
      if (!medication.dosage || medication.dosage.trim() === '') {
        medicationErrors.dosage = 'Dosage is required';
      } else {
        // Enhanced dosage format validation with more units
        const dosagePattern = /^\d+(\.\d{1,3})?\s*(mg|g|ml|mcg|μg|iu|unit|units?|tab|tabs?|cap|caps?|drop|drops?|puff|puffs?|spray|sprays?|patch|patches?)$/i;
        if (!dosagePattern.test(medication.dosage.trim())) {
          medicationErrors.dosage = 'Invalid dosage format (e.g., 500mg, 1.5g, 10ml, 2tabs, 1puff)';
        } else {
          // Check for reasonable dosage ranges
          const numericValue = parseFloat(medication.dosage.match(/^\d+(\.\d+)?/)[0]);
          const unit = medication.dosage.replace(/[\d.\s]/g, '').toLowerCase();

          // Set reasonable limits per unit type
          const dosageLimits = {
            'mg': { min: 0.1, max: 5000 },
            'mcg': { min: 0.1, max: 10000 },
            'μg': { min: 0.1, max: 10000 },
            'g': { min: 0.01, max: 50 },
            'ml': { min: 0.1, max: 1000 },
            'iu': { min: 1, max: 100000 },
            'unit': { min: 1, max: 1000 },
            'units': { min: 1, max: 1000 },
            'tab': { min: 0.25, max: 20 },
            'tabs': { min: 0.25, max: 20 },
            'cap': { min: 0.5, max: 20 },
            'caps': { min: 0.5, max: 20 },
            'drop': { min: 1, max: 50 },
            'drops': { min: 1, max: 50 },
            'puff': { min: 1, max: 20 },
            'puffs': { min: 1, max: 20 },
            'spray': { min: 1, max: 10 },
            'sprays': { min: 1, max: 10 },
            'patch': { min: 1, max: 7 },
            'patches': { min: 1, max: 7 }
          };

          const limits = dosageLimits[unit];
          if (limits && (numericValue < limits.min || numericValue > limits.max)) {
            medicationErrors.dosage = `Dosage should be between ${limits.min}-${limits.max} ${unit}`;
          }
        }
      }

      // Validate frequency
      if (!medication.frequency || medication.frequency.trim() === '') {
        medicationErrors.frequency = 'Frequency is required';
      } else {
        const validFrequencies = [
          'once daily', 'twice daily', 'three times daily', 'four times daily',
          '1x daily', '2x daily', '3x daily', '4x daily',
          'every 4 hours', 'every 6 hours', 'every 8 hours', 'every 12 hours',
          'as needed', 'prn', 'before meals', 'after meals', 'with meals',
          'at bedtime', 'morning', 'evening', 'when required'
        ];
        
        const isValidFrequency = validFrequencies.some(freq => 
          medication.frequency.toLowerCase().includes(freq.toLowerCase())
        );
        
        if (!isValidFrequency && !/^\d+\s*(times?|x)\s*(daily|per day|a day)$/i.test(medication.frequency)) {
          medicationErrors.frequency = 'Please use standard frequency format (e.g., "twice daily", "every 8 hours")';
        }
      }

      // Validate quantity
      if (!medication.quantity || medication.quantity === '') {
        medicationErrors.quantity = 'Quantity is required';
      } else {
        const quantity = parseFloat(medication.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          medicationErrors.quantity = 'Quantity must be a positive number';
        } else if (quantity > 1000) {
          medicationErrors.quantity = 'Quantity seems too large (max 1000)';
        } else {
          // Validate quantity based on dosage form
          const dosageForm = (medication.dosageForm || '').toLowerCase();
          const decimals = (medication.quantity.toString().split('.')[1] || '').length;

          if (['tablet', 'capsule', 'injection', 'vial'].includes(dosageForm)) {
            if (quantity % 1 !== 0) {
              medicationErrors.quantity = 'Quantity for tablets/capsules/injections must be whole numbers';
            }
          } else if (['syrup', 'suspension', 'solution'].includes(dosageForm)) {
            if (decimals > 1) {
              medicationErrors.quantity = 'Liquid quantities should not exceed 1 decimal place';
            }
            if (quantity < 5) {
              medicationErrors.quantity = 'Minimum liquid quantity is 5ml';
            }
          }

          // Check for reasonable quantity limits by category
          const category = (medication.category || '').toLowerCase();
          if (category.includes('controlled') || category.includes('narcotic')) {
            if (quantity > 30) {
              medicationErrors.quantity = 'Controlled substances limited to 30 units maximum';
            }
          }
        }
      }

      // Validate against available stock
      if (medication.currentStock !== undefined && medication.quantity) {
        const requestedQuantity = parseFloat(medication.quantity);
        if (!isNaN(requestedQuantity) && requestedQuantity > medication.currentStock) {
          if (medication.currentStock === 0) {
            medicationErrors.quantity = `${medication.drugName} is currently out of stock`;
          } else {
            medicationErrors.quantity = `Only ${medication.currentStock} ${getQuantityUnit(medication.dosageForm)} available in stock`;
          }
        }
      }

      // Validate instructions
      if (medication.instructions) {
        if (medication.instructions.length > 500) {
          medicationErrors.instructions = 'Instructions too long (max 500 characters)';
        } else if (medication.instructions.trim().length > 0 && medication.instructions.trim().length < 3) {
          medicationErrors.instructions = 'Instructions too short (min 3 characters)';
        }

        // Enhanced safety checks for dangerous instructions
        const dangerousWords = [
          'overdose', 'double dose', 'triple dose', 'quadruple dose',
          'as much as possible', 'unlimited', 'no limit', 'maximum dose',
          'crush and inject', 'inject', 'snort', 'abuse',
          'all at once', 'entire bottle', 'whole pack'
        ];
        const containsDangerous = dangerousWords.some(word =>
          medication.instructions.toLowerCase().includes(word)
        );
        if (containsDangerous) {
          medicationErrors.instructions = 'Instructions contain potentially unsafe language';
        }

        // Check for common instruction patterns
        const validInstructionPatterns = [
          /take.*with.*food/i,
          /take.*before.*meal/i,
          /take.*after.*meal/i,
          /apply.*to.*affected.*area/i,
          /as.*directed.*by.*physician/i,
          /do.*not.*exceed/i,
          /take.*as.*needed/i
        ];
        
        if (medication.instructions.length > 10) {
          const hasValidPattern = validInstructionPatterns.some(pattern =>
            pattern.test(medication.instructions)
          );
          
          if (!hasValidPattern && !medication.instructions.toLowerCase().includes('consult')) {
            medicationErrors.instructions = 'Please provide more detailed instructions (e.g., "Take with food", "Apply to affected area")';
          }
        }
      }

      if (Object.keys(medicationErrors).length > 0) {
        errors[`medication_${index}`] = medicationErrors;
      }
    });

    return errors;
  };

  const validatePrescriptionData = () => {
    const errors = {};

    if (!prescriptionData.startDate) {
      errors.startDate = 'Start date is required';
    } else {
      const startDate = new Date(prescriptionData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        errors.startDate = 'Start date cannot be in the past';
      }
      
      const maxFutureDate = new Date();
      maxFutureDate.setDate(maxFutureDate.getDate() + 30);
      if (startDate > maxFutureDate) {
        errors.startDate = 'Start date cannot be more than 30 days in the future';
      }
    }

    return errors;
  };

  // Helper functions
  const getQuantityUnit = (dosageForm) => {
    const formUnits = {
      'tablet': 'tablets',
      'capsule': 'capsules',
      'syrup': 'ml',
      'injection': 'vials',
      'cream': 'tubes',
      'ointment': 'tubes'
    };
    return formUnits[dosageForm?.toLowerCase()] || 'units';
  };

  const clearFieldError = (fieldName) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // Generate dosage options based on medication
  const generateDosageOptions = (medication) => {
    const strength = medication?.strength;
    const dosageForm = medication?.dosageForm || medication?.form;
    
    if (!strength || typeof strength !== 'string') return ['Standard dose'];
    
    const baseStrength = parseFloat(strength.replace(/[^0-9.]/g, ''));
    const unit = strength.replace(/[0-9.]/g, '');
    
    if (isNaN(baseStrength)) return [strength];
    
    // Generate common dosage multiples based on form
    const multipliers = dosageForm?.toLowerCase().includes('tablet') || dosageForm?.toLowerCase().includes('capsule')
      ? [0.5, 1, 2] // Half, full, double dose for tablets/capsules
      : [1]; // Standard dose for liquids/injectables
    
    return multipliers.map(mult => `${baseStrength * mult}${unit}`);
  };

  // Get standard frequencies based on medication category
  const getStandardFrequencies = (category) => {
    const frequencyMap = {
      'Analgesic': ['Once daily (OD)', 'Twice daily (BD)', 'Three times daily (TDS)', 'As needed (PRN)'],
      'Antibiotic': ['Twice daily (BD)', 'Three times daily (TDS)', 'Four times daily (QDS)'],
      'Antidiabetic': ['Once daily (OD)', 'Twice daily (BD)', 'Before meals', 'With meals'],
      'Antihypertensive': ['Once daily (OD)', 'Twice daily (BD)'],
      'Diuretic': ['Once daily (OD)', 'In the morning'],
      'Proton Pump Inhibitor': ['Once daily (OD)', 'Twice daily (BD)', 'Before meals'],
      default: ['Once daily (OD)', 'Twice daily (BD)', 'Three times daily (TDS)', 'Four times daily (QDS)']
    };
    
    return frequencyMap[category] || frequencyMap.default;
  };

  // Filter functions - search by fullName, firstName, lastName, and nationalId
  const filteredPatients = (apiPatients || []).filter(patient => {
    const searchTerm = patientSearchTerm.toLowerCase();
    const fullNameMatch = patient.fullName?.toLowerCase().includes(searchTerm);
    const firstNameMatch = patient.firstName?.toLowerCase().includes(searchTerm);
    const lastNameMatch = patient.lastName?.toLowerCase().includes(searchTerm);
    const nameMatch = patient.name?.toLowerCase().includes(searchTerm);
    const idMatch = patient.nationalId?.toString().includes(patientSearchTerm);
    const matches = fullNameMatch || firstNameMatch || lastNameMatch || nameMatch || idMatch;
    
    if (patientSearchTerm && matches) {
      console.log('🔍 Search match:', { 
        term: patientSearchTerm, 
        patient: patient.fullName || patient.name, 
        id: patient.nationalId 
      });
    }
    
    return matches;
  });

  const filteredMedications = (apiMedications || availableMedications || []).filter(medication =>
    medication.name?.toLowerCase().includes(medicationSearchTerm.toLowerCase()) ||
    medication.drugName?.toLowerCase().includes(medicationSearchTerm.toLowerCase()) ||
    medication.genericName?.toLowerCase().includes(medicationSearchTerm.toLowerCase()) ||
    medication.category?.toLowerCase().includes(medicationSearchTerm.toLowerCase())
  );

  // Medication management
  const addMedication = (medication) => {
    if (selectedMedications.find(med => med.id === medication.id)) {
      return; // Already added
    }
    
    const medicationWithDefaults = {
      ...medication,
      dosage: '',
      frequency: '',
      quantity: '',
      instructions: medication.commonInstructions || '',
      dosageOptions: generateDosageOptions(medication),
      frequencyOptions: getStandardFrequencies(),
      quantityUnit: getQuantityUnit(medication.dosageForm || medication.form)
    };
    
    setSelectedMedications(prev => [...prev, medicationWithDefaults]);
    setMedicationSearchTerm('');
  };

  const removeMedication = (medicationId) => {
    setSelectedMedications(prev => prev.filter(med => med.id !== medicationId));
    // Clear related validation errors
    const medicationIndex = selectedMedications.findIndex(med => med.id === medicationId);
    if (medicationIndex !== -1) {
      clearFieldError(`medication_${medicationIndex}`);
    }
  };

  const updateMedicationField = (medicationId, field, value) => {
    setSelectedMedications(prev => prev.map(med =>
      med.id === medicationId ? { ...med, [field]: value } : med
    ));
  };

  // Initialize medications when modal opens
  useEffect(() => {
    if (isOpen && !medicationsFetched && !medicationsLoading) {
      setMedicationsLoading(true);

      try {
        // Fallback to mock data for clinic prescriptions
        const mockMedications = [
          {
            id: 1,
            name: 'Paracetamol',
            drugName: 'Paracetamol',
            genericName: 'Acetaminophen',
            category: 'Analgesic',
            strength: '500mg',
            dosageForm: 'Tablet',
            manufacturer: 'GSK',
            currentStock: 1000,
            commonInstructions: 'Take with water after meals'
          },
          {
            id: 2,
            name: 'Amoxicillin',
            drugName: 'Amoxicillin',
            genericName: 'Amoxicillin',
            category: 'Antibiotic',
            strength: '250mg',
            dosageForm: 'Capsule',
            manufacturer: 'Pfizer',
            currentStock: 500,
            commonInstructions: 'Complete the full course'
          },
          {
            id: 3,
            name: 'Omeprazole',
            drugName: 'Omeprazole',
            genericName: 'Omeprazole',
            category: 'Proton Pump Inhibitor',
            strength: '20mg',
            dosageForm: 'Capsule',
            manufacturer: 'AstraZeneca',
            currentStock: 300,
            commonInstructions: 'Take before meals'
          },
          {
            id: 4,
            name: 'Metformin',
            drugName: 'Metformin',
            genericName: 'Metformin HCl',
            category: 'Antidiabetic',
            strength: '500mg',
            dosageForm: 'Tablet',
            manufacturer: 'Merck',
            currentStock: 800,
            commonInstructions: 'Take with meals'
          }
        ];

        setAvailableMedications(mockMedications);
        setMedicationsFetched(true);
      } catch (error) {
        console.error('Error loading medications:', error);
      } finally {
        setMedicationsLoading(false);
      }
    }
  }, [isOpen, medicationsFetched, medicationsLoading]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPatientSearchTerm('');
      setSelectedPatient(null);
      setSelectedMedications([]);
      setMedicationSearchTerm('');
      setPrescriptionData({
        startDate: new Date().toISOString().split('T')[0]
      });
      setIsSubmitting(false);
      setValidationErrors({});
      setMedicationsFetched(false);
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all sections
    const patientError = validatePatientSelection();
    const medicationErrors = validateMedications();
    const prescriptionErrors = validatePrescriptionData();

    const allErrors = {
      ...(patientError && { patient: patientError }),
      ...medicationErrors,
      ...prescriptionErrors
    };

    setValidationErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Create prescription payload in the SAME FORMAT as Ward Management
      const prescriptionPayload = {
        // Patient and prescription metadata (same as Ward)
        patientNationalId: selectedPatient.nationalId || selectedPatient.id,
        patientName: selectedPatient.name,
        prescribedBy: "Clinic Doctor", // Clinic doctor
        startDate: prescriptionData.startDate,
        endDate: null, // Optional - can be set later
        prescriptionNotes: `Clinic prescription for ${selectedMedications.length} medication(s) - Patient: ${selectedPatient.name}`,
        consultationType: "outpatient",
        isUrgent: selectedMedications.some(med => med.isUrgent) || false,

        // Convert selected medications to prescriptionItems format (SAME as Ward)
        medications: selectedMedications.map(medication => ({
          medicationId: medication.id, // Use medication entity ID (required relationship field)
          drugName: medication.name || medication.drugName,
          dose: medication.dosage,
          frequency: medication.frequency,
          quantity: parseInt(medication.quantity) || 1,
          quantityUnit: medication.quantityUnit || getQuantityUnit(medication.dosageForm || medication.form),
          instructions: medication.instructions || '',
          route: medication.route || 'Oral',
          isUrgent: medication.isUrgent || false,
          notes: medication.notes || 'Clinic prescription'
        }))
      };

      // Call the onPrescriptionAdded callback
      if (onPrescriptionAdded) {
        await onPrescriptionAdded(prescriptionPayload);
      }

      // Reset form and close modal
      handleClose();
    } catch (error) {
      console.error('Error creating prescription:', error);
      setValidationErrors({ submit: 'Failed to create prescription. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setPatientSearchTerm('');
    setSelectedPatient(null);
    setSelectedMedications([]);
    setMedicationSearchTerm('');
    setPrescriptionData({
      startDate: new Date().toISOString().split('T')[0]
    });
    setValidationErrors({});
    setIsSubmitting(false);
    setMedicationsFetched(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <Pill size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create New Prescription</h2>
              <p className="text-blue-100">Clinic Management System</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Global validation error */}
            {validationErrors.submit && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                <div className="text-red-700 flex items-center">
                  <AlertCircle size={20} className="mr-2" />
                  {validationErrors.submit}
                </div>
              </div>
            )}

            {/* Step 1: Patient Search and Selection */}
            <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border ${validationErrors.patient ? 'border-red-300 bg-red-50' : 'border-blue-100'}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <User size={20} className="mr-3 text-blue-600" />
                Step 1: Search and Select Patient
                {validationErrors.patient && (
                  <span className="ml-2 text-red-600">
                    <AlertCircle size={16} />
                  </span>
                )}
              </h3>
              {validationErrors.patient && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <div className="text-red-700 text-sm flex items-center">
                    <AlertCircle size={14} className="mr-2" />
                    {validationErrors.patient}
                  </div>
                </div>
              )}

              {/* API Error Display */}
              {patientsError && !patientsLoading && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <div className="text-red-700 text-sm flex items-center">
                    <AlertCircle size={14} className="mr-2" />
                    {patientsError}
                  </div>
                </div>
              )}

              {!selectedPatient ? (
                <div className="space-y-4">
                  {/* Patient Search */}
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients by name or ID..."
                      value={patientSearchTerm}
                      onChange={(e) => setPatientSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>

                  {/* Patient Search Results */}
                  {patientSearchTerm && (
                    <div>
                      <div className="text-xs text-gray-500 mb-2">
                        Searching for: "{patientSearchTerm}" | Found: {filteredPatients.length} patients
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient, index) => {
                          console.log(`🔍 Search result ${index}:`, { name: patient.name, nationalId: patient.nationalId });
                          return (
                            <button
                              key={patient.nationalId || patient.id || index}
                              type="button"
                              onClick={() => {
                                console.log('🔘 Search patient selected:', patient);
                                setSelectedPatient(patient);
                                clearFieldError('patient');
                              }}
                              className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-white transition-all duration-200 text-left"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User size={16} className="text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {patient.fullName || patient.name || `${patient.firstName} ${patient.lastName}` || 'No Name'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {patient.nationalId}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="col-span-2 text-center py-4 text-gray-500">
                          No patients found matching your search
                        </div>
                      )}
                      </div>
                    </div>
                  )}

                  {!patientSearchTerm && (
                    <div>
                      {patientsLoading ? (
                        <div className="text-center py-8">
                          <div className="text-blue-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            Loading patients...
                          </div>
                        </div>
                      ) : patientsError ? (
                        <div className="text-center py-8">
                          <div className="text-red-500">
                            <AlertCircle size={20} className="mx-auto mb-2" />
                            {patientsError}
                          </div>
                        </div>
                      ) : apiPatients && apiPatients.length > 0 ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-4">Available active patients: ({apiPatients.length}) - Showing first 4</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                            {console.log('🎯 Rendering patients in grid:', apiPatients?.length, 'patients - showing first 4')}
                            {apiPatients.slice(0, 4).map((patient, index) => {
                              console.log(`👤 Patient ${index}:`, { name: patient.name, nationalId: patient.nationalId });
                              return (
                                <button
                                  key={patient.nationalId || patient.id || index}
                                  type="button"
                                  onClick={() => {
                                    console.log('🔘 Patient selected:', patient);
                                    setSelectedPatient(patient);
                                    clearFieldError('patient');
                                  }}
                                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-white transition-all duration-200 text-left"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <User size={16} className="text-blue-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {patient.fullName || patient.name || `${patient.firstName} ${patient.lastName}` || 'No Name'}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        ID: {patient.nationalId}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <div>No patients available</div>
                          <div className="text-xs mt-2">
                            Debug: apiPatients = {JSON.stringify(apiPatients?.slice(0, 2) || 'null')}
                          </div>
                          <div className="text-xs">
                            Loading: {patientsLoading ? 'Yes' : 'No'}, Error: {patientsError || 'None'}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              console.log('🔄 Manual fetch triggered');
                              fetchPatients();
                            }}
                            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded"
                          >
                            Retry Fetch Patients
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <User size={20} className="text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedPatient.fullName || selectedPatient.name || `${selectedPatient.firstName} ${selectedPatient.lastName}`}
                      </div>
                      <div className="text-sm text-gray-500">ID: {selectedPatient.nationalId}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Medication Search and Selection */}
            <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border ${validationErrors.medications ? 'border-red-300 bg-red-50' : 'border-green-100'}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Pill size={20} className="mr-3 text-green-600" />
                Step 2: Search and Add Medications
                {validationErrors.medications && (
                  <span className="ml-2 text-red-600">
                    <AlertCircle size={16} />
                  </span>
                )}
              </h3>
              {validationErrors.medications && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <div className="text-red-700 text-sm flex items-center">
                    <AlertCircle size={14} className="mr-2" />
                    {validationErrors.medications}
                  </div>
                </div>
              )}

              {/* Medication Search */}
              <div className="relative mb-4">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medications by name, category, or manufacturer..."
                  value={medicationSearchTerm}
                  onChange={(e) => setMedicationSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>

              {/* Medication Results */}
              {medicationSearchTerm && (
                <div>
                  {filteredMedications.length > 0 && (
                    <p className="text-sm text-gray-600 mb-4">Search results: ({filteredMedications.length}) - Showing first 6</p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto mb-4">
                    {filteredMedications.length > 0 ? (
                    filteredMedications.slice(0, 6).map((medication) => (
                      <button
                        key={medication.id}
                        type="button"
                        onClick={() => addMedication(medication)}
                        disabled={selectedMedications.find(med => med.id === medication.id)}
                        className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                          selectedMedications.find(med => med.id === medication.id)
                            ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-green-500 hover:bg-white'
                        }`}
                      >
                        <div className="font-medium text-gray-900">
                          {medication.drugName || medication.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {medication.strength} {medication.dosageForm}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Category: {medication.category}
                        </div>
                        <div className="text-xs text-blue-600 mt-1 font-medium">
                          Stock: {medication.currentStock || 0} units
                        </div>
                        {selectedMedications.find(med => med.id === medication.id) && (
                          <div className="text-xs text-green-600 mt-2 font-medium">✓ Added</div>
                        )}
                      </button>
                    ))
                    ) : (
                      <div className="col-span-3 text-center py-4 text-gray-500">
                        No medications found matching your search
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!medicationSearchTerm && (
                <div>
                  {medicationsLoading ? (
                    <div className="text-center py-8">
                      <div className="text-green-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                        Loading medications...
                      </div>
                    </div>
                  ) : apiMedications && apiMedications.length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">Available medications: ({apiMedications.length}) - Showing first 6</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                        {apiMedications.slice(0, 6).map((medication) => (
                          <button
                            key={medication.id}
                            type="button"
                            onClick={() => addMedication(medication)}
                            disabled={selectedMedications.find(med => med.id === medication.id)}
                            className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                              selectedMedications.find(med => med.id === medication.id)
                                ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                                : 'border-gray-200 hover:border-green-500 hover:bg-white'
                            }`}
                          >
                            <div className="font-medium text-gray-900">
                              {medication.drugName || medication.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {medication.strength} {medication.dosageForm}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Category: {medication.category}
                            </div>
                            <div className="text-xs text-blue-600 mt-1 font-medium">
                              Stock: {medication.currentStock || 0} units
                            </div>
                            {selectedMedications.find(med => med.id === medication.id) && (
                              <div className="text-xs text-green-600 mt-2 font-medium">✓ Added</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No medications available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Selected Medications with Dosage Configuration */}
            {selectedMedications.length > 0 && (
              <div className={`bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border ${validationErrors.duplicates || Object.keys(validationErrors).some(key => key.startsWith('medication_')) ? 'border-red-300 bg-red-50' : 'border-amber-100'}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <FileText size={20} className="mr-3 text-amber-600" />
                  Step 3: Configure Selected Medications ({selectedMedications.length})
                  {(validationErrors.duplicates || Object.keys(validationErrors).some(key => key.startsWith('medication_'))) && (
                    <span className="ml-2 text-red-600">
                      <AlertCircle size={16} />
                    </span>
                  )}
                </h3>
                {validationErrors.duplicates && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                    <div className="text-red-700 text-sm flex items-center">
                      <AlertCircle size={14} className="mr-2" />
                      {validationErrors.duplicates}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                {selectedMedications.map((medication, index) => {
                  const medicationErrors = validationErrors[`medication_${index}`] || {};
                  const hasErrors = Object.keys(medicationErrors).length > 0;

                  return (
                    <div key={medication.id} className={`bg-white rounded-xl p-4 border ${hasErrors ? 'border-red-300 bg-red-50' : 'border-amber-200'}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Pill size={20} className="text-amber-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{medication.name || medication.drugName}</h4>
                            <p className="text-sm text-gray-500">
                              {medication.category} • {medication.strength} {medication.dosageForm}
                            </p>
                            {medication.genericName && (
                              <p className="text-xs text-gray-400">Generic: {medication.genericName}</p>
                            )}
                            <p className="text-xs text-gray-400">
                              Stock: {medication.currentStock} • {medication.manufacturer}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMedication(medication.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Minus size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Dosage *
                          </label>
                          <select
                            value={medication.dosage || ''}
                            onChange={(e) => updateMedicationField(medication.id, 'dosage', e.target.value)}
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all duration-200 ${medicationErrors.dosage ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-amber-500 focus:border-amber-500'}`}
                          >
                            <option value="">Select dosage</option>
                            {medication.dosageOptions && medication.dosageOptions.map((dosage) => (
                              <option key={dosage} value={dosage}>{dosage}</option>
                            ))}
                          </select>
                          {medicationErrors.dosage && (
                            <div className="mt-1 text-red-600 text-xs flex items-center">
                              <AlertCircle size={12} className="mr-1" />
                              {medicationErrors.dosage}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Frequency *
                          </label>
                          <select
                            value={medication.frequency || ''}
                            onChange={(e) => updateMedicationField(medication.id, 'frequency', e.target.value)}
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all duration-200 ${medicationErrors.frequency ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-amber-500 focus:border-amber-500'}`}
                          >
                            <option value="">Select frequency</option>
                            {medication.frequencyOptions && medication.frequencyOptions.map((frequency) => (
                              <option key={frequency} value={frequency}>{frequency}</option>
                            ))}
                          </select>
                          {medicationErrors.frequency && (
                            <div className="mt-1 text-red-600 text-xs flex items-center">
                              <AlertCircle size={12} className="mr-1" />
                              {medicationErrors.frequency}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quantity to Issue *
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              value={medication.quantity || ''}
                              onChange={(e) => updateMedicationField(medication.id, 'quantity', e.target.value)}
                              className={`flex-1 px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all duration-200 ${medicationErrors.quantity ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-amber-500 focus:border-amber-500'}`}
                              placeholder="Enter quantity"
                            />
                            <span className="text-sm text-gray-500 min-w-[60px]">
                              {medication.quantityUnit}
                            </span>
                          </div>
                          {medicationErrors.quantity && (
                            <div className="mt-1 text-red-600 text-xs flex items-center">
                              <AlertCircle size={12} className="mr-1" />
                              {medicationErrors.quantity}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Instructions
                        </label>
                        <textarea
                          rows="2"
                          value={medication.instructions || ''}
                          onChange={(e) => updateMedicationField(medication.id, 'instructions', e.target.value)}
                          className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 transition-all duration-200 resize-none ${medicationErrors.instructions ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-amber-500 focus:border-amber-500'}`}
                          placeholder="Type instructions or click suggestions below..."
                          maxLength="500"
                        />
                        
                        {/* Quick Suggestion Buttons */}
                        <div className="mt-2 mb-2">
                          <p className="text-xs text-gray-500 mb-2">💡 Quick suggestions (click to fill):</p>
                          <div className="flex flex-wrap gap-1">
                            {[
                              'Take as directed',
                              'Take with food',
                              'Take on empty stomach',
                              'Take before meals',
                              'Take after meals',
                              'Take at bedtime',
                              'Take in morning',
                              'Complete full course',
                              'Take as needed for pain',
                              'Do not crush or chew',
                              'Shake well before use',
                              'Take twice daily'
                            ].map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => updateMedicationField(medication.id, 'instructions', suggestion)}
                                className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 transition-colors duration-200 border border-amber-200 hover:border-amber-300"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {medicationErrors.instructions && (
                          <div className="mt-1 text-red-600 text-xs flex items-center">
                            <AlertCircle size={12} className="mr-1" />
                            {medicationErrors.instructions}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          {medication.instructions ? medication.instructions.length : 0}/500 characters
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            )}

            {/* Start Date Section */}
            {selectedMedications.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText size={20} className="mr-3 text-blue-600" />
                  Prescription Start Date
                </h3>
                <div className="max-w-md">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={prescriptionData.startDate}
                    onChange={(e) => setPrescriptionData(prev => ({ ...prev, startDate: e.target.value }))}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      validationErrors.startDate ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {validationErrors.startDate && (
                    <div className="mt-1 text-red-600 text-xs flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {validationErrors.startDate}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    📅 Select when the prescription should begin
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2 text-sm">
            {Object.keys(validationErrors).length > 0 ? (
              <>
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-red-600 font-medium">
                  {Object.keys(validationErrors).length} validation error(s) - Please fix before submitting
                </span>
              </>
            ) : !selectedPatient ? (
              <>
                <AlertCircle size={16} className="text-gray-500" />
                <span className="text-gray-500">Please select a patient to continue</span>
              </>
            ) : selectedMedications.length === 0 ? (
              <>
                <AlertCircle size={16} className="text-gray-500" />
                <span className="text-gray-500">Please add at least one medication</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-green-600 font-medium">
                  Ready to create {selectedMedications.length} prescription(s)
                </span>
              </>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedPatient || selectedMedications.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Prescriptions...</span>
                </>
              ) : (
                <>
                  <FileText size={20} />
                  <span>Create Prescription{selectedMedications.length > 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicPrescriptionModal;