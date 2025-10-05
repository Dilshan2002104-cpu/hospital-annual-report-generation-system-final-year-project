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
  Send
} from 'lucide-react';
import PrescriptionModal from './PrescriptionModal';
import usePrescriptions from '../hooks/usePrescriptions';

const PrescriptionsManagement = () => {
  // Use the prescriptions hook for API integration
  const {
    prescriptions: apiPrescriptions,
    activePatients,
    loading: apiLoading,
    error: apiError,
    fetchPrescriptions,
    addPrescription,
    getStats,
    wsConnected
  } = usePrescriptions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'
  const [selectedPrescriptionForView, setSelectedPrescriptionForView] = useState(null);
  const [showPrescriptionDetailsModal, setShowPrescriptionDetailsModal] = useState(false);

  // Use API data with fallback to empty array
  const prescriptions = useMemo(() => apiPrescriptions || [], [apiPrescriptions]);
  const [refreshing, setRefreshing] = useState(false);

  // Filter prescriptions based on search and filters
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(prescription => {
      const matchesSearch = 
        prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;

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
      active: prescriptions.filter(p => p.status === 'active').length,
      completed: prescriptions.filter(p => p.status === 'completed').length,
      expired: prescriptions.filter(p => p.status === 'expired').length,
      discontinued: prescriptions.filter(p => p.status === 'discontinued').length,
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
      urgentPrescriptions: prescriptions.filter(p => p.isUrgent).length,
      activePatients: activePatients.length
    };
  }, [prescriptions, getStats, activePatients]);


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
    if (activePatients.length === 0) {
      alert('No active patients available for prescriptions.');
      return;
    }

    setShowPrescriptionModal(true);
  };

  // Handle prescription creation
  const handlePrescriptionAdded = async (prescriptionData) => {
    await addPrescription(prescriptionData);
    // Refresh the prescriptions list
    await fetchPrescriptions();
  };

  // Handle viewing prescription details
  const handleViewPrescriptionDetails = (prescription) => {
    setSelectedPrescriptionForView(prescription);
    setShowPrescriptionDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'discontinued':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-blue-600" />;
      case 'expired':
        return <XCircle size={16} className="text-red-600" />;
      case 'discontinued':
        return <XCircle size={16} className="text-gray-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Time not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid time';
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid time';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Prescriptions Management</h2>
            <div className="flex items-center space-x-3">
              <p className="text-gray-600">Manage electronic prescriptions for all ward patients</p>
              {wsConnected && (
                <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  Real-time updates active
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'card' : 'list')}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {viewMode === 'list' ? 'Card View' : 'List View'}
            </button>
            <button
              onClick={handleNewPrescriptionClick}
              disabled={apiLoading || activePatients.length === 0}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} className="mr-2" />
              New Prescription
              {activePatients.length === 0 && !apiLoading && (
                <span className="ml-2 text-xs">(No active patients)</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Pill className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-700">{stats.completed}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Patients</p>
              <p className="text-2xl font-bold text-blue-700">{stats.activePatients || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent Rx</p>
              <p className="text-2xl font-bold text-red-700">{stats.urgentPrescriptions || 0}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name, drug, or prescription ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="Refresh prescriptions data"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* API Error Display */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <h4 className="text-red-800 font-medium">Error Loading Prescription Data</h4>
              <p className="text-red-700 text-sm mt-1">{apiError}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Active Patients Info */}
      {activePatients.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <h4 className="text-blue-800 font-medium">
                  {activePatients.length} Active Patient{activePatients.length !== 1 ? 's' : ''} Available
                </h4>
                <p className="text-blue-700 text-sm">
                  Patients currently admitted and eligible for prescriptions
                </p>
              </div>
            </div>
            <div className="text-blue-600 text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Prescriptions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Prescriptions ({filteredPrescriptions.length})
              {apiLoading && (
                <span className="ml-2 text-sm text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
                  Loading...
                </span>
              )}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                disabled={filteredPrescriptions.length === 0}
                className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} className="mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {apiLoading ? (
            // Loading State
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading prescriptions...</p>
              <p className="text-gray-500 text-sm mt-2">Fetching data from active patients</p>
            </div>
          ) : viewMode === 'list' ? (
            // List View
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Medication</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Dosage</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Prescribed By</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Pill size={48} className="text-gray-300 mb-4" />
                        {activePatients.length === 0 ? (
                          <>
                            <p className="text-gray-500 text-lg">No active patients available</p>
                            <p className="text-gray-400 text-sm mt-2">Admit patients to start creating prescriptions</p>
                          </>
                        ) : prescriptions.length === 0 ? (
                          <>
                            <p className="text-gray-500 text-lg">No prescriptions created yet</p>
                            <p className="text-gray-400 text-sm mt-2">Click "New Prescription" to create the first prescription</p>
                          </>
                        ) : (
                          <>
                            <p className="text-gray-500 text-lg">No prescriptions match your search</p>
                            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User size={16} className="text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                            <div className="text-sm text-gray-500">ID: {prescription.patientId}</div>
                            <div className="text-sm text-gray-500">Bed: {prescription.bedNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {prescription.medications && prescription.medications.length > 0 ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {prescription.totalMedications} Medication{prescription.totalMedications !== 1 ? 's' : ''}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {prescription.medications.slice(0, 2).map((med, index) => (
                                <div key={index} className="truncate">
                                  {med.drugName} - {med.dose}
                                </div>
                              ))}
                              {prescription.medications.length > 2 && (
                                <div className="text-blue-600 font-medium">
                                  +{prescription.medications.length - 2} more...
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{prescription.drugName}</div>
                            <div className="text-sm text-gray-500">{prescription.frequency}</div>
                            <div className="text-sm text-gray-500">Route: {prescription.route}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {prescription.medications && prescription.medications.length > 0 ? (
                          <div className="text-sm">
                            {prescription.medications.slice(0, 2).map((med, index) => (
                              <div key={index} className="text-gray-900">
                                {med.dose}
                              </div>
                            ))}
                            {prescription.medications.length > 2 && (
                              <div className="text-blue-600 text-xs">
                                +{prescription.medications.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{prescription.dose}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(prescription.startDate)}
                          {prescription.endDate && (
                            <span> - {formatDate(prescription.endDate)}</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Prescribed: {formatDate(prescription.prescribedDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(prescription.status)}`}>
                          {getStatusIcon(prescription.status)}
                          <span className="ml-1 capitalize">{prescription.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{prescription.prescribedBy}</div>
                        <div className="text-sm text-gray-500">{formatTime(prescription.prescribedDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewPrescriptionDetails(prescription)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View all medications"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            // Card View
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPrescriptions.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center py-12">
                    <Pill size={48} className="text-gray-300 mb-4" />
                    {activePatients.length === 0 ? (
                      <>
                        <p className="text-gray-500 text-lg">No active patients available</p>
                        <p className="text-gray-400 text-sm mt-2">Admit patients to start creating prescriptions</p>
                      </>
                    ) : prescriptions.length === 0 ? (
                      <>
                        <p className="text-gray-500 text-lg">No prescriptions created yet</p>
                        <p className="text-gray-400 text-sm mt-2">Click "New Prescription" to create the first prescription</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500 text-lg">No prescriptions match your search</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                      </>
                    )}
                  </div>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Pill size={16} className="text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                            <div className="text-sm text-gray-500">Bed: {prescription.bedNumber}</div>
                          </div>
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(prescription.status)}`}>
                          {getStatusIcon(prescription.status)}
                          <span className="ml-1 capitalize">{prescription.status}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {prescription.medications && prescription.medications.length > 0 ? (
                          <div>
                            <div className="text-lg font-semibold text-gray-900 mb-2">
                              {prescription.totalMedications} Medication{prescription.totalMedications !== 1 ? 's' : ''} Prescribed
                            </div>
                            <div className="space-y-2">
                              {prescription.medications.map((medication, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{medication.drugName}</div>
                                      <div className="text-sm text-gray-600">{medication.dose} • {medication.frequency}</div>
                                      {medication.route && (
                                        <div className="text-sm text-gray-500">Route: {medication.route}</div>
                                      )}
                                      {medication.instructions && (
                                        <div className="text-sm text-gray-600 mt-1 italic">"{medication.instructions}"</div>
                                      )}
                                    </div>
                                    {medication.isUrgent && (
                                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                        URGENT
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-lg font-semibold text-gray-900">{prescription.drugName}</div>
                            <div className="text-sm text-gray-600">{prescription.dose} • {prescription.frequency}</div>
                            <div className="text-sm text-gray-500">Route: {prescription.route}</div>
                          </div>
                        )}
                        
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            Start: {formatDate(prescription.startDate)}
                          </div>
                          {prescription.endDate && (
                            <div className="flex items-center mt-1">
                              <Calendar size={14} className="mr-1" />
                              End: {formatDate(prescription.endDate)}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          Prescribed by {prescription.prescribedBy} on {formatDate(prescription.prescribedDate)}
                        </div>
                        
                        {prescription.instructions && (
                          <div className="text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-start">
                              <AlertCircle size={14} className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{prescription.instructions}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleViewPrescriptionDetails(prescription)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View all medications"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => {
          setShowPrescriptionModal(false);
        }}
        activePatients={activePatients}
        onPrescriptionAdded={handlePrescriptionAdded}
      />

      {/* Prescription Details Modal */}
      {selectedPrescriptionForView && (
        <div className={`fixed inset-0 z-50 ${showPrescriptionDetailsModal ? 'block' : 'hidden'}`}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPrescriptionDetailsModal(false)}></div>

            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-5xl max-h-[90vh] flex flex-col mx-auto">
              {/* Header - Fixed */}
              <div className="bg-white px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl leading-6 font-semibold text-gray-900">
                        Prescription Details - {selectedPrescriptionForView.prescriptionId}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Patient: {selectedPrescriptionForView.patientName} | Bed: {selectedPrescriptionForView.bedNumber}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPrescriptionDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">

                {/* Prescription Summary */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Prescribed by:</span>
                        <div className="text-gray-900 font-semibold">{selectedPrescriptionForView.prescribedBy}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPrescriptionForView.status)}`}>
                            {selectedPrescriptionForView.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Prescribed Date:</span>
                        <div className="text-gray-900 font-semibold">{formatDate(selectedPrescriptionForView.prescribedDate)}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Start Date:</span>
                        <div className="text-gray-900 font-semibold">{formatDate(selectedPrescriptionForView.startDate)}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">End Date:</span>
                        <div className="text-gray-900 font-semibold">{selectedPrescriptionForView.endDate ? formatDate(selectedPrescriptionForView.endDate) : 'Ongoing'}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Total Medications:</span>
                        <div className="text-blue-600 font-bold text-lg">{selectedPrescriptionForView.totalMedications || selectedPrescriptionForView.medications?.length || 1}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medications List */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-blue-600" />
                    Medications ({selectedPrescriptionForView.totalMedications || selectedPrescriptionForView.medications?.length || 1})
                  </h4>
                  <div className="space-y-4">
                    {selectedPrescriptionForView.medications && selectedPrescriptionForView.medications.length > 0 ? (
                      selectedPrescriptionForView.medications.map((medication, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <div className="ml-3">
                                <h5 className="text-xl font-bold text-gray-900">{medication.drugName}</h5>
                                {medication.genericName && (
                                  <p className="text-sm text-gray-500">Generic: {medication.genericName}</p>
                                )}
                              </div>
                            </div>
                            {medication.isUrgent && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-200 animate-pulse">
                                🚨 URGENT
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <span className="font-semibold text-blue-800 text-sm">Dose</span>
                              <div className="text-blue-900 font-bold">{medication.dose}</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <span className="font-semibold text-green-800 text-sm">Frequency</span>
                              <div className="text-green-900 font-bold">{medication.frequency}</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <span className="font-semibold text-purple-800 text-sm">Route</span>
                              <div className="text-purple-900 font-bold">{medication.route}</div>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg">
                              <span className="font-semibold text-orange-800 text-sm">Quantity</span>
                              <div className="text-orange-900 font-bold">{medication.quantity} {medication.quantityUnit}</div>
                            </div>
                            {medication.dosageForm && (
                              <div className="bg-cyan-50 p-3 rounded-lg">
                                <span className="font-semibold text-cyan-800 text-sm">Form</span>
                                <div className="text-cyan-900 font-bold">{medication.dosageForm}</div>
                              </div>
                            )}
                            {medication.manufacturer && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="font-semibold text-gray-800 text-sm">Manufacturer</span>
                                <div className="text-gray-900 font-bold">{medication.manufacturer}</div>
                              </div>
                            )}
                          </div>

                          {medication.instructions && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                              <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-semibold text-amber-800">Instructions:</span>
                                  <p className="text-amber-700 mt-1 leading-relaxed">{medication.instructions}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {medication.notes && (
                            <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                              <div className="flex items-start">
                                <FileText className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-semibold text-blue-800">Notes:</span>
                                  <p className="text-blue-700 mt-1 leading-relaxed">{medication.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            1
                          </div>
                          <div className="ml-3">
                            <h5 className="text-xl font-bold text-gray-900">{selectedPrescriptionForView.drugName}</h5>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <span className="font-semibold text-blue-800 text-sm">Dose</span>
                            <div className="text-blue-900 font-bold">{selectedPrescriptionForView.dose}</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <span className="font-semibold text-green-800 text-sm">Frequency</span>
                            <div className="text-green-900 font-bold">{selectedPrescriptionForView.frequency}</div>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <span className="font-semibold text-purple-800 text-sm">Route</span>
                            <div className="text-purple-900 font-bold">{selectedPrescriptionForView.route}</div>
                          </div>
                        </div>
                        {selectedPrescriptionForView.instructions && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start">
                              <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold text-amber-800">Instructions:</span>
                                <p className="text-amber-700 mt-1 leading-relaxed">{selectedPrescriptionForView.instructions}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Prescription Notes */}
                {selectedPrescriptionForView.prescriptionNotes && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      Prescription Notes
                    </h4>
                    <p className="text-gray-700 leading-relaxed">{selectedPrescriptionForView.prescriptionNotes}</p>
                  </div>
                )}
              </div>

              {/* Footer - Fixed */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPrescriptionDetailsModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsManagement;