import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Users, UserPlus, FileText, Activity, Clock, Phone, MapPin, User, CheckCircle, XCircle, AlertCircle, Heart, Shield, Stethoscope, Clipboard, TrendingUp, UserCheck, LogOut, Settings, Bell, Search } from 'lucide-react';
import axios from 'axios';

const TabButton = ({ active, onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 group ${
      active 
        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25 transform scale-105' 
        : 'text-gray-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md'
    }`}
  >
    <Icon size={20} className={`transition-transform duration-300 ${
      active ? 'rotate-0' : 'group-hover:scale-110'
    }`} />
    <span className="text-sm font-medium">{children}</span>
    {active && (
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-white rounded-full opacity-75"></div>
    )}
  </button>
);

const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", trend }) => {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 border-blue-200 text-blue-800 shadow-blue-100/50",
    green: "bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800 shadow-emerald-100/50",
    yellow: "bg-gradient-to-br from-amber-50 via-yellow-50 to-yellow-100 border-amber-200 text-amber-800 shadow-amber-100/50",
    red: "bg-gradient-to-br from-rose-50 via-red-50 to-red-100 border-rose-200 text-rose-800 shadow-rose-100/50",
    purple: "bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 border-purple-200 text-purple-800 shadow-purple-100/50",
    indigo: "bg-gradient-to-br from-indigo-50 via-indigo-50 to-indigo-100 border-indigo-200 text-indigo-800 shadow-indigo-100/50"
  };

  const iconColors = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    yellow: "text-amber-600",
    red: "text-rose-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600"
  };

  return (
    <div className={`p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer backdrop-blur-sm ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <p className="text-sm font-semibold opacity-80 uppercase tracking-wide">{title}</p>
            {trend && (
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp size={12} className="text-green-600" />
                <span className="text-green-600 font-medium">{trend}</span>
              </div>
            )}
          </div>
          <p className="text-4xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">{value}</p>
          {subtitle && <p className="text-sm opacity-75 font-medium">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-white/60 group-hover:bg-white/80 transition-all duration-300 ${iconColors[color]}`}>
          <Icon size={28} className="group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    available: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    busy: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle },
    unavailable: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    completed: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    'in-progress': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
    scheduled: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Clock }
  };

  const config = statusConfig[status] || statusConfig.scheduled;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${config.color}`}>
      <Icon size={12} className="mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState('status');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New patient form state
  const [newPatient, setNewPatient] = useState({
    nationalId: '',
    fullName: '',
    address: '',
    dateOfBirth: '',
    contactNumber: '',
    emergencyContactNumber: '',
    gender: ''
  });

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: ''
  });

  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showPatientView, setShowPatientView] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        console.warn('No JWT token found');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/patients/all', {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      
      // Show user-friendly error messages
      let errorMessage = 'Failed to load patient data. ';
      
      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to view patient data.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      // You could replace this with a toast notification or modal
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Statistics calculations
  const todayStats = useMemo(() => {
    const totalDoctors = doctors.length;
    const availableDoctors = doctors.filter(d => d.status === 'available').length;
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
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

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    return patients.filter(patient =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.nationalId.includes(searchTerm) ||
      patient.contactNumber.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Get JWT token from localStorage
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        alert('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.post('http://localhost:8080/api/patients/register', newPatient, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      // Reset form and close modal first
      setNewPatient({
        nationalId: '',
        fullName: '',
        address: '',
        dateOfBirth: '',
        contactNumber: '',
        emergencyContactNumber: '',
        gender: ''
      });
      setShowPatientForm(false);
      
      // Refresh the entire patient list from server instead of manual addition
      await fetchPatients();
      
      // Show success message
      alert('Patient registered successfully!');
      
    } catch (error) {
      console.error('Error registering patient:', error);
      
      if (error.response) {
        // Handle specific status codes
        if (error.response.status === 401) {
          alert('Authentication failed. Please log in again.');
          // Optional: Redirect to login page
          // window.location.href = '/login';
        } else if (error.response.status === 403) {
          alert('You do not have permission to register patients.');
        } else {
          const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
          alert(`Failed to register patient: ${errorMessage}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        alert('Failed to register patient. Please check your connection and try again.');
      } else {
        // Something else happened
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle patient view
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientView(true);
  };

  // Handle patient edit
  const handleEditPatient = (patient) => {
    setEditingPatient({...patient});
    setShowEditForm(true);
  };

  // Handle patient update
  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        alert('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.put(`http://localhost:8080/api/patients/${editingPatient.id}`, editingPatient, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      setShowEditForm(false);
      setEditingPatient(null);
      
      await fetchPatients();
      
      alert('Patient updated successfully!');
      
    } catch (error) {
      console.error('Error updating patient:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          alert('Authentication failed. Please log in again.');
        } else if (error.response.status === 403) {
          alert('You do not have permission to update patients.');
        } else {
          const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
          alert(`Failed to update patient: ${errorMessage}`);
        }
      } else if (error.request) {
        alert('Failed to update patient. Please check your connection and try again.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle patient delete
  const handleDeletePatient = async (patient) => {
    if (!window.confirm(`Are you sure you want to delete patient ${patient.fullName}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        alert('Authentication required. Please log in again.');
        return;
      }

      await axios.delete(`http://localhost:8080/api/patients/${patient.id}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      await fetchPatients();
      
      alert('Patient deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting patient:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          alert('Authentication failed. Please log in again.');
        } else if (error.response.status === 403) {
          alert('You do not have permission to delete patients.');
        } else {
          const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
          alert(`Failed to delete patient: ${errorMessage}`);
        }
      } else if (error.request) {
        alert('Failed to delete patient. Please check your connection and try again.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleScheduleAppointment = (e) => {
    e.preventDefault();
    const selectedPatient = patients.find(p => p.id === parseInt(newAppointment.patientId));
    const selectedDoctor = doctors.find(d => d.id === parseInt(newAppointment.doctorId));
    
    if (selectedPatient && selectedDoctor) {
      const appointment = {
        id: appointments.length + 1,
        patientName: selectedPatient.fullName,
        doctorName: selectedDoctor.name,
        date: newAppointment.date,
        time: newAppointment.time,
        status: 'scheduled'
      };
      setAppointments([...appointments, appointment]);
      setNewAppointment({
        patientId: '',
        doctorId: '',
        date: '',
        time: ''
      });
      setShowAppointmentForm(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderClinicStatus = () => (
    <div className="space-y-8">
      {/* Key Performance Indicators */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Overview</h2>
        <p className="text-gray-600">Real-time hospital statistics and performance metrics</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Patients"
          value={todayStats.totalPatients}
          subtitle="Registered patients"
          icon={Users}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Today's Registrations"
          value={todayStats.todayRegistrations}
          subtitle="New patients today"
          icon={UserPlus}
          color="green"
        />
        <StatCard
          title="Active Doctors"
          value={`${todayStats.availableDoctors}/${todayStats.totalDoctors}`}
          subtitle={`${todayStats.doctorUtilization}% availability`}
          icon={Stethoscope}
          color="purple"
        />
        <StatCard
          title="Appointments"
          value={todayStats.totalAppointments}
          subtitle={`${todayStats.completedAppointments} completed`}
          icon={Calendar}
          color="yellow"
        />
        <StatCard
          title="Completion Rate"
          value={`${todayStats.completionRate}%`}
          subtitle="Today's progress"
          icon={Activity}
          color="green"
        />
        <StatCard
          title="System Status"
          value="Online"
          subtitle="All systems operational"
          icon={Shield}
          color="indigo"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clipboard size={20} className="mr-2 text-blue-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveTab('register')}
            className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105 group"
          >
            <UserPlus size={24} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-blue-800">Add Patient</span>
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-105 group"
          >
            <Calendar size={24} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-green-800">Schedule</span>
          </button>
          <button 
            onClick={() => setActiveTab('patients')}
            className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 hover:scale-105 group"
          >
            <Users size={24} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-purple-800">View Patients</span>
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all duration-200 hover:scale-105 group"
          >
            <FileText size={24} className="text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-orange-800">Reports</span>
          </button>
        </div>
      </div>

      {/* Doctor Status Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Stethoscope size={24} className="mr-3 text-blue-600" />
            Medical Staff Status
          </h3>
          <p className="text-sm text-gray-600 mt-1">Current availability and performance metrics</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Medical Professional</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Current Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Today's Load</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users size={48} className="text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">No medical staff data available</p>
                      <p className="text-gray-400 text-sm mt-2">Connect your data source to view doctor information</p>
                    </div>
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{doctor.name}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <UserCheck size={12} className="mr-1" />
                            Licensed Professional
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {doctor.specialization}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <StatusBadge status={doctor.status} />
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{doctor.todayPatients}</div>
                      <div className="text-xs text-gray-500">patients</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-emerald-600">{doctor.completed}</div>
                      <div className="text-xs text-gray-500">treatments</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="w-20 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300" 
                              style={{ width: `${doctor.todayPatients > 0 ? (doctor.completed / doctor.todayPatients) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-700 min-w-[3rem]">
                          {doctor.todayPatients > 0 ? Math.round((doctor.completed / doctor.todayPatients) * 100) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderScheduleAppointments = () => (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Schedule Management</h3>
        <button
          onClick={() => setShowAppointmentForm(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Calendar size={16} />
          <span>Schedule Appointment</span>
        </button>
      </div>

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Schedule New Appointment</h4>
            <form onSubmit={handleScheduleAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <select
                  value={newAppointment.patientId}
                  onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>{patient.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select
                  value={newAppointment.doctorId}
                  onChange={(e) => setNewAppointment({...newAppointment, doctorId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                >
                  Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowAppointmentForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-medium text-gray-900">Today's Schedule</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No appointments scheduled. Create a new appointment to get started.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.patientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.doctorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                        <button className="text-red-600 hover:text-red-900 font-medium">Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRegisterPatient = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Patient Registration</h3>
        <button
          onClick={() => setShowPatientForm(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <UserPlus size={16} />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Patient Registration Form Modal */}
      {showPatientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-900 flex items-center">
                <UserPlus size={20} className="mr-2 text-blue-600" />
                Register New Patient
              </h4>
              <button 
                onClick={() => setShowPatientForm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={18} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleRegisterPatient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                  <input
                    type="text"
                    value={newPatient.nationalId}
                    onChange={(e) => setNewPatient({...newPatient, nationalId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="200112345678"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newPatient.fullName}
                    onChange={(e) => setNewPatient({...newPatient, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Full Address"
                  rows="2"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newPatient.dateOfBirth}
                    onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={newPatient.contactNumber}
                    onChange={(e) => setNewPatient({...newPatient, contactNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0771234567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    type="tel"
                    value={newPatient.emergencyContactNumber}
                    onChange={(e) => setNewPatient({...newPatient, emergencyContactNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0712345678"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPatientForm(false)}
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    submitting 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition-colors flex items-center space-x-2 ${
                    submitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Register</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Registrations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-medium text-gray-900">Recent Registrations</h4>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No patients registered yet. Register your first patient to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.slice(-6).map((patient) => (
                <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{patient.fullName}</h5>
                      <p className="text-sm text-gray-500">ID: {patient.nationalId}</p>
                      <p className="text-sm text-gray-500">Age: {calculateAge(patient.dateOfBirth)} years</p>
                      <p className="text-sm text-gray-500">Registered: {formatDate(patient.registrationDate)}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <User size={16} className="text-green-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

const renderPatientInformation = () => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Registry</h2>
        <p className="text-gray-600">Comprehensive patient information and medical records</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-80 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200"
          />
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
        </div>
        <button
          onClick={() => setShowPatientForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-semibold"
        >
          <UserPlus size={18} />
          <span>Add Patient</span>
        </button>
      </div>
    </div>

    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Users size={24} className="mr-3 text-blue-600" />
            Patient Database
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              {filteredPatients.length} patients
            </span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Patient Information</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Identification</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Demographics</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500 text-lg font-medium">Loading patient data...</p>
                        <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the information</p>
                      </>
                    ) : patients.length === 0 ? (
                      <>
                        <Users size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No patients registered</p>
                        <p className="text-gray-400 text-sm mt-2">Click 'Add Patient' to register your first patient</p>
                        <button
                          onClick={() => setShowPatientForm(true)}
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          Register First Patient
                        </button>
                      </>
                    ) : (
                      <>
                        <Search size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No patients match your search</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <span className="text-white font-bold text-sm">
                          {patient.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{patient.fullName}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <User size={12} className="mr-1" />
                          Patient ID: {patient.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{patient.nationalId}</div>
                    <div className="text-xs text-gray-500 mt-1">National ID</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{calculateAge(patient.dateOfBirth)} years</div>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        patient.gender === 'Male' ? 'bg-blue-100 text-blue-800' :
                        patient.gender === 'Female' ? 'bg-pink-100 text-pink-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.gender}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-gray-900 flex items-center">
                        <Phone size={12} className="mr-2 text-green-600" />
                        {patient.contactNumber}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <AlertCircle size={12} className="mr-2 text-orange-500" />
                        Emergency: {patient.emergencyContactNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-gray-900 flex items-start max-w-xs">
                      <MapPin size={12} className="mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span className="line-clamp-2 text-xs leading-relaxed">{patient.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewPatient(patient)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEditPatient(patient)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePatient(patient)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Patient View Modal */}
      {showPatientView && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Patient Details</h4>
              <button 
                onClick={() => setShowPatientView(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-lg font-medium text-gray-900">{selectedPatient.fullName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">National ID</label>
                  <p className="text-gray-900">{selectedPatient.nationalId}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">{formatDate(selectedPatient.dateOfBirth)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Age</label>
                  <p className="text-gray-900">{calculateAge(selectedPatient.dateOfBirth)} years</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900">{selectedPatient.gender}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Contact Number</label>
                  <p className="text-gray-900">{selectedPatient.contactNumber}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Emergency Contact</label>
                  <p className="text-gray-900">{selectedPatient.emergencyContactNumber}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{selectedPatient.address}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Registration Date</label>
                  <p className="text-gray-900">{formatDate(selectedPatient.registrationDate)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => {
                  setShowPatientView(false);
                  handleEditPatient(selectedPatient);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Edit Patient
              </button>
              <button
                onClick={() => setShowPatientView(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Edit Modal */}
      {showEditForm && editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-4">Edit Patient</h4>
            <form onSubmit={handleUpdatePatient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                  <input
                    type="text"
                    value={editingPatient.nationalId}
                    onChange={(e) => setEditingPatient({...editingPatient, nationalId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingPatient.fullName}
                    onChange={(e) => setEditingPatient({...editingPatient, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={editingPatient.address}
                  onChange={(e) => setEditingPatient({...editingPatient, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editingPatient.dateOfBirth}
                    onChange={(e) => setEditingPatient({...editingPatient, dateOfBirth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={editingPatient.gender}
                    onChange={(e) => setEditingPatient({...editingPatient, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={editingPatient.contactNumber}
                    onChange={(e) => setEditingPatient({...editingPatient, contactNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    type="tel"
                    value={editingPatient.emergencyContactNumber}
                    onChange={(e) => setEditingPatient({...editingPatient, emergencyContactNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-2 rounded-md text-white ${
                    submitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {submitting ? 'Updating...' : 'Update Patient'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingPatient(null);
                  }}
                  disabled={submitting}
                  className={`flex-1 py-2 rounded-md ${
                    submitting 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
);

  const renderReports = () => (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical Reports & Analytics</h2>
        <p className="text-gray-600">Comprehensive healthcare analytics and reporting dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Analytics Preview */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp size={24} className="mr-3 text-blue-600" />
              Quick Analytics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                <span className="font-medium text-gray-700">Total Patients Registered</span>
                <span className="text-2xl font-bold text-blue-600">{todayStats.totalPatients}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                <span className="font-medium text-gray-700">Today's Registrations</span>
                <span className="text-2xl font-bold text-green-600">{todayStats.todayRegistrations}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                <span className="font-medium text-gray-700">System Uptime</span>
                <span className="text-2xl font-bold text-purple-600">99.9%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity size={20} className="mr-2 text-green-600" />
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Database Connection</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">API Services</span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Backup Status</span>
                <span className="flex items-center text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Last backup: 2 hours ago
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coming Soon Features */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg border border-blue-200 p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Reports Module</h3>
            <p className="text-gray-600 mb-8">Comprehensive healthcare analytics and reporting suite coming soon</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Users size={16} className="mr-2 text-blue-600" />
                Patient Analytics
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Demographics analysis</li>
                <li>• Treatment outcomes</li>
                <li>• Patient flow tracking</li>
              </ul>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Calendar size={16} className="mr-2 text-green-600" />
                Operational Reports
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Appointment statistics</li>
                <li>• Staff performance</li>
                <li>• Resource utilization</li>
              </ul>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <TrendingUp size={16} className="mr-2 text-purple-600" />
                Financial Analysis
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Revenue tracking</li>
                <li>• Cost analysis</li>
                <li>• Billing reports</li>
              </ul>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Shield size={16} className="mr-2 text-red-600" />
                Compliance Reports
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• HIPAA compliance</li>
                <li>• Quality metrics</li>
                <li>• Audit trails</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
              Request Reports Module Access
            </button>
            <p className="text-xs text-gray-500 mt-3">Contact system administrator to enable advanced reporting features</p>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'status', label: 'Hospital Overview', icon: Activity },
    { id: 'schedule', label: 'Appointments', icon: Calendar },
    { id: 'register', label: 'Patient Registration', icon: UserPlus },
    { id: 'patients', label: 'Patient Database', icon: Users },
    { id: 'reports', label: 'Medical Reports', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  HMS - Hospital Management
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-gray-700 text-sm font-medium flex items-center">
                    <Shield size={14} className="mr-2 text-blue-600" />
                    National Institute of Nephrology, Dialysis and Transplantation
                  </p>
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-700 font-medium">System Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden lg:flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Active Patients</p>
                  <p className="text-2xl font-bold text-blue-700">{todayStats.totalPatients}</p>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Today's Appointments</p>
                  <p className="text-2xl font-bold text-emerald-600">{todayStats.totalAppointments}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors">
                  <Bell size={18} />
                </button>
                <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                  <Settings size={18} />
                </button>
                <button className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Today</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-gray-600">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b-2 border-blue-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 py-6 overflow-x-auto scrollbar-hide">
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
          {activeTab === 'status' && renderClinicStatus()}
          {activeTab === 'schedule' && renderScheduleAppointments()}
          {activeTab === 'register' && renderRegisterPatient()}
          {activeTab === 'patients' && renderPatientInformation()}
          {activeTab === 'reports' && renderReports()}
        </div>
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Heart size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">HMS - Hospital Management System</p>
                <p className="text-xs text-gray-500">National Institute of Nephrology, Dialysis and Transplantation</p>
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
    </div>
  );
}