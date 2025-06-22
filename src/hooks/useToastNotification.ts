
import { useState } from 'react';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useToastNotification = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast,
  };
};
