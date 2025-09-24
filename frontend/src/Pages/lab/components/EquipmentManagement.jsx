import React from 'react';
import { Database, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

export default function EquipmentManagement({ equipment, loading, onUpdateEquipment, onScheduleMaintenance, stats }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading equipment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Equipment Management</h2>
        <p className="text-sm text-gray-600 mt-1">Monitor and maintain laboratory equipment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Equipment</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEquipment}</p>
            </div>
            <Database className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Operational</p>
              <p className="text-2xl font-bold text-green-600">{stats.operationalEquipment}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-orange-600">{stats.maintenanceEquipment}</p>
            </div>
            <Settings className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-red-600">{stats.offlineEquipment}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((eq, index) => (
          <div key={eq.equipmentId || index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Database className="w-8 h-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{eq.name}</h3>
                  <p className="text-sm text-gray-600">{eq.type}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                eq.status === 'operational' ? 'bg-green-500' :
                eq.status === 'maintenance' ? 'bg-orange-500' :
                'bg-red-500'
              }`}></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{eq.status?.charAt(0).toUpperCase() + eq.status?.slice(1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Maintenance:</span>
                <span>{eq.lastMaintenance ? new Date(eq.lastMaintenance).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}