import React from 'react';
import {
  X,
  TestTube,
  User,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Stethoscope,
  FileText
} from 'lucide-react';

const LabRequestDetailsModal = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  // Get status display information
  const getStatusDisplay = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return {
          color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
          icon: <Clock size={16} />,
          label: 'Pending'
        };
      case 'IN_PROGRESS':
        return {
          color: 'text-blue-600 bg-blue-100 border-blue-200',
          icon: <RefreshCw size={16} />,
          label: 'In Progress'
        };
      case 'COMPLETED':
        return {
          color: 'text-green-600 bg-green-100 border-green-200',
          icon: <CheckCircle size={16} />,
          label: 'Completed'
        };
      case 'CANCELLED':
        return {
          color: 'text-red-600 bg-red-100 border-red-200',
          icon: <XCircle size={16} />,
          label: 'Cancelled'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-100 border-gray-200',
          icon: <AlertCircle size={16} />,
          label: 'Unknown'
        };
    }
  };

  const statusDisplay = getStatusDisplay(request.status);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  // Get test category color
  const getCategoryColor = (category) => {
    const colors = {
      'Hematology': 'bg-red-100 text-red-800',
      'Chemistry': 'bg-blue-100 text-blue-800',
      'Microbiology': 'bg-green-100 text-green-800',
      'Radiology': 'bg-purple-100 text-purple-800',
      'Cardiac': 'bg-orange-100 text-orange-800',
      'Coagulation': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TestTube className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Lab Request Details</h2>
              <p className="text-sm text-gray-600">Request ID: {request.requestId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Status</h3>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${statusDisplay.color}`}>
                {statusDisplay.icon}
                <span className="ml-2 font-medium">{statusDisplay.label}</span>
              </div>
            </div>

            {/* Request Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Information</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Requested:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(request.requestDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Requested by:</span>
                  <span className="text-sm font-medium text-gray-900">{request.requestedBy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Patient Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-blue-700">Patient Name</label>
                <p className="text-lg font-semibold text-blue-900">{request.patientName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-blue-700">National ID</label>
                <p className="text-lg font-semibold text-blue-900">{request.patientNationalId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-blue-700">Ward</label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-lg font-semibold text-blue-900">{request.wardName}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-blue-700">Bed Number</label>
                <p className="text-lg font-semibold text-blue-900">{request.bedNumber}</p>
              </div>
            </div>
          </div>

          {/* Ordered Tests */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TestTube className="h-5 w-5 text-green-600" />
              <span>Ordered Tests ({request.tests?.length || 0})</span>
            </h3>
            {request.tests && request.tests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {request.tests.map((test, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{test.testName || test.name}</h4>
                        <p className="text-sm text-gray-600">ID: {test.testId || test.id}</p>
                      </div>
                      {test.urgent && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(test.category)}`}>
                        {test.category}
                      </span>
                      <TestTube className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TestTube className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p>No tests found for this request</p>
              </div>
            )}
          </div>

          {/* Additional Information */}
          {(request.notes || request.priority) && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Additional Information</span>
              </h3>
              <div className="space-y-3">
                {request.priority && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <p className="text-gray-900 capitalize">{request.priority}</p>
                  </div>
                )}
                {request.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-gray-900">{request.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <span className="text-sm font-medium text-gray-900">Request Created</span>
                  <p className="text-sm text-gray-600">{formatDate(request.createdAt || request.requestDate)}</p>
                </div>
              </div>
              {request.updatedAt && request.updatedAt !== request.createdAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Last Updated</span>
                    <p className="text-sm text-gray-600">{formatDate(request.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabRequestDetailsModal;