import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { toastStore } from '../../store/toastStore';

export default function GlobalToast() {
  const [toasts, setToasts] = useState(() => toastStore.getToasts());

  useEffect(() => {
    return toastStore.subscribe((newToasts) => {
      setToasts(newToasts);
    });
  }, []);

  const handleRemove = (id) => {
    toastStore.removeToast(id);
  };

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '52px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        maxWidth: '420px',
        width: 'auto'
      }}
    >
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const isWarn = t.type === 'warn' || t.type === 'warning';

        const icon = isSuccess ? (
          <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
        ) : isError ? (
          <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
        ) : isWarn ? (
          <AlertTriangle size={18} style={{ color: '#F59E0B', flexShrink: 0 }} />
        ) : (
          <Info size={18} style={{ color: '#3B82F6', flexShrink: 0 }} />
        );

        const borderColor = isSuccess
          ? 'rgba(16, 185, 129, 0.3)'
          : isError
          ? 'rgba(239, 68, 68, 0.3)'
          : isWarn
          ? 'rgba(245, 158, 11, 0.3)'
          : 'rgba(59, 130, 246, 0.3)';

        return (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#0F172A',
              color: '#F8FAFC',
              borderRadius: '9px',
              border: `1px solid ${borderColor}`,
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35), 0 2px 6px rgba(0, 0, 0, 0.15)',
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: 1.4,
              animation: 'toastSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {icon}
              <span>{t.message}</span>
            </div>

            <button
              onClick={() => handleRemove(t.id)}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                flexShrink: 0
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
