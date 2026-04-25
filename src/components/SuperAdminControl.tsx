'use client';
import React, { useState, useEffect, useCallback } from 'react';

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
      setIsSaving(false);
    }
  }, []);

  const handleSliderChange = (idx: number, field: keyof ZoneData, value: number) => {
    const newZones = [...zones];
    newZones[idx] = { ...newZones[idx], [field]: value };
    
    // Auto update status based on occupancy
    if (field === 'occupancy') {
      newZones[idx].status = getStatusForOccupancy(value);
      // Mock correlation: count goes up as occupancy goes up
      newZones[idx].count = Math.round(value * 1.5);
    }

    newZones[idx].last_update = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    setZones(newZones);
    handleUpdate(newZones);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Critical') return '#ef4444'; // red
    if (status === 'Busy') return '#f59e0b'; // yellow
    return '#10b981'; // green
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: '#060d1f', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px', width: '100%', maxWidth: '800px',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: '#ef4444', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>Super Admin Overrides</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0' }}>Manually inject telemetry data to control the frontend in real-time.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {isSaving && <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', animation: 'pulse 1.5s infinite' }}>Saving to JSON...</span>}
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* Control Panels */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {zones.map((zone, idx) => (
            <div key={zone.zone_id} style={{ 
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '16px', padding: '20px', display: 'flex', gap: '24px', flexWrap: 'wrap'
            }}>
              {/* Zone Info */}
              <div style={{ flex: '1 1 200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getStatusColor(zone.status), boxShadow: `0 0 10px ${getStatusColor(zone.status)}` }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>{zone.zone_id.replace('_', ' ')}</h3>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>STATUS: <span style={{ color: getStatusColor(zone.status) }}>{zone.status}</span></span>
                  <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>RAW COUNT: {zone.count}</span>
                </div>
              </div>

              {/* Sliders */}
              <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Occupancy Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Occupancy Density</label>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: getStatusColor(zone.status) }}>{zone.occupancy.toFixed(1)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="0.5" 
                    value={zone.occupancy} 
                    onChange={(e) => handleSliderChange(idx, 'occupancy', parseFloat(e.target.value))}
                    style={{ 
                      width: '100%', accentColor: getStatusColor(zone.status),
                      height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', outline: 'none'
                    }} 
                  />
                </div>

                {/* Wait Time Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Wait Time</label>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#38bdf8' }}>{zone.wait_time} mins</span>
                  </div>
                  <input 
                    type="range" min="0" max="60" step="1" 
                    value={zone.wait_time} 
                    onChange={(e) => handleSliderChange(idx, 'wait_time', parseInt(e.target.value))}
                    style={{ 
                      width: '100%', accentColor: '#38bdf8',
                      height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', outline: 'none'
                    }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminControl;
