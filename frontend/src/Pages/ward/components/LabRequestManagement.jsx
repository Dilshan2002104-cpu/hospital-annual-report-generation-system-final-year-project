import React, { useState, useEffect, useMemo } from 'react';
import {
  TestTube,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  MapPin,
  FileText,
  RefreshCw,
  Stethoscope
} from 'lucide-react';

// Import hooks
import useLabRequests from '../hooks/useLabRequests';
import usePatients from '../hooks/usePatients';

// Import components
import CreateLabRequestModal from './CreateLabRequestModal';
import LabRequestDetailsModal from './LabRequestDetailsModal';

const LabRequestManagement = ({ showToast, activeAdmissions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Custom hooks
  const {
    labRequests,
    loading,
    availableTests,
    createLabRequest,
    fetchLabRequests
  } = useLabRequests(showToast);

  const { fetchPatients } = usePatients();

  // Fetch data on component mount
  useEffect(() => {
    fetchLabRequests();
    fetchPatients();
  }, [fetchLabRequests, fetchPatients]);

  // Filter lab requests based on search and status
  const filteredLabRequests = useMemo(() => {
    let filtered = labRequests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.patientNationalId?.includes(searchTerm) ||
        request.wardName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => 
        request.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filtered.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
  }, [labRequests, searchTerm, statusFilter]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = labRequests.length;
    const pending = labRequests.filter(r => r.status === 'PENDING').length;
    const inProgress = labRequests.filter(r => r.status === 'IN_PROGRESS').length;
    const completed = labRequests.filter(r => r.status === 'COMPLETED').length;
    const cancelled = labRequests.filter(r => r.status === 'CANCELLED').length;

    // Today's requests
    const today = new Date().toDateString();
    const todayRequests = labRequests.filter(r => 
      new Date(r.requestDate).toDateString() === today
    ).length;

    return {
      total,
      pending,
      inProgress,
      completed,
      cancelled,
      todayRequests
    };
  }, [labRequests]);

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return {
          color: 'text-yellow-600 bg-yellow-100',
          icon: <Clock size={14} />,
          label: 'Pending'
        };
      case 'IN_PROGRESS':
        return {
          color: 'text-blue-600 bg-blue-100',
          icon: <RefreshCw size={14} />,
          label: 'In Progress'
        };
      case 'COMPLETED':
        return {
          color: 'text-green-600 bg-green-100',
          icon: <CheckCircle size={14} />,
          label: 'Completed'
        };
      case 'CANCELLED':
        return {
          color: 'text-red-600 bg-red-100',
          icon: <XCircle size={14} />,
          label: 'Cancelled'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100',
          icon: <AlertCircle size={14} />,
          label: 'Unknown'
        };
    }
  };

  // Handle create lab request success
  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchLabRequests(); // Refresh the list
  };

  // Handle view request details
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TestTube className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Lab Request Management</h2>
                <p className="text-sm text-gray-600 mt-1">Create and track laboratory test requests for ward patients</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>New Lab Request</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Requests</p>
                  <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
                </div>
                <TestTube className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{statistics.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-900">{statistics.inProgress}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Completed</p>
                  <p className="text-2xl font-bold text-green-900">{statistics.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-900">{statistics.cancelled}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Today's Requests</p>
                  <p className="text-2xl font-bold text-purple-900">{statistics.todayRequests}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by patient name, request ID, or ward..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <button
              onClick={fetchLabRequests}
              disabled={loading}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lab Requests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lab Requests</h3>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading lab requests...</p>
            </div>
          ) : filteredLabRequests.length === 0 ? (
            <div className="p-8 text-center">
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No lab requests found</p>
              <p className="text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Create your first lab request for a patient'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward/Bed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLabRequests.map((request) => {
                  const statusDisplay = getStatusDisplay(request.status);
                  return (
                    <tr key={request.id || request.requestId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TestTube className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{request.requestId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.patientName}</div>
                          <div className="text-sm text-gray-500">{request.patientNationalId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <div>
                            <div className="text-sm text-gray-900">{request.wardName}</div>
                            <div className="text-sm text-gray-500">Bed: {request.bedNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {request.tests?.slice(0, 2).map((test, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {test.testName || test.name}
                            </span>
                          ))}
                          {request.tests?.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{request.tests.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                          {statusDisplay.icon}
                          <span className="ml-1">{statusDisplay.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Stethoscope className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{request.requestedBy}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateLabRequestModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
          availableTests={availableTests}
          activeAdmissions={activeAdmissions}
          createLabRequest={createLabRequest}
          showToast={showToast}
        />
      )}

      {showDetailsModal && selectedRequest && (
        <LabRequestDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default LabRequestManagement;