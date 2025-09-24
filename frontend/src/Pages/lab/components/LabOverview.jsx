import React from 'react';
import {
  TestTube,
  Clock,
  Activity,
  CheckCircle,
  AlertTriangle,
  Users,
  Database,
  TrendingUp,
  Microscope,
  FileText,
  ArrowRight
} from 'lucide-react';

export default function LabOverview({ stats, testOrders, samples, equipment, results, onTabChange }) {
  const quickActions = [
    {
      title: 'New Test Order',
      description: 'Create new laboratory test order',
      icon: TestTube,
      color: 'blue',
      action: () => onTabChange('test-orders'),
      count: stats.pendingTests
    },
    {
      title: 'Collect Sample',
      description: 'Process sample collection',
      icon: Activity,
      color: 'green',
      action: () => onTabChange('sample-collection'),
      count: stats.todayCollections
    },
    {
      title: 'Process Tests',
      description: 'Run laboratory tests',
      icon: Microscope,
      color: 'purple',
      action: () => onTabChange('test-processing'),
      count: stats.inProgressTests
    },
    {
      title: 'Review Results',
      description: 'Validate and approve results',
      icon: CheckCircle,
      color: 'emerald',
      action: () => onTabChange('results'),
      count: stats.pendingApproval
    }
  ];

  const recentActivities = [
    {
      type: 'test_completed',
      message: 'Blood Chemistry panel completed for Patient #12345',
      time: '2 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'urgent_test',
      message: 'URGENT: Cardiac enzyme test ordered for Patient #67890',
      time: '5 minutes ago',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      type: 'sample_collected',
      message: 'Urine sample collected for Patient #54321',
      time: '8 minutes ago',
      icon: TestTube,
      color: 'text-blue-600'
    },
    {
      type: 'equipment_maintenance',
      message: 'Hematology analyzer scheduled for maintenance',
      time: '15 minutes ago',
      icon: Database,
      color: 'text-orange-600'
    }
  ];

  const criticalAlerts = [
    ...(stats.urgentTests > 0 ? [{
      type: 'urgent_tests',
      title: `${stats.urgentTests} Urgent Tests`,
      message: 'Require immediate attention',
      action: () => onTabChange('test-orders'),
      color: 'red'
    }] : []),
    ...(stats.criticalResults > 0 ? [{
      type: 'critical_results',
      title: `${stats.criticalResults} Critical Results`,
      message: 'Need physician notification',
      action: () => onTabChange('results'),
      color: 'red'
    }] : []),
    ...(stats.offlineEquipment > 0 ? [{
      type: 'offline_equipment',
      title: `${stats.offlineEquipment} Equipment Offline`,
      message: 'Affecting test processing',
      action: () => onTabChange('equipment'),
      color: 'orange'
    }] : []),
    ...(stats.sampleRejectionRate > 10 ? [{
      type: 'high_rejection',
      title: 'High Sample Rejection Rate',
      message: `${stats.sampleRejectionRate}% of samples rejected today`,
      action: () => onTabChange('quality-control'),
      color: 'yellow'
    }] : [])
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
      red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Critical Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalAlerts.map((alert, index) => (
              <div
                key={index}
                className={`${getColorClasses(alert.color)} border-2 rounded-lg p-4 cursor-pointer transition-all duration-200`}
                onClick={alert.action}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{alert.title}</p>
                    <p className="text-xs opacity-80 mt-1">{alert.message}</p>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${getColorClasses(action.color)} border-2 rounded-xl p-6 text-left transition-all duration-200 hover:shadow-md relative`}
            >
              <div className="flex items-center justify-between mb-3">
                <action.icon size={24} />
                {action.count > 0 && (
                  <span className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {action.count}
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
              <p className="text-xs opacity-80">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Processing Pipeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Processing Pipeline</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Orders Received</span>
              </div>
              <span className="text-blue-600 font-bold">{stats.pendingTests + stats.inProgressTests + stats.completedTests}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TestTube className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Sample Collection</span>
              </div>
              <span className="text-yellow-600 font-bold">{stats.collectedSamples}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Microscope className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">In Progress</span>
              </div>
              <span className="text-purple-600 font-bold">{stats.inProgressTests}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Completed</span>
              </div>
              <span className="text-green-600 font-bold">{stats.completedTests}</span>
            </div>
          </div>
        </div>

        {/* Equipment Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Equipment</span>
              <span className="font-semibold text-gray-900">{stats.totalEquipment}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-green-600 text-sm flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Operational
                </span>
                <span className="text-green-600 font-semibold">{stats.operationalEquipment}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-orange-600 text-sm flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  Maintenance
                </span>
                <span className="text-orange-600 font-semibold">{stats.maintenanceEquipment}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-600 text-sm flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Offline
                </span>
                <span className="text-red-600 font-semibold">{stats.offlineEquipment}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Utilization Rate</span>
                <span className="font-semibold text-gray-900">{stats.equipmentUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.equipmentUtilization}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{stats.completionRate}%</h4>
          <p className="text-sm text-gray-600">Test Completion Rate</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{stats.todayResults}</h4>
          <p className="text-sm text-gray-600">Results Today</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4">
            <Database className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{stats.sampleRejectionRate}%</h4>
          <p className="text-sm text-gray-600">Sample Rejection Rate</p>
        </div>
      </div>
    </div>
  );
}