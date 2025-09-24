import React, { useState } from 'react';
import { UserPlus, User, XCircle, AlertTriangle, CheckCircle, Heart, ClipboardList } from 'lucide-react';
import { ToastContainer } from './Toast';

const PatientRegistration = ({ patients, loading, onRegisterPatient, submitting, lastError }) => {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [errors, setErrors] = useState({});
  const [newPatient, setNewPatient] = useState({
    nationalId: '',
    firstName: '',
    lastName: '',
    address: '',
    dateOfBirth: '',
    contactNumber: '',
    emergencyContactNumber: '',
    gender: ''
  });

  // Toast utility functions
  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Enhanced form validation
  const validateForm = () => {
    const newErrors = {};

    // National ID validation (Sri Lankan format - both old and new)
    if (!newPatient.nationalId) {
      newErrors.nationalId = 'National ID is required';
    } else {
      const cleanNIC = newPatient.nationalId.trim().toUpperCase();
      // Old format: 9 digits + V or X, New format: 12 digits
      if (!/^\d{9}[VvXx]$/.test(cleanNIC) && !/^\d{12}$/.test(cleanNIC)) {
        newErrors.nationalId = 'Invalid National ID format (9 digits + V/X or 12 digits)';
      }
    }

    // First name validation
    if (!newPatient.firstName || newPatient.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (newPatient.firstName.trim().length > 50) {
      newErrors.firstName = 'First name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s\-'.]+$/.test(newPatient.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Last name validation
    if (!newPatient.lastName || newPatient.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (newPatient.lastName.trim().length > 50) {
      newErrors.lastName = 'Last name must be less than 50 characters';
    } else if (!/^[a-zA-Z\s\-'.]+$/.test(newPatient.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Phone number validation (Sri Lankan format)
    if (!newPatient.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^0\d{9}$/.test(newPatient.contactNumber.replace(/[\s-]/g, ''))) {
      newErrors.contactNumber = 'Invalid phone number format (0XXXXXXXXX)';
    }

    // Emergency contact validation
    if (!newPatient.emergencyContactNumber) {
      newErrors.emergencyContactNumber = 'Emergency contact is required';
    } else if (!/^0\d{9}$/.test(newPatient.emergencyContactNumber.replace(/[\s-]/g, ''))) {
      newErrors.emergencyContactNumber = 'Invalid phone number format (0XXXXXXXXX)';
    } else if (newPatient.emergencyContactNumber === newPatient.contactNumber) {
      newErrors.emergencyContactNumber = 'Emergency contact must be different from primary contact';
    }

    // Date of birth validation
    if (!newPatient.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(newPatient.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (age > 150) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      } else if (age < 0 || (age === 0 && monthDiff < 0)) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }

    // Address validation
    if (!newPatient.address || newPatient.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    } else if (newPatient.address.trim().length > 200) {
      newErrors.address = 'Address must be less than 200 characters';
    }

    // Gender validation
    if (!newPatient.gender) {
      newErrors.gender = 'Gender selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time field validation
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'nationalId':
        if (!value) {
          newErrors.nationalId = 'National ID is required';
        } else {
          const cleanNIC = value.trim().toUpperCase();
          if (!/^\d{9}[VvXx]$/.test(cleanNIC) && !/^\d{12}$/.test(cleanNIC)) {
            newErrors.nationalId = 'Invalid National ID format (9 digits + V/X or 12 digits)';
          } else {
            delete newErrors.nationalId;
          }
        }
        break;
      case 'firstName':
        if (!value || value.trim().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          newErrors.firstName = 'First name must be less than 50 characters';
        } else if (!/^[a-zA-Z\s\-'.]+$/.test(value.trim())) {
          newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (!value || value.trim().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
        } else if (value.trim().length > 50) {
          newErrors.lastName = 'Last name must be less than 50 characters';
        } else if (!/^[a-zA-Z\s\-'.]+$/.test(value.trim())) {
          newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'contactNumber':
        if (!value) {
          newErrors.contactNumber = 'Contact number is required';
        } else if (!/^0\d{9}$/.test(value.replace(/[\s-]/g, ''))) {
          newErrors.contactNumber = 'Invalid phone number format (0XXXXXXXXX)';
        } else {
          delete newErrors.contactNumber;
        }
        break;
      case 'emergencyContactNumber':
        if (!value) {
          newErrors.emergencyContactNumber = 'Emergency contact is required';
        } else if (!/^0\d{9}$/.test(value.replace(/[\s-]/g, ''))) {
          newErrors.emergencyContactNumber = 'Invalid phone number format (0XXXXXXXXX)';
        } else if (value === newPatient.contactNumber) {
          newErrors.emergencyContactNumber = 'Emergency contact must be different from primary contact';
        } else {
          delete newErrors.emergencyContactNumber;
        }
        break;
      case 'dateOfBirth':
        if (!value) {
          newErrors.dateOfBirth = 'Date of birth is required';
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          if (birthDate > today) {
            newErrors.dateOfBirth = 'Date of birth cannot be in the future';
          } else {
            delete newErrors.dateOfBirth;
          }
        }
        break;
      case 'address':
        if (!value || value.trim().length < 10) {
          newErrors.address = 'Address must be at least 10 characters';
        } else if (value.trim().length > 200) {
          newErrors.address = 'Address must be less than 200 characters';
        } else {
          delete newErrors.address;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // Handle input change with real-time validation
  const handleInputChange = (field, value) => {
    setNewPatient(prev => ({ ...prev, [field]: value }));

    // Clear previous error immediately when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Handle field blur for validation
  const handleFieldBlur = (field, value) => {
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please correct the errors in the form before submitting.',
      });
      return;
    }

    try {
      console.log('Submitting patient data:', {
        ...newPatient,
        // Don't log sensitive data in production
        nationalId: newPatient.nationalId ? '[REDACTED]' : '',
        contactNumber: newPatient.contactNumber ? '[REDACTED]' : ''
      });

      const success = await onRegisterPatient(newPatient);
      if (success) {
        addToast({
          type: 'success',
          title: 'Registration Successful',
          message: `${newPatient.firstName} ${newPatient.lastName} has been successfully registered.`,
        });

        setNewPatient({
          nationalId: '',
          firstName: '',
          lastName: '',
          address: '',
          dateOfBirth: '',
          contactNumber: '',
          emergencyContactNumber: '',
          gender: ''
        });
        setErrors({});
        setShowPatientForm(false);
      } else {
        // Error message is already shown by the usePatients hook
        console.log('Registration failed, lastError:', lastError);

        // Only show toast if lastError is available and no toast was shown by the hook
        if (lastError && !lastError.includes('Server error')) {
          addToast({
            type: 'error',
            title: 'Registration Failed',
            message: lastError,
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error in handleSubmit:', error);
      addToast({
        type: 'error',
        title: 'System Error',
        message: 'An unexpected error occurred. Please contact support.',
      });
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Heart size={24} className="mr-2 text-blue-500" />
          Patient Intake & Admission
        </h3>
        <button
          onClick={() => setShowPatientForm(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <UserPlus size={16} />
          <span>Admit New Patient</span>
        </button>
      </div>

      {/* Patient Registration Form Modal */}
      {showPatientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-900 flex items-center">
                <Heart size={20} className="mr-2 text-blue-600" />
                Patient Admission & Intake
              </h4>
              <button 
                onClick={() => setShowPatientForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                  <input
                    type="text"
                    value={newPatient.nationalId}
                    onChange={(e) => handleInputChange('nationalId', e.target.value)}
                    onBlur={(e) => handleFieldBlur('nationalId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.nationalId
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="200112345678 or 123456789V"
                    maxLength={12}
                  />
                  {errors.nationalId && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {errors.nationalId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={newPatient.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    onBlur={(e) => handleFieldBlur('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.firstName
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter first name"
                    maxLength={50}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newPatient.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    onBlur={(e) => handleFieldBlur('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.lastName 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="Enter last name"
                    maxLength={50}
                    />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newPatient.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onBlur={(e) => handleFieldBlur('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.address 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Enter complete address"
                  rows="2"
                  maxLength={200}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertTriangle size={14} className="mr-1" />
                    {errors.address}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newPatient.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    onBlur={(e) => handleFieldBlur('dateOfBirth', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.dateOfBirth 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    onBlur={(e) => handleFieldBlur('gender', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.gender 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={newPatient.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    onBlur={(e) => handleFieldBlur('contactNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.contactNumber 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="0771234567"
                    maxLength={10}
                    pattern="[0-9]*"
                    />
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {errors.contactNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    type="tel"
                    value={newPatient.emergencyContactNumber}
                    onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                    onBlur={(e) => handleFieldBlur('emergencyContactNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.emergencyContactNumber 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="0712345678"
                    maxLength={10}
                    pattern="[0-9]*"
                    />
                  {errors.emergencyContactNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {errors.emergencyContactNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPatientForm(false)}
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    submitting 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Admitting...</span>
                    </>
                  ) : (
                    <>
                      <Heart size={16} />
                      <span>Admit Patient</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Admissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-medium text-gray-900 flex items-center">
            <ClipboardList size={18} className="mr-2 text-blue-500" />
            Recent Patient Admissions
          </h4>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No patients admitted yet. Complete your first patient admission to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.slice(-6).map((patient, index) => (
                <div key={patient.id || patient.nationalId || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{patient.fullName}</h5>
                      <p className="text-sm text-gray-500">ID: {patient.nationalId}</p>
                      <p className="text-sm text-gray-500">Age: {calculateAge(patient.dateOfBirth)} years</p>
                      <p className="text-sm text-gray-500">Admitted: {formatDate(patient.registrationDate)}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <User size={16} className="text-green-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default PatientRegistration;