import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  User,
  MapPin,
  TestTube,
  Search,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const CreateLabRequestModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  availableTests, 
  activeAdmissions, 
  createLabRequest 
}) => {
  const [formData, setFormData] = useState({
    selectedPatient: null,
    selectedTests: []
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        selectedPatient: null,
        selectedTests: []
      });
      setSearchTerm('');
      setErrors({});
    }
  }, [isOpen]);

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    if (!activeAdmissions) return [];
    
    return activeAdmissions.filter(admission =>
      admission.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.patientNationalId?.includes(searchTerm) ||
      admission.wardName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.bedNumber?.includes(searchTerm)
    );
  }, [activeAdmissions, searchTerm]);

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setFormData(prev => ({ ...prev, selectedPatient: patient }));
    setSearchTerm('');
    setErrors(prev => ({ ...prev, patient: null }));
  };

  // Handle test selection
  const handleTestSelect = (test) => {
    if (formData.selectedTests.find(t => t.id === test.id)) {
      return; // Test already selected
    }
    
    setFormData(prev => ({
      ...prev,
      selectedTests: [...prev.selectedTests, test]
    }));
    setErrors(prev => ({ ...prev, tests: null }));
  };

  // Handle test removal
  const handleTestRemove = (testId) => {
    setFormData(prev => ({
      ...prev,
      selectedTests: prev.selectedTests.filter(t => t.id !== testId)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.selectedPatient) {
      newErrors.patient = 'Please select a patient';
    }

    if (formData.selectedTests.length === 0) {
      newErrors.tests = 'Please select at least one test';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const requestData = {
        patientNationalId: formData.selectedPatient.patientNationalId,
        patientName: formData.selectedPatient.patientName,
        wardName: formData.selectedPatient.wardName,
        bedNumber: formData.selectedPatient.bedNumber,
        requestedBy: 'Ward Staff', // Default value since field is removed
        selectedTests: formData.selectedTests
      };

      await createLabRequest(requestData);
      onSuccess();
    } catch (error) {
      // Error is handled by the hook
      console.error('Error creating lab request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TestTube className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Create Lab Request</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient <span className="text-red-500">*</span>
            </label>
            
            {formData.selectedPatient ? (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">{formData.selectedPatient.patientName}</div>
                    <div className="text-sm text-blue-700">
                      ID: {formData.selectedPatient.patientNationalId} | 
                      Ward: {formData.selectedPatient.wardName} | 
                      Bed: {formData.selectedPatient.bedNumber}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, selectedPatient: null }))}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Change
                </button>
              </div>
            ) : (
              <div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search patients by name, ID, ward, or bed..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {searchTerm && (
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <button
                          key={patient.admissionId}
                          type="button"
                          onClick={() => handlePatientSelect(patient)}
                          className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                        >
                          <User className="h-4 w-4 text-gray-500" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{patient.patientName}</div>
                            <div className="text-sm text-gray-500">
                              ID: {patient.patientNationalId} | {patient.wardName} | Bed: {patient.bedNumber}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">No patients found</div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {errors.patient && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertTriangle size={14} />
                <span>{errors.patient}</span>
              </p>
            )}
          </div>

          {/* Test Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tests <span className="text-red-500">*</span>
            </label>
            
            {/* Selected Tests */}
            {formData.selectedTests.length > 0 && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Selected Tests ({formData.selectedTests.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedTests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center space-x-2 px-3 py-2 bg-white border border-green-300 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-900">{test.name}</span>
                      <span className="text-xs text-gray-500">({test.category})</span>
                      {test.urgent && (
                        <span className="text-xs bg-red-100 text-red-800 px-1 rounded">Urgent</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTestRemove(test.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Tests - Simple Card Layout */}
            <div className="grid grid-cols-2 gap-3">
              {availableTests.map((test) => {
                const isSelected = formData.selectedTests.find(t => t.id === test.id);
                return (
                  <div
                    key={test.id}
                    onClick={() => handleTestSelect(test)}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <TestTube className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                          <h3 className={`font-medium text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                            {test.name}
                          </h3>
                        </div>
                        <p className={`text-xs ${isSelected ? 'text-blue-700' : 'text-gray-600'} mb-2`}>
                          {test.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isSelected 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {test.category}
                          </span>
                          {test.urgent && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.tests && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertTriangle size={14} />
                <span>{errors.tests}</span>
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <TestTube size={16} />
                  <span>Create Lab Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLabRequestModal;