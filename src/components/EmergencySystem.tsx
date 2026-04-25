'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, ShieldAlert, Stethoscope, Flame, Search, X, Radio, Navigation, Camera, CheckCircle2 
} from 'lucide-react';

const EmergencySystem = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<'select' | 'reporting' | 'tracking'>('select');
  const [incidentType, setIncidentType] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(120);

  const incidentTypes = [
    { id: 'medical', label: 'Medical', icon: <Stethoscope size={24} />, color: '#ef4444' },
    { id: 'security', label: 'Security', icon: <ShieldAlert size={24} />, color: '#3b82f6' },
    { id: 'lost', label: 'Person', icon: <Search size={24} />, color: '#fbbf24' },
    { id: 'hazard', label: 'Hazard', icon: <Flame size={24} />, color: '#f97316' },
  ];

  const handleReport = (type: string) => {
    setIncidentType(type);
    setStep('reporting');
    setTimeout(() => setStep('tracking'), 2500);
  };

  useEffect(() => {
    if (step === 'tracking' && countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 3000, 
        background: 'rgba(2, 6, 23, 0.95)', 
        backdropFilter: 'blur(32px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px' 
      }}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 30 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ 
          width: '100%', 
          maxWidth: '380px', 
          background: '#0a0a0a', 
          border: '1px solid rgba(239, 68, 68, 0.3)', 
          borderRadius: '32px', 
          overflow: 'hidden', 
          boxShadow: '0 40px 100px -12px rgba(239, 68, 68, 0.25)' 
        }}
      >
        <div style={{ background: '#ef4444', padding: 'clamp(32px, 8vw, 40px) 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <motion.div 
            animate={{ opacity: [0.1, 0.2, 0.1] }} 
            transition={{ duration: 1.5, repeat: Infinity }} 
            style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, white 0%, transparent 80%)' }} 
          />
          <motion.button 
            whileTap={{ scale: 0.9 }} 
            onClick={onClose} 
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} strokeWidth={3} />
          </motion.button>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ duration: 1, repeat: Infinity }} 
            style={{ display: 'inline-flex', marginBottom: '10px', position: 'relative', zIndex: 1 }}
          >
            <AlertCircle size={36} strokeWidth={3} />
          </motion.div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 950, color: 'white', margin: 0, letterSpacing: '-0.04em', position: 'relative', zIndex: 1 }}>SYSTEM_SOS</h2>
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.85)', fontWeight: 900, marginTop: '2px', letterSpacing: '0.15em', position: 'relative', zIndex: 1 }}>PRIORITY_DATALINK</p>
        </div>

        <div style={{ padding: '24px' }}>
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <motion.div key="select" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}>
                <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.02em' }}>SELECT_INCIDENT_VECTOR</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {incidentTypes.map(item => (
                    <motion.button 
                      key={item.id} onClick={() => handleReport(item.label)} whileTap={{ scale: 0.96 }}
                      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${item.color}33`, padding: '16px 10px', borderRadius: '24px', cursor: 'pointer', color: item.color, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                    >
                      {item.icon}
                      <div style={{ fontSize: '0.75rem', fontWeight: 950 }}>{item.label.toUpperCase()}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'reporting' && (
              <motion.div key="reporting" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
                  <motion.div animate={{ scale: [1, 2], opacity: [0.3, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ position: 'absolute', inset: 0, border: '2px solid #ef4444', borderRadius: '50%' }} />
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Radio className="pulse" color="#ef4444" size={28} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 950, marginBottom: '8px', color: '#fff' }}>UPLOADING_INTEL...</h3>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, lineHeight: 1.5 }}>Transmitting GPS coordinates and biometric telemetry to neural network.</p>
              </motion.div>
            )}

            {step === 'tracking' && (
              <motion.div key="tracking" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center' }}>
                <div style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid #22c55e44', padding: '14px', borderRadius: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                  <div style={{ background: '#22c55e', borderRadius: '50%', padding: '4px' }}>
                    <CheckCircle2 color="#000" size={16} strokeWidth={3} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.55rem', color: '#22c55e', fontWeight: 950, letterSpacing: '0.05em' }}>SOS_ACKNOWLEDGED</div>
                    <div style={{ fontWeight: 950, color: '#fff', fontSize: '0.9rem' }}>Response Team Deployed</div>
                  </div>
                </div>
                <div style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-2px', lineHeight: 1, color: '#fff' }}>{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</div>
                <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 900, letterSpacing: '0.2em', marginBottom: '24px' }}>ESTIMATED_INTERCEPTION</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Navigation size={18} color="#22d3ee" /></div>
                    <div><div style={{ fontSize: '0.85rem', fontWeight: 950, color: '#fff' }}>UNIT_SIGMA_7</div><div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>LIVE_TRACKING_ACTIVE</div></div>
                  </div>
                  <motion.button whileTap={{ scale: 0.98 }} style={{ width: '100%', padding: '14px', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.75rem' }}>
                    <Camera size={16} /> BROADCAST_VISUALS
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <style jsx>{`
        .pulse { animation: pulse 1s infinite ease-in-out; }
        @keyframes pulse { 
          0% { transform: scale(1); opacity: 1; } 
          50% { transform: scale(1.2); opacity: 0.7; } 
          100% { transform: scale(1); opacity: 1; } 
        }
      `}</style>
    </motion.div>
  );
};

export default EmergencySystem;
