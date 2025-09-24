import React from 'react';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function QualityControl({ results, testOrders, samples, loading, stats }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quality control data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Quality Control</h2>
        <p className="text-sm text-gray-600 mt-1">Monitor and ensure test quality standards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Quality Score</h3>
          <p className="text-3xl font-bold text-green-600">98.5%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Flagged Results</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.criticalResults}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">Improvement</h3>
          <p className="text-3xl font-bold text-blue-600">+2.1%</p>
        </div>
      </div>
    </div>
  );
}