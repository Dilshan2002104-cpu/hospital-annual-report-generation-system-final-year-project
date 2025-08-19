import React, { useMemo, useState } from 'react';
import { Bed, Users, CheckCircle, Activity, Heart, Shield, Droplets, Stethoscope } from 'lucide-react';
import useWards from '../hooks/useWards';

const WardOverview = ({ wardStats = {}, showToast }) => {
  const { wards, loading, lastError } = useWards(showToast);
  const [selectedWardType, setSelectedWardType] = useState('All');

  const wardTypeConfig = {
    'General': {
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      badgeColor: 'bg-blue-100 text-blue-800',
      icon: Bed,
      description: 'General Medical Care'
    },
    'ICU': {
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-100 text-red-800',
      icon: Heart,
      description: 'Intensive Care Unit'
    },
    'Dialysis': {
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      badgeColor: 'bg-purple-100 text-purple-800',
      icon: Droplets,
      description: 'Dialysis Treatment'
    },
    'Emergency': {
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      badgeColor: 'bg-orange-100 text-orange-800',
      icon: Shield,
      description: 'Emergency Care'
    },
    'Surgery': {
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      badgeColor: 'bg-green-100 text-green-800',
      icon: Stethoscope,
      description: 'Surgical Ward'
    }
  };

  const processedWards = useMemo(() => {
    return wards.map(ward => ({
      id: ward.wardId,
      name: ward.wardName,
      type: ward.wardType,
      total: 20,
      occupied: Math.floor(Math.random() * 20),
      config: wardTypeConfig[ward.wardType] || wardTypeConfig['General']
    }));
  }, [wards]);

  const filteredWards = useMemo(() => {
    if (selectedWardType === 'All') return processedWards;
    return processedWards.filter(ward => ward.type === selectedWardType);
  }, [processedWards, selectedWardType]);

  const wardTypes = useMemo(() => {
    const types = [...new Set(processedWards.map(ward => ward.type))];
    return ['All', ...types];
  }, [processedWards]);

  const calculatedStats = useMemo(() => {
    const totalBeds = processedWards.reduce((sum, ward) => sum + ward.total, 0);
    const occupiedBeds = processedWards.reduce((sum, ward) => sum + ward.occupied, 0);
    const availableBeds = totalBeds - occupiedBeds;
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    return {
      totalBeds: wardStats.totalBeds || totalBeds,
      occupiedBeds: wardStats.occupiedBeds || occupiedBeds,
      availableBeds: wardStats.availableBeds || availableBeds,
      occupancyRate: wardStats.occupancyRate || occupancyRate,
      criticalPatients: wardStats.criticalPatients || Math.floor(occupiedBeds * 0.2),
      stablePatients: wardStats.stablePatients || Math.floor(occupiedBeds * 0.6),
      improvingPatients: wardStats.improvingPatients || Math.floor(occupiedBeds * 0.2),
    };
  }, [processedWards, wardStats]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (lastError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{lastError}</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Ward Type Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ward Types</h3>
        <div className="flex flex-wrap gap-3">
          {wardTypes.map((type) => {
            const config = wardTypeConfig[type];
            const IconComponent = config?.icon || Bed;
            const isSelected = selectedWardType === type;
            const wardCount = type === 'All' ? processedWards.length : processedWards.filter(w => w.type === type).length;
            
            return (
              <button
                key={type}
                onClick={() => setSelectedWardType(type)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? type === 'All' 
                      ? 'bg-gray-100 border-gray-300 text-gray-800'
                      : `${config.bgColor} ${config.borderColor} ${config.textColor}`
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {type !== 'All' && <IconComponent className="h-4 w-4" />}
                <span className="font-medium">{type}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  isSelected && type !== 'All' ? config.badgeColor : 'bg-gray-100 text-gray-600'
                }`}>
                  {wardCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Beds</p>
              <p className="text-2xl font-bold text-gray-900">{calculatedStats.totalBeds}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bed className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-gray-900">{calculatedStats.occupiedBeds}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{calculatedStats.availableBeds}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{calculatedStats.occupancyRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Ward Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ward Status</h3>
          {selectedWardType !== 'All' && (
            <span className="text-sm text-gray-500">
              Showing {filteredWards.length} {selectedWardType} ward{filteredWards.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWards.map((ward) => {
            const IconComponent = ward.config.icon;
            return (
              <div 
                key={ward.id} 
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${ward.config.bgColor} ${ward.config.borderColor}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${ward.config.badgeColor.replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{ward.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ward.config.badgeColor}`}>
                          {ward.type}
                        </span>
                        <span className="text-xs text-gray-500">{ward.config.description}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    ward.occupied / ward.total > 0.8 ? 'bg-red-100 text-red-800' :
                    ward.occupied / ward.total > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {Math.round((ward.occupied / ward.total) * 100)}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={ward.config.textColor}>Occupied: {ward.occupied}/{ward.total} beds</span>
                    <span className="text-gray-500">Available: {ward.total - ward.occupied}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        ward.occupied / ward.total > 0.8 ? 'bg-red-500' :
                        ward.occupied / ward.total > 0.6 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${(ward.occupied / ward.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Patient Status Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Status Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{calculatedStats.criticalPatients}</div>
            <div className="text-sm text-red-600">Critical</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{calculatedStats.stablePatients}</div>
            <div className="text-sm text-green-600">Stable</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{calculatedStats.improvingPatients}</div>
            <div className="text-sm text-blue-600">Improving</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardOverview;