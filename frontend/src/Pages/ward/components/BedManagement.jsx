import React, { useState, useMemo } from 'react';
import {
  Bed,
  User,
  Clock,
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

const BedManagement = () => {
  const { activeAdmissions, loading, fetchActiveAdmissions } = useAdmissions();
  const [selectedWard, setSelectedWard] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Ward configuration - each ward has 20 beds
  const wards = [
    { id: 1, name: 'Ward 1 - General', type: 'general', total: 20, color: 'blue' },
    { id: 2, name: 'Ward 2 - General', type: 'general', total: 20, color: 'green' },
    { id: 3, name: 'Ward 3 - ICU', type: 'icu', total: 20, color: 'red' },
    { id: 4, name: 'Ward 4 - Dialysis', type: 'specialty', total: 20, color: 'purple' }
  ];

  // Generate bed numbers for each ward (1-20)
  const generateBeds = (wardId, total = 20) => {
    return Array.from({ length: total }, (_, index) => ({
      bedNumber: `${wardId}${String(index + 1).padStart(2, '0')}`, // e.g., "101", "102", etc.
      wardId: wardId,
      position: index + 1
    }));
  };

  // Get all beds with their current status
  const allBeds = useMemo(() => {
    const beds = [];
    wards.forEach(ward => {
      const wardBeds = generateBeds(ward.id, ward.total);
      wardBeds.forEach(bed => {
        // Find if this bed is occupied
        const admission = activeAdmissions.find(adm =>
          adm.wardName?.includes(ward.name.split(' - ')[0]) &&
          adm.bedNumber === bed.bedNumber.slice(-2) // Match last 2 digits
        );

        beds.push({
          ...bed,
          ward: ward,
          status: admission ? 'occupied' : 'available',
          patient: admission ? {
            name: admission.patientName,
            id: admission.patientNationalId,
            admissionDate: admission.admissionDate,
            admissionId: admission.admissionId
          } : null
        });
      });
    });
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
        return 'bg-red-100 border-red-300 text-red-800';
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800';
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const BedCard = ({ bed }) => (
    <div
      className={`relative p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${getStatusColor(bed.status)}`}
      title={bed.status === 'occupied' ? `Patient: ${bed.patient?.name}` : 'Available'}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Bed size={16} className="mr-1" />
          <span className="font-bold text-sm">{bed.bedNumber}</span>
        </div>
        {bed.status === 'occupied' && (
          <User size={14} className="text-gray-600" />
        )}
      </div>

      {bed.status === 'occupied' && bed.patient ? (
        <div className="space-y-1">
          <div className="font-medium text-sm truncate">{bed.patient.name}</div>
          <div className="text-xs text-gray-600">ID: {bed.patient.id}</div>
          <div className="text-xs text-gray-500">
            <Clock size={10} className="inline mr-1" />
            {formatDate(bed.patient.admissionDate)}
          </div>
        </div>
      ) : (
        <div className="text-center text-sm font-medium text-green-700">
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
            </div>
          </div>
          <button
            onClick={fetchActiveAdmissions}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
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
    </div>
  );
};

export default BedManagement;