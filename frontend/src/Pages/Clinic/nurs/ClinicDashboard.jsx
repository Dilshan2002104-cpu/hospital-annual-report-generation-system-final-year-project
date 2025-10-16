import React, { useState, useMemo, useCallback } from 'react';
import { Activity, Calendar, UserPlus, Users, FileText, Heart, Shield, Stethoscope, ClipboardList, History, BarChart3, Pill } from 'lucide-react';

// Import custom hooks
import usePatients from './hooks/usePatients';
import useDoctors from './hooks/useDoctors';
import useAppointments from './hooks/useAppointments';

// Import components
import Header from './components/Header';
import TabButton from './components/TabButton';
import ClinicOverview from './components/ClinicOverview';
import AppointmentScheduler from './components/AppointmentScheduler';
import PatientRegistration from './components/PatientRegistration';
import PatientDatabase from './components/PatientDatabase';
import PatientHistory from './components/PatientHistory';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ReportsModule from './components/ReportsModule';
import ClinicPrescriptionsManagement from './components/ClinicPrescriptionsManagement';
import { ToastContainer } from './components/Toast';

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState('status');
  const [toasts, setToasts] = useState([]);

  // Add CSS to hide scrollbar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Toast utility functions
  const addToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Use custom hooks for real data
  const { doctors, loading: doctorsLoading } = useDoctors();
  const { appointments, setAppointments } = useAppointments();

  // Use custom hook for patient management
  const {
    patients,
    loading,
    submitting,
    lastError,
    registerPatient,
    updatePatient,
    deletePatient
  } = usePatients(addToast);

  // Statistics calculations
  const todayStats = useMemo(() => {
    const totalDoctors = doctors.length;
    const availableDoctors = doctors.filter(d => d.available === true).length;
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => 
      a.status === 'completed' || a.status === 'done'
    ).length;
    const totalPatients = patients.length;
    const todayRegistrations = patients.filter(p => {
      const today = new Date().toDateString();
      const regDate = new Date(p.registrationDate).toDateString();
      return today === regDate;
    }).length;
    const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
    const doctorUtilization = totalDoctors > 0 ? Math.round((availableDoctors / totalDoctors) * 100) : 0;

    return {
      totalDoctors,
      availableDoctors,
      totalAppointments,
      completedAppointments,
      totalPatients,
      todayRegistrations,
      completionRate,
      doctorUtilization
    };
  }, [doctors, appointments, patients]);

  const handleScheduleAppointment = useCallback((appointment) => {
    setAppointments(prev => [...prev, appointment]);
  }, [setAppointments]);

  const tabs = [
    { id: 'status', label: 'Clinic Management', icon: Activity },
    { id: 'schedule', label: 'Patient Schedule', icon: Calendar },
    { id: 'register', label: 'Patient Intake', icon: UserPlus },
    { id: 'patients', label: 'Patient Records', icon: Users },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'history', label: 'Patient History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: ClipboardList }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'status':
        return (
          <ClinicOverview 
            todayStats={todayStats} 
            doctors={doctors}
            doctorsLoading={doctorsLoading}
            onTabChange={setActiveTab}
          />
        );
      case 'schedule':
        return (
          <AppointmentScheduler 
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            onScheduleAppointment={handleScheduleAppointment}
          />
        );
      case 'register':
        return (
          <PatientRegistration 
            patients={patients}
            loading={loading}
            submitting={submitting}
            lastError={lastError}
            onRegisterPatient={registerPatient}
          />
        );
      case 'patients':
        return (
          <PatientDatabase
            patients={patients}
            loading={loading}
            submitting={submitting}
            onRegisterPatient={registerPatient}
            onUpdatePatient={updatePatient}
            onDeletePatient={deletePatient}
            onTabChange={setActiveTab}
          />
        );
      case 'prescriptions':
        return (
          <ClinicPrescriptionsManagement />
        );
      case 'history':
        return (
          <PatientHistory />
        );
      case 'analytics':
        return (
          <AnalyticsDashboard />
        );
      case 'reports':
        return (
          <ReportsModule
            todayStats={todayStats}
          />
        );
      default:
        return (
          <ClinicOverview 
            todayStats={todayStats} 
            doctors={doctors} 
            onTabChange={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header todayStats={todayStats} />

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b-2 border-blue-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav 
            className="flex space-x-2 py-6 overflow-x-auto no-scrollbar" 
            style={{
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
              >
                {tab.label}
              </TabButton>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[60vh]">
          {renderContent()}
        </div>
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Heart size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Clinic Management</p>
                <p className="text-xs text-gray-500">National Institute of Nephrology, Dialysis and Transplantation - Clinic Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <Shield size={14} className="mr-1" />
                Secure & HIPAA Compliant
              </span>
              <span>Version 2.1.0</span>
              <span>{new Date().getFullYear()} - All Rights Reserved</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}