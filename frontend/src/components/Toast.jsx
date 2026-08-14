import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toasts, removeToast } = useAuth();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info;

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <Icon size={18} />
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: 'auto', display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
