import React from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Users,
  Bed,
  Heart,
  Activity
} from 'lucide-react';
import InlineAlert, { CapacityAlert, StaffAlert, PatientAlert } from './notifications/InlineAlert';
import useNotifications from '../hooks/useNotifications';

const NotificationDemo = () => {
  const notifications = useNotifications();

  const demoToasts = () => {
    // Success notification
    notifications.success(
      'Patient Admitted Successfully',
      'John Doe has been admitted to Ward 1 - General.',
      {
        action: {
          label: 'View Patient',
          onClick: () => console.log('Navigate to patient details')
        }
      }
    );

    // Error notification
    setTimeout(() => {
      notifications.error(
        'Admission Failed',
        'Failed to admit patient due to insufficient permissions.',
        {
          duration: 8000
        }
      );
    }, 1000);

    // Warning notification
    setTimeout(() => {
      notifications.warning(
        'Bed Capacity Warning',
        'Ward 2 - ICU is approaching full capacity.',
        {
          action: {
            label: 'Manage Beds',
            onClick: () => console.log('Navigate to bed management')
          }
        }
      );
    }, 2000);

    // Info notification
    setTimeout(() => {
      notifications.info(
        'System Maintenance',
        'Scheduled maintenance will occur tonight from 11 PM to 1 AM.',
        {
          duration: 10000
        }
      );
    }, 3000);
  };

  const demoAlerts = () => {
    // Capacity alert
    notifications.capacityAlert([
      { name: 'Ward 1 - General', available: 1 },
      { name: 'Ward 2 - ICU', available: 0 }
    ]);

    // Staff alert
    setTimeout(() => {
      notifications.staffAlert(5, 12); // 5 current, 12 required
    }, 1000);

    // Emergency alert
    setTimeout(() => {
      notifications.emergencyAlert('Code Blue - Cardiac Arrest', 'Ward 3 - Room 302');
    }, 2000);
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Modern Notification System Demo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Toast Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Toast Notifications
            </h3>
            <p className="text-gray-600 text-sm">
              Modern toast notifications with auto-dismiss, animations, and action buttons.
            </p>

            <button
              onClick={demoToasts}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Demo Toast Notifications
            </button>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">Features:</div>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Auto-dismiss with progress bar</li>
                <li>Color-coded by type (success, error, warning, info)</li>
                <li>Action buttons for immediate actions</li>
                <li>Smooth slide-in animations</li>
                <li>Stacking support (max 5 toasts)</li>
              </ul>
            </div>
          </div>

          {/* Alert Banners */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Alert Banners
            </h3>
            <p className="text-gray-600 text-sm">
              Critical alerts that persist until resolved, with priority-based display.
            </p>

            <button
              onClick={demoAlerts}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Demo Alert Banners
            </button>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">Features:</div>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Priority-based display order</li>
                <li>Persistent until dismissed</li>
                <li>Action buttons for immediate resolution</li>
                <li>Multiple alert types (capacity, staff, emergency)</li>
                <li>Automatic cleanup of expired alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Alert Examples */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Inline Alert Examples</h3>

        {/* Capacity Alert Example */}
        <CapacityAlert
          wards={[
            { name: 'Ward 1 - General', available: 2 },
            { name: 'Ward 2 - ICU', available: 1 }
          ]}
          onViewWards={() => console.log('Navigate to ward management')}
          onDismiss={() => console.log('Capacity alert dismissed')}
        />

        {/* Staff Alert Example */}
        <StaffAlert
          staffCount={5}
          onManageStaff={() => console.log('Navigate to staff management')}
          onDismiss={() => console.log('Staff alert dismissed')}
        />

        {/* Patient Alert Example */}
        <PatientAlert
          patients={[
            { status: 'critical', name: 'John Doe' },
            { status: 'critical', name: 'Jane Smith' },
            { status: 'ready_discharge', name: 'Bob Johnson' }
          ]}
          onViewPatients={() => console.log('Navigate to patient list')}
          onDismiss={() => console.log('Patient alert dismissed')}
        />

        {/* Custom Inline Alerts */}
        <InlineAlert
          type="success"
          severity="medium"
          title="System Update Complete"
          message="All ward management systems have been successfully updated to version 2.1.0"
          details={[
            { label: 'Updated modules', value: '5', icon: Activity },
            { label: 'Time taken', value: '2 minutes', icon: Activity }
          ]}
          actions={[
            {
              label: 'View Changes',
              onClick: () => console.log('View update log'),
              icon: Info,
              showArrow: true
            }
          ]}
        />

        <InlineAlert
          type="error"
          severity="critical"
          title="Critical System Error"
          message="Database connection lost. Patient data may not be up to date."
          persistent={true}
          actions={[
            {
              label: 'Retry Connection',
              onClick: () => console.log('Retry database connection'),
              icon: Activity
            },
            {
              label: 'Contact IT Support',
              onClick: () => console.log('Contact support'),
              icon: Users
            }
          ]}
        />

        <InlineAlert
          type="warning"
          severity="high"
          title="Scheduled Maintenance"
          message="System maintenance is scheduled for tonight. Some features may be unavailable."
          icon={AlertTriangle}
          details={[
            { label: 'Start time', value: '11:00 PM', icon: Activity },
            { label: 'Duration', value: '2 hours', icon: Activity },
            { label: 'Affected systems', value: 'Reports, Analytics', icon: Activity }
          ]}
          actions={[
            {
              label: 'Learn More',
              onClick: () => console.log('Show maintenance details'),
              showArrow: true
            }
          ]}
        />
      </div>

      {/* API Usage Examples */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          API Usage Examples
        </h3>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Toast Notifications</h4>
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`// Using the notification hook
const notifications = useNotifications();

// Success notification with action
notifications.patientAdmitted('John Doe', 'Ward 1 - General');

// Error notification
notifications.admissionFailed('John Doe', 'Bed already occupied');

// Custom toast
notifications.success('Title', 'Message', {
  action: {
    label: 'View Details',
    onClick: () => navigate('/details')
  },
  duration: 6000
});`}
            </pre>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Alert Banners</h4>
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`// Capacity alerts
notifications.capacityAlert([
  { name: 'Ward 1', available: 1 },
  { name: 'Ward 2', available: 0 }
]);

// Staff shortage alerts
notifications.staffAlert(5, 12); // current: 5, required: 12

// Emergency alerts
notifications.emergencyAlert('Code Blue', 'Ward 3 - Room 302');`}
            </pre>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Modern Confirm Dialog</h4>
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`// Replace window.confirm() with modern dialog
showConfirmDialog(
  'warning',
  'Confirm Patient Discharge',
  'Are you sure you want to discharge this patient?',
  async () => {
    // Confirmation action
    await dischargePatient(patientId);
    notifications.patientDischarged(patientName);
  },
  patientData // Optional patient context
);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;