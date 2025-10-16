import { useState, useMemo } from 'react';
import {
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Import components
import LabHeader from './components/LabHeader';
import TestOrdersManagement from './components/TestOrdersManagement';
import LabAnalytics from './components/LabAnalytics';
import LabReports from './components/LabReports';
import { ToastContainer } from '../Clinic/nurs/components/Toast';

// Import custom hooks
import useLabTests from './hooks/useLabTests';
import useSamples from './hooks/useSamples';
import useLabEquipment from './hooks/useLabEquipment';
import useLabResults from './hooks/useLabResults';

export default function LabDashboard() {
  const [activeTab, setActiveTab] = useState('test-orders');
  const [toasts, setToasts] = useState([]);

  // Toast functions
  function addToast(type, title, message) {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }

  // Custom hooks for data management
  const {
    testOrders,
    loading: testsLoading,
    createTestOrder,
    updateTestOrder,
    processTest,
    getStats: getTestStats
  } = useLabTests(addToast);

  const {
    samples,
    getStats: getSampleStats
  } = useSamples(addToast);

  const {
    equipment,
    getStats: getEquipmentStats
  } = useLabEquipment(addToast);

  const {
    results,
    getStats: getResultStats
  } = useLabResults(addToast);

  // Calculate lab statistics
  const labStats = useMemo(() => {
    const testStats = getTestStats ? getTestStats() : {
      totalTests: testOrders?.length || 0,
      pendingTests: 0,
      inProgressTests: 0,
      completedTests: 0,
      urgentTests: 0,
      todayTests: 0
    };

    const sampleStats = getSampleStats ? getSampleStats() : {
      totalSamples: samples?.length || 0,
      collectedSamples: 0,
      processingSamples: 0,
      rejectedSamples: 0,
      todayCollections: 0
    };

    const equipmentStats = getEquipmentStats ? getEquipmentStats() : {
      totalEquipment: equipment?.length || 0,
      operationalEquipment: 0,
      maintenanceEquipment: 0,
      offlineEquipment: 0
    };

    const resultStats = getResultStats ? getResultStats() : {
      totalResults: results?.length || 0,
      pendingApproval: 0,
      approvedResults: 0,
      criticalResults: 0,
      todayResults: 0
    };

    return {
      // Test statistics
      totalTests: testStats.totalTests,
      pendingTests: testStats.pendingTests,
      inProgressTests: testStats.inProgressTests,
      completedTests: testStats.completedTests,
      urgentTests: testStats.urgentTests,
      todayTests: testStats.todayTests,

      // Sample statistics
      totalSamples: sampleStats.totalSamples,
      collectedSamples: sampleStats.collectedSamples,
      processingSamples: sampleStats.processingSamples,
      rejectedSamples: sampleStats.rejectedSamples,
      todayCollections: sampleStats.todayCollections,

      // Equipment statistics
      totalEquipment: equipmentStats.totalEquipment,
      operationalEquipment: equipmentStats.operationalEquipment,
      maintenanceEquipment: equipmentStats.maintenanceEquipment,
      offlineEquipment: equipmentStats.offlineEquipment,

      // Result statistics
      totalResults: resultStats.totalResults,
      pendingApproval: resultStats.pendingApproval,
      approvedResults: resultStats.approvedResults,
      criticalResults: resultStats.criticalResults,
      todayResults: resultStats.todayResults,

      // Calculated metrics
      completionRate: testStats.totalTests > 0 ?
        Math.round((testStats.completedTests / testStats.totalTests) * 100) : 0,
      equipmentUtilization: equipmentStats.totalEquipment > 0 ?
        Math.round((equipmentStats.operationalEquipment / equipmentStats.totalEquipment) * 100) : 0,
      sampleRejectionRate: sampleStats.totalSamples > 0 ?
        Math.round((sampleStats.rejectedSamples / sampleStats.totalSamples) * 100) : 0
    };
  }, [testOrders, samples, equipment, results, getTestStats, getSampleStats, getEquipmentStats, getResultStats]);

  // Tab configuration
  const tabs = [
    {
      id: 'test-orders',
      label: 'Test Orders',
      icon: FileText,
      description: 'Order Management',
      count: labStats.pendingTests
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Performance Metrics'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      description: 'Generate Reports'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'test-orders':
        return (
          <TestOrdersManagement
            testOrders={testOrders}
            loading={testsLoading}
            onCreateOrder={createTestOrder}
            onUpdateOrder={updateTestOrder}
            onProcessTest={processTest}
            stats={labStats}
            showToast={(message, type) => addToast(type, type === 'success' ? 'Success' : 'Error', message)}
          />
        );
      case 'analytics':
        return (
          <LabAnalytics
            testOrders={testOrders}
            samples={samples}
            results={results}
            equipment={equipment}
            loading={testsLoading}
            stats={labStats}
          />
        );
      case 'reports':
        return (
          <LabReports
            testOrders={testOrders}
            samples={samples}
            results={results}
            stats={labStats}
          />
        );
      default:
        return (
          <TestOrdersManagement
            testOrders={testOrders}
            loading={testsLoading}
            onCreateOrder={createTestOrder}
            onUpdateOrder={updateTestOrder}
            onProcessTest={processTest}
            stats={labStats}
            showToast={(message, type) => addToast(type, type === 'success' ? 'Success' : 'Error', message)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <LabHeader stats={labStats} />

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                <div className="text-left">
                  <div>{tab.label}</div>
                  <div className={`text-xs ${
                    activeTab === tab.id ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {tab.description}
                  </div>
                </div>

                {/* Alert badges */}
                {tab.count > 0 && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    tab.id === 'test-orders'
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}>
                    {tab.count > 99 ? '99+' : tab.count}
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Critical Alerts Banner */}
      {labStats.urgentTests > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">Urgent Test Orders</div>
              <div className="text-xs opacity-90">
                {labStats.urgentTests} urgent test{labStats.urgentTests > 1 ? 's' : ''} need attention
              </div>
            </div>
            <button
              onClick={() => setActiveTab('test-orders')}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-medium transition-colors"
            >
              View
            </button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}