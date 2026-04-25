'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

// Data models
interface ZoneData {
  zone_id: string;
  occupancy: number;
  status: string;
  count: number;
  wait_time: number;
  last_update: string;
}

interface StandState {
  id: string;
  occupancyRate: number;
}

const getStatusForOccupancy = (occ: number) => {
  if (occ >= 70) return 'Critical';
  if (occ >= 40) return 'Busy';
  return 'Optimal';
};

const getStatusColor = (status: string) => {
  if (status === 'Critical') return '#ef4444'; // red
  if (status === 'Busy') return '#f59e0b'; // yellow
  return '#10b981'; // green
};

export default function AdminPage() {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Data State
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [stands, setStands] = useState<StandState[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Simulator State
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  // Initial Fetch
  useEffect(() => {
    if (!isAuthenticated) return;
    
    Promise.all([
      fetch('/vision_data.json?t=' + Date.now()).then(res => res.json()),
      fetch('/stadium_state.json?t=' + Date.now()).then(res => res.json())
    ]).then(([zoneData, standData]) => {
      setZones(zoneData);
      setStands(standData);
    }).catch(err => console.error('Failed to load initial data', err));
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const saveVisionData = async (newZones: ZoneData[]) => {
    setIsSaving(true);
    try {
      await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZones)
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveStadiumData = async (newStands: StandState[]) => {
    setIsSaving(true);
    try {
      await fetch('/api/stadium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStands)
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleZoneChange = (idx: number, field: keyof ZoneData, value: number) => {
    const newZones = [...zones];
    newZones[idx] = { ...newZones[idx], [field]: value };
    
    if (field === 'occupancy') {
      newZones[idx].status = getStatusForOccupancy(value);
      newZones[idx].count = Math.round(value * 1.5);
    }
    newZones[idx].last_update = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    setZones(newZones);
    saveVisionData(newZones);
  };

  const handleStandChange = (idx: number, value: number) => {
    const newStands = [...stands];
    newStands[idx] = { ...newStands[idx], occupancyRate: value };
    setStands(newStands);
    saveStadiumData(newStands);
  };

  // ── Random Simulator ──
  const toggleSimulator = () => {
    if (isSimulating) {
      if (simulationRef.current) clearInterval(simulationRef.current);
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      simulationRef.current = setInterval(() => {
        setZones(prevZones => {
          const newZones = prevZones.map(z => {
            // Random walk: +/- 5% occupancy
            let newOcc = z.occupancy + (Math.random() * 10 - 5);
            newOcc = Math.max(0, Math.min(100, newOcc));
            
            // Random wait time +/- 2 mins
            let newWait = z.wait_time + Math.floor(Math.random() * 5 - 2);
            newWait = Math.max(0, newWait);

            return {
              ...z,
              occupancy: newOcc,
              wait_time: newWait,
              status: getStatusForOccupancy(newOcc),
              count: Math.round(newOcc * 1.5),
              last_update: new Date().toLocaleTimeString('en-US', { hour12: false })
            };
          });
          saveVisionData(newZones);
          return newZones;
        });

        setStands(prevStands => {
          const newStands = prevStands.map(s => {
            let newRate = s.occupancyRate + (Math.random() * 0.1 - 0.05); // +/- 5%
            newRate = Math.max(0, Math.min(1, newRate));
            return { ...s, occupancyRate: newRate };
          });
          saveStadiumData(newStands);
          return newStands;
        });
      }, 3000); // Update every 3 seconds
    }
  };

  // Cleanup simulator on unmount
  useEffect(() => {
    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, []);


  // ── LOGIN SCREEN ──
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <form onSubmit={handleLogin} style={{ background: '#0f172a', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
             <div style={{ width: '64px', height: '64px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, textAlign: 'center', marginBottom: '8px' }}>Super Admin Portal</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', marginBottom: '32px' }}>Enter credentials to control live stadium data.</p>
          
          {loginError && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '20px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Invalid username or password.</div>}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }} />
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: '#c084fc', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)' }}>
            LOGIN TO COMMAND CENTER
          </button>
        </form>
      </div>
    );
  }

  // ── DASHBOARD SCREEN ──
  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', background: '#0f172a', padding: '24px 32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(90deg, #fff 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Super Admin Control</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>Real-time overrides for Stadium Data & Seat Availability.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isSaving && <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, letterSpacing: '0.1em' }}>● SYNCING</span>}
          
          <button 
            onClick={toggleSimulator}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px',
              background: isSimulating ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 85, 247, 0.15)', 
              border: `1px solid ${isSimulating ? 'rgba(239, 68, 68, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`, 
              color: isSimulating ? '#ef4444' : '#c084fc', 
              padding: '10px 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            {isSimulating ? (
              <><span className="pulse" style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} /> STOP SIMULATION</>
            ) : (
              <>▶ SIMULATE LIVE CROWD</>
            )}
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              color: '#fff', 
              padding: '10px 20px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            EXIT TO APP
          </button>

          <button onClick={() => setIsAuthenticated(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}>
            LOGOUT
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* ── ZONE CONTROLS ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '4px', height: '20px', background: '#38bdf8', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Gate & Concourse Control</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {zones.map((zone, idx) => (
              <div key={zone.zone_id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getStatusColor(zone.status) }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{zone.zone_id.replace('_', ' ')}</h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>
                    RAW COUNT: {zone.count}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Occupancy Density</label>
                      <span style={{ fontSize: '0.9rem', fontWeight: 900, color: getStatusColor(zone.status) }}>{zone.occupancy.toFixed(1)}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="0.5" value={zone.occupancy} 
                      onChange={(e) => handleZoneChange(idx, 'occupancy', parseFloat(e.target.value))}
                      disabled={isSimulating}
                      style={{ width: '100%', accentColor: getStatusColor(zone.status), height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', outline: 'none', opacity: isSimulating ? 0.5 : 1 }} 
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Estimated Wait Time</label>
                      <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#38bdf8' }}>{zone.wait_time} mins</span>
                    </div>
                    <input 
                      type="range" min="0" max="60" step="1" value={zone.wait_time} 
                      onChange={(e) => handleZoneChange(idx, 'wait_time', parseInt(e.target.value))}
                      disabled={isSimulating}
                      style={{ width: '100%', accentColor: '#38bdf8', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', outline: 'none', opacity: isSimulating ? 0.5 : 1 }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEAT & STAND CONTROLS ── */}
        <div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '4px', height: '20px', background: '#c084fc', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Stadium Seating Control</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {stands.map((stand, idx) => {
              const pct = Math.round(stand.occupancyRate * 100);
              return (
                <div key={stand.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, color: '#fff', textTransform: 'uppercase' }}>STAND {stand.id}</h3>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#c084fc' }}>{pct}%</span>
                  </div>
                  
                  <input 
                    type="range" min="0" max="1" step="0.01" value={stand.occupancyRate} 
                    onChange={(e) => handleStandChange(idx, parseFloat(e.target.value))}
                    disabled={isSimulating}
                    style={{ width: '100%', accentColor: '#c084fc', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', outline: 'none', opacity: isSimulating ? 0.5 : 1 }} 
                  />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>EMPTY: {100 - pct}%</span>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>OCC: {pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time explanation */}
          <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#c084fc', fontWeight: 800, marginBottom: '8px', marginTop: 0 }}>ℹ️ HOW IT WORKS</h4>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Adjusting the Stand occupancy rate instantly forces the frontend to recalculate the 3D seat map. The seating algorithm will randomly assign <b>Occupied</b>, <b>Empty</b>, and <b>VIP</b> seats based on your designated density percentage.
            </p>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .pulse { animation: pulse 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
