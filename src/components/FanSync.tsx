'use client';

import React, { useState, useEffect } from 'react';

const FanSync = () => {
  const [synced, setSynced] = useState(false);
  const [pulseColor, setPulseColor] = useState('#22d3ee');

  useEffect(() => {
    if (synced) {
      const interval = setInterval(() => {
        setPulseColor(prev => prev === '#22d3ee' ? '#8b5cf6' : '#22d3ee');
        // Simulate haptic feedback if API available
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [synced]);

  return (
    <div style={{ padding: '0 20px', marginTop: '20px', marginBottom: '20px' }}>
      <div 
        onClick={() => setSynced(!synced)}
        style={{ 
          background: synced 
            ? `linear-gradient(135deg, ${pulseColor} 0%, #1e1b4b 100%)` 
            : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: `2px solid ${synced ? pulseColor : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '24px',
          padding: '24px',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: synced ? `0 0 30px ${pulseColor}44` : 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background glow for sync */}
        {synced && (
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: `radial-gradient(circle at center, ${pulseColor} 0%, transparent 70%)`,
            opacity: 0.2,
            animation: 'pulse 1s infinite'
          }} />
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            fontSize: '2rem', 
            marginBottom: '12px',
            animation: synced ? 'bounce 0.5s infinite alternate' : 'none'
          }}>
            {synced ? '✨' : '💫'}
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>
            {synced ? 'SYNCED TO STADIUM' : 'FAN SYNC'}
          </h3>
          <p style={{ fontSize: '0.8rem', color: synced ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: synced ? 700 : 400 }}>
            {synced 
              ? 'Your device is now part of the light show!' 
              : 'Join 14,204 fans in the coordinated light show'}
          </p>
          
          {synced && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite 0.1s' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite 0.2s' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite 0.3s' }} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse { 0% { opacity: 0.1; transform: scale(0.9); } 50% { opacity: 0.3; transform: scale(1.1); } 100% { opacity: 0.1; transform: scale(0.9); } }
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }
      `}</style>
    </div>
  );
};

export default FanSync;
