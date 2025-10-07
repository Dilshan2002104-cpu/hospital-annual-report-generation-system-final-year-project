import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Activity, 
  FileText,
  Clock,
  UserPlus,
  RefreshCw,
  Droplet
} from 'lucide-react';

// Import components
import DialysisHeader from './components/DialysisHeader';
import SessionScheduler from './components/SessionScheduler';
import SessionDetailsModal from './components/SessionDetailsModal';
import ReportsModule from './components/ReportsModule';
import { ToastContainer } from '../Clinic/nurs/components/Toast';

// Import custom hooks
import useDialysisSessions from './hooks/useDialysisSessions';

export default function DialysisDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Custom hooks for data management
  const {
    sessions,
    loading: _sessionsLoading,
    dialysisPatients,
    patientsLoading,
    wsConnected,
    wsError,
    wsNotifications,
    wsTransferredPatients,
    fetchDialysisPatients,
    createSession,
    getMachinesWithAvailability,
    addSessionDetails,
    requestDialysisUpdate
  } = useDialysisSessions(addToast);

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
    
    const completedSessions = todaySessions.filter(s => s.status === 'completed').length;
    const inProgressSessions = todaySessions.filter(s => s.status === 'in_progress').length;

    return {
      totalPatients,
      todaySessions: todaySessions.length,
      presentToday,
      absentToday,
      pendingToday,
      completedSessions,
      inProgressSessions,
      attendanceRate: todaySessions.length > 0 ? 
        Math.round((presentToday / todaySessions.length) * 100) : 0
    };
  }, [sessions]);

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity, description: 'Dashboard & Stats' },
    { id: 'attendance', label: 'Schedule Session', icon: Users, description: 'Schedule & Manage Sessions' },
    { id: 'sessions', label: 'Session Details', icon: Activity, description: 'Add Session Data' },
    { id: 'reports', label: 'Reports', icon: FileText, description: 'Generate Reports' }
  ];

  // Handle session actions
  const handleAddSessionDetails = () => {
    if (selectedSession) {
      setShowSessionDetails(true);
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

  const handleScheduleSession = async (sessionData) => {
    try {
      // Use the real API to create the session
      const newSession = await createSession(sessionData);
      
      addToast('success', 'Session Scheduled', `Dialysis session scheduled for ${sessionData.patientName}`);
      
      return newSession;
    } catch (error) {
      console.error('Failed to schedule session:', error);
      addToast('error', 'Scheduling Failed', 'Could not schedule dialysis session');
      throw error;
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
                    <Droplet className="h-8 w-8 text-blue-600" />
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
                  <RefreshCw className="h-4 w-4 mr-2" />
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
                    <p className="text-sm font-medium text-gray-600">Today's Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{dialysisStats.todaySessions}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-full">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {dialysisStats.inProgressSessions} in progress
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{dialysisStats.completedSessions}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-full">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-600 text-sm font-medium">
                    Today
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
                    <Droplet className="h-6 w-6 text-orange-600" />
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
            {/* Real-time Patient Transfer Status */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Schedule Dialysis Sessions
                    </h3>
                    <p className="text-sm text-gray-600">
                      Real-time integration with Ward Management - Manually schedule dialysis sessions for transferred patients
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'} rounded-full`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {wsConnected ? 'Live Connection' : 'Disconnected'}
                  </span>
                </div>
              </div>
              
              {dialysisPatients.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-purple-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{dialysisPatients.length}</p>
                        <p className="text-xs text-gray-600">Patients Transferred</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {sessions.filter(s => s.status === 'scheduled').length}
                        </p>
                        <p className="text-xs text-gray-600">Manually Scheduled</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-orange-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {Math.max(0, dialysisPatients.length - sessions.filter(s => s.status === 'scheduled').length)}
                        </p>
                        <p className="text-xs text-gray-600">Awaiting Schedule</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleRefreshPatients}
                disabled={patientsLoading}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
              >
                {patientsLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {patientsLoading ? 'Syncing with Ward Management...' : 'Refresh Patient Data'}
              </button>
            </div>
            
            <SessionScheduler
              dialysisPatients={dialysisPatients}
              existingSessions={sessions}
              loading={patientsLoading}
              onScheduleSession={handleScheduleSession}
              getMachinesWithAvailability={getMachinesWithAvailability}
            />
          </div>
        );
      case 'sessions':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Session Details Management</h3>
                  <p className="text-sm text-gray-600 mt-1">Add and manage detailed session information</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{sessions.length} total sessions</span>
                </div>
              </div>

              {/* Sessions List */}
              {sessions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {sessions.map((session) => {
                    const hasDetails = session.actualStartTime || session.preWeight || session.postWeight;
                    const isCompleted = session.status === 'COMPLETED' || session.status === 'completed';

                    return (
                      <div
                        key={session.sessionId}
                        className="py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  {session.patientName?.split(' ').map(n => n[0]).join('') || 'P'}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{session.patientName}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>ID: {session.patientNationalId}</span>
                                  <span>•</span>
                                  <span>{new Date(session.scheduledDate).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span>{session.startTime} - {session.endTime}</span>
                                  <span>•</span>
                                  <span>Machine: {session.machineName || session.machineId}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* Status Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isCompleted
                                ? 'bg-green-100 text-green-700'
                                : session.status === 'IN_PROGRESS' || session.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {session.status}
                            </span>

                            {/* Details Status */}
                            {hasDetails ? (
                              <span className="flex items-center text-xs text-green-600">
                                <Activity className="w-4 h-4 mr-1" />
                                Details Added
                              </span>
                            ) : (
                              <span className="flex items-center text-xs text-orange-600">
                                <Clock className="w-4 h-4 mr-1" />
                                No Details
                              </span>
                            )}

                            {/* Action Button */}
                            <button
                              onClick={() => {
                                setSelectedSession(session);
                                setShowSessionDetails(true);
                              }}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                            >
                              <FileText className="w-4 h-4" />
                              <span>{hasDetails ? 'Edit Details' : 'Add Details'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Show summary if details exist */}
                        {hasDetails && (
                          <div className="mt-3 ml-13 bg-gray-50 rounded-lg p-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              {session.actualStartTime && (
                                <div>
                                  <span className="text-gray-600">Actual Time:</span>
                                  <span className="ml-1 font-medium">{session.actualStartTime} - {session.actualEndTime}</span>
                                </div>
                              )}
                              {session.preWeight && (
                                <div>
                                  <span className="text-gray-600">Pre Weight:</span>
                                  <span className="ml-1 font-medium">{session.preWeight} kg</span>
                                </div>
                              )}
                              {session.postWeight && (
                                <div>
                                  <span className="text-gray-600">Post Weight:</span>
                                  <span className="ml-1 font-medium">{session.postWeight} kg</span>
                                </div>
                              )}
                              {session.fluidRemoval && (
                                <div>
                                  <span className="text-gray-600">Fluid Removed:</span>
                                  <span className="ml-1 font-medium">{session.fluidRemoval} ml</span>
                                </div>
                              )}
                              {session.preBloodPressure && (
                                <div>
                                  <span className="text-gray-600">Pre BP:</span>
                                  <span className="ml-1 font-medium">{session.preBloodPressure}</span>
                                </div>
                              )}
                              {session.postBloodPressure && (
                                <div>
                                  <span className="text-gray-600">Post BP:</span>
                                  <span className="ml-1 font-medium">{session.postBloodPressure}</span>
                                </div>
                              )}
                              {session.complications && (
                                <div className="col-span-2">
                                  <span className="text-red-600">Complications:</span>
                                  <span className="ml-1 font-medium text-red-700">{session.complications}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Sessions Found
                  </h3>
                  <p className="text-gray-600">
                    Schedule sessions from the "Schedule Session" tab
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case 'reports':
        return (
          <ReportsModule
            sessions={sessions}
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