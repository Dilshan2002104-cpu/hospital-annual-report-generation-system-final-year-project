import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  FileText, 
  ArrowUpDown, 
  Users,
  Bed,
  UserPlus
} from 'lucide-react';

// Import components
import WardHeader from './components/WardHeader';
import WardOverview from './components/WardOverview';
import PatientList from './components/PatientList';
import PrescriptionModal from './components/PrescriptionModal';
import TransferModal from './components/TransferModal';
import DischargeModal from './components/DischargeModal';
import LabResultsModal from './components/LabResultsModal';
import TransferManagement from './components/TransferManagement';
import AdmitPatientModal from './components/AdmitPatientModal';

const WardDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [dischargeModal, setDischargeModal] = useState(false);
  const [labResultsModal, setLabResultsModal] = useState(false);
  const [admitPatientModal, setAdmitPatientModal] = useState(false);

  // Sample ward data
  const [wards] = useState([
    { id: 1, name: 'Ward 1 - General', occupied: 12, total: 20, type: 'general' },
    { id: 2, name: 'Ward 2 - General', occupied: 14, total: 20, type: 'general' },
    { id: 3, name: 'Ward 2 - ICU', occupied: 8, total: 10, type: 'icu' },
    { id: 4, name: 'Ward 3 - Dialysis', occupied: 6, total: 8, type: 'specialty' }
  ]);

  // Sample patient data
  const [patients] = useState([
    {
      id: 1,
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      bedNumber: 'A101',
      ward: 'Ward 1 - General',
      admissionDate: '2025-01-15',
      diagnosis: 'Chronic Kidney Disease',
      status: 'stable',
      doctor: 'Dr. Johnson',
      lastVitals: '2025-01-18 08:00',
      pendingTests: ['Blood Test', 'Urine Analysis'],
      prescriptions: [
        { drug: 'Lisinopril', dose: '10mg', frequency: 'Once daily', route: 'Oral' }
      ]
    },
    {
      id: 2,
      name: 'Mary Johnson',
      age: 62,
      gender: 'Female',
      bedNumber: 'B205',
      ward: 'Ward 2 - ICU',
      admissionDate: '2025-01-16',
      diagnosis: 'Acute Kidney Failure',
      status: 'critical',
      doctor: 'Dr. Chen',
      lastVitals: '2025-01-18 09:30',
      pendingTests: ['CT Scan', 'Blood Culture'],
      prescriptions: [
        { drug: 'Furosemide', dose: '40mg', frequency: 'Twice daily', route: 'IV' }
      ]
    },
    {
      id: 3,
      name: 'Robert Wilson',
      age: 38,
      gender: 'Male',
      bedNumber: 'C301',
      ward: 'Ward 3 - Dialysis',
      admissionDate: '2025-01-17',
      diagnosis: 'Kidney Stones',
      status: 'improving',
      doctor: 'Dr. Davis',
      lastVitals: '2025-01-18 07:45',
      pendingTests: [],
      prescriptions: [
        { drug: 'Hydrocodone', dose: '5mg', frequency: 'As needed', route: 'Oral' }
      ]
    }
  ]);

  // Calculate statistics
  const wardStats = useMemo(() => {
    const totalBeds = wards.reduce((sum, ward) => sum + ward.total, 0);
    const occupiedBeds = wards.reduce((sum, ward) => sum + ward.occupied, 0);
    const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);
    const criticalPatients = patients.filter(p => p.status === 'critical').length;
    const stablePatients = patients.filter(p => p.status === 'stable').length;
    const improvingPatients = patients.filter(p => p.status === 'improving').length;

    return {
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      occupancyRate,
      totalPatients: patients.length,
      criticalPatients,
      stablePatients,
      improvingPatients
    };
  }, [wards, patients]);

  // Filter patients based on search and filter criteria
  const filteredPatients = useMemo(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBy !== 'all') {
      filtered = filtered.filter(patient => patient.status === filterBy);
    }

    return filtered;
  }, [patients, searchTerm, filterBy]);

  const tabs = [
    { id: 'overview', label: 'Ward Overview', icon: Activity },
    { id: 'patients', label: 'Patient List', icon: Users },
    { id: 'admit', label: 'Admit Patients', icon: UserPlus },
    { id: 'beds', label: 'Bed Management', icon: Bed },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'transfers', label: 'Transfers', icon: ArrowUpDown }
  ];

  // Handler functions for patient actions
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handlePrescribeMedication = (patient) => {
    setSelectedPatient(patient);
    setPrescriptionModal(true);
  };

  const handleTransferPatient = (patient) => {
    setSelectedPatient(patient);
    setTransferModal(true);
  };

  const handleDischargePatient = (patient) => {
    setSelectedPatient(patient);
    setDischargeModal(true);
  };

  const handleViewLabResults = (patient) => {
    setSelectedPatient(patient);
    setLabResultsModal(true);
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <WardOverview wardStats={wardStats} wards={wards} />;
      case 'patients':
        return (
          <PatientList
            patients={filteredPatients}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            onViewPatient={handleViewPatient}
            onPrescribeMedication={handlePrescribeMedication}
            onTransferPatient={handleTransferPatient}
            onDischargePatient={handleDischargePatient}
            onViewLabResults={handleViewLabResults}
          />
        );
      case 'admit':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Admit New Patients</h3>
                <p className="text-sm text-gray-600">Process new patient admissions to the ward</p>
              </div>
              <button
                onClick={() => setAdmitPatientModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserPlus size={18} className="mr-2" />
                Admit Patient
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Available Beds</p>
                    <p className="text-2xl font-bold text-blue-900">{wardStats.availableBeds}</p>
                  </div>
                  <Bed className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Admissions Today</p>
                    <p className="text-2xl font-bold text-green-900">3</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Pending Admissions</p>
                    <p className="text-2xl font-bold text-yellow-900">2</p>
                  </div>
                  <Activity className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Emergency Admissions</p>
                    <p className="text-2xl font-bold text-purple-900">1</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Recent Admissions</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">John Smith</p>
                    <p className="text-sm text-gray-600">Bed A101 • Admitted 2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Emergency</span>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">Mary Johnson</p>
                    <p className="text-sm text-gray-600">Bed B205 • Admitted 4 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Planned</span>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">Robert Wilson</p>
                    <p className="text-sm text-gray-600">Bed C301 • Admitted 6 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Transfer</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'beds':
        return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">Bed Management (To be implemented)</div>;
      case 'prescriptions':
        return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">Prescriptions Management (To be implemented)</div>;
      case 'transfers':
        return <TransferManagement />;
      default:
        return <WardOverview wardStats={wardStats} wards={wards} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <WardHeader />

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Modals */}
      <PrescriptionModal
        isOpen={prescriptionModal}
        onClose={() => {
          setPrescriptionModal(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />
      <TransferModal
        isOpen={transferModal}
        onClose={() => {
          setTransferModal(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />
      <DischargeModal
        isOpen={dischargeModal}
        onClose={() => {
          setDischargeModal(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />
      <LabResultsModal
        isOpen={labResultsModal}
        onClose={() => {
          setLabResultsModal(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />
      <AdmitPatientModal
        isOpen={admitPatientModal}
        onClose={() => setAdmitPatientModal(false)}
      />
    </div>
  );
};

export default WardDashboard;