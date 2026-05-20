import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification from '../components/Notification';
import ConfirmModal from '../components/ConfirmModal';

interface NotificationState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface AppContextType {
  showNotification: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  showConfirm: (options: Omit<ConfirmState, 'isOpen'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const [confirm, setConfirm] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showNotification = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ isOpen: true, title, message, type });
  };

  const showConfirm = (options: Omit<ConfirmState, 'isOpen'>) => {
    setConfirm({ ...options, isOpen: true });
  };

  const closeNotification = () => setNotification(prev => ({ ...prev, isOpen: false }));
  const closeConfirm = () => setConfirm(prev => ({ ...prev, isOpen: false }));

  return (
    <AppContext.Provider value={{ showNotification, showConfirm }}>
      {children}
      <Notification
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
      <ConfirmModal
        isOpen={confirm.isOpen}
        onClose={closeConfirm}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        message={confirm.message}
        confirmText={confirm.confirmText}
        cancelText={confirm.cancelText}
        type={confirm.type}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
