import React from 'react';

const Alert = ({ type, title, message, onConfirm, onClose, showConfirm = false, confirmType = 'danger' }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: '#f0fdf4',
          borderColor: '#bbf7d0',
          iconColor: '#16a34a',
          icon: '✅'
        };
      case 'error':
        return {
          background: '#fef2f2',
          borderColor: '#fecaca',
          iconColor: '#dc2626',
          icon: '❌'
        };
      case 'warning':
        return {
          background: '#fffbeb',
          borderColor: '#fed7aa',
          iconColor: '#d97706',
          icon: '⚠️'
        };
      case 'danger':
        return {
          background: '#fef2f2',
          borderColor: '#fecaca',
          iconColor: '#dc2626',
          icon: '⚠️'
        };
      case 'confirm':
        return {
          background: '#eff6ff',
          borderColor: '#bfdbfe',
          iconColor: '#2563eb',
          icon: '❓'
        };
      default:
        return {
          background: '#ffffff',
          borderColor: '#e2e8f0',
          iconColor: '#6b7280',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className="alert-overlay">
      <div className="alert-modal" style={{ 
        background: styles.background,
        borderColor: styles.borderColor 
      }}>
        <div className="alert-icon" style={{ color: styles.iconColor }}>
          {styles.icon}
        </div>
        <div className="alert-content">
          <h3 className="alert-title">{title}</h3>
          <p className="alert-message">{message}</p>
        </div>
        <div className="alert-actions">
          {showConfirm ? (
            <>
              <button className="btn-cancel" onClick={onClose}>Cancel</button>
              <button className={`btn-confirm ${confirmType === 'success' ? 'btn-success' : ''}`} onClick={onConfirm}>Confirm</button>
            </>
          ) : (
            <button className="btn-ok" onClick={onClose}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;