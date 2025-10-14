import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Search, User, ChevronDown, Check, X, AlertTriangle, Bed, Shield } from 'lucide-react';
import usePatients from '../hooks/usePatients';
import useWards from '../hooks/useWards';
import useAdmissions from '../hooks/useAdmissions';

const AdmitPatientModal = ({ isOpen, onClose, onAdmissionSuccess }) => {
  const { patients, loading, fetchPatients, searchPatients, calculateAge } = usePatients();
  const { wards, loading: wardsLoading } = useWards();
  const { loading: isSubmitting, lastError: _LAST_ERROR, admitPatient, activeAdmissions, fetchingAdmissions, fetchActiveAdmissions } = useAdmissions();
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [showBedDropdown, setShowBedDropdown] = useState(false);
  const [alreadyAdmittedPatient, setAlreadyAdmittedPatient] = useState(null);
  
  const [admission, setAdmission] = useState({
    patientId: '',
    admissionDate: '',
    admissionTime: '',
    wardId: '',
    bedNumber: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Generate available beds for the selected ward
  const generateAvailableBeds = useCallback((wardId) => {
    if (!wardId || !wards || !activeAdmissions) return [];

    const selectedWard = wards.find(w => w.wardId === parseInt(wardId));
    if (!selectedWard) return [];

    // Generate bed numbers based on ward type
    let bedNumbers = [];
    const wardCapacity = getWardCapacity(selectedWard.wardType);

    for (let i = 1; i <= wardCapacity; i++) {
      const bedNumber = `${selectedWard.wardName.charAt(selectedWard.wardName.length - 1)}${i.toString().padStart(2, '0')}`;
      bedNumbers.push(bedNumber);
    }

    // Filter out occupied beds
    const occupiedBeds = activeAdmissions
      .filter(admission => String(admission.wardId) === String(wardId))
      .map(admission => admission.bedNumber);

    return bedNumbers.filter(bed => !occupiedBeds.includes(bed));
  }, [wards, activeAdmissions]);

  // Get ward capacity based on type
  const getWardCapacity = (wardType) => {
    switch (wardType?.toLowerCase()) {
      case 'general':
        return 20;
      case 'icu':
        return 10;
      case 'dialysis':
        return 8;
      default:
        return 15;
    }
  };

  // Check if patient is already admitted and active
  const checkPatientAdmissionStatus = (patientNationalId) => {
    if (!activeAdmissions || !patientNationalId) return null;

    const existingAdmission = activeAdmissions.find(
      admission => String(admission.patientNationalId) === String(patientNationalId)
    );

    return existingAdmission;
  };

  // Validation functions
  const validateAdmission = () => {
    const errors = {};

    // Patient validation
    if (!selectedPatient) {
      errors.patient = 'Please select a patient to admit';
    }

    // Ward validation
    if (!admission.wardId) {
      errors.wardId = 'Please select a ward';
    }

    // Bed number validation
    if (!admission.bedNumber || !admission.bedNumber.trim()) {
      errors.bedNumber = 'Bed number is required';
    } else if (admission.bedNumber.length > 10) {
      errors.bedNumber = 'Bed number must be 10 characters or less';
    } else if (!/^[A-Za-z0-9-]+$/.test(admission.bedNumber.trim())) {
      errors.bedNumber = 'Bed number can only contain letters, numbers, and hyphens';
    }

    // Date validation
    if (!admission.admissionDate) {
      errors.admissionDate = 'Admission date is required';
    } else {
      const admissionDate = new Date(admission.admissionDate);
      const today = new Date();
      const maxFutureDate = new Date();
      maxFutureDate.setDate(today.getDate() + 30); // Allow up to 30 days in future

      if (admissionDate < today.setHours(0, 0, 0, 0)) {
        errors.admissionDate = 'Admission date cannot be in the past';
      } else if (admissionDate > maxFutureDate) {
        errors.admissionDate = 'Admission date cannot be more than 30 days in the future';
      }
    }

    // Time validation
    if (!admission.admissionTime) {
      errors.admissionTime = 'Admission time is required';
    } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(admission.admissionTime)) {
      errors.admissionTime = 'Please enter a valid time (HH:MM)';
    }

    // Check if patient is already admitted
    if (selectedPatient && activeAdmissions && Array.isArray(activeAdmissions)) {
      const isAlreadyAdmitted = activeAdmissions.some(
        adm => String(adm.patientNationalId) === String(selectedPatient.nationalId)
      );
      if (isAlreadyAdmitted) {
        errors.patient = 'This patient is already admitted to a ward';
      }
    }

    // Check if bed is already occupied (if we have ward data)
    if (admission.wardId && admission.bedNumber && activeAdmissions && Array.isArray(activeAdmissions)) {
      const isBedOccupied = activeAdmissions.some(
        adm => String(adm.wardId) === String(admission.wardId) &&
               adm.bedNumber?.toLowerCase() === admission.bedNumber?.toLowerCase()
      );
      if (isBedOccupied) {
        errors.bedNumber = 'This bed is already occupied';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Real-time validation for individual fields
  const validateField = (fieldName, value) => {
    const errors = { ...validationErrors };

    switch (fieldName) {
      case 'bedNumber':
        if (!value || !value.trim()) {
          errors.bedNumber = 'Bed number is required';
        } else if (value.length > 10) {
          errors.bedNumber = 'Bed number must be 10 characters or less';
        } else if (!/^[A-Za-z0-9-]+$/.test(value.trim())) {
          errors.bedNumber = 'Bed number can only contain letters, numbers, and hyphens';
        } else {
          delete errors.bedNumber;
        }
        break;
      case 'admissionDate':
        if (!value) {
          errors.admissionDate = 'Admission date is required';
        } else {
          const admissionDate = new Date(value);
          const today = new Date();
          const maxFutureDate = new Date();
          maxFutureDate.setDate(today.getDate() + 30);

          if (admissionDate < today.setHours(0, 0, 0, 0)) {
            errors.admissionDate = 'Admission date cannot be in the past';
          } else if (admissionDate > maxFutureDate) {
            errors.admissionDate = 'Admission date cannot be more than 30 days in the future';
          } else {
            delete errors.admissionDate;
          }
        }
        break;
      case 'admissionTime':
        if (!value) {
          errors.admissionTime = 'Admission time is required';
        } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
          errors.admissionTime = 'Please enter a valid time (HH:MM)';
        } else {
          delete errors.admissionTime;
        }
        break;
      default:
        break;
    }

    setValidationErrors(errors);
  };

  // Handle input changes with validation
  const _HANDLE_INPUT_CHANGE = (field, value) => {
    setAdmission(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // Real-time validation
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // Search and filter patients
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (searchPatients && typeof searchPatients === 'function') {
      const filtered = searchPatients(term);
      setFilteredPatients(filtered);
    }
  };

  // Select a patient and populate form
  const handlePatientSelect = (patient) => {
    // Check if patient is already admitted and active
    const existingAdmission = checkPatientAdmissionStatus(patient.nationalId);

    if (existingAdmission) {
      // Patient is already admitted - show warning
      setAlreadyAdmittedPatient({
        patient: patient,
        admission: existingAdmission
      });
      setSelectedPatient(null);
    } else {
      // Patient is not admitted - proceed normally
      setSelectedPatient(patient);
      setAlreadyAdmittedPatient(null);

      setAdmission(prev => ({
        ...prev,
        patientId: patient.nationalId.toString()
      }));
    }

    setShowPatientSearch(false);
    setSearchTerm('');
  };

  // Reset form
  const resetForm = () => {
    const now = new Date();
    setAdmission({
      patientId: '',
      admissionDate: now.toISOString().split('T')[0],
      admissionTime: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      wardId: '',
      bedNumber: ''
    });
    setSelectedPatient(null);
    setSearchTerm('');
    setShowPatientSearch(false);
    setAlreadyAdmittedPatient(null);
  };

  // Fetch patients and recent admissions, set current date/time when modal opens
  useEffect(() => {
    if (isOpen) {
      if (fetchPatients && typeof fetchPatients === 'function') {
        fetchPatients();
      }
      if (fetchActiveAdmissions && typeof fetchActiveAdmissions === 'function') {
        fetchActiveAdmissions();
      }
      // Set current date and time when modal opens
      const now = new Date();
      setAdmission(prev => ({
        ...prev,
        admissionDate: now.toISOString().split('T')[0],
        admissionTime: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }));
    }
  }, [isOpen, fetchPatients, fetchActiveAdmissions]);

  // Update filtered patients when patients data changes
  useEffect(() => {
    if (patients && Array.isArray(patients)) {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients([]);
    }
  }, [patients]);

  // Update available beds when ward changes
  useEffect(() => {
    if (admission.wardId) {
      const beds = generateAvailableBeds(admission.wardId);
      setAvailableBeds(beds);
      // Reset bed selection when ward changes
      setAdmission(prev => ({ ...prev, bedNumber: '' }));
    } else {
      setAvailableBeds([]);
    }
  }, [admission.wardId, activeAdmissions, wards, generateAvailableBeds]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.patient-search') && !event.target.closest('.ward-dropdown') && !event.target.closest('.bed-dropdown')) {
        setShowPatientSearch(false);
        setShowWardDropdown(false);
        setShowBedDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show validation errors
    setTouched({
      patient: true,
      wardId: true,
      bedNumber: true,
      admissionDate: true,
      admissionTime: true
    });

    // Validate the form
    if (!validateAdmission()) {
      return;
    }
    
    try {
      // Validate data before submission
      const patientNationalId = selectedPatient?.nationalId;
      const wardId = admission.wardId;
      const bedNumber = admission.bedNumber?.trim();
      
      if (!patientNationalId || !wardId || !bedNumber) {
        return;
      }

      const admissionData = {
        patientNationalId: parseInt(patientNationalId),
        wardId: parseInt(wardId),
        bedNumber: bedNumber
      };
      
      console.log('Submitting admission:', admissionData);
      
      if (!admitPatient || typeof admitPatient !== 'function') {
        return;
      }
      
      const response = await admitPatient(admissionData);
      
      console.log('Admission successful:', response);
      
      // Get ward name for success notification
      const selectedWard = wards.find(w => w.wardId === parseInt(admission.wardId));
      const wardName = selectedWard ? selectedWard.wardName : 'Selected Ward';

      // Refresh recent admissions in the dashboard and show notification
      if (onAdmissionSuccess && typeof onAdmissionSuccess === 'function') {
        onAdmissionSuccess(selectedPatient.fullName, wardName);
      }
      
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('Admission error:', error);
      // Error handling is done in the hook and will show notifications
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full m-4 max-h-[90vh] overflow-y-auto relative">
        <div className="p-6 border-b border-gray-200 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold text-gray-900 flex items-center pr-12">
            <UserPlus size={20} className="mr-2 text-green-600" />
            Admit New Patient
          </h2>
          <p className="text-sm text-gray-600">Enter patient information and admission details</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Search Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-4">
                Search Existing Patient <span className="text-red-500">*</span>
              </h3>
              <div className="flex gap-4">
                <div className="flex-1 relative patient-search">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search by name, national ID, or phone..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setShowPatientSearch(true)}
                    />
                  </div>
                  
                  {/* Patient Search Results */}
                  {showPatientSearch && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading patients...</div>
                      ) : (filteredPatients && filteredPatients.length > 0) ? (
                        filteredPatients.map((patient) => (
                          <div
                            key={patient.nationalId}
                            onClick={() => handlePatientSelect(patient)}
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{patient.fullName || 'Unknown Name'}</div>
                                <div className="text-sm text-gray-600">
                                  ID: {patient.nationalId || 'N/A'} | {patient.gender || 'N/A'} | Age: {patient.dateOfBirth && calculateAge ? calculateAge(patient.dateOfBirth) : 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">{patient.contactNumber || 'No contact'}</div>
                              </div>
                              <User className="text-blue-500" size={16} />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          {searchTerm ? 'No patients found' : 'Type to search patients...'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPatientSearch(!showPatientSearch)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Search size={16} className="mr-2" />
                  {showPatientSearch ? 'Hide' : 'Search'}
                </button>
              </div>
              
              {/* Selected Patient Info */}
              {selectedPatient ? (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-800">Selected: {selectedPatient.fullName}</div>
                      <div className="text-sm text-green-600">
                        ID: {selectedPatient.nationalId} | Registered: {new Date(selectedPatient.registrationDate).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPatient(null);
                        resetForm();
                      }}
                      className="text-green-600 hover:text-green-800 text-sm underline"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center text-amber-800">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      Please select a patient from the search results above to proceed with admission.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Already Admitted Patient Warning */}
            {alreadyAdmittedPatient && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-sm font-semibold text-red-800">Patient Already Admitted</h4>
                    </div>
                    <p className="text-sm text-red-700 mb-3">
                      <strong>{alreadyAdmittedPatient.patient.firstName} {alreadyAdmittedPatient.patient.lastName}</strong> (ID: {alreadyAdmittedPatient.patient.nationalId}) is currently admitted and active in the hospital.
                    </p>
                    <div className="bg-red-100 border border-red-200 rounded-md p-3 mb-3">
                      <div className="text-xs text-red-600 space-y-1">
                        <div><strong>Current Ward:</strong> {alreadyAdmittedPatient.admission.wardName || 'Ward information not available'}</div>
                        <div><strong>Bed Number:</strong> {alreadyAdmittedPatient.admission.bedNumber || 'Bed information not available'}</div>
                        <div><strong>Admission Date:</strong> {alreadyAdmittedPatient.admission.admissionDate ? new Date(alreadyAdmittedPatient.admission.admissionDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Date not available'}</div>
                        <div><strong>Status:</strong> <span className="px-2 py-0.5 bg-red-200 text-red-800 rounded-full text-xs">Active</span></div>
                      </div>
                    </div>
                    <div className="text-xs text-red-600">
                      <strong>Action Required:</strong> To admit this patient to a different ward, please discharge them from their current location first, or contact the ward supervisor for transfer procedures.
                    </div>
                    <button
                      type="button"
                      onClick={() => setAlreadyAdmittedPatient(null)}
                      className="mt-3 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Dismiss this message
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Admission Details */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-4">Admission Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    value={admission.admissionDate}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admission Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    value={admission.admissionTime}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward <span className="text-red-500">*</span></label>
                  <div className="relative ward-dropdown">
                    <button
                      type="button"
                      onClick={() => setShowWardDropdown(!showWardDropdown)}
                      className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors flex items-center justify-between"
                    >
                      <div>
                        {admission.wardId ? (
                          <div>
                            <span className="font-medium text-gray-900">
                              {wards.find(w => w.wardId.toString() === admission.wardId)?.wardName || 'Selected Ward'}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              ({wards.find(w => w.wardId.toString() === admission.wardId)?.wardType || 'Type'})
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Select a ward...</span>
                        )}
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform ${showWardDropdown ? 'rotate-180' : ''}`} 
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {showWardDropdown && (
                      <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-hidden">
                        <div className="max-h-40 overflow-y-auto">
                          {(wards && Array.isArray(wards) && wards.length > 0) ? (
                            wards.map(ward => {
                              if (!ward || !ward.wardId) return null;
                              
                              const isSelected = admission.wardId === ward.wardId.toString();
                              
                              return (
                                <div
                                  key={ward.wardId}
                                  onClick={() => {
                                    setAdmission({...admission, wardId: ward.wardId.toString()});
                                    setShowWardDropdown(false);
                                  }}
                                  className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors ${
                                    isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium">{ward.wardName}</div>
                                      <div className="text-sm text-gray-500">{ward.wardType}</div>
                                    </div>
                                    {isSelected && (
                                      <Check size={16} className="text-blue-600" />
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="px-4 py-3 text-center text-gray-500">
                              {wardsLoading ? 'Loading wards...' : 'No wards available'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bed Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative bed-dropdown">
                    <button
                      type="button"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white flex items-center justify-between"
                      onClick={() => setShowBedDropdown(!showBedDropdown)}
                      disabled={!admission.wardId}
                    >
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 text-gray-400 mr-2" />
                        <span className={admission.bedNumber ? 'text-gray-900' : 'text-gray-500'}>
                          {admission.bedNumber || (admission.wardId ? 'Select available bed' : 'Select ward first')}
                        </span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showBedDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showBedDropdown && admission.wardId && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {availableBeds.length > 0 ? (
                          availableBeds.map((bedNumber) => (
                            <button
                              type="button"
                              key={bedNumber}
                              onClick={() => {
                                setAdmission({...admission, bedNumber});
                                setShowBedDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between group"
                            >
                              <div className="flex items-center">
                                <Bed className="h-4 w-4 text-green-600 mr-3" />
                                <span className="font-medium text-gray-900">{bedNumber}</span>
                              </div>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                Available
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-center text-gray-500">
                            <Bed className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                            No beds available in this ward
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Admissions Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-4 flex items-center">
                <User className="mr-2" size={16} />
                Recent Admitted Patients
              </h3>
              
              {fetchingAdmissions ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-blue-600 text-sm">Loading recent admissions...</p>
                </div>
              ) : (activeAdmissions && Array.isArray(activeAdmissions) && activeAdmissions.length > 0) ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {activeAdmissions
                    .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate))
                    .slice(0, 5)
                    .map((admissionRecord) => (
                      <div
                        key={admissionRecord.admissionId}
                        className="bg-white p-3 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{admissionRecord.patientName || 'Unknown Patient'}</div>
                            <div className="text-sm text-gray-600">
                              ID: {admissionRecord.patientNationalId || 'N/A'} | {admissionRecord.wardName || 'Unknown Ward'} - Bed {admissionRecord.bedNumber || 'N/A'}
                            </div>
                            <div className="text-xs text-blue-600">
                              Admitted: {admissionRecord.admissionDate ? new Date(admissionRecord.admissionDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Unknown Date'}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {admissionRecord.status || 'Active'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4 text-blue-600">
                  <User className="mx-auto mb-2" size={24} />
                  <p className="text-sm">No recent admissions found</p>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className={`px-6 py-2 border border-gray-300 rounded-lg transition-colors ${
                  isSubmitting 
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedPatient || isSubmitting}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center ${
                  selectedPatient && !isSubmitting
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Admitting...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    Admit Patient
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdmitPatientModal;