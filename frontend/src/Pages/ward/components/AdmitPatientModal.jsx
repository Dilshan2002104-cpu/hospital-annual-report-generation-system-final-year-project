import React, { useState, useEffect } from 'react';
import { UserPlus, Search, User, ChevronDown, Check } from 'lucide-react';
import usePatients from '../hooks/usePatients';
import useWards from '../hooks/useWards';

const AdmitPatientModal = ({ isOpen, onClose }) => {
  const { patients, loading, fetchPatients, searchPatients, calculateAge } = usePatients();
  const { wards } = useWards();
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  
  const [admission, setAdmission] = useState({
    patientId: '',
    admissionDate: '',
    admissionTime: '',
    wardId: '',
    bedNumber: ''
  });


  // Search and filter patients
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = searchPatients(term);
    setFilteredPatients(filtered);
  };

  // Select a patient and populate form
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    
    setAdmission(prev => ({
      ...prev,
      patientId: patient.nationalId.toString()
    }));
    
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
  };

  // Fetch patients and set current date/time when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      // Set current date and time when modal opens
      const now = new Date();
      setAdmission(prev => ({
        ...prev,
        admissionDate: now.toISOString().split('T')[0],
        admissionTime: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      }));
    }
  }, [isOpen, fetchPatients]);

  // Update filtered patients when patients data changes
  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.patient-search') && !event.target.closest('.ward-dropdown')) {
        setShowPatientSearch(false);
        setShowWardDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      alert('Please select a patient before submitting the admission.');
      return;
    }
    
    const admissionData = {
      ...admission,
      patient: selectedPatient
    };
    
    console.log('Patient admission submitted:', admissionData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full m-4 max-h-[90vh] overflow-y-auto relative">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
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
                      ) : filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                          <div
                            key={patient.nationalId}
                            onClick={() => handlePatientSelect(patient)}
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{patient.fullName}</div>
                                <div className="text-sm text-gray-600">
                                  ID: {patient.nationalId} | {patient.gender} | Age: {calculateAge(patient.dateOfBirth)}
                                </div>
                                <div className="text-xs text-gray-500">{patient.contactNumber}</div>
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
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-red-700 text-sm">
                    ⚠️ Please select a patient from the search results above to proceed with admission.
                  </div>
                </div>
              )}
            </div>


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
                          {wards && wards.length > 0 ? (
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
                              {wards ? 'No wards available' : 'Loading wards...'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bed Number</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.bedNumber}
                    onChange={(e) => setAdmission({...admission, bedNumber: e.target.value})}
                    placeholder="A101"
                  />
                </div>
              </div>
            </div>



            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedPatient}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center ${
                  selectedPatient 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <UserPlus size={16} className="mr-2" />
                Admit Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdmitPatientModal;