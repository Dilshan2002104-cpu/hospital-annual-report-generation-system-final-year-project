import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Bed,
  Users,
  Clock,
  X,
  ChevronRight,
  Shield,
  Heart,
  Activity
} from 'lucide-react';

const AlertBanner = ({
  alerts = [],
  onDismiss,
  onAction,
  position = 'bottom-right' // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
}) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    const filteredAlerts = alerts.filter(alert =>
      !dismissedAlerts.has(alert.id) && alert.priority >= 3 // Only show high priority alerts
    );
    setVisibleAlerts(filteredAlerts);
  }, [alerts, dismissedAlerts]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  const getAlertStyles = (alert) => {
    switch (alert.severity) {
      case 'critical':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          icon: 'text-white',
          button: 'bg-red-600 hover:bg-red-700',
          pulse: 'animate-pulse'
        };
      case 'high':
        return {
          bg: 'bg-orange-500',
          text: 'text-white',
          icon: 'text-white',
          button: 'bg-orange-600 hover:bg-orange-700',
          pulse: ''
        };
      case 'medium':
        return {
          bg: 'bg-amber-500',
          text: 'text-white',
          icon: 'text-white',
          button: 'bg-amber-600 hover:bg-amber-700',
          pulse: ''
        };
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          icon: 'text-white',
          button: 'bg-blue-600 hover:bg-blue-700',
          pulse: ''
        };
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'bed_capacity':
        return <Bed className="w-5 h-5" />;
      case 'patient_critical':
        return <Heart className="w-5 h-5" />;
      case 'staff_shortage':
        return <Users className="w-5 h-5" />;
      case 'emergency':
        return <Shield className="w-5 h-5" />;
      case 'system':
        return <Activity className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  const handleAction = (alert) => {
    if (onAction) {
      onAction(alert);
    }
    handleDismiss(alert.id);
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className={`fixed ${getPositionClasses()} z-50 space-y-3 max-w-sm w-full`}>
      {visibleAlerts.slice(0, 3).map((alert) => {
        const styles = getAlertStyles(alert);

        return (
          <div
            key={alert.id}
            className={`
              ${styles.bg} ${styles.text} p-4 rounded-xl shadow-xl backdrop-blur-sm
              transform transition-all duration-500 ease-out
              ${styles.pulse}
              animate-in slide-in-from-bottom-2
              border border-white/20
            `}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
                {getAlertIcon(alert.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm leading-tight mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-xs opacity-90 leading-relaxed">
                      {alert.message}
                    </p>

                    {/* Metadata */}
                    {alert.count && (
                      <div className="flex items-center mt-2 text-xs opacity-80">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{alert.count} items affected</span>
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="ml-2 p-1 rounded-md hover:bg-white/20 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Action Button */}
                {alert.actionLabel && (
                  <button
                    onClick={() => handleAction(alert)}
                    className={`
                      inline-flex items-center mt-3 px-3 py-1.5 text-xs font-medium rounded-lg
                      ${styles.button} transition-colors duration-200
                      shadow-sm
                    `}
                  >
                    <span>{alert.actionLabel}</span>
                    <ChevronRight size={12} className="ml-1" />
                  </button>
                )}
              </div>
            </div>

            {/* Priority Indicator */}
            <div className="absolute top-2 right-2">
              <div className={`
                w-2 h-2 rounded-full
                ${alert.severity === 'critical' ? 'bg-red-200 animate-ping' :
                  alert.severity === 'high' ? 'bg-orange-200' :
                  alert.severity === 'medium' ? 'bg-amber-200' :
                  'bg-blue-200'
                }
              `} />
            </div>
          </div>
        );
      })}

      {/* Show More Indicator */}
      {visibleAlerts.length > 3 && (
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
          <div className="text-xs text-center opacity-75">
            +{visibleAlerts.length - 3} more alerts
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertBanner;