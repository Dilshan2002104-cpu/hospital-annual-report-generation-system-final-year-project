import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Eye,
  FileText,
  User,
  Calendar,
  MapPin,
  Bell,
  Bed,
  Users
} from 'lucide-react';

import TransferDetailsModal from './TransferDetailsModal';
import NewTransferModal from './NewTransferModal';

const TransferManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Sample patients data for new transfer modal
  const [patients] = useState([
    {
      id: 1,
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      bedNumber: 'A101',
      ward: 'Ward 1 - General',
      diagnosis: 'Chronic Kidney Disease',
      doctor: 'Johnson'
    },
    {
      id: 2,
      name: 'Mary Johnson',
      age: 62,
      gender: 'Female',
      bedNumber: 'B205',
      ward: 'Ward 2 - ICU',
      diagnosis: 'Acute Kidney Failure',
      doctor: 'Chen'
    },
    {
      id: 3,
      name: 'Robert Wilson',
      age: 38,
      gender: 'Male',
      bedNumber: 'C301',
      ward: 'Ward 3 - Nephrology',
      diagnosis: 'Kidney Stones',
      doctor: 'Davis'
    }
  ]);

  // Sample transfer data
  const [transfers] = useState([
    {
      id: 1,
      patient: {
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        id: 'P001'
      },
      from: 'Ward 1 - General',
      to: 'Ward 3 - Nephrology',
      fromBed: 'A101',
      toBed: 'C305',
      requestedBy: 'Dr. Johnson',
      approvedBy: 'Dr. Davis',
      requestDate: '2025-01-18',
      requestTime: '09:30',
      scheduledDate: '2025-01-18',
      scheduledTime: '14:00',
      status: 'approved',
      urgency: 'routine',
      reason: 'Specialist nephrology consultation required for chronic kidney disease management',
      notes: 'Patient stable for transfer. All medical records and current medications to accompany.',
      checklist: {
        medicalRecords: true,
        medications: true,
        labResults: true,
        nursingPlan: false
      }
    },
    {
      id: 2,
      patient: {
        name: 'Mary Johnson',
        age: 62,
        gender: 'Female',
        id: 'P002'
      },
      from: 'Ward 2 - ICU',
      to: 'Ward 1 - General',
      fromBed: 'B205',
      toBed: 'A103',
      requestedBy: 'Dr. Chen',
      approvedBy: null,
      requestDate: '2025-01-18',
      requestTime: '11:15',
      scheduledDate: null,
      scheduledTime: null,
      status: 'pending',
      urgency: 'urgent',
      reason: 'Patient condition stabilized, ready for step-down care',
      notes: 'Vitals stable for 24 hours. Continue current medication regimen.',
      checklist: {
        medicalRecords: true,
        medications: true,
        labResults: true,
        nursingPlan: true
      }
    },
    {
      id: 3,
      patient: {
        name: 'Robert Wilson',
        age: 38,
        gender: 'Male',
        id: 'P003'
      },
      from: 'Ward 3 - Nephrology',
      to: 'Clinic - Dialysis',
      fromBed: 'C301',
      toBed: 'Outpatient',
      requestedBy: 'Dr. Davis',
      approvedBy: 'Dr. Hassan',
      requestDate: '2025-01-17',
      requestTime: '16:45',
      scheduledDate: '2025-01-18',
      scheduledTime: '08:00',
      status: 'completed',
      urgency: 'routine',
      reason: 'Scheduled dialysis session',
      notes: 'Regular dialysis patient. Transport arranged.',
      checklist: {
        medicalRecords: true,
        medications: true,
        labResults: true,
        nursingPlan: true
      }
    },
    {
      id: 4,
      patient: {
        name: 'Sarah Davis',
        age: 55,
        gender: 'Female',
        id: 'P004'
      },
      from: 'Ward 1 - General',
      to: 'Ward 2 - ICU',
      fromBed: 'A105',
      toBed: 'B208',
      requestedBy: 'Dr. Johnson',
      approvedBy: null,
      requestDate: '2025-01-18',
      requestTime: '13:20',
      scheduledDate: null,
      scheduledTime: null,
      status: 'rejected',
      urgency: 'emergency',
      reason: 'Acute deterioration in kidney function',
      notes: 'ICU bed not available. Alternative treatment plan initiated.',
      checklist: {
        medicalRecords: true,
        medications: false,
        labResults: true,
        nursingPlan: false
      }
    }
  ]);

  // Ward availability data
  const [wardAvailability] = useState([
    { ward: 'Ward 1 - General', available: 8, total: 20 },
    { ward: 'Ward 2 - ICU', available: 2, total: 10 },
    { ward: 'Ward 3 - Nephrology', available: 3, total: 18 },
    { ward: 'Ward 4 - Dialysis', available: 2, total: 8 },
    { ward: 'Clinic - Nephrology', available: 'N/A', total: 'N/A' },
    { ward: 'Clinic - Cardiology', available: 'N/A', total: 'N/A' }
  ]);

  // Filter transfers based on tab and search/filter criteria
  const filteredTransfers = useMemo(() => {
    let filtered = transfers;

    // Filter by tab
    switch (activeTab) {
      case 'active':
        filtered = filtered.filter(t => ['pending', 'approved'].includes(t.status));
        break;
      case 'pending':
        filtered = filtered.filter(t => t.status === 'pending');
        break;
      case 'completed':
        filtered = filtered.filter(t => t.status === 'completed');
        break;
      case 'history':
        filtered = transfers; // Show all for history
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transfer =>
        transfer.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(transfer => transfer.status === filterStatus);
    }

    return filtered;
  }, [transfers, activeTab, searchTerm, filterStatus]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return 'text-red-600 bg-red-100';
      case 'urgent': return 'text-orange-600 bg-orange-100';
      case 'routine': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'active', label: 'Active Transfers', count: transfers.filter(t => ['pending', 'approved'].includes(t.status)).length },
    { id: 'pending', label: 'Pending Approval', count: transfers.filter(t => t.status === 'pending').length },
    { id: 'completed', label: 'Completed', count: transfers.filter(t => t.status === 'completed').length },
    { id: 'history', label: 'Transfer History', count: transfers.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Transfer Management</h2>
            <p className="text-sm text-gray-600">Manage patient transfers between wards and clinics</p>
          </div>
          <button
            onClick={() => setShowNewTransferModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            New Transfer Request
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{transfers.filter(t => t.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Approved</p>
                <p className="text-2xl font-bold text-blue-900">{transfers.filter(t => t.status === 'approved').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Completed Today</p>
                <p className="text-2xl font-bold text-green-900">{transfers.filter(t => t.status === 'completed').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Emergency</p>
                <p className="text-2xl font-bold text-red-900">{transfers.filter(t => t.urgency === 'emergency').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Ward Availability Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Bed Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wardAvailability.map((ward) => (
            <div key={ward.ward} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{ward.ward}</h4>
                <Bed className="h-4 w-4 text-gray-500" />
              </div>
              {ward.available !== 'N/A' ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{ward.available}/{ward.total} available</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ward.available / ward.total > 0.3 ? 'bg-green-100 text-green-800' :
                    ward.available > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {ward.available > 0 ? 'Available' : 'Full'}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Outpatient Clinic</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search transfers, patients, or doctors..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Transfers List */}
        <div className="divide-y divide-gray-200">
          {filteredTransfers.length === 0 ? (
            <div className="p-12 text-center">
              <ArrowUpDown className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transfers found</h3>
              <p className="mt-1 text-sm text-gray-500">No transfers match your current filters.</p>
            </div>
          ) : (
            filteredTransfers.map((transfer) => (
              <div key={transfer.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{transfer.patient.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                        {getStatusIcon(transfer.status)}
                        <span className="ml-1 capitalize">{transfer.status}</span>
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(transfer.urgency)}`}>
                        <AlertTriangle size={12} className="mr-1" />
                        {transfer.urgency}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <User size={14} className="mr-2" />
                        {transfer.patient.age}y, {transfer.patient.gender}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={14} className="mr-2" />
                        {transfer.fromBed} → {transfer.toBed}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={14} className="mr-2" />
                        {transfer.requestDate} {transfer.requestTime}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users size={14} className="mr-2" />
                        {transfer.requestedBy}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        Transfer Route: <span className="font-normal">{transfer.from} → {transfer.to}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {transfer.reason}
                      </div>
                    </div>

                    {transfer.status === 'approved' && transfer.scheduledDate && (
                      <div className="text-sm text-blue-600 bg-blue-50 rounded-lg p-2">
                        <strong>Scheduled:</strong> {transfer.scheduledDate} at {transfer.scheduledTime}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedTransfer(transfer);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Documents">
                      <FileText size={16} />
                    </button>
                    {transfer.status === 'pending' && (
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Notifications">
                        <Bell size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <TransferDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTransfer(null);
        }}
        transfer={selectedTransfer}
      />

      <NewTransferModal
        isOpen={showNewTransferModal}
        onClose={() => setShowNewTransferModal(false)}
        patients={patients}
        wardAvailability={wardAvailability}
      />
    </div>
  );
};

export default TransferManagement;