import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  X,
  Loader2
} from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'danger', 'warning', 'info', 'success'
  loading = false,
  patient = null,
  details = null
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          header: 'bg-gradient-to-r from-red-50 to-red-100',
          border: 'border-red-200',
          confirmButton: 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
          header: 'bg-gradient-to-r from-amber-50 to-amber-100',
          border: 'border-amber-200',
          confirmButton: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 text-white',
          iconBg: 'bg-amber-100'
        };
      case 'info':
        return {
          icon: <Info className="w-6 h-6 text-blue-500" />,
          header: 'bg-gradient-to-r from-blue-50 to-blue-100',
          border: 'border-blue-200',
          confirmButton: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white',
          iconBg: 'bg-blue-100'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-500" />,
          header: 'bg-gradient-to-r from-green-50 to-green-100',
          border: 'border-green-200',
          confirmButton: 'bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white',
          iconBg: 'bg-green-100'
        };
      default:
        return {
          icon: <Info className="w-6 h-6 text-blue-500" />,
          header: 'bg-gradient-to-r from-blue-50 to-blue-100',
          border: 'border-blue-200',
          confirmButton: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white',
          iconBg: 'bg-blue-100'
        };
    }
  };

  const styles = getStyles();

  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm();
  };

  const handleCancel = () => {
    if (loading) return;
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl w-full max-w-md border-2 ${styles.border}
          transform transition-all duration-300 ease-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Header */}
        <div className={`${styles.header} p-6 rounded-t-2xl border-b border-gray-100`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${styles.iconBg}`}>
                {styles.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {title}
                </h3>
                {patient && (
                  <p className="text-sm text-gray-600 mt-1">
                    Patient: {patient.patientName || patient.name}
                  </p>
                )}
              </div>
            </div>

            {!loading && (
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-gray-700 text-sm leading-relaxed mb-4">
            {message}
          </div>

          {/* Additional Details */}
          {details && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                {details.map((detail, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{detail.label}:</span>
                    <span className="font-medium text-gray-900">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient Information */}
          {patient && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Patient Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Name:</span>
                  <span className="font-medium text-blue-900">{patient.patientName}</span>
                </div>
                {patient.bedNumber && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Bed:</span>
                    <span className="font-medium text-blue-900">{patient.bedNumber}</span>
                  </div>
                )}
                {patient.wardName && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Ward:</span>
                    <span className="font-medium text-blue-900">{patient.wardName}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 pt-0">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`
              flex-1 flex items-center justify-center ${styles.confirmButton}
              py-3 px-4 rounded-xl font-medium transition-all duration-200
              shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transform hover:scale-[1.02] active:scale-[0.98]
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="
              flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium
              transition-all duration-200 border border-gray-200 hover:border-gray-300
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transform hover:scale-[1.02] active:scale-[0.98]
            "
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;