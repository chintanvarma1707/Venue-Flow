'use client';

import React, { useState, useEffect } from 'react';

interface VisionStats {
  zone_id: string;
  occupancy: number;
  status: string;
  count: number;
  wait_time: number;
  last_update: string;
}

const AdminDashboard = ({ onClose }: { onClose: () => void }) => {
  const [stats, setStats] = useState<VisionStats[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [mode, setMode] = useState<'mobile' | 'laptop'>('laptop');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/vision_data.json?t=${Date.now()}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch vision data', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'busy': return '#fbbf24';
      default: return '#22d3ee';
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 4000, 
      background: '#020617', 
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px 30px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>COMMAND CENTER</h1>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>REAL-TIME ANOMALY DETECTION ENGINE</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
            <button 
              onClick={() => setMode('mobile')}
              style={{ padding: '8px 16px', background: mode === 'mobile' ? '#fff' : 'transparent', color: mode === 'mobile' ? '#020617' : '#fff', border: 'none', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>MOBILE</button>
            <button 
              onClick={() => setMode('laptop')}
              style={{ padding: '8px 16px', background: mode === 'laptop' ? 'var(--accent-cyan)' : 'transparent', color: mode === 'laptop' ? '#020617' : '#fff', border: 'none', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>LAPTOP</button>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'rgba(239, 68, 68, 0.15)', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              color: '#ef4444', 
              padding: '8px 16px', 
              borderRadius: '10px', 
              fontSize: '0.7rem', 
              fontWeight: 900, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            EXIT
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: 3D Digital Twin Map (Mocked) */}
        <div style={{ flex: 2, padding: '20px', position: 'relative', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ 
            width: '100%', 
            height: '100%', 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: '24px', 
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Mock 3D Stadium Wireframe SVG */}
            <svg viewBox="0 0 800 600" style={{ width: '80%', height: '80%', opacity: 0.3 }}>
              <ellipse cx="400" cy="300" rx="350" ry="250" fill="none" stroke="var(--accent-cyan)" strokeWidth="1" strokeDasharray="5,5" />
              <ellipse cx="400" cy="300" rx="250" ry="180" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" />
              <rect x="350" y="250" width="100" height="100" fill="none" stroke="var(--accent-cyan)" strokeWidth="1" />
            </svg>

            {/* Dynamic Zone Overlays */}
            {stats.map((zone, i) => (
              <div 
                key={zone.zone_id}
                onClick={() => setSelectedZone(zone.zone_id)}
                style={{ 
                  position: 'absolute',
                  top: i < 2 ? '25%' : '65%',
                  left: i % 2 === 0 ? '25%' : '65%',
                  width: '120px',
                  height: '120px',
                  background: `radial-gradient(circle, ${getStatusColor(zone.status)}33 0%, transparent 70%)`,
                  border: `2px solid ${getStatusColor(zone.status)}`,
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  transform: selectedZone === zone.zone_id ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: `0 0 30px ${getStatusColor(zone.status)}33`
                }}
              >
                <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#fff' }}>{zone.zone_id}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: getStatusColor(zone.status) }}>{zone.occupancy}%</span>
              </div>
            ))}

            <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 700 }}>
              STADIUM_TWIN_V1.0 // SYNCED
            </div>
          </div>
        </div>

        {/* Right: Telemetry & Alerts */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          {/* Active Alerts */}
          <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '20px', padding: '20px' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ef4444', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }} />
               CRITICAL ANOMALIES
            </h3>
            {stats.filter(s => s.status === 'Critical').map(s => (
              <div key={s.zone_id} style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', marginBottom: '10px', borderLeft: '4px solid #ef4444' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>DENSITY SPIKE: {s.zone_id}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>Occupancy at {s.occupancy}% | Wait: {s.wait_time}m</div>
              </div>
            ))}
          </div>

          {/* Zone Drill-down */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px', flex: 1 }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', marginBottom: '15px' }}>ZONE TELEMETRY</h3>
            {stats.map(s => (
              <div key={s.zone_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{s.zone_id}</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>Last update: {s.last_update}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: getStatusColor(s.status) }}>{s.occupancy}%</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>{s.count} PEOPLE</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
