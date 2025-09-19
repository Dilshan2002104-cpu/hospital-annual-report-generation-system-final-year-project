import React, { useState, useMemo } from 'react';
import { Search, Calendar, Clock, User, Stethoscope, FileText, ChevronDown, ChevronUp, X, Filter, History } from 'lucide-react';
import StatusBadge from './StatusBadge';
import useAllAppointments from '../hooks/useAllAppointments';
import usePatients from '../hooks/usePatients';

const PatientHistory = () => {
  const { allAppointments, loading, error } = useAllAppointments();
  const { patients } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search logic
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;

    const searchLower = searchTerm.toLowerCase();
    return patients.filter(patient =>
      patient.fullName?.toLowerCase().includes(searchLower) ||
      String(patient.nationalId).includes(searchTerm) ||
      patient.contactNumber?.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  const getPatientAppointments = useMemo(() => {
    if (!selectedPatient) return [];

    let appointments = allAppointments.filter(apt =>
      apt.patientNationalId === parseInt(selectedPatient.nationalId)
    );

    // Apply status filter
    if (statusFilter !== 'all') {
      appointments = appointments.filter(apt =>
        apt.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'last7days':
          filterDate.setDate(today.getDate() - 7);
          appointments = appointments.filter(apt =>
            new Date(apt.appointmentDate) >= filterDate
          );
          break;
        case 'last30days':
          filterDate.setDate(today.getDate() - 30);
          appointments = appointments.filter(apt =>
            new Date(apt.appointmentDate) >= filterDate
          );
          break;
        case 'last6months':
          filterDate.setMonth(today.getMonth() - 6);
          appointments = appointments.filter(apt =>
            new Date(apt.appointmentDate) >= filterDate
          );
          break;
        case 'thisyear':
          filterDate.setFullYear(today.getFullYear(), 0, 1);
          appointments = appointments.filter(apt =>
            new Date(apt.appointmentDate) >= filterDate
          );
          break;
      }
    }

    return appointments.sort((a, b) =>
      new Date(b.appointmentDate) - new Date(a.appointmentDate)
    );
  }, [allAppointments, selectedPatient, statusFilter, dateFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'no_show': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'in_progress': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAppointmentStats = () => {
    const appointments = getPatientAppointments;
    return {
      total: appointments.length,
      completed: appointments.filter(a => a.status?.toLowerCase() === 'completed').length,
      scheduled: appointments.filter(a => a.status?.toLowerCase() === 'scheduled').length,
      cancelled: appointments.filter(a => a.status?.toLowerCase() === 'cancelled').length
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 ml-4">Loading patient history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <FileText size={48} className="mx-auto mb-4 text-red-300" />
        <p className="text-lg font-medium">Error loading patient history</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <History size={28} className="mr-3 text-blue-500" />
            Patient Medical History
          </h3>
          <p className="text-gray-600">View comprehensive appointment history and patient care timeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Search Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User size={20} className="mr-2 text-blue-600" />
              Select Patient
            </h4>

            {/* Search Input */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search by name, ID, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Patient List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>No patients found</p>
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.nationalId}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                      selectedPatient?.nationalId === patient.nationalId
                        ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {patient.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{patient.fullName}</p>
                        <p className="text-sm text-gray-500">ID: {patient.nationalId}</p>
                        <p className="text-xs text-gray-400">{patient.contactNumber}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* History Panel */}
        <div className="lg:col-span-8">
          {selectedPatient ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Patient Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-25 to-indigo-25">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-blue-700 font-bold text-lg">
                      {selectedPatient.fullName?.split(' ').map(n => n[0]).join('') || 'P'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedPatient.fullName}</h3>
                      <p className="text-gray-600">National ID: {selectedPatient.nationalId}</p>
                      <p className="text-sm text-gray-500">Contact: {selectedPatient.contactNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter size={16} />
                    <span>Filters</span>
                    {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no_show">No Show</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Dates</option>
                        <option value="last7days">Last 7 Days</option>
                        <option value="last30days">Last 30 Days</option>
                        <option value="last6months">Last 6 Months</option>
                        <option value="thisyear">This Year</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const stats = getAppointmentStats();
                    return (
                      <>
                        <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                          <div className="text-xs text-gray-500">Total Visits</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                          <div className="text-xs text-gray-500">Completed</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                          <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
                          <div className="text-xs text-gray-500">Scheduled</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                          <div className="text-xs text-gray-500">Cancelled</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Appointment Timeline */}
              <div className="p-6">
                {getPatientAppointments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No appointment history found</p>
                    <p className="text-sm">
                      {statusFilter !== 'all' || dateFilter !== 'all'
                        ? 'Try adjusting your filters to see more appointments'
                        : 'This patient has no recorded appointments'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Calendar size={20} className="mr-2 text-blue-600" />
                      Appointment Timeline ({getPatientAppointments.length} visits)
                    </h4>

                    <div className="space-y-3">
                      {getPatientAppointments.map((appointment) => (
                        <div
                          key={appointment.appointmentId}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-4">
                                <div className="text-center min-w-[100px]">
                                  <div className="text-lg font-bold text-gray-700">{formatTime(appointment.appointmentTime)}</div>
                                  <div className="text-sm font-medium text-gray-600">{formatDate(appointment.appointmentDate)}</div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Stethoscope size={16} className="text-blue-600" />
                                    <span className="font-semibold text-gray-900">{appointment.doctorName}</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{appointment.doctorSpecialization}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Created: {formatDate(appointment.createdAt)}
                                  </p>
                                </div>
                              </div>

                              {expandedAppointment === appointment.appointmentId && (
                                <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-25 rounded-lg p-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium text-gray-700">Appointment ID:</span>
                                      <span className="ml-2 text-gray-600">{appointment.appointmentId}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Doctor ID:</span>
                                      <span className="ml-2 text-gray-600">{appointment.doctorEmployeeId}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Patient ID:</span>
                                      <span className="ml-2 text-gray-600">{appointment.patientNationalId}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Status:</span>
                                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                                        {appointment.status?.replace('_', ' ').toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-end space-y-2">
                              <StatusBadge status={appointment.status} />
                              <button
                                onClick={() => setExpandedAppointment(
                                  expandedAppointment === appointment.appointmentId ? null : appointment.appointmentId
                                )}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                              >
                                {expandedAppointment === appointment.appointmentId ? (
                                  <>Less <ChevronUp size={14} className="ml-1" /></>
                                ) : (
                                  <>Details <ChevronDown size={14} className="ml-1" /></>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <User size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Patient</h3>
              <p className="text-gray-600">Choose a patient from the list to view their complete appointment history and medical timeline.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;