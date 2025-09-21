import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  X,
  ChevronRight,
  Bed,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';

const InlineAlert = ({
  type = 'info', // 'success', 'error', 'warning', 'info'
  severity = 'medium', // 'low', 'medium', 'high', 'critical'
  title,
  message,
  actions = [],
  onDismiss,
  dismissible = true,
  icon: CustomIcon,
  details = [],
  persistent = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = () => {
    if (CustomIcon) return <CustomIcon className="w-5 h-5" />;

    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const base = 'border-l-4 rounded-r-lg';

    switch (type) {
      case 'success':
        return {
          container: `${base} bg-green-50 border-green-400 ${severity === 'critical' ? 'shadow-green-200 shadow-lg' : 'shadow-sm'}`,
          icon: 'text-green-500',
          title: 'text-green-800',
          message: 'text-green-700',
          accent: 'bg-green-100',
          button: 'bg-green-100 hover:bg-green-200 text-green-800 border-green-200'
        };
      case 'error':
        return {
          container: `${base} bg-red-50 border-red-400 ${severity === 'critical' ? 'shadow-red-200 shadow-lg animate-pulse' : 'shadow-sm'}`,
          icon: 'text-red-500',
          title: 'text-red-800',
          message: 'text-red-700',
          accent: 'bg-red-100',
          button: 'bg-red-100 hover:bg-red-200 text-red-800 border-red-200'
        };
      case 'warning':
        return {
          container: `${base} bg-amber-50 border-amber-400 ${severity === 'critical' ? 'shadow-amber-200 shadow-lg' : 'shadow-sm'}`,
          icon: 'text-amber-500',
          title: 'text-amber-800',
          message: 'text-amber-700',
          accent: 'bg-amber-100',
          button: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200'
        };
      case 'info':
      default:
        return {
          container: `${base} bg-blue-50 border-blue-400 ${severity === 'critical' ? 'shadow-blue-200 shadow-lg' : 'shadow-sm'}`,
          icon: 'text-blue-500',
          title: 'text-blue-800',
          message: 'text-blue-700',
          accent: 'bg-blue-100',
          button: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200'
        };
    }
  };

  const handleDismiss = () => {
    if (!dismissible) return;

    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  };

  const styles = getStyles();

  if (!isVisible && !persistent) return null;

  return (
    <div
      className={`
        ${styles.container} p-4 transition-all duration-300 ease-out
        ${isAnimating ? 'animate-in slide-in-from-top-2' : ''}
        ${!isVisible ? 'opacity-0 scale-95 transform' : 'opacity-100 scale-100'}
        ${className}
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Title */}
              {title && (
                <h4 className={`${styles.title} font-semibold text-sm leading-tight mb-1`}>
                  {title}
                  {severity === 'critical' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                      Critical
                    </span>
                  )}
                </h4>
              )}

              {/* Message */}
              <div className={`${styles.message} text-sm leading-relaxed`}>
                {message}
              </div>

              {/* Details */}
              {details.length > 0 && (
                <div className={`${styles.accent} rounded-lg p-3 mt-3`}>
                  <div className="space-y-2">
                    {details.map((detail, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {detail.icon && (
                            <detail.icon className="w-4 h-4 text-gray-500" />
                          )}
                          <span className={styles.title}>{detail.label}</span>
                        </div>
                        <span className={`font-medium ${styles.title}`}>
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.onClick();
                        if (action.dismissOnClick) handleDismiss();
                      }}
                      className={`
                        inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg
                        ${styles.button} border transition-colors duration-200
                        hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1
                      `}
                    >
                      {action.icon && <action.icon className="w-3 h-3 mr-1.5" />}
                      <span>{action.label}</span>
                      {action.showArrow && <ArrowRight className="w-3 h-3 ml-1.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dismiss Button */}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className={`
                  ml-3 flex-shrink-0 p-1.5 rounded-md transition-colors duration-200
                  text-gray-400 hover:text-gray-600 hover:bg-white/50
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500
                `}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Timestamp */}
          {!persistent && (
            <div className="flex items-center mt-2 text-xs opacity-75">
              <Clock className="w-3 h-3 mr-1" />
              <span>Now</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar for Critical Alerts */}
      {severity === 'critical' && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full ${
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-amber-500' :
              'bg-blue-500'
            } animate-pulse`}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
};

// Predefined Alert Components
export const CapacityAlert = ({ wards, onViewWards, onDismiss }) => (
  <InlineAlert
    type="warning"
    severity="high"
    title="Ward Capacity Alert"
    message={`${wards.length} ward${wards.length !== 1 ? 's' : ''} ${wards.length === 1 ? 'is' : 'are'} approaching full capacity`}
    icon={Bed}
    details={wards.map(ward => ({
      label: ward.name,
      value: `${ward.available} bed${ward.available !== 1 ? 's' : ''} remaining`,
      icon: Bed
    }))}
    actions={[
      {
        label: 'View Ward Status',
        onClick: onViewWards,
        icon: ArrowRight,
        showArrow: true
      }
    ]}
    onDismiss={onDismiss}
  />
);

export const StaffAlert = ({ staffCount, onManageStaff, onDismiss }) => (
  <InlineAlert
    type="error"
    severity="critical"
    title="Staff Shortage Alert"
    message={`Critical staff shortage detected. Only ${staffCount} staff members on duty.`}
    icon={Users}
    actions={[
      {
        label: 'Manage Staff',
        onClick: onManageStaff,
        icon: Users,
        dismissOnClick: true
      }
    ]}
    onDismiss={onDismiss}
    persistent={true}
  />
);

export const PatientAlert = ({ patients, onViewPatients, onDismiss }) => (
  <InlineAlert
    type="info"
    severity="medium"
    title="Patient Status Update"
    message={`${patients.length} patient${patients.length !== 1 ? 's' : ''} require immediate attention`}
    details={[
      {
        label: 'Critical patients',
        value: patients.filter(p => p.status === 'critical').length,
        icon: AlertTriangle
      },
      {
        label: 'Pending discharges',
        value: patients.filter(p => p.status === 'ready_discharge').length,
        icon: CheckCircle
      }
    ]}
    actions={[
      {
        label: 'Review Patients',
        onClick: onViewPatients,
        icon: Users,
        showArrow: true
      }
    ]}
    onDismiss={onDismiss}
  />
);

export default InlineAlert;