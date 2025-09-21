import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X, ExternalLink } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.autoClose !== false && !isExiting) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast, isExiting]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500 flex-shrink-0" />;
      case 'error':
        return <XCircle size={20} className="text-red-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-500 flex-shrink-0" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 shadow-green-100';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 shadow-red-100';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800 shadow-amber-100';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100';
    }
  };

  const getProgressBarColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div
      className={`
        flex items-start space-x-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm
        transform transition-all duration-300 ease-out
        ${getStyles()}
        ${isVisible && !isExiting
          ? 'translate-x-0 opacity-100 scale-100'
          : isExiting
            ? 'translate-x-full opacity-0 scale-95'
            : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      {/* Icon */}
      {getIcon()}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold text-sm mb-1 leading-tight">
            {toast.title}
          </div>
        )}
        <div className="text-sm leading-relaxed">
          {toast.message}
        </div>

        {/* Action Button */}
        {toast.action && (
          <button
            onClick={() => {
              toast.action.onClick();
              handleClose();
            }}
            className={`
              inline-flex items-center mt-2 px-3 py-1.5 text-xs font-medium rounded-lg
              transition-colors duration-200
              ${toast.type === 'success' ? 'bg-green-100 hover:bg-green-200 text-green-700' :
                toast.type === 'error' ? 'bg-red-100 hover:bg-red-200 text-red-700' :
                toast.type === 'warning' ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' :
                'bg-blue-100 hover:bg-blue-200 text-blue-700'
              }
            `}
          >
            <span>{toast.action.label}</span>
            <ExternalLink size={12} className="ml-1" />
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-md hover:bg-white/50"
      >
        <X size={16} />
      </button>

      {/* Progress Bar */}
      {toast.autoClose !== false && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-xl overflow-hidden">
          <div
            className={`h-full ${getProgressBarColor()} transition-all duration-300 ease-linear`}
            style={{
              animation: `shrink ${toast.duration || 5000}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full pointer-events-none">
        <div className="space-y-3 pointer-events-auto">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={onClose} />
          ))}
        </div>
      </div>
    </>
  );
};

export { Toast, ToastContainer };