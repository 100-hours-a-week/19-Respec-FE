import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({
  type = 'success',
  message,
  isVisible = false,
  onClose,
  duration = 1000,
  position = 'top-center',
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);

    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => onClose && onClose(), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  const getToastStyles = () => {
    const baseStyles =
      'fixed z-50 flex items-center justify-between p-4 text-sm rounded-lg shadow-lg min-w-80 max-w-md transition-all duration-300 ease-in-out';

    const positionStyles = {
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };

    const typeStyles = {
      success: 'bg-green-100 border border-green-400 text-green-700',
      error: 'bg-red-100 border border-red-400 text-red-700',
      info: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
    };

    const visibilityStyles = show
      ? 'opacity-100 translate-y-0 scale-100'
      : 'opacity-0 -translate-y-2 scale-95 pointer-events-none';

    return `${baseStyles} ${positionStyles[position]} ${typeStyles[type]} ${visibilityStyles}`;
  };

  const getIcon = () => {
    if (type === 'success') {
      return (
        <div className="flex-shrink-0 mr-3">
          <CheckCircle size={20} className="text-green-500" />
        </div>
      );
    } else if (type === 'error') {
      return (
        <div className="flex-shrink-0 mr-3">
          <XCircle size={20} className="text-red-500" />
        </div>
      );
    } else if (type === 'info') {
      return (
        <div className="flex-shrink-0 mr-3">
          <Info size={20} className="text-yellow-500" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <span className="flex-1 font-medium">{message}</span>
      <button
        onClick={handleClose}
        className="flex-shrink-0 ml-3 text-gray-400 transition-colors duration-200 hover:text-gray-600"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
