import React from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  icon: Icon,
  iconColor = 'blue',
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  primaryButtonColor = 'blue',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[300px] rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {Icon && (
                <div
                  className={`flex items-center justify-center w-10 h-10 mr-4 bg-${iconColor}-100 rounded-full`}
                >
                  <Icon className={`w-6 h-6 text-${iconColor}-500`} />
                </div>
              )}
              <div>
                <h4 className="font-bold">{title}</h4>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {message && <p className="mb-6 text-sm text-gray-600">{message}</p>}

          <div className="flex space-x-2">
            <button
              className={`flex-1 py-2 text-white bg-${primaryButtonColor}-500 rounded-md`}
              onClick={onPrimaryButtonClick}
            >
              {primaryButtonText}
            </button>
            {secondaryButtonText && (
              <button
                className="flex-1 py-2 text-gray-800 bg-gray-200 rounded-md"
                onClick={onSecondaryButtonClick}
              >
                {secondaryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
