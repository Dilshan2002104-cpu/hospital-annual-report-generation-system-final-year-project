import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Send,
  Clock,
  User,
  Calendar
} from 'lucide-react';

export default function ResultsManagement({
  results = [],
  loading,
  onValidateResult,
  onApproveResult,
  stats
}) {
  const [selectedResult, setSelectedResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const pendingResults = results.filter(result => result.status === 'pending_approval');
  const criticalResults = results.filter(result => result.isCritical);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Results Management</h2>
        <p className="text-sm text-gray-600 mt-1">Review, validate and approve test results</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Results</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Results</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalResults}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.todayResults}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Critical Results Alert */}
      {criticalResults.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Critical Results Require Immediate Attention</h3>
          </div>
          <div className="mt-2 space-y-2">
            {criticalResults.slice(0, 3).map((result, index) => (
              <div key={result.resultId || index} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-900">{result.patientName}</p>
                  <p className="text-sm text-gray-600">{result.testName}: {result.value} {result.unit}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedResult(result);
                    setShowResultModal(true);
                  }}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Review Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approval */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approval</h3>
          <div className="space-y-4">
            {pendingResults.map((result, index) => (
              <div key={result.resultId || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{result.patientName}</p>
                    <p className="text-sm text-gray-600">{result.testName}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(result.status)}`}>
                    Pending
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Result</p>
                    <p className="font-medium text-gray-900">{result.value} {result.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reference Range</p>
                    <p className="text-sm text-gray-600">{result.referenceRange}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{new Date(result.testDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedResult(result);
                        setShowResultModal(true);
                      }}
                      className="text-purple-600 hover:text-purple-800 text-sm p-1"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onApproveResult(result.resultId)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">No results pending approval</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h3>
          <div className="space-y-4">
            {results.slice(0, 5).map((result, index) => (
              <div key={result.resultId || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{result.patientName}</p>
                    <p className="text-sm text-gray-600">{result.testName}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(result.status)}`}>
                    {result.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {result.value} {result.unit}
                      {result.isCritical && (
                        <AlertTriangle className="inline w-4 h-4 text-red-500 ml-1" />
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Range: {result.referenceRange}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <User size={12} />
                    <span>{result.approvedBy || 'System'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result Detail Modal */}
      {showResultModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Result Details</h3>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                  <p className="text-sm text-gray-900">{selectedResult.patientName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test</label>
                  <p className="text-sm text-gray-900">{selectedResult.testName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedResult.value} {selectedResult.unit}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Range</label>
                  <p className="text-sm text-gray-900">{selectedResult.referenceRange}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedResult.testDate).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedResult.status)}`}>
                    {selectedResult.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {selectedResult.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedResult.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowResultModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {selectedResult.status === 'pending_approval' && (
                <>
                  <button
                    onClick={() => {
                      onValidateResult(selectedResult.resultId);
                      setShowResultModal(false);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Validate
                  </button>
                  <button
                    onClick={() => {
                      onApproveResult(selectedResult.resultId);
                      setShowResultModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve & Send
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}