import React, { useState, useEffect, useCallback } from 'react';
import { Search, TestTube, RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import useLabRequestWebSocket from '../hooks/useLabRequestWebSocket';
import axios from 'axios';

export default function TestOrdersManagement({ showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    labRequests,
    stats,
    connected,
    error,
    refreshLabRequests
  } = useLabRequestWebSocket(showToast);

  const fetchLabRequests = useCallback(async () => {
    try {
      setLoading(true);
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        console.warn('No JWT token found');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/lab-requests/all', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      refreshLabRequests(response.data);
    } catch (error) {
      console.error('Error fetching lab requests:', error);
      if (showToast) {
        showToast('error', 'Error', 'Failed to fetch lab requests');
      }
    } finally {
      setLoading(false);
    }
  }, [refreshLabRequests, showToast]);

  useEffect(() => {
    fetchLabRequests();
  }, [fetchLabRequests]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Lab Test Orders</h2>
            <p className="text-gray-600">Real-time lab request management from ward staff</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {connected ? 'Live Updates' : 'Disconnected'}
              </span>
            </div>
            
            <button
              onClick={fetchLabRequests}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">{stats.inProgress}</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{stats.completed}</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Urgent</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-1">{stats.urgent}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by patient, request ID, or ward..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lab Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loading && labRequests.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lab requests...</p>
          </div>
        ) : labRequests.length === 0 ? (
          <div className="text-center py-8">
            <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No lab requests received yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Lab requests from ward staff will appear here automatically
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {labRequests
              .filter(request => 
                !searchTerm ||
                request.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.wardName?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((request, index) => (
                <div key={request.requestId || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-medium text-gray-900">{request.requestId}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Patient:</span> {request.patientName}
                        </div>
                        <div>
                          <span className="font-medium">Ward:</span> {request.wardName} - Bed {request.bedNumber}
                        </div>
                      </div>
                      
                      {request.tests && request.tests.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-700">Tests: </span>
                          <span className="text-sm text-gray-600">
                            {request.tests.map(test => test.testName).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">WebSocket Connection Error</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <p className="text-red-600 text-xs mt-1">Real-time updates may not work properly. Click refresh to reload data.</p>
        </div>
      )}
    </div>
  );
}
