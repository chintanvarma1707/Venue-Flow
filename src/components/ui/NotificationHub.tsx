'use client';

import React from 'react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'alert' | 'success';
}

const NotificationHub = ({ notifications, onClose, onClear }: { 
  notifications: AppNotification[], 
  onClose: () => void,
  onClear: () => void 
}) => {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(10px)',
      display: 'flex', justifyContent: 'flex-end'
    }}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '380px', height: '100%',
          background: '#0f172a', borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex', flexDirection: 'column',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Notifications</h2>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>STADIUM LIVE UPDATES</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {notifications.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔔</div>
              <p style={{ fontSize: '0.9rem' }}>No new notifications</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: '20px', borderRadius: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  borderLeft: `4px solid ${n.type === 'alert' ? '#ef4444' : n.type === 'success' ? '#22c55e' : '#22d3ee'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{n.title}</span>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div style={{ padding: '24px' }}>
            <button 
              onClick={onClear}
              style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
            >
              CLEAR ALL
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default NotificationHub;
