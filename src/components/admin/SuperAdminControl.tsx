'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Save, X, 
  Settings2, Activity, Users, 
  Clock, TrendingUp, RefreshCw,
  Terminal, Zap, ChevronRight
} from 'lucide-react';

interface ZoneData {
  zone_id: string;
  occupancy: number;
  status: string;
  count: number;
  wait_time: number;
  last_update: string;
}

const getStatusForOccupancy = (occ: number) => {
  if (occ >= 70) return 'Critical';
  if (occ >= 40) return 'Busy';
  return 'Optimal';
};

export const SuperAdminControl = ({ onClose }: { onClose: () => void }) => {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`/vision_data.json?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => setZones(data))
      .catch(err => console.error('Failed to load initial data', err));
  }, []);

  const handleUpdate = useCallback(async (newZones: ZoneData[]) => {
    setIsSaving(true);
    try {
      await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZones)
      });
    } catch (error) {
      console.error('Failed to update data', error);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  }, []);

  const handleSliderChange = (idx: number, field: keyof ZoneData, value: number) => {
    const newZones = [...zones];
    newZones[idx] = { ...newZones[idx], [field]: value };
    if (field === 'occupancy') {
      newZones[idx].status = getStatusForOccupancy(value);
      newZones[idx].count = Math.round(value * 1.5);
    }
    newZones[idx].last_update = new Date().toLocaleTimeString('en-US', { hour12: false });
    setZones(newZones);
    handleUpdate(newZones);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Critical') return '#ef4444';
    if (status === 'Busy') return '#f59e0b';
    return '#10b981';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(32px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 24px)', fontFamily: 'Inter, sans-serif'
      }}>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 30 }}
        style={{
          background: '#060d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', width: '100%', maxWidth: '900px',
          maxHeight: '92vh', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.8)', position: 'relative', display: 'flex', flexDirection: 'column'
        }}>
        
        {/* Header */}
        <div style={{ padding: 'clamp(20px, 4vw, 32px)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 16px)' }}>
            <motion.div animate={{ rotate: [0, 90, 0] }} transition={{ duration: 10, repeat: Infinity }} style={{ width: 'clamp(44px, 10vw, 56px)', height: 'clamp(44px, 10vw, 56px)', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <ShieldAlert size={28} color="#ef4444" />
            </motion.div>
            <div>
              <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 950, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>GOD_COMMAND</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <Terminal size={12} color="#94a3b8" />
                <p style={{ fontSize: '0.65rem', color: '#94a3b8', margin: 0, fontWeight: 700, letterSpacing: '0.05em' }}>LIVE_OVERRIDE_ON</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <AnimatePresence>
              {isSaving && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 211, 238, 0.1)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(34, 211, 238, 0.2)' }}>
                  <RefreshCw size={12} color="var(--accent-cyan)" className="spin-slow" />
                  <span className="hide-mobile" style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', fontWeight: 950 }}>SYNCING</span>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '40px', height: '40px', borderRadius: '12px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={22} strokeWidth={3} />
            </motion.button>
          </div>
        </div>

        {/* Override Panels */}
        <div className="control-list" style={{ padding: 'clamp(16px, 4vw, 32px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {zones.map((zone, idx) => (
            <motion.div 
              key={zone.zone_id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: 'clamp(16px, 4vw, 24px)', display: 'flex', flexWrap: 'wrap', gap: '20px' }}
            >
              <div style={{ flex: '1 1 180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(zone.status), boxShadow: `0 0 15px ${getStatusColor(zone.status)}` }} />
                  <h3 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.2rem)', fontWeight: 950, color: '#fff', margin: 0 }}>{zone.zone_id.replace('_', ' ')}</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div className="telemetry-badge"><span className="label">STATUS:</span> <span style={{ color: getStatusColor(zone.status) }}>{zone.status.toUpperCase()}</span></div>
                  <div className="telemetry-badge"><span className="label">UNITS:</span> <span style={{ color: '#fff' }}>{zone.count}</span></div>
                </div>
              </div>

              <div style={{ flex: '2 1 280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="slider-container">
                  <div className="slider-header">
                    <div className="label-group"><Activity size={12} color={getStatusColor(zone.status)} /><span>DENSITY</span></div>
                    <span className="value" style={{ color: getStatusColor(zone.status) }}>{zone.occupancy.toFixed(0)}%</span>
                  </div>
                  <input type="range" min="0" max="100" step="1" value={zone.occupancy} onChange={(e) => handleSliderChange(idx, 'occupancy', parseFloat(e.target.value))} className="custom-slider" style={{ '--accent': getStatusColor(zone.status) } as any} />
                </div>

                <div className="slider-container">
                  <div className="slider-header">
                    <div className="label-group"><Clock size={12} color="var(--accent-cyan)" /><span>WAIT_TIME</span></div>
                    <span className="value" style={{ color: 'var(--accent-cyan)' }}>{zone.wait_time}M</span>
                  </div>
                  <input type="range" min="0" max="60" step="1" value={zone.wait_time} onChange={(e) => handleSliderChange(idx, 'wait_time', parseInt(e.target.value))} className="custom-slider" style={{ '--accent': 'var(--accent-cyan)' } as any} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Terminal Footer */}
        <div style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>
            <Zap size={12} /> REALTIME_NEURAL_OVERRIDE // SYNC_ENABLED
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .control-list::-webkit-scrollbar { width: 4px; }
        .control-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .telemetry-badge { padding: 4px 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); borderRadius: 8px; fontSize: 0.65rem; fontWeight: 900; }
        .telemetry-badge .label { color: rgba(255,255,255,0.3); marginRight: 4px; }
        .slider-container { padding: 12px; background: rgba(255,255,255,0.02); borderRadius: 16px; border: 1px solid rgba(255,255,255,0.04); }
        .slider-header { display: flex; justifyContent: space-between; alignItems: center; marginBottom: 10px; }
        .label-group { display: flex; alignItems: center; gap: 6px; fontSize: 0.6rem; fontWeight: 900; color: rgba(255,255,255,0.3); letterSpacing: 0.05em; }
        .slider-header .value { fontSize: 1rem; fontWeight: 950; }
        .custom-slider { width: 100%; height: 6px; borderRadius: 3px; background: rgba(255,255,255,0.05); outline: none; cursor: pointer; accent-color: var(--accent); }
        .pulse { animation: pulse 2s infinite ease-in-out; }
        @keyframes pulse { 0% { transform: scale(0.9); opacity: 0.4; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.4; } }
        .spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .hide-mobile { display: none; } }
      `}</style>
    </motion.div>
  );
};

export default SuperAdminControl;
