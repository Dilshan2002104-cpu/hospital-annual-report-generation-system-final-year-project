import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';

export default function LabReports() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Laboratory Reports</h2>
        <p className="text-sm text-gray-600 mt-1">Generate and download various reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Daily Lab Report', description: 'Summary of daily activities', icon: FileText },
          { title: 'Test Volume Report', description: 'Test statistics and trends', icon: Calendar },
          { title: 'Quality Control Report', description: 'QC metrics and compliance', icon: Download }
        ].map((report, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <report.icon className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
              Generate Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}