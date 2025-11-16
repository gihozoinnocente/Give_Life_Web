import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

let nextToastId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message, variant = 'info') => {
    const id = nextToastId++;
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => remove(id), 3500);
  }, [remove]);

  const api = useMemo(() => ({
    info: (msg) => push(msg, 'info'),
    success: (msg) => push(msg, 'success'),
    error: (msg) => push(msg, 'error'),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={
              `min-w-[260px] max-w-sm rounded-lg shadow-lg px-4 py-3 text-sm ` +
              (t.variant === 'success' ? 'bg-green-600 text-white' : '') +
              (t.variant === 'error' ? 'bg-red-600 text-white' : '') +
              (t.variant === 'info' ? 'bg-gray-900 text-white' : '')
            }
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}


