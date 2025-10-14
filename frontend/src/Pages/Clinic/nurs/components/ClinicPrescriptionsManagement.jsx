import React, { useState, useMemo } from 'react';
import {
  Pill,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Users,
  Activity,
  X,
  Package,
  Send,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import ClinicPrescriptionModal from './ClinicPrescriptionModal';
import useClinicPrescriptionsApi from '../hooks/useClinicPrescriptionsApi';

const ClinicPrescriptionsManagement = () => {
  // Use the clinic prescriptions API hook for real integration
  const {
    prescriptions: apiPrescriptions,
    patients: apiPatients,
    loading: apiLoading,
    error: apiError,
    fetchPrescriptions,
    addPrescription,
    getStats,
    wsConnected
  } = useClinicPrescriptionsApi();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
  const [selectedPrescriptionForView, setSelectedPrescriptionForView] = useState(null);
  const [showPrescriptionDetailsModal, setShowPrescriptionDetailsModal] = useState(false);

  // Use API data with fallback to empty array
  const prescriptions = useMemo(() => apiPrescriptions || [], [apiPrescriptions]);
  const patients = useMemo(() => apiPatients || [], [apiPatients]);
  const [refreshing, setRefreshing] = useState(false);

  // Filter prescriptions based on search and filters
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(prescription => {
      const matchesSearch = 
        prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.prescriptionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.prescribedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patientNationalId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || 
        prescription.status?.toLowerCase() === filterStatus.toLowerCase();

      let matchesDate = true;
      if (filterDate !== 'all' && prescription.prescribedDate) {
        try {
          const prescDate = new Date(prescription.prescribedDate);
          if (!isNaN(prescDate.getTime())) {
            const today = new Date();
            
            switch (filterDate) {
              case 'today':
                matchesDate = prescDate.toDateString() === today.toDateString();
                break;
              case 'week': {
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesDate = prescDate >= weekAgo;
                break;
              }
              case 'month': {
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                matchesDate = prescDate >= monthAgo;
                break;
              }
              default:
                matchesDate = true;
            }
          }
        } catch {
          matchesDate = filterDate === 'all';
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [prescriptions, searchTerm, filterStatus, filterDate]);

  // Calculate statistics from API
  const stats = useMemo(() => {
    if (getStats) {
      return getStats();
    }

    // Fallback calculation if hook not available
    return {
      total: prescriptions.length,
      active: prescriptions.filter(p => p.status?.toLowerCase() === 'active').length,
      completed: prescriptions.filter(p => p.status?.toLowerCase() === 'completed').length,
      pending: prescriptions.filter(p => p.status?.toLowerCase() === 'pending').length,
      todaysPrescriptions: prescriptions.filter(p => {
        if (!p.prescribedDate) return false;
        try {
          const prescDate = new Date(p.prescribedDate);
          if (isNaN(prescDate.getTime())) return false;
          const today = new Date();
          return prescDate.toDateString() === today.toDateString();
        } catch {
          return false;
        }
      }).length,
      urgentPrescriptions: prescriptions.filter(p => p.isUrgent || p.urgency === 'urgent').length
    };
  }, [prescriptions, getStats]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPrescriptions();
    } catch (error) {
      console.error('Failed to refresh prescriptions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Show patient selection modal for new prescriptions
  const handleNewPrescriptionClick = () => {
    if (patients.length === 0) {
      alert('No registered patients available for prescriptions.');
      return;
    }
    setShowPrescriptionModal(true);
  };

  // Handle prescription creation
  const handlePrescriptionAdded = async (prescriptionData) => {
    try {
      await addPrescription(prescriptionData);
      setShowPrescriptionModal(false);
      await handleRefresh();
    } catch (error) {
      console.error('Failed to add prescription:', error);
    }
  };

  // Get status color for prescription badges
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'active':
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
      case 'dispensed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
      case 'discontinued':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  // Format time helper
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescriptionForView(prescription);
    setShowPrescriptionDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Pill className="mr-3 text-blue-500" size={28} />
              Clinic Prescription Management
            </h2>
            <p className="text-gray-600">Manage prescriptions for clinic patients and outpatient consultations</p>
            
            {/* WebSocket Status */}
            <div className="flex items-center mt-2 space-x-2">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-500">
                {wsConnected ? 'Connected to pharmacy system' : 'Disconnected from pharmacy system'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing || apiLoading}
              className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            
            <button
              onClick={handleNewPrescriptionClick}
              className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Prescription
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ClipboardList className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Prescriptions</p>
              <p className="text-2xl font-bold text-purple-600">{stats.todaysPrescriptions}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-red-600">{stats.urgentPrescriptions}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by patient name, prescription ID, or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          {/* Date Filter */}
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'card' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {apiLoading && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12">
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin h-8 w-8 text-blue-500 mr-3" />
            <span className="text-lg text-gray-600">Loading prescriptions...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {apiError && !apiLoading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">Error loading prescriptions: {apiError}</span>
          </div>
        </div>
      )}

      {/* Prescriptions List */}
      {!apiLoading && !apiError && (
        <>
          {filteredPrescriptions.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12">
              <div className="text-center">
                <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
                <p className="text-gray-600 mb-6">
                  {prescriptions.length === 0 
                    ? "No prescriptions have been created yet."
                    : "No prescriptions match your current filters."
                  }
                </p>
                {prescriptions.length === 0 && (
                  <button
                    onClick={handleNewPrescriptionClick}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Prescription
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
              {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50/70">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prescription
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Medications
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPrescriptions.map((prescription) => (
                        <tr key={prescription.id || prescription.prescriptionId} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Pill className="h-5 w-5 text-blue-500 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {prescription.prescriptionId}
                                </div>
                                {prescription.isUrgent && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Urgent
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {prescription.patientName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {prescription.patientNationalId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Stethoscope className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-sm text-gray-900">{prescription.prescribedBy}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {prescription.totalMedications || prescription.medications?.length || 0} medications
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(prescription.status)}`}>
                              {prescription.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(prescription.prescribedDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewDetails(prescription)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrescriptions.map((prescription) => (
                    <div key={prescription.id || prescription.prescriptionId} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <Pill className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="font-medium text-gray-900">{prescription.prescriptionId}</span>
                        </div>
                        {prescription.isUrgent && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Urgent
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">{prescription.patientName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Stethoscope className="h-4 w-4 text-gray-400 mr-2" />
                          <span>Dr. {prescription.prescribedBy}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Package className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{prescription.totalMedications || prescription.medications?.length || 0} medications</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{formatDate(prescription.prescribedDate)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(prescription.status)}`}>
                          {prescription.status}
                        </span>
                        <button
                          onClick={() => handleViewDetails(prescription)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Prescription Creation Modal */}
      {showPrescriptionModal && (
        <ClinicPrescriptionModal
          isOpen={showPrescriptionModal}
          onClose={() => setShowPrescriptionModal(false)}
          onPrescriptionAdded={handlePrescriptionAdded}
        />
      )}

      {/* Prescription Details Modal */}
      {showPrescriptionDetailsModal && selectedPrescriptionForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Prescription Details</h3>
                <button
                  onClick={() => setShowPrescriptionDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Prescription Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Prescription Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">ID:</span> {selectedPrescriptionForView.prescriptionId}</div>
                    <div><span className="font-medium">Date:</span> {formatDateTime(selectedPrescriptionForView.prescribedDate)}</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedPrescriptionForView.status)}`}>
                        {selectedPrescriptionForView.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Patient & Doctor</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Patient:</span> {selectedPrescriptionForView.patientName}</div>
                    <div><span className="font-medium">Patient ID:</span> {selectedPrescriptionForView.patientNationalId}</div>
                    <div><span className="font-medium">Prescribed by:</span> Dr. {selectedPrescriptionForView.prescribedBy}</div>
                  </div>
                </div>
              </div>
              
              {/* Medications List */}
              {selectedPrescriptionForView.medications && selectedPrescriptionForView.medications.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Medications ({selectedPrescriptionForView.medications.length})</h4>
                  <div className="space-y-3">
                    {selectedPrescriptionForView.medications.map((medication, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-900">{medication.drugName}</div>
                            <div className="text-gray-600">Dose: {medication.dose}</div>
                            <div className="text-gray-600">Frequency: {medication.frequency}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Quantity: {medication.quantity} {medication.quantityUnit}</div>
                            <div className="text-gray-600">Route: {medication.route}</div>
                            {medication.instructions && (
                              <div className="text-gray-600">Instructions: {medication.instructions}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Notes */}
              {selectedPrescriptionForView.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    {selectedPrescriptionForView.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicPrescriptionsManagement;