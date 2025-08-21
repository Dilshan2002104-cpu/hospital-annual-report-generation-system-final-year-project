import React, { useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Stethoscope, 
  ArrowUpDown, 
  UserCheck, 
  FileText,
  CheckCircle,
  XCircle,
  Activity,
  Clock
} from 'lucide-react';

const PatientList = ({
  patients,
  loading,
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  onViewPatient,
  onPrescribeMedication,
  onTransferPatient,
  onDischargePatient,
  onViewLabResults
}) => {
  // Filter patients based on search and filter criteria
  const filteredPatients = useMemo(() => {
    if (!patients || patients.length === 0) return [];
    
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.wardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientNationalId.toString().includes(searchTerm)
      );
    }

    if (filterBy !== 'all') {
      filtered = filtered.filter(patient => patient.status.toLowerCase() === filterBy.toLowerCase());
    }

    return filtered;
  }, [patients, searchTerm, filterBy]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'discharged': return 'text-gray-600 bg-gray-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'stable': return 'text-green-600 bg-green-100';
      case 'improving': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return <CheckCircle size={16} />;
      case 'discharged': return <UserCheck size={16} />;
      case 'critical': return <XCircle size={16} />;
      case 'stable': return <CheckCircle size={16} />;
      case 'improving': return <Activity size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search patients, bed numbers, or diagnosis..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="all">All Patients</option>
              <option value="active">Active</option>
              <option value="discharged">Discharged</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Patient List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-500">Loading patients...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-gray-500">
                      {searchTerm || filterBy !== 'all' ? 'No patients found matching your criteria' : 'No patients currently admitted'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.admissionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{patient.patientName}</div>
                        <div className="text-sm text-gray-500">ID: {patient.patientNationalId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.bedNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.wardName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                        {getStatusIcon(patient.status)}
                        <span className="ml-1 capitalize">{patient.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          onClick={() => onViewPatient(patient)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          onClick={() => onPrescribeMedication(patient)}
                          title="Prescribe Medication"
                        >
                          <Stethoscope size={16} />
                        </button>
                        <button
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                          onClick={() => onTransferPatient(patient)}
                          title="Transfer Patient"
                        >
                          <ArrowUpDown size={16} />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900 p-1 rounded"
                          onClick={() => onDischargePatient(patient)}
                          title="Discharge Patient"
                        >
                          <UserCheck size={16} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                          onClick={() => onViewLabResults(patient)}
                          title="Lab Results"
                        >
                          <FileText size={16} />
                        </button>
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
};

export default PatientList;