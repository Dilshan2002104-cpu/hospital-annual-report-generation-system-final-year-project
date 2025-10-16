import React, { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';
import axios from 'axios';

const TestResultsModal = ({ isOpen, onClose, labRequest, showToast }) => {
  const [results, setResults] = useState({});
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !labRequest) return null;

  const handleInputChange = (testName, field, value) => {
    setResults(prev => ({
      ...prev,
      [testName]: {
        ...prev[testName],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        if (showToast) showToast('Authentication required', 'error');
        return;
      }

      // Filter out empty results
      const filteredResults = {};
      Object.keys(results).forEach(testName => {
        const testResults = results[testName];
        if (testResults && Object.keys(testResults).length > 0) {
          // Filter out empty values
          const cleanResults = {};
          Object.keys(testResults).forEach(key => {
            if (testResults[key] !== '' && testResults[key] !== null && testResults[key] !== undefined) {
              cleanResults[key] = testResults[key];
            }
          });
          if (Object.keys(cleanResults).length > 0) {
            filteredResults[testName] = cleanResults;
          }
        }
      });

      if (Object.keys(filteredResults).length === 0) {
        if (showToast) showToast('Please enter at least one test result', 'error');
        return;
      }

      const submitData = {
        requestId: labRequest.requestId,
        tests: labRequest.tests || [{ testName: labRequest.testType }],
        results: filteredResults,
        notes: notes.trim(),
        completedAt: new Date().toISOString(),
        completedBy: 'Lab Staff'
      };

      console.log('Submitting test results:', submitData);

      // Test 1: Simple endpoint
      const testResponse = await axios.get('http://localhost:8080/api/simple-test/hello');
      console.log('✅ Simple test response:', testResponse.data);

      // Test 2: Database connection
      const dbResponse = await axios.get('http://localhost:8080/api/debug/database-connection');
      console.log('✅ Database test response:', dbResponse.data);

      // Test 3: Lab request exists
      const labRequestResponse = await axios.get(`http://localhost:8080/api/debug/lab-request/${submitData.requestId}`);
      console.log('✅ Lab request test response:', labRequestResponse.data);

      // Test 4: Basic test result save (without specific test results)
      const basicTestResult = await axios.post(
        'http://localhost:8080/api/test-simple/save-basic',
        submitData
      );
      console.log('✅ Basic test result response:', basicTestResult.data);

      // Test 5: Simple test result endpoint (no database)
      const simpleTestResult = await axios.post(
        'http://localhost:8080/api/test-results-simple/test-save',
        submitData
      );
      console.log('✅ Simple test result response:', simpleTestResult.data);

      // Test 6: Full test result save WITHOUT Authorization (to test if JWT is the issue)
      console.log('🔍 Testing without JWT token first...');
      const responseNoAuth = await axios.post(
        'http://localhost:8080/api/test-results/save',
        submitData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Test result save WITHOUT JWT:', responseNoAuth.data);

      // Test 7: Full test result save WITH Authorization (original)
      console.log('🔍 JWT Token:', jwtToken ? 'exists' : 'missing');
      const response = await axios.post(
        'http://localhost:8080/api/test-results/save',
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        if (showToast) showToast('Test results saved successfully', 'success');
        onClose();
        // Reset form
        setResults({});
        setNotes('');
      } else {
        if (showToast) showToast('Failed to save test results', 'error');
      }
    } catch (error) {
      console.error('Error submitting test results:', error);
      if (error.response?.status === 401) {
        if (showToast) showToast('Authentication failed', 'error');
      } else {
        if (showToast) showToast('Failed to save test results', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCompleteBloodCountInputs = (testName) => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Complete Blood Count Results</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            White Blood Cells (WBC) <span className="text-gray-500">(4.0-11.0 × 10³/μL)</span>
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g., 7.5"
            value={results[testName]?.wbc || ''}
            onChange={(e) => handleInputChange(testName, 'wbc', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Red Blood Cells (RBC) <span className="text-gray-500">(4.2-5.9 × 10⁶/μL)</span>
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g., 4.8"
            value={results[testName]?.rbc || ''}
            onChange={(e) => handleInputChange(testName, 'rbc', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hemoglobin <span className="text-gray-500">(12.0-15.5 g/dL)</span>
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g., 13.2"
            value={results[testName]?.hemoglobin || ''}
            onChange={(e) => handleInputChange(testName, 'hemoglobin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Platelets <span className="text-gray-500">(150-450 × 10³/μL)</span>
          </label>
          <input
            type="number"
            step="1"
            placeholder="e.g., 300"
            value={results[testName]?.platelets || ''}
            onChange={(e) => handleInputChange(testName, 'platelets', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderBloodGlucoseInputs = (testName) => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Blood Glucose Results</h4>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Glucose Level <span className="text-gray-500">(70-100 mg/dL fasting)</span>
          </label>
          <input
            type="number"
            step="1"
            placeholder="e.g., 95"
            value={results[testName]?.glucose || ''}
            onChange={(e) => handleInputChange(testName, 'glucose', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
          <select
            value={results[testName]?.testType || 'fasting'}
            onChange={(e) => handleInputChange(testName, 'testType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="fasting">Fasting Glucose</option>
            <option value="random">Random Glucose</option>
            <option value="postprandial">Post-prandial Glucose</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderUrineAnalysisInputs = (testName) => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Urine Analysis Results</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Protein <span className="text-gray-500">(Negative/Trace/1+/2+/3+/4+)</span>
          </label>
          <select
            value={results[testName]?.protein || ''}
            onChange={(e) => handleInputChange(testName, 'protein', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Result</option>
            <option value="negative">Negative</option>
            <option value="trace">Trace</option>
            <option value="1+">1+</option>
            <option value="2+">2+</option>
            <option value="3+">3+</option>
            <option value="4+">4+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Glucose <span className="text-gray-500">(Negative/Positive)</span>
          </label>
          <select
            value={results[testName]?.urineGlucose || ''}
            onChange={(e) => handleInputChange(testName, 'urineGlucose', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Result</option>
            <option value="negative">Negative</option>
            <option value="positive">Positive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specific Gravity <span className="text-gray-500">(1.003-1.030)</span>
          </label>
          <input
            type="number"
            step="0.001"
            placeholder="e.g., 1.020"
            value={results[testName]?.specificGravity || ''}
            onChange={(e) => handleInputChange(testName, 'specificGravity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            pH <span className="text-gray-500">(4.6-8.0)</span>
          </label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g., 6.5"
            value={results[testName]?.ph || ''}
            onChange={(e) => handleInputChange(testName, 'ph', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderCholesterolInputs = (testName) => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Cholesterol Level Results</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Cholesterol <span className="text-gray-500">(&lt;200 mg/dL)</span>
          </label>
          <input
            type="number"
            step="1"
            placeholder="e.g., 180"
            value={results[testName]?.totalCholesterol || ''}
            onChange={(e) => handleInputChange(testName, 'totalCholesterol', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            HDL Cholesterol <span className="text-gray-500">(&gt;40 mg/dL)</span>
          </label>
          <input
            type="number"
            step="1"
            placeholder="e.g., 50"
            value={results[testName]?.hdlCholesterol || ''}
            onChange={(e) => handleInputChange(testName, 'hdlCholesterol', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LDL Cholesterol <span className="text-gray-500">(&lt;100 mg/dL)</span>
          </label>
          <input
            type="number"
            step="1"
            placeholder="e.g., 110"
            value={results[testName]?.ldlCholesterol || ''}
            onChange={(e) => handleInputChange(testName, 'ldlCholesterol', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Triglycerides <span className="text-gray-500">(&lt;150 mg/dL)</span>
          </label>
          <input
            type="number"
            step="1"
            placeholder="e.g., 120"
            value={results[testName]?.triglycerides || ''}
            onChange={(e) => handleInputChange(testName, 'triglycerides', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderTestInputs = () => {
    const tests = labRequest.tests || [{ testName: labRequest.testType }];
    
    return (
      <div className="space-y-8">
        {tests.map((test, index) => {
          const testName = test.testName;
          
          let testComponent;
          switch (testName) {
            case 'Complete Blood Count':
              testComponent = renderCompleteBloodCountInputs(testName);
              break;
            case 'Blood Glucose':
              testComponent = renderBloodGlucoseInputs(testName);
              break;
            case 'Urine Analysis':
              testComponent = renderUrineAnalysisInputs(testName);
              break;
            case 'Cholesterol Level':
              testComponent = renderCholesterolInputs(testName);
              break;
            default:
              testComponent = (
                <div className="text-center py-8">
                  <p className="text-gray-500">Test type "{testName}" not supported for result entry</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Supported tests: Complete Blood Count, Blood Glucose, Urine Analysis, Cholesterol Level
                  </p>
                </div>
              );
          }

          return (
            <div key={`${testName}-${index}`} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              {testComponent}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Enter Test Results</h3>
              <p className="text-sm text-gray-600">
                Patient: {labRequest.patientName} | Test: {labRequest.tests && labRequest.tests.length > 0 
                  ? labRequest.tests.map(test => test.testName).join(', ')
                  : labRequest.testType || 'Unknown Test'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Patient ID:</span>
                <span className="ml-2 text-gray-900">{labRequest.patientId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Ward:</span>
                <span className="ml-2 text-gray-900">{labRequest.wardName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Request Date:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(labRequest.requestDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Priority:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  labRequest.priority === 'URGENT' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {labRequest.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Test Results Input */}
          {renderTestInputs()}

          {/* Additional Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Enter any additional observations or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Object.values(results).every(testResults => !testResults || Object.keys(testResults).length === 0)}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving Results...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Results</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestResultsModal;