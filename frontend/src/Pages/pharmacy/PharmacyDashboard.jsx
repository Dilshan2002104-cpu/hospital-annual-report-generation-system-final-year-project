import React, { useState, useMemo } from 'react';
import { 
  Pill, 
  ClipboardList, 
  Package, 
  Shield, 
  FileText, 
  AlertTriangle,
  Search,
  Database,
  TrendingUp
} from 'lucide-react';

// Import components
import PharmacyHeader from './components/PharmacyHeader';
import PrescriptionProcessing from './components/PrescriptionProcessing';
import InventoryManagement from './components/InventoryManagement';
import InventoryAlerts from './components/InventoryAlerts';
import DrugDatabase from './components/DrugDatabase';
import PharmacyReports from './components/PharmacyReports';
import PharmacyAnalytics from './components/PharmacyAnalytics';
import { ToastContainer } from '../Clinic/nurs/components/Toast';

// Import custom hooks
import { usePrescriptions } from './hooks/usePrescriptions';
import useInventory from './hooks/useInventory';
import useDrugDatabase from './hooks/useDrugDatabase';

export default function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [toasts, setToasts] = useState([]);

  // Toast functions (defined before hooks that might need them)
  function removeToast(id) {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }

  function showToast(message, type = 'success', duration = 5000) {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  // Custom hooks for data management
  const {
    prescriptions,
    loading: prescriptionsLoading,
    updateStatus,
    dispenseMedication,
    cancelPrescription,
    verifyInteractions,
    getStats: getPrescriptionStats,
    // WebSocket properties
    wsConnected,
    _WS_ERROR,
    _WS_NOTIFICATIONS,
    wsUnreadCount,
    _MARK_NOTIFICATION_AS_READ,
    _CLEAR_NOTIFICATIONS
  } = usePrescriptions();

  const {
    inventory,
    loading: inventoryLoading,
    updateStock,
    addInventoryItem,
    refreshInventory,
    getStats: getInventoryStats,
    getReorderSuggestions,
    wsConnected: inventoryWsConnected
  } = useInventory({ onToast: showToast });

  const {
    drugDatabase,
    searchResults,
    loading: drugLoading,
    error: drugError,
    pagination,
    searchDrug,
    fetchAllDrugs,
    getDrugInfo,
    getCategories,
    clearSearch,
    wsConnected: drugDatabaseWsConnected
  } = useDrugDatabase();

  // Calculate pharmacy statistics
  const pharmacyStats = useMemo(() => {
    const prescriptionStats = getPrescriptionStats ? getPrescriptionStats() : {
      totalPrescriptions: prescriptions?.length || 0,
      pendingPrescriptions: 0,
      processingPrescriptions: 0,
      readyPrescriptions: 0,
      dispensedPrescriptions: 0,
      dispensedToday: 0,
      processingRate: 0
    };

    const inventoryStats = getInventoryStats ? getInventoryStats() : {
      totalItems: inventory?.length || 0,
      lowStockAlerts: 0,
      outOfStockAlerts: 0,
      expiryAlerts: 0,
      totalValue: 0,
      averageStockLevel: 0
    };

    // Combine stats from hooks with computed values
    return {
      // Prescription stats (matching PharmacyHeader expectations)
      totalPrescriptions: prescriptionStats.totalPrescriptions,
      todayPrescriptions: prescriptionStats.dispensedToday, // Using dispensedToday as today's prescriptions
      pendingPrescriptions: prescriptionStats.pendingPrescriptions,
      processingPrescriptions: prescriptionStats.processingPrescriptions,
      readyPrescriptions: prescriptionStats.readyPrescriptions,
      dispensedPrescriptions: prescriptionStats.dispensedPrescriptions,
      dispensedToday: prescriptionStats.dispensedToday,
      processingRate: prescriptionStats.processingRate,

      // Inventory stats (matching PharmacyHeader expectations)
      totalMedications: inventoryStats.totalItems,
      lowStockItems: inventoryStats.lowStockAlerts, // Matching PharmacyHeader property name
      lowStockAlerts: inventoryStats.lowStockAlerts,
      outOfStockAlerts: inventoryStats.outOfStockAlerts,
      expiryAlerts: inventoryStats.expiryAlerts,
      totalValue: inventoryStats.totalValue,
      averageStockLevel: inventoryStats.averageStockLevel,

      // Combined alerts
      criticalAlerts: inventoryStats.lowStockAlerts + inventoryStats.outOfStockAlerts + inventoryStats.expiryAlerts
    };
  }, [prescriptions, inventory, getPrescriptionStats, getInventoryStats]);

  // Tab configuration
  const tabs = [
    { 
      id: 'prescriptions', 
      label: 'Prescriptions', 
      icon: ClipboardList, 
      description: 'Dispense & Track',
      count: pharmacyStats.pendingPrescriptions
    },
    { 
      id: 'inventory', 
      label: 'Inventory', 
      icon: Package, 
      description: 'Stock Management',
      count: pharmacyStats.lowStockItems
    },
    { 
      id: 'alerts', 
      label: 'Alerts', 
      icon: AlertTriangle, 
      description: 'Stock & Expiry Alerts',
      count: pharmacyStats.lowStockItems
    },
    { 
      id: 'database', 
      label: 'Drug Info', 
      icon: Database, 
      description: 'Medication Database'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: TrendingUp, 
      description: 'Data Visualization'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: FileText, 
      description: 'Analytics & Compliance'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'prescriptions':
        return (
          <PrescriptionProcessing
            prescriptions={prescriptions}
            loading={prescriptionsLoading}
            onUpdateStatus={updateStatus} // Using updateStatus for status updates
            onCheckInteractions={verifyInteractions}
            onDispenseMedication={dispenseMedication}
            onCancelPrescription={cancelPrescription}
            stats={pharmacyStats}
          />
        );
      case 'inventory':
        return (
          <InventoryManagement
            inventory={inventory}
            loading={inventoryLoading}
            onUpdateStock={updateStock}
            onAddMedication={addInventoryItem}
            onGenerateAlerts={getReorderSuggestions}
            stats={pharmacyStats}
            wsConnected={inventoryWsConnected}
          />
        );
      case 'alerts':
        return (
          <InventoryAlerts
            loading={inventoryLoading}
          />
        );
      case 'database':
        return (
          <DrugDatabase
            drugDatabase={drugDatabase}
            searchResults={searchResults}
            loading={drugLoading}
            pagination={pagination}
            error={drugError}
            onSearchDrug={searchDrug}
            onFetchAllDrugs={fetchAllDrugs}
            onGetDrugInfo={getDrugInfo}
            onGetCategories={getCategories}
            onClearSearch={clearSearch}
            wsConnected={drugDatabaseWsConnected}
          />
        );
      case 'analytics':
        return (
          <PharmacyAnalytics
            inventory={inventory}
            prescriptions={prescriptions}
            loading={inventoryLoading}
            onRefresh={refreshInventory}
          />
        );
      case 'reports':
        return (
          <PharmacyReports
            prescriptions={prescriptions}
            inventory={inventory}
            stats={pharmacyStats}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      {/* Header */}
      <PharmacyHeader stats={pharmacyStats} />

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* WebSocket Connection Status */}
          <div className="flex items-center justify-end pt-2 pb-1">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
              wsConnected
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span>
                {wsConnected ? 'Real-time updates active' : 'Connecting...'}
              </span>
              {wsUnreadCount > 0 && (
                <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {wsUnreadCount} new
                </span>
              )}
            </div>
          </div>
          <nav className="flex space-x-1 py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                <div className="text-left">
                  <div>{tab.label}</div>
                  <div className={`text-xs ${
                    activeTab === tab.id ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {tab.description}
                  </div>
                </div>
                
                {/* Alert badges */}
                {tab.count > 0 && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    tab.id === 'inventory' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
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
      {pharmacyStats.criticalAlerts > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 max-w-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">Critical Alerts</div>
              <div className="text-xs opacity-90">
                {pharmacyStats.criticalAlerts} items need attention
              </div>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
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