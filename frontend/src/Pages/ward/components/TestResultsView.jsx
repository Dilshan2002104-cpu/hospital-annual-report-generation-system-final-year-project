import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Calendar, User, Clock, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import axios from 'axios';

const TestResultsView = ({ patientNationalId, showToast }) => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchTestResults = useCallback(async () => {
    try {
      setLoading(true);
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        showToast('Authentication required', 'error');
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/test-results/patient/${patientNationalId}/recent`,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        }
      );

      setTestResults(response.data || []);
    } catch (error) {
      console.error('Error fetching test results:', error);
      if (error.response?.status === 401) {
        showToast('Authentication failed', 'error');
      } else {
        showToast('Failed to fetch test results', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [patientNationalId, showToast]);

  useEffect(() => {
    if (patientNationalId) {
      fetchTestResults();
    }
  }, [patientNationalId, fetchTestResults]);

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
  };

  const getTestIcon = (testName) => {
    switch (testName) {
      case 'Complete Blood Count':
        return <Activity className="h-5 w-5 text-red-500" />;
      case 'Blood Glucose':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'Urine Analysis':
        return <FileText className="h-5 w-5 text-yellow-500" />;
      case 'Cholesterol Level':
        return <Activity className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatResultSummary = (testName, results) => {
    if (!results) return 'No data available';

    switch (testName) {
      case 'Blood Glucose':
        return `${results.glucoseLevel} mg/dL (${results.testType})`;
      case 'Complete Blood Count':
        return `WBC: ${results.wbc}, RBC: ${results.rbc}, Hgb: ${results.hemoglobin}`;
      case 'Urine Analysis':
        return `Protein: ${results.protein}, Glucose: ${results.urineGlucose}`;
      case 'Cholesterol Level':
        return `Total: ${results.totalCholesterol}, HDL: ${results.hdlCholesterol}, LDL: ${results.ldlCholesterol}`;
      default:
        return 'View details for results';
    }
  };

  const renderDetailedResults = (testName, results) => {
    if (!results) return <p>No detailed results available</p>;

    switch (testName) {
      case 'Blood Glucose':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Glucose Level:</span>
              <span>{results.glucoseLevel} mg/dL</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Test Type:</span>
              <span className="capitalize">{results.testType}</span>
            </div>
          </div>
        );

      case 'Complete Blood Count':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">White Blood Cells:</span>
              <span>{results.wbc} × 10³/μL</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Red Blood Cells:</span>
              <span>{results.rbc} × 10⁶/μL</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Hemoglobin:</span>
              <span>{results.hemoglobin} g/dL</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Platelets:</span>
              <span>{results.platelets} × 10³/μL</span>
            </div>
          </div>
        );

      case 'Urine Analysis':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Protein:</span>
              <span className="capitalize">{results.protein}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Glucose:</span>
              <span className="capitalize">{results.urineGlucose}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Specific Gravity:</span>
              <span>{results.specificGravity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">pH:</span>
              <span>{results.ph}</span>
            </div>
          </div>
        );

      case 'Cholesterol Level':
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Total Cholesterol:</span>
              <span>{results.totalCholesterol} mg/dL</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">HDL Cholesterol:</span>
              <span>{results.hdlCholesterol} mg/dL</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">LDL Cholesterol:</span>
              <span>{results.ldlCholesterol} mg/dL</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Triglycerides:</span>
              <span>{results.triglycerides} mg/dL</span>
            </div>
          </div>
        );

      default:
        return <p>Detailed results not available for this test type</p>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading test results...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recent Test Results</h3>
        <button
          onClick={fetchTestResults}
          className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {testResults.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No test results found for this patient</p>
          <p className="text-sm text-gray-500 mt-2">Test results from the last 30 days will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testResults.map((result) => (
            <div
              key={result.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getTestIcon(result.testName)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{result.testName}</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatResultSummary(result.testName, result.results)}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(result.completedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(result.completedAt).toLocaleTimeString()}</span>
                      </div>
                      {result.completedBy && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{result.completedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleViewDetails(result)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getTestIcon(selectedResult.testName)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedResult.testName} Results
                  </h3>
                  <p className="text-sm text-gray-600">
                    Completed on {new Date(selectedResult.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Test Results</h4>
                {renderDetailedResults(selectedResult.testName, selectedResult.results)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Request ID:</span>
                  <span className="ml-2 text-gray-900">{selectedResult.requestId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Completed By:</span>
                  <span className="ml-2 text-gray-900">{selectedResult.completedBy || 'Lab Staff'}</span>
                </div>
              </div>

              {selectedResult.notes && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                  <p className="text-gray-700 text-sm">{selectedResult.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResultsView;