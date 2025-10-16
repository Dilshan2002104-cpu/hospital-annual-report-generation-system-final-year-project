import React, { useState, useMemo, useEffect } from 'react';
import {
  Bed,
  User,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  MapPin,
  Users,
  Activity
} from 'lucide-react';
import useAdmissions from '../hooks/useAdmissions';
import useWards from '../hooks/useWards';

const BedManagement = () => {
  const { activeAdmissions, loading, fetchActiveAdmissions } = useAdmissions();
  const { wards: realWards, loading: wardsLoading, fetchWards } = useWards();
  const [selectedWard, setSelectedWard] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [_VIEW_MODE, _SET_VIEW_MODE] = useState('grid'); // 'grid' or 'list'
  const [selectedBed, setSelectedBed] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);

  // Auto-fetch admissions and wards on component mount and refresh every 30 seconds
  useEffect(() => {
    fetchActiveAdmissions();
    fetchWards();
    const interval = setInterval(() => {
      fetchActiveAdmissions();
      fetchWards();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchActiveAdmissions, fetchWards]);

  // Use real ward data from API, fallback to default configuration
  const wards = useMemo(() => {
    if (realWards && realWards.length > 0) {
      // Use real wards from API
      return realWards.map((ward, index) => ({
        id: ward.wardId,
        name: ward.wardName,
        type: ward.wardType?.toLowerCase() || 'general',
        total: 20, // Each ward has 20 beds
        color: ['blue', 'green', 'red', 'purple'][index % 4] // Cycle through colors
      }));
    }
    // Fallback to default ward configuration
    return [
      { id: 1, name: 'Ward 1 - General', type: 'general', total: 20, color: 'blue' },
      { id: 2, name: 'Ward 2 - General', type: 'general', total: 20, color: 'green' },
      { id: 3, name: 'Ward 3 - ICU', type: 'icu', total: 20, color: 'red' },
      { id: 4, name: 'Ward 4 - Dialysis', type: 'specialty', total: 20, color: 'purple' }
    ];
  }, [realWards]);



  // Get all beds with their current status - create beds from actual admissions data
  const allBeds = useMemo(() => {
    const beds = [];
    
    console.log('BedManagement - Processing admissions:', activeAdmissions?.length || 0);
    console.log('BedManagement - Available wards:', wards?.length || 0);
    
    // First, create occupied beds from real admissions data
    const occupiedBeds = new Set();
    if (activeAdmissions && Array.isArray(activeAdmissions)) {
      activeAdmissions.forEach(admission => {
        const ward = wards.find(w => w.id === admission.wardId);
        if (ward) {
          console.log(`Adding occupied bed: Ward ${admission.wardId} - Bed ${admission.bedNumber} - Patient ${admission.patientName}`);
          beds.push({
            bedNumber: admission.bedNumber,
            wardId: admission.wardId,
            ward: ward,
            status: 'occupied',
            patient: {
              name: admission.patientName,
              id: admission.patientNationalId,
              admissionDate: admission.admissionDate,
              admissionId: admission.admissionId,
              wardName: admission.wardName,
              realBedNumber: admission.bedNumber
            }
          });
          occupiedBeds.add(`${admission.wardId}-${admission.bedNumber}`);
        }
      });
    }
    
    // Then, create some available beds for each ward (for demo purposes)
    wards.forEach(ward => {
      // Add some available beds per ward
      const availableBedsCount = 15; // Show 15 available beds per ward
      for (let i = 1; i <= availableBedsCount; i++) {
        let bedNumber;
        
        // Generate bed number based on ward type
        switch (ward.type?.toLowerCase()) {
          case 'icu':
            bedNumber = `ICU-${i}`;
            break;
          case 'dialysis':
            bedNumber = String(i).padStart(3, '0');
            break;
          case 'general':
          default:
            bedNumber = `${ward.id}${String(i).padStart(2, '0')}`;
            break;
        }
        
        // Only add if not already occupied
        const bedExists = beds.some(b => b.wardId === ward.id && b.bedNumber === bedNumber);
        if (!bedExists) {
          beds.push({
            bedNumber: bedNumber,
            wardId: ward.id,
            ward: ward,
            status: 'available',
            patient: null
          });
        }
      }
    });
    
    console.log('BedManagement - Total beds created:', beds.length);
    console.log('BedManagement - Occupied beds:', beds.filter(b => b.status === 'occupied').length);
    console.log('BedManagement - Available beds:', beds.filter(b => b.status === 'available').length);
    
    return beds;
  }, [activeAdmissions, wards]);

  // Filter beds based on selected ward and search
  const filteredBeds = useMemo(() => {
    let filtered = allBeds;

    if (selectedWard !== 'all') {
      filtered = filtered.filter(bed => bed.ward.id === parseInt(selectedWard));
    }

    if (searchTerm) {
      filtered = filtered.filter(bed =>
        bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bed.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bed.patient?.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allBeds, selectedWard, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBeds = allBeds.length;
    const occupiedBeds = allBeds.filter(bed => bed.status === 'occupied').length;
    const availableBeds = totalBeds - occupiedBeds;
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    const wardStats = wards.map(ward => {
      const wardBeds = allBeds.filter(bed => bed.ward.id === ward.id);
      const wardOccupied = wardBeds.filter(bed => bed.status === 'occupied').length;
      const wardAvailable = ward.total - wardOccupied;

      return {
        ...ward,
        occupied: wardOccupied,
        available: wardAvailable,
        occupancyRate: Math.round((wardOccupied / ward.total) * 100)
      };
    });

    return {
      totalBeds,
      occupiedBeds,
      availableBeds,
      occupancyRate,
      wardStats
    };
  }, [allBeds, wards]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-500 border-red-600 text-white shadow-md'; // Bright red for occupied beds
      case 'available':
        return 'bg-green-500 border-green-600 text-white shadow-md'; // Bright green for available beds
      case 'cleaning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'maintenance':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getWardColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      red: 'bg-red-50 border-red-200',
      purple: 'bg-purple-50 border-purple-200'
    };
    return colors[color] || 'bg-gray-50 border-gray-200';
  };



  const handleBedClick = (bed) => {
    if (bed.status === 'occupied' && bed.patient) {
      setSelectedBed(bed);
      setShowPatientModal(true);
    }
  };

  const BedCard = ({ bed }) => (
    <div
      className={`relative p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-lg cursor-pointer ${getStatusColor(bed.status)}`}
      title={bed.status === 'occupied' ? 
        `Patient: ${bed.patient?.name} | Real Bed: ${bed.patient?.realBedNumber} | Ward: ${bed.patient?.wardName}` : 
        'Available Bed'}
      onClick={() => handleBedClick(bed)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Bed size={16} className="mr-1" />
          <span className="font-bold text-xs">{bed.bedNumber}</span>
        </div>
        {bed.status === 'occupied' && (
          <User size={14} className="text-white" />
        )}
      </div>

      {bed.status === 'occupied' && bed.patient ? (
        <div className="text-center">
          <div className="font-medium text-xs truncate text-white">{bed.patient.name}</div>
        </div>
      ) : (
        <div className="text-center text-xs font-medium text-white">
          Available
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bed className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-gray-900">Bed Management</h1>
              <p className="text-gray-600">Monitor bed allocation and patient distribution across all wards</p>
              {/* Debug info */}
              <p className="text-xs text-gray-400 mt-1">
                Active Admissions: {activeAdmissions?.length || 0} | 
                Wards: {wards?.length || 0} | 
                Occupied Beds: {allBeds?.filter(b => b.status === 'occupied').length || 0} |
                Last Updated: {new Date().toLocaleTimeString()}
              </p>
              {/* Show sample bed numbers for debugging */}
              {activeAdmissions && activeAdmissions.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Sample bed numbers: {activeAdmissions.slice(0, 3).map(a => `${a.wardName}:${a.bedNumber}`).join(', ')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              fetchActiveAdmissions();
              fetchWards();
            }}
            disabled={loading || wardsLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${(loading || wardsLoading) ? 'animate-spin' : ''}`} />
            Refresh Beds
          </button>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Beds</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalBeds}</p>
              </div>
              <Bed className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Occupied</p>
                <p className="text-2xl font-bold text-red-900">{stats.occupiedBeds}</p>
              </div>
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Available</p>
                <p className="text-2xl font-bold text-green-900">{stats.availableBeds}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Occupancy Rate</p>
                <p className="text-2xl font-bold text-purple-900">{stats.occupancyRate}%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Ward Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ward Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.wardStats.map(ward => (
            <div key={ward.id} className={`rounded-lg p-4 border-2 ${getWardColor(ward.color)}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 text-sm">{ward.name}</h3>
                <span className="text-xs px-2 py-1 bg-white rounded-full">{ward.type}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Occupied:</span>
                  <span className="font-bold text-red-600">{ward.occupied}/{ward.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Available:</span>
                  <span className="font-bold text-green-600">{ward.available}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rate:</span>
                  <span className="font-bold text-purple-600">{ward.occupancyRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Ward Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Ward</label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Wards</option>
              {wards.map(ward => (
                <option key={ward.id} value={ward.id}>{ward.name}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by bed number, patient name, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bed Grid */}
      {selectedWard === 'all' ? (
        // Show all wards
        <div className="space-y-6">
          {wards.map(ward => {
            const wardBeds = filteredBeds.filter(bed => bed.ward.id === ward.id);
            if (wardBeds.length === 0 && searchTerm) return null;

            return (
              <div key={ward.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${getWardColor(ward.color)}`}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{ward.name}</h3>
                      <p className="text-sm text-gray-600">
                        {stats.wardStats.find(w => w.id === ward.id)?.occupied || 0} occupied, {stats.wardStats.find(w => w.id === ward.id)?.available || 0} available
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
                  {wardBeds.map(bed => (
                    <BedCard key={bed.bedNumber} bed={bed} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Show selected ward
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${getWardColor(wards.find(w => w.id === parseInt(selectedWard))?.color)}`}>
                <MapPin className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {wards.find(w => w.id === parseInt(selectedWard))?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {stats.wardStats.find(w => w.id === parseInt(selectedWard))?.occupied || 0} occupied, {stats.wardStats.find(w => w.id === parseInt(selectedWard))?.available || 0} available
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {filteredBeds.map(bed => (
              <BedCard key={bed.bedNumber} bed={bed} />
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bed Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Occupied</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Cleaning</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded mr-2"></div>
            <span className="text-sm text-gray-700">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Patient Information Modal */}
      {showPatientModal && selectedBed && selectedBed.patient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
              <button
                onClick={() => setShowPatientModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Patient Details */}
            <div className="space-y-4">
              {/* Patient Name */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <label className="text-sm font-medium text-blue-800">Patient Name</label>
                <p className="text-lg font-semibold text-blue-900">{selectedBed.patient.name}</p>
              </div>

              {/* Patient ID */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-sm font-medium text-gray-600">National ID</label>
                <p className="font-mono text-gray-900">{selectedBed.patient.id}</p>
              </div>

              {/* Ward & Bed Information */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-green-800">Ward</label>
                  <p className="font-semibold text-green-900">{selectedBed.patient.wardName}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <label className="text-sm font-medium text-purple-800">Bed Number</label>
                  <p className="font-semibold text-purple-900">{selectedBed.patient.realBedNumber}</p>
                </div>
              </div>

              {/* Admission Date */}
              <div className="bg-orange-50 p-3 rounded-lg">
                <label className="text-sm font-medium text-orange-800">Admission Date & Time</label>
                <p className="text-orange-900">
                  {new Date(selectedBed.patient.admissionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {' '}
                  {new Date(selectedBed.patient.admissionDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Admission ID */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Admission ID</label>
                <p className="font-mono text-gray-900">#{selectedBed.patient.admissionId}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowPatientModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;