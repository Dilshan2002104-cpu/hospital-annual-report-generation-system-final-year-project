import React from 'react';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

export default function LabAnalytics({ testOrders, samples, results, equipment, loading, stats }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Laboratory Analytics</h2>
        <p className="text-sm text-gray-600 mt-1">Performance metrics and data visualization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Test Volume Trend</h3>
          <p className="text-sm text-gray-600">+15% from last month</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Turnaround Time</h3>
          <p className="text-sm text-gray-600">Average: 2.4 hours</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <PieChart className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Test Distribution</h3>
          <p className="text-sm text-gray-600">By department</p>
        </div>
      </div>
    </div>
  );
}