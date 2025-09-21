import { useState, useCallback, useEffect } from 'react';

const useNotifications = () => {
  const [toasts, setToasts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [maxToasts] = useState(5);
  const [maxAlerts] = useState(3);

  // Toast Management
  const addToast = useCallback((type, title, message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type, // 'success', 'error', 'warning', 'info'
      title,
      message,
      autoClose: options.autoClose !== false,
      duration: options.duration || (type === 'error' ? 7000 : 5000),
      action: options.action, // { label: string, onClick: function }
      ...options
    };

    setToasts(prev => {
      const newToasts = [toast, ...prev];
      return newToasts.slice(0, maxToasts);
    });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Alert Management
  const addAlert = useCallback((alertData) => {
    const id = Date.now() + Math.random();
    const alert = {
      id,
      type: 'bed_capacity', // 'bed_capacity', 'patient_critical', 'staff_shortage', 'emergency', 'system'
      severity: 'medium', // 'low', 'medium', 'high', 'critical'
      priority: 3, // 1-5 scale
      title: '',
      message: '',
      count: 0,
      actionLabel: null,
      timestamp: new Date().toISOString(),
      ...alertData
    };

    setAlerts(prev => {
      // Check if alert of same type already exists
      const existingIndex = prev.findIndex(a => a.type === alert.type);

      if (existingIndex !== -1) {
        // Update existing alert
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...alert, id: updated[existingIndex].id };
        return updated;
      } else {
        // Add new alert
        const newAlerts = [alert, ...prev];
        return newAlerts.slice(0, maxAlerts);
      }
    });

    return id;
  }, [maxAlerts]);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Convenience methods for common notifications
  const success = useCallback((title, message, options) => {
    return addToast('success', title, message, options);
  }, [addToast]);

  const error = useCallback((title, message, options) => {
    return addToast('error', title, message, options);
  }, [addToast]);

  const warning = useCallback((title, message, options) => {
    return addToast('warning', title, message, options);
  }, [addToast]);

  const info = useCallback((title, message, options) => {
    return addToast('info', title, message, options);
  }, [addToast]);

  // Ward-specific notification methods
  const patientAdmitted = useCallback((patientName, wardName) => {
    return success(
      'Patient Admitted',
      `${patientName} has been successfully admitted to ${wardName}.`,
      {
        action: {
          label: 'View Patient',
          onClick: () => {
            // Will be provided by the component
          }
        }
      }
    );
  }, [success]);

  const patientDischarged = useCallback((patientName) => {
    return success(
      'Patient Discharged',
      `${patientName} has been successfully discharged.`,
      {
        duration: 4000
      }
    );
  }, [success]);

  const patientTransferred = useCallback((patientName, fromWard, toWard) => {
    return info(
      'Patient Transferred',
      `${patientName} has been transferred from ${fromWard} to ${toWard}.`,
      {
        action: {
          label: 'View Transfer',
          onClick: () => {
            // Will be provided by the component
          }
        }
      }
    );
  }, [info]);

  const admissionFailed = useCallback((patientName, reason) => {
    return error(
      'Admission Failed',
      `Failed to admit ${patientName}. ${reason}`,
      {
        duration: 8000,
        action: {
          label: 'Retry',
          onClick: () => {
            // Will be provided by the component
          }
        }
      }
    );
  }, [error]);

  const dischargeFailed = useCallback((patientName, reason) => {
    return error(
      'Discharge Failed',
      `Failed to discharge ${patientName}. ${reason}`,
      {
        duration: 8000
      }
    );
  }, [error]);

  const transferFailed = useCallback((patientName, reason) => {
    return error(
      'Transfer Failed',
      `Failed to transfer ${patientName}. ${reason}`,
      {
        duration: 8000
      }
    );
  }, [error]);

  // Alert-specific methods
  const capacityAlert = useCallback((wards) => {
    const criticalWards = wards.filter(w => w.available <= 1);
    const warningWards = wards.filter(w => w.available <= 3 && w.available > 1);

    if (criticalWards.length > 0) {
      return addAlert({
        type: 'bed_capacity',
        severity: 'critical',
        priority: 5,
        title: 'Critical Capacity Alert',
        message: `${criticalWards.length} ward${criticalWards.length !== 1 ? 's have' : ' has'} reached critical capacity.`,
        count: criticalWards.length,
        actionLabel: 'Manage Beds'
      });
    } else if (warningWards.length > 0) {
      return addAlert({
        type: 'bed_capacity',
        severity: 'high',
        priority: 4,
        title: 'Capacity Warning',
        message: `${warningWards.length} ward${warningWards.length !== 1 ? 's are' : ' is'} approaching full capacity.`,
        count: warningWards.length,
        actionLabel: 'View Status'
      });
    }
  }, [addAlert]);

  const staffAlert = useCallback((staffCount, requiredCount) => {
    const shortage = requiredCount - staffCount;

    if (shortage > 5) {
      return addAlert({
        type: 'staff_shortage',
        severity: 'critical',
        priority: 5,
        title: 'Critical Staff Shortage',
        message: `Severe understaffing detected. ${shortage} more staff members needed.`,
        count: shortage,
        actionLabel: 'Contact Admin'
      });
    } else if (shortage > 0) {
      return addAlert({
        type: 'staff_shortage',
        severity: 'high',
        priority: 4,
        title: 'Staff Shortage',
        message: `${shortage} additional staff member${shortage !== 1 ? 's' : ''} needed for optimal coverage.`,
        count: shortage,
        actionLabel: 'Manage Staff'
      });
    }
  }, [addAlert]);

  const emergencyAlert = useCallback((message, location) => {
    return addAlert({
      type: 'emergency',
      severity: 'critical',
      priority: 5,
      title: 'Emergency Alert',
      message: `${message} ${location ? `at ${location}` : ''}`,
      actionLabel: 'Respond'
    });
  }, [addAlert]);

  // Auto-cleanup expired alerts
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = new Date();
      setAlerts(prev => prev.filter(alert => {
        const alertTime = new Date(alert.timestamp);
        const timeDiff = now - alertTime;
        const maxAge = alert.severity === 'critical' ? 10 * 60 * 1000 : 5 * 60 * 1000; // 10min for critical, 5min for others
        return timeDiff < maxAge;
      }));
    }, 60000); // Check every minute

    return () => clearInterval(cleanup);
  }, []);

  return {
    // Toast state
    toasts,

    // Alert state
    alerts,

    // Toast methods
    addToast,
    removeToast,
    clearAllToasts,

    // Alert methods
    addAlert,
    removeAlert,
    clearAllAlerts,

    // Convenience methods
    success,
    error,
    warning,
    info,

    // Ward-specific methods
    patientAdmitted,
    patientDischarged,
    patientTransferred,
    admissionFailed,
    dischargeFailed,
    transferFailed,

    // Alert-specific methods
    capacityAlert,
    staffAlert,
    emergencyAlert
  };
};

export default useNotifications;