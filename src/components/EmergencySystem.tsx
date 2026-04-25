'use client';

import React, { useState, useEffect } from 'react';

const EmergencySystem = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<'select' | 'reporting' | 'tracking'>('select');
  const [incidentType, setIncidentType] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(120); // 2 mins to arrival

  const incidentTypes = [
    { id: 'medical', label: 'Medical Aid', icon: '🚑', color: '#ef4444' },
    { id: 'security', label: 'Security', icon: '👮', color: '#3b82f6' },
    { id: 'lost', label: 'Lost Person', icon: '🔍', color: '#fbbf24' },
    { id: 'hazard', label: 'Fire/Hazard', icon: '🔥', color: '#f97316' },
  ];

  const handleReport = (type: string) => {
    setIncidentType(type);
    setStep('reporting');
    setTimeout(() => {
      setStep('tracking');
    }, 2000);
  };

  useEffect(() => {
    if (step === 'tracking' && countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '400px',
        background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{ background: '#ef4444', padding: '24px', textAlign: 'center', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🚨</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>EMERGENCY SOS</h2>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>PRIORITY 1 DISPATCH SYSTEM</p>
        </div>

        <div style={{ padding: '24px' }}>
          {step === 'select' && (
            <div className="slide-up">
              <p style={{ textAlign: 'center', marginBottom: '24px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>What kind of assistance do you need?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {incidentTypes.map(item => (
                  <button key={item.id} onClick={() => handleReport(item.label)}
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}33`, padding: '20px', borderRadius: '24px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'reporting' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="pulse" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%' }} />
              </div>
              <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>REPORTING INCIDENT</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Transmitting GPS coordinates and user data...</p>
            </div>
          )}

          {step === 'tracking' && (
            <div className="slide-up" style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', padding: '16px', borderRadius: '20px', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Incident Confirmed</div>
                <div style={{ fontWeight: 900, color: '#fff' }}>Help is on the way</div>
              </div>

              <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '4px' }}>
                {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </div>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>Estimated Time of Arrival</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👮</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Team Delta-4</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>Dispatched from Gate 6</div>
                  </div>
                </div>
                <button style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>ADD PHOTOS/NOTES</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.5; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.5; } }
        .pulse { animation: pulse 1.5s infinite; }
        .slide-up { animation: slideUp 0.4s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default EmergencySystem;
