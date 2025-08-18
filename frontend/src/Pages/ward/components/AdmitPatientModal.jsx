import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

const AdmitPatientModal = ({ isOpen, onClose }) => {
  const [admission, setAdmission] = useState({
    patientId: '',
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNumber: '',
    emergencyContact: '',
    emergencyContactNumber: '',
    address: '',
    admissionDate: new Date().toISOString().split('T')[0],
    admissionTime: '',
    wardId: '',
    bedNumber: '',
    primaryDiagnosis: '',
    secondaryDiagnosis: '',
    admissionType: 'emergency',
    referringDoctor: '',
    assignedDoctor: '',
    allergies: '',
    medications: '',
    medicalHistory: '',
    insurance: '',
    insuranceNumber: '',
    notes: ''
  });

  const wards = [
    { id: 1, name: 'Ward 1 - General', available: 8 },
    { id: 2, name: 'Ward 2 - General', available: 6 },
    { id: 3, name: 'Ward 2 - ICU', available: 2 },
    { id: 4, name: 'Ward 3 - Dialysis', available: 2 }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Patient admission submitted:', admission);
    onClose();
    // Reset form after submission
    setAdmission({
      patientId: '',
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      contactNumber: '',
      emergencyContact: '',
      emergencyContactNumber: '',
      address: '',
      admissionDate: new Date().toISOString().split('T')[0],
      admissionTime: '',
      wardId: '',
      bedNumber: '',
      primaryDiagnosis: '',
      secondaryDiagnosis: '',
      admissionType: 'emergency',
      referringDoctor: '',
      assignedDoctor: '',
      allergies: '',
      medications: '',
      medicalHistory: '',
      insurance: '',
      insuranceNumber: '',
      notes: ''
    });
  };

  const handleClose = () => {
    setAdmission({
      patientId: '',
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      contactNumber: '',
      emergencyContact: '',
      emergencyContactNumber: '',
      address: '',
      admissionDate: new Date().toISOString().split('T')[0],
      admissionTime: '',
      wardId: '',
      bedNumber: '',
      primaryDiagnosis: '',
      secondaryDiagnosis: '',
      admissionType: 'emergency',
      referringDoctor: '',
      assignedDoctor: '',
      allergies: '',
      medications: '',
      medicalHistory: '',
      insurance: '',
      insuranceNumber: '',
      notes: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <UserPlus size={20} className="mr-2 text-green-600" />
            Admit New Patient
          </h2>
          <p className="text-sm text-gray-600">Enter patient information and admission details</p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.patientId}
                    onChange={(e) => setAdmission({...admission, patientId: e.target.value})}
                    placeholder="P001234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.firstName}
                    onChange={(e) => setAdmission({...admission, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.lastName}
                    onChange={(e) => setAdmission({...admission, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.age}
                    onChange={(e) => setAdmission({...admission, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.gender}
                    onChange={(e) => setAdmission({...admission, gender: e.target.value})}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.contactNumber}
                    onChange={(e) => setAdmission({...admission, contactNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.emergencyContact}
                    onChange={(e) => setAdmission({...admission, emergencyContact: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.emergencyContactNumber}
                    onChange={(e) => setAdmission({...admission, emergencyContactNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  required
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={admission.address}
                  onChange={(e) => setAdmission({...admission, address: e.target.value})}
                  placeholder="Full address..."
                />
              </div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.admissionDate}
                    onChange={(e) => setAdmission({...admission, admissionDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admission Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.admissionTime}
                    onChange={(e) => setAdmission({...admission, admissionTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.wardId}
                    onChange={(e) => setAdmission({...admission, wardId: e.target.value})}
                  >
                    <option value="">Select Ward</option>
                    {wards.map(ward => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name} ({ward.available} beds available)
                      </option>
                    ))}
                  </select>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admission Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.admissionType}
                    onChange={(e) => setAdmission({...admission, admissionType: e.target.value})}
                  >
                    <option value="emergency">Emergency</option>
                    <option value="planned">Planned</option>
                    <option value="transfer">Transfer</option>
                    <option value="outpatient">Outpatient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referring Doctor</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.referringDoctor}
                    onChange={(e) => setAdmission({...admission, referringDoctor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Doctor</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.assignedDoctor}
                    onChange={(e) => setAdmission({...admission, assignedDoctor: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-800 mb-4">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Diagnosis</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.primaryDiagnosis}
                    onChange={(e) => setAdmission({...admission, primaryDiagnosis: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Diagnosis</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.secondaryDiagnosis}
                    onChange={(e) => setAdmission({...admission, secondaryDiagnosis: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Known Allergies</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.allergies}
                    onChange={(e) => setAdmission({...admission, allergies: e.target.value})}
                    placeholder="List any known allergies..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.medications}
                    onChange={(e) => setAdmission({...admission, medications: e.target.value})}
                    placeholder="Current medications and dosages..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.medicalHistory}
                    onChange={(e) => setAdmission({...admission, medicalHistory: e.target.value})}
                    placeholder="Previous medical conditions..."
                  />
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-4">Insurance Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.insurance}
                    onChange={(e) => setAdmission({...admission, insurance: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Number</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={admission.insuranceNumber}
                    onChange={(e) => setAdmission({...admission, insuranceNumber: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={admission.notes}
                onChange={(e) => setAdmission({...admission, notes: e.target.value})}
                placeholder="Any additional notes or observations..."
              />
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
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
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