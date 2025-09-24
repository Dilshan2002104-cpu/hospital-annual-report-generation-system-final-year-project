import React, { useState } from 'react';
import {
  Microscope,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Database
} from 'lucide-react';

export default function TestProcessing({
  testOrders = [],
  samples = [],
  equipment = [],
  loading,
  onProcessTest,
  stats
}) {
  const [activeTests, setActiveTests] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const inProgressTests = testOrders.filter(test => test.status === 'in_progress');
  const readyToProcess = testOrders.filter(test => test.status === 'pending');
  const operationalEquipment = equipment.filter(eq => eq.status === 'operational');

  const handleStartTest = (testId, equipmentId) => {
    setActiveTests(prev => [...prev, { testId, equipmentId, startTime: new Date() }]);
    onProcessTest(testId, { status: 'in_progress', equipmentId });
  };

  const handleCompleteTest = (testId) => {
    setActiveTests(prev => prev.filter(test => test.testId !== testId));
    onProcessTest(testId, { status: 'completed', completedTime: new Date() });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Test Processing</h2>
        <p className="text-sm text-gray-600 mt-1">Run and monitor laboratory tests</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ready to Process</p>
              <p className="text-2xl font-bold text-blue-600">{readyToProcess.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">{stats.inProgressTests}</p>
            </div>
            <Microscope className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Equipment Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.operationalEquipment}</p>
            </div>
            <Database className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.completionRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Tests</h3>
          <div className="space-y-4">
            {inProgressTests.map((test, index) => (
              <div key={test.orderId || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{test.orderId}</p>
                    <p className="text-sm text-gray-600">{test.patientName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-purple-600">
                      <Microscope size={16} />
                      <span className="text-sm font-medium">Processing</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Tests: {Array.isArray(test.tests) ? test.tests.join(', ') : test.tests}
                  </p>
                  <button
                    onClick={() => handleCompleteTest(test.orderId)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Complete
                  </button>
                </div>
                {/* Progress bar simulation */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            ))}
            {inProgressTests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Microscope className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">No tests currently in progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Ready to Process */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Process</h3>
          <div className="space-y-4">
            {readyToProcess.map((test, index) => (
              <div key={test.orderId || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{test.orderId}</p>
                    <p className="text-sm text-gray-600">{test.patientName}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    test.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    test.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {test.priority || 'Normal'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Tests: {Array.isArray(test.tests) ? test.tests.join(', ') : test.tests}
                </p>
                <div className="flex items-center justify-between">
                  <select
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500"
                    onChange={(e) => setSelectedEquipment(e.target.value)}
                  >
                    <option value="">Select Equipment</option>
                    {operationalEquipment.map(eq => (
                      <option key={eq.equipmentId} value={eq.equipmentId}>
                        {eq.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleStartTest(test.orderId, selectedEquipment)}
                    disabled={!selectedEquipment}
                    className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Play size={14} />
                    <span>Start</span>
                  </button>
                </div>
              </div>
            ))}
            {readyToProcess.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">No tests ready for processing</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {equipment.map((eq, index) => (
            <div key={eq.equipmentId || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Database size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-900">{eq.name}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  eq.status === 'operational' ? 'bg-green-500' :
                  eq.status === 'maintenance' ? 'bg-orange-500' :
                  'bg-red-500'
                }`}></div>
              </div>
              <p className="text-sm text-gray-600">{eq.type}</p>
              <p className="text-xs text-gray-500 mt-1">
                Status: {eq.status?.charAt(0).toUpperCase() + eq.status?.slice(1)}
              </p>
              {eq.status === 'operational' && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">Utilization</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}