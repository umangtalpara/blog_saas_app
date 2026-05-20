import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Modal from './Modal';

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ isOpen, onClose, title, message, type }) => {
  const icons = {
    success: <CheckCircle className="text-green-500" size={48} />,
    error: <XCircle className="text-red-500" size={48} />,
    info: <AlertCircle className="text-blue-500" size={48} />,
  };

  const colors = {
    success: 'bg-green-50 text-green-700 border-green-100',
    error: 'bg-red-50 text-red-700 border-red-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        {icons[type]}
        <div className={`p-4 rounded-xl border w-full ${colors[type]}`}>
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95"
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default Notification;
