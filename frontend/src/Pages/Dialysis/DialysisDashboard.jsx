import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Activity, 
  FileText, 
  Settings,
  Droplets,
  Monitor,
  Clock,
  UserPlus
} from 'lucide-react';

// Import components
import DialysisHeader from './components/DialysisHeader';
import AttendanceTracker from './components/AttendanceTracker';
import SessionDetailsModal from './components/SessionDetailsModal';
import ReportsModule from './components/ReportsModule';
import MachineManagement from './components/MachineManagement';
import { ToastContainer } from '../Clinic/nurs/components/Toast';

// Import custom hooks
import useDialysisSessions from './hooks/useDialysisSessions';
import useDialysisMachines from './hooks/useDialysisMachines';

export default function DialysisDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Custom hooks for data management
  const {
    sessions,
    loading: sessionsLoading,
    dialysisPatients,
    patientsLoading,
    wsConnected,
    wsError,
    wsNotifications,
    wsTransferredPatients,
    fetchDialysisPatients,
    markAttendance,
    addSessionDetails,
    requestDialysisUpdate
  } = useDialysisSessions(addToast);

  const {
    machines,
    loading: machinesLoading,
    updateMachine
  } = useDialysisMachines(addToast);

  // Toast functions
  function addToast(type, title, message) {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }

  // Calculate dashboard statistics
  const dialysisStats = useMemo(() => {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => 
      new Date(s.scheduledDate).toDateString() === today
    );
    
    const totalPatients = new Set(sessions.map(s => s.patientId)).size;
    const presentToday = todaySessions.filter(s => s.attendance === 'present').length;
    const absentToday = todaySessions.filter(s => s.attendance === 'absent').length;
    const pendingToday = todaySessions.filter(s => s.attendance === 'pending').length;
    
    const activeMachines = machines.filter(m => m.status === 'active').length;
    const totalMachines = machines.length;
    
    const completedSessions = todaySessions.filter(s => s.status === 'completed').length;
    const inProgressSessions = todaySessions.filter(s => s.status === 'in_progress').length;

    return {
      totalPatients,
      todaySessions: todaySessions.length,
      presentToday,
      absentToday,
      pendingToday,
      activeMachines,
      totalMachines,
      completedSessions,
      inProgressSessions,
      attendanceRate: todaySessions.length > 0 ? 
        Math.round((presentToday / todaySessions.length) * 100) : 0
    };
  }, [sessions, machines]);

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Monitor, description: 'Dashboard & Stats' },
    { id: 'attendance', label: 'Attendance', icon: Users, description: 'Mark Present/Absent' },
    { id: 'sessions', label: 'Session Details', icon: Activity, description: 'Add Session Data' },
    { id: 'machines', label: 'Machines', icon: Settings, description: 'Equipment Management' },
    { id: 'reports', label: 'Reports', icon: FileText, description: 'Generate Reports' }
  ];

  // Handle session actions


  const handleAddSessionDetails = () => {
    if (selectedSession) {
      setShowSessionDetails(true);
    }
  };



  const handleAttendanceUpdate = async (sessionId, status) => {
    try {
      await markAttendance(sessionId, status);
      addToast('success', 'Attendance Updated', `Patient marked as ${status}`);
    } catch {
      addToast('error', 'Update Failed', 'Could not update attendance');
    }
  };

  const handleSessionDetailsSubmit = async (sessionId, details) => {
    try {
      await addSessionDetails(sessionId, details);
      setShowSessionDetails(false);
      setSelectedSession(null);
      addToast('success', 'Details Added', 'Session details saved successfully');
    } catch {
      addToast('error', 'Save Failed', 'Could not save session details');
    }
  };

  const handleRefreshPatients = async () => {
    try {
      addToast('info', 'Refreshing...', 'Loading latest patient data from Ward Management');
      
      // First try WebSocket real-time update
      if (wsConnected && requestDialysisUpdate) {
        requestDialysisUpdate();
        addToast('success', 'Real-time Update', 'Requested live data from WebSocket');
      }
      
      // Also fetch via API as backup
      await fetchDialysisPatients();
    } catch (error) {
      console.error('Failed to refresh patients:', error);
    }
  };



  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* API Integration Status */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ward Transfer Integration
                    </h3>
                    <p className="text-sm text-gray-600">
                      Real-time connection with Ward Management system
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-green-700">
                  <div className={`w-2 h-2 ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'} rounded-full`}></div>
                  <span className="text-sm font-medium">{wsConnected ? 'Live' : 'Disconnected'}</span>
                  {wsError && <span className="text-xs text-red-600">({wsError})</span>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Transferred Patients</p>
                      <p className="text-2xl font-bold text-gray-900">{dialysisPatients.length + (wsTransferredPatients?.length || 0)}</p>
                    </div>
                    <UserPlus className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">From Ward Management</p>
                  {wsNotifications?.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">{wsNotifications.length} real-time updates</p>
                  )}
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">{sessions.filter(s => s.transferredFrom).length}</p>
                    </div>
                    <Droplets className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Generated from transfers</p>
                </div>
              </div>
              
              <button
                onClick={handleRefreshPatients}
                disabled={patientsLoading}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {patientsLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Monitor className="h-4 w-4 mr-2" />
                )}
                {patientsLoading ? 'Syncing with Ward Management...' : 'Refresh Patient Data'}
              </button>
            </div>

            {/* Real-time Notifications Panel */}
            {wsNotifications && wsNotifications.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserPlus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Real-time Transfer Notifications
                      </h3>
                      <p className="text-sm text-gray-600">
                        Latest patient transfers and updates
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-700 text-sm font-medium">
                    {wsNotifications.length} notification{wsNotifications.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {wsNotifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.message}
                          </p>
                          {notification.transfer && (
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.transfer.patientName} • Bed {notification.transfer.toBedNumber}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{dialysisStats.totalPatients}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-600 text-sm font-medium">
                    +{dialysisPatients.length + (wsTransferredPatients?.length || 0)} from transfers
                  </span>
                  {wsConnected && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Real-time
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{dialysisStats.activeMachines}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {sessions.filter(s => new Date(s.scheduledDate).toDateString() === new Date().toDateString()).length} today
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Machines</p>
                    <p className="text-2xl font-bold text-gray-900">{dialysisStats.totalMachines}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-full">
                    <Monitor className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-orange-600 text-sm font-medium">
                    {dialysisStats.activeMachines} active
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{dialysisStats.attendanceRate}%</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-full">
                    <Droplets className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-gray-600 text-sm font-medium">
                    Today
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div className="space-y-6">
            {/* Dialysis Patients Integration Header */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dialysis Patient Management
                    </h3>
                    <p className="text-sm text-gray-600">
                      Real-time integration with Ward Management - showing patients transferred to Dialysis Ward (Ward 4)
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRefreshPatients}
                  disabled={patientsLoading}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                >
                  {patientsLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Monitor className="h-4 w-4 mr-2" />
                  )}
                  {patientsLoading ? 'Loading...' : 'Refresh Patients'}
                </button>
              </div>
              
              {dialysisPatients.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-purple-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{dialysisPatients.length}</p>
                        <p className="text-xs text-gray-600">Active Dialysis Patients</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{sessions.filter(s => s.transferredFrom).length}</p>
                        <p className="text-xs text-gray-600">Recently Transferred</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{sessions.filter(s => new Date(s.scheduledDate).toDateString() === new Date().toDateString()).length}</p>
                        <p className="text-xs text-gray-600">Today's Sessions</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <AttendanceTracker
              sessions={sessions}
              loading={sessionsLoading}
              onAttendanceUpdate={handleAttendanceUpdate}
              stats={dialysisStats}
            />
          </div>
        );
      case 'sessions':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Session Details Management
              </h3>
              <p className="text-gray-600 mb-6">
                Select a session from the Attendance tab to add detailed information
              </p>
              {selectedSession ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mb-4">
                  <p className="text-sm font-medium text-blue-900">Selected Session:</p>
                  <p className="text-blue-800">{selectedSession.patientName}</p>
                  <p className="text-blue-700 text-sm">
                    {new Date(selectedSession.scheduledDate).toLocaleDateString()} at {selectedSession.startTime}
                  </p>
                </div>
              ) : null}
              <button
                onClick={handleAddSessionDetails}
                disabled={!selectedSession}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {selectedSession ? 'Add Session Details' : 'No Session Selected'}
              </button>
            </div>
          </div>
        );
      case 'machines':
        return (
          <MachineManagement
            machines={machines}
            sessions={sessions}
            loading={machinesLoading}
            onUpdateMachine={updateMachine}
          />
        );
      case 'reports':
        return (
          <ReportsModule
            sessions={sessions}
            machines={machines}
            stats={dialysisStats}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <DialysisHeader stats={dialysisStats} />

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                <div className="text-left">
                  <div>{tab.label}</div>
                  <div className={`text-xs ${
                    activeTab === tab.id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Modals */}
      <SessionDetailsModal
        isOpen={showSessionDetails}
        onClose={() => {
          setShowSessionDetails(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
        onSubmit={handleSessionDetailsSubmit}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}