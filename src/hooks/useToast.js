import { useCallback, useState } from 'react';

export default function useToast () {
    const [toasts, setToasts] = useState([]);
  
    const showToast = useCallback((message, type = 'success', options = {}) => {
        const isDuplicate = toasts.some(
            toast => toast.message === message && toast.type === type && toast.isVisible
        );
        if (isDuplicate) return null;
        
        const id = Date.now() + Math.random();
        setToasts(prev => [
            ...prev,
            { id, message, type, isVisible: true, ...options }
        ]);
        return id;
    }, [toasts]);
  
    const removeToast = useCallback((id) => {
        setToasts(prev =>
            prev.map(toast =>
              toast.id === id ? { ...toast, isVisible: false } : toast
            )
          );

          setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
          }, 300);
    }, []);
  
    const showSuccess = (message, options) => showToast(message, 'success', options);
    const showError = (message, options) => showToast(message, 'error', options);
  
    return { toasts, showToast, removeToast, showSuccess, showError };
  };
