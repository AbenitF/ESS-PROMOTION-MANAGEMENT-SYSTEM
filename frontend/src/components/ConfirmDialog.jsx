/**
 * ConfirmDialog Component
 * Accessible modal for destructive action confirmations.
 */

import React, { useEffect } from 'react';

const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  // Trap escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15,23,42,0.5)',
          backdropFilter: 'blur(2px)',
        }}
        onClick={onCancel}
      />

      {/* Dialog */}
      <div style={{
        position: 'relative',
        background: '#fff',
        borderRadius: '0.75rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.18)',
        padding: '1.75rem',
        maxWidth: '420px',
        width: '100%',
        animation: 'dialog-in 0.2s ease',
      }}>
        {/* Icon */}
        <div style={{
          width: 52, height: 52,
          borderRadius: '50%',
          background: variant === 'danger' ? '#fee2e2' : '#fef3c7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 0 1rem',
          color: variant === 'danger' ? '#dc2626' : '#d97706',
        }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h2 id="confirm-title" style={{
          fontSize: '1.125rem', fontWeight: 700,
          color: 'var(--color-gray-800)', marginBottom: '0.5rem',
        }}>{title}</h2>

        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', lineHeight: 1.6 }}>
          {message}
        </p>

        <div style={{
          display: 'flex', justifyContent: 'flex-end',
          gap: '0.75rem', marginTop: '1.5rem',
        }}>
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-accent'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dialog-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
