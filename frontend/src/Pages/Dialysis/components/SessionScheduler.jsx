import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Clock, 
  Calendar,
  Settings,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Save,
  X
} from 'lucide-react';

export default function SessionScheduler({
  dialysisPatients = [],
  existingSessions = [],
  loading = false,
  onScheduleSession,
  getMachinesWithAvailability
  // onUpdateSession, // Future use
  // onCancelSession  // Future use
}) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [machines, setMachines] = useState([]);
  const [machinesLoading, setMachinesLoading] = useState(false);
  const [availableMachines, setAvailableMachines] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('4'); // hours

  // Fetch machines with availability checking
  const fetchAvailableMachines = React.useCallback(async (date, startTime, duration) => {
    if (!getMachinesWithAvailability || !date || !startTime || !duration) {
      return;
    }

    try {
      setMachinesLoading(true);
      const machineData = await getMachinesWithAvailability(date, startTime, duration);
      
      // Transform the data to show availability status
      const transformedMachines = machineData.map(machine => ({
        id: machine.machineId,
        name: machine.machineName,
        status: machine.status ? machine.status.toLowerCase() : 'active',
        model: machine.model,
        location: machine.location,
        isAvailable: machine.available, // Backend returns 'available', not 'isAvailable'
        conflictCount: machine.conflictCount || 0,
        conflicts: machine.conflicts || []
      }));

      // Only show available machines
      const availableOnly = transformedMachines.filter(machine => machine.isAvailable);
      setAvailableMachines(availableOnly);
      setMachines(transformedMachines); // Keep all machines for reference
      
    } catch (error) {
      console.error('Error fetching machine availability:', error);
      setAvailableMachines([]);
      setMachines([]);
    } finally {
      setMachinesLoading(false);
    }
  }, [getMachinesWithAvailability]);

  // Check availability when date, time, or duration changes
  React.useEffect(() => {
    if (selectedDate && selectedTime && selectedDuration) {
      fetchAvailableMachines(selectedDate, selectedTime, selectedDuration);
    }
  }, [selectedDate, selectedTime, selectedDuration, fetchAvailableMachines]);

  // Fetch all machines on component mount (without availability filter)
  React.useEffect(() => {
    const fetchAllMachines = async () => {
      try {
        setMachinesLoading(true);
        const response = await fetch('http://localhost:8080/api/dialysis/machines');
        if (response.ok) {
          const machineData = await response.json();
          setMachines(machineData.map(machine => ({
            id: machine.machineId,
            name: machine.machineName,
            status: machine.status.toLowerCase(),
            type: machine.machineType,
            location: machine.location
          })));
        } else {
          console.error('Failed to fetch machines');
          setMachines([]);
        }
      } catch (error) {
        console.error('Error fetching machines:', error);
        setMachines([]);
      } finally {
        setMachinesLoading(false);
      }
    };
    
    fetchAllMachines();
  }, []);

  const dialysisTypes = [
    { value: 'hemodialysis', label: 'Hemodialysis', duration: '4 hours' },
    { value: 'peritoneal_dialysis', label: 'Peritoneal Dialysis', duration: '8-10 hours' },
    { value: 'continuous_renal_replacement', label: 'CRRT', duration: '24 hours' },
    { value: 'hemodiafiltration', label: 'Hemodiafiltration', duration: '4-5 hours' }
  ];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  // Filter transferred patients and remove duplicates
  const filteredPatients = useMemo(() => {
    // First remove duplicates based on patientNationalId
    const uniquePatients = dialysisPatients.reduce((unique, patient) => {
      const existingIndex = unique.findIndex(p => p.patientNationalId === patient.patientNationalId);
      if (existingIndex === -1) {
        unique.push(patient);
      } else {
        // Keep the most recent one (if transferDate is available)
        if (patient.transferDate && (!unique[existingIndex].transferDate || 
            new Date(patient.transferDate) > new Date(unique[existingIndex].transferDate))) {
          unique[existingIndex] = patient;
        }
      }
      return unique;
    }, []);

    return uniquePatients.filter(patient => {
      const matchesSearch = !searchTerm || 
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientNationalId?.includes(searchTerm);
      
      const hasSession = existingSessions.some(session => 
        session.patientNationalId === patient.patientNationalId
      );
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'scheduled' && hasSession) ||
        (filterStatus === 'unscheduled' && !hasSession);
      
      return matchesSearch && matchesStatus;
    });
  }, [dialysisPatients, searchTerm, filterStatus, existingSessions]);

  const getPatientScheduleStatus = (patient) => {
    const hasSession = existingSessions.some(session => 
      session.patientNationalId === patient.patientNationalId
    );
    return hasSession ? 'scheduled' : 'unscheduled';
  };

  const ScheduleModal = () => {
    const [formData, setFormData] = useState({
      date: selectedDate,
      startTime: selectedTime || '08:00',
      duration: selectedDuration || '4',
      dialysisType: 'hemodialysis',
      machineId: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!selectedPatient || !formData.machineId) {
        alert('Please select a patient and machine');
        return;
      }

      // Calculate end time based on start time and duration
      const startHour = parseInt(formData.startTime.split(':')[0]);
      const startMinute = parseInt(formData.startTime.split(':')[1]);
      const durationHours = parseInt(formData.duration);
      const endHour = (startHour + durationHours) % 24;
      const endTime = `${String(endHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;

      const sessionData = {
        patientNationalId: selectedPatient.patientNationalId,
        patientName: selectedPatient.patientName,
        admissionId: selectedPatient.admissionId,
        scheduledDate: formData.date,
        startTime: formData.startTime,
        endTime: endTime,
        duration: `${formData.duration}h 0m`,
        sessionType: formData.dialysisType.toUpperCase(), // Map dialysisType to sessionType
        machineId: formData.machineId,
        status: 'SCHEDULED', // Uppercase enum
        attendance: 'PENDING' // Uppercase enum
      };

      onScheduleSession(sessionData);
      setShowScheduleModal(false);
      setSelectedPatient(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Schedule Dialysis Session
              </h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {selectedPatient && (
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">{selectedPatient.patientName}</p>
                    <p className="text-sm text-blue-700">ID: {selectedPatient.patientNationalId}</p>
                    <p className="text-sm text-blue-700">Ward: {selectedPatient.wardName} - Bed {selectedPatient.bedNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Session Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, date: e.target.value }));
                    setSelectedDate(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Start Time
                </label>
                <select
                  value={formData.startTime}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, startTime: e.target.value }));
                    setSelectedTime(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* Dialysis Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Activity className="w-4 h-4 inline mr-1" />
                  Dialysis Type
                </label>
                <select
                  value={formData.dialysisType}
                  onChange={(e) => {
                    const selectedType = dialysisTypes.find(type => type.value === e.target.value);
                    const durationHours = selectedType?.duration.match(/\d+/)[0] || '4';
                    setFormData(prev => ({ 
                      ...prev, 
                      dialysisType: e.target.value,
                      duration: durationHours
                    }));
                    setSelectedDuration(durationHours);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {dialysisTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={formData.duration}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, duration: e.target.value }));
                    setSelectedDuration(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Machine Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Settings className="w-4 h-4 inline mr-1" />
                  Machine Assignment
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {machinesLoading ? (
                    <div className="col-span-full text-center py-6 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                      <p className="text-sm text-blue-600 font-medium">Checking machine availability...</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {selectedDate && selectedTime && selectedDuration ? 
                          `For ${selectedDate} at ${selectedTime} (${selectedDuration}h)` : 
                          'Please select date, time and duration'
                        }
                      </p>
                    </div>
                  ) : availableMachines.length > 0 ? (
                    availableMachines.map(machine => (
                      <label key={machine.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="machine"
                          value={machine.id}
                          checked={formData.machineId === machine.id}
                          onChange={(e) => setFormData(prev => ({ ...prev, machineId: e.target.value }))}
                          className="sr-only"
                        />
                        <div className={`p-3 border-2 rounded-lg transition-all ${
                          formData.machineId === machine.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}>
                          <div className="text-sm font-medium text-gray-900">{machine.name}</div>
                          <div className="text-xs text-green-600 font-medium">✓ Available</div>
                          <div className="text-xs text-gray-500">{machine.location}</div>
                          <div className="text-xs text-blue-600 mt-1">
                            {selectedTime && selectedDuration ? 
                              `${selectedTime} - ${String(parseInt(selectedTime.split(':')[0]) + parseInt(selectedDuration)).padStart(2, '0')}:${selectedTime.split(':')[1]}` : 
                              'Ready for scheduling'
                            }
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (selectedDate && selectedTime && selectedDuration) ? (
                    <div className="col-span-full text-center py-6 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-red-600 font-medium">No machines available</p>
                      <p className="text-sm text-red-500 mt-1">
                        For {selectedDate} at {selectedTime} ({selectedDuration}h duration)
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        Try selecting a different time slot or duration
                      </p>
                    </div>
                  ) : (
                    <div className="col-span-full text-center py-6 bg-gray-50 border border-gray-200 rounded-lg">
                      <Settings className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">Select date, time and duration</p>
                      <p className="text-xs text-gray-500 mt-1">
                        to see available machines
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={availableMachines.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Schedule Session</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading patients...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Machine Status Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dialysis Machines Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {machines.map(machine => {
            const currentSessions = existingSessions.filter(session => 
              session.machineId === machine.id && 
              session.scheduledDate === selectedDate &&
              session.status !== 'completed' &&
              session.status !== 'cancelled'
            );
            const isOccupied = currentSessions.length > 0;
            
            return (
              <div key={machine.id} className={`p-4 rounded-lg border-2 ${
                isOccupied ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{machine.name}</h4>
                    <p className={`text-sm ${isOccupied ? 'text-red-600' : 'text-green-600'}`}>
                      {isOccupied ? 'In Use' : 'Available'}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    isOccupied ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                </div>
                {isOccupied && currentSessions[0] && (
                  <p className="text-xs text-gray-600 mt-2">
                    {currentSessions[0].patientName}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transferred patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Patients</option>
                <option value="unscheduled">Unscheduled</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {filteredPatients.length} transferred patients • 
            {filteredPatients.filter(p => getPatientScheduleStatus(p) === 'unscheduled').length} awaiting manual scheduling
          </div>
        </div>
      </div>

      {/* Transferred Patients List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Transferred Patients - Schedule Dialysis Sessions
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Patients transferred from Ward Management ready for dialysis scheduling
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => {
              const scheduleStatus = getPatientScheduleStatus(patient);
              const existingSession = existingSessions.find(session => 
                session.patientNationalId === patient.patientNationalId
              );
              
              // Create a unique key combining multiple identifiers
              const uniqueKey = `${patient.patientNationalId}_${patient.admissionId || index}_${patient.wardId || 'default'}`;
              
              return (
                <div key={uniqueKey} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {patient.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {patient.patientName}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>ID: {patient.patientNationalId}</span>
                          <span>Ward: {patient.wardName}</span>
                          <span>Bed: {patient.bedNumber}</span>
                          <span>Admission: #{patient.admissionId}</span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          Transferred: {new Date(patient.transferDate || Date.now()).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {scheduleStatus === 'scheduled' ? (
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Scheduled</span>
                          </div>
                          {existingSession && (
                            <div className="text-sm text-gray-600">
                              <p>{new Date(existingSession.scheduledDate).toLocaleDateString()}</p>
                              <p>{existingSession.startTime} - {existingSession.dialysisType}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-orange-600">
                          <AlertCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Needs Scheduling</span>
                        </div>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowScheduleModal(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{scheduleStatus === 'scheduled' ? 'Reschedule' : 'Schedule'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Transferred Patients
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No patients match your search criteria.' 
                  : 'Waiting for patients to be transferred from Ward Management.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && <ScheduleModal />}
    </div>
  );
}