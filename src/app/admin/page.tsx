'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Shield, LogOut, ChevronLeft, 
  Settings, Database, Play, Square, 
  RefreshCw, Map as MapIcon, Info, Users,
  Clock, Zap, LayoutGrid, Monitor, Terminal,
  Cpu, BarChart3, Globe, Lock
} from 'lucide-react';
import { StadiumBowl } from '@/components/StadiumBowl';
import { STANDS, Stand } from '@/components/stadiumData';

// Data models
interface ZoneData {
  zone_id: string;
  occupancy: number;
  status: string;
  count: number;
  wait_time: number;
  last_update: string;
}

interface StandState extends Stand {
  occupancyRate: number;
  healthStatus: 'Excellent' | 'Fair' | 'Critical';
  gateAccess: string;
  direction: string;
}

const getStatusForOccupancy = (occ: number) => {
  if (occ >= 75) return 'Critical';
  if (occ >= 45) return 'Busy';
  return 'Optimal';
};

const getStatusColor = (status: string) => {
  if (status === 'Critical') return '#ef4444';
  if (status === 'Busy' || status === 'Fair') return '#f59e0b';
  return '#10b981';
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
  const [selectedStandId, setSelectedStandId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Simulator State
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef<any>(null);

  // Initial Fetch
  useEffect(() => {
    if (!isAuthenticated) return;

    const init = async () => {
      try {
        const [zoneRes, standRes] = await Promise.all([
          fetch('/vision_data.json?t=' + Date.now()),
          fetch('/stadium_state.json?t=' + Date.now())
        ]);
        const zoneData = await zoneRes.json();
        const standData = await standRes.json();

        const mergedStands = STANDS.map(s => {
          const live = standData.find((ls: any) => ls.id === s.id);
          return {
            ...s,
            occupancyRate: live ? live.occupancyRate : 0.5,
            healthStatus: (live?.occupancyRate > 0.8 ? 'Critical' : live?.occupancyRate > 0.5 ? 'Fair' : 'Excellent') as any,
            gateAccess: `Gate ${s.id.toUpperCase()}`,
            direction: s.id === 'nc' ? 'North' : s.id === 's' ? 'South' : s.id.includes('e') ? 'East' : 'West'
          };
        });

        setZones(zoneData);
        setStands(mergedStands);
      } catch (err) {
        console.error('Failed to load initial data', err);
      }
    };
    init();
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
      const minimalData = newStands.map(s => ({ id: s.id, occupancyRate: s.occupancyRate }));
      await fetch('/api/stadium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(minimalData)
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleZoneChange = (idx: number, field: keyof ZoneData, value: any) => {
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

  const handleStandChange = (idx: number, field: keyof StandState, value: any) => {
    const newStands = [...stands];
    newStands[idx] = { ...newStands[idx], [field]: value };
    if (field === 'occupancyRate') {
      const rate = value;
      newStands[idx].healthStatus = rate > 0.85 ? 'Critical' : rate > 0.55 ? 'Fair' : 'Excellent';
    }
    setStands(newStands);
    saveStadiumData(newStands);
  };

  const toggleSimulator = () => {
    if (isSimulating) {
      if (simulationRef.current) clearInterval(simulationRef.current);
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      simulationRef.current = setInterval(() => {
        setZones((prevZones: ZoneData[]) => {
          const newZones = prevZones.map(z => {
            let newOcc = z.occupancy + (Math.random() * 6 - 3);
            newOcc = Math.max(0, Math.min(100, newOcc));
            let newWait = z.wait_time + Math.floor(Math.random() * 3 - 1);
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

        setStands((prevStands: StandState[]) => {
          const newStands = prevStands.map(s => {
            let newRate = s.occupancyRate + (Math.random() * 0.04 - 0.02);
            newRate = Math.max(0, Math.min(1, newRate));
            return {
              ...s,
              occupancyRate: newRate,
              healthStatus: (newRate > 0.85 ? 'Critical' : newRate > 0.55 ? 'Fair' : 'Excellent') as any
            };
          });
          saveStadiumData(newStands);
          return newStands;
        });
      }, 2000);
    }
  };

  useEffect(() => { return () => { if (simulationRef.current) clearInterval(simulationRef.current); }; }, []);

  const selectedStand = stands.find(s => s.id === selectedStandId);

  // ── UI HELPERS ──
  const StatBox = ({ label, value, color, icon: Icon }: { label: string, value: string | number, color?: string, icon: any }) => (
    <motion.div 
      whileHover={{ y: -4, background: 'rgba(255,255,255,0.04)' }}
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}
    >
      <div style={{ background: `${color || '#22d3ee'}15`, padding: '8px', borderRadius: '12px' }}>
        <Icon size={16} color={color || '#22d3ee'} />
      </div>
      <div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: color || '#fff' }}>{value}</div>
      </div>
    </motion.div>
  );

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <motion.form 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          onSubmit={handleLogin} 
          style={{ background: '#0f172a', padding: '48px', borderRadius: '40px', border: '1px solid rgba(192, 132, 252, 0.2)', width: '100%', maxWidth: '480px', boxShadow: '0 40px 120px rgba(0,0,0,0.8)', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: '#c084fc', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ width: '80px', height: '80px', background: 'rgba(192, 132, 252, 0.1)', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(192, 132, 252, 0.4)' }}>
              <Shield size={40} color="#c084fc" strokeWidth={2.5} />
            </motion.div>
          </div>
          <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: 950, textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.04em' }}>ApexStadium Control</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', textAlign: 'center', marginBottom: '40px', fontWeight: 600 }}>Administrator Authentication Required</p>
          {loginError && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '16px', borderRadius: '16px', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 800 }}>⚠️ Authentication Failed</motion.div>
          )}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 900, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Access ID</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username..." style={{ width: '100%', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', color: '#fff', outline: 'none', fontSize: '1.1rem', transition: 'all 0.3s' }} />
          </div>
          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 900, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Security Key</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', color: '#fff', outline: 'none', fontSize: '1.1rem' }} />
          </div>
          <motion.button whileHover={{ scale: 1.02, background: '#d8b4fe' }} whileTap={{ scale: 0.98 }} type="submit" style={{ width: '100%', padding: '18px', background: '#c084fc', color: '#000', border: 'none', borderRadius: '18px', fontWeight: 950, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 12px 40px rgba(192, 132, 252, 0.3)' }}>ACCESS COMMAND CENTER</motion.button>
        </motion.form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#010409', color: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* ── TACTICAL NAV ── */}
      <nav style={{ height: '80px', padding: '0 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(13, 17, 23, 0.9)', backdropFilter: 'blur(32px)', zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ padding: '10px', background: 'rgba(192, 132, 252, 0.1)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: '16px' }}>
            <Terminal size={24} color="#c084fc" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 950, letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>APEXSTADIUM::GOD_MODE</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <div className="pulse" style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 900, letterSpacing: '0.15em' }}>LIVE_UPLINK_STABLE</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleSimulator} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isSimulating ? 'rgba(239, 68, 68, 0.15)' : 'rgba(192, 132, 252, 0.15)', border: `1px solid ${isSimulating ? 'rgba(239, 68, 68, 0.3)' : 'rgba(192, 132, 252, 0.3)'}`, color: isSimulating ? '#f87171' : '#c084fc', padding: '10px 20px', borderRadius: '14px', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer', transition: '0.3s' }}>
            {isSimulating ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            {isSimulating ? 'STOP SIMULATION' : 'RUN SIMULATION'}
          </motion.button>
          <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.05)' }} />
          <button onClick={() => window.location.href = '/'} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', padding: '10px 20px', borderRadius: '14px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>DASHBOARD</button>
          <motion.button whileHover={{ background: '#ef4444', color: '#fff' }} onClick={() => setIsAuthenticated(false)} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '14px', fontWeight: 900, fontSize: '0.8rem', cursor: 'pointer' }}>LOGOUT</motion.button>
        </div>
      </nav>

      {/* ── COMMAND CENTER LAYOUT ── */}
      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '360px 1fr 400px', height: 'calc(100vh - 80px)', background: '#010409' }}>
        
        {/* --- LEFT: VISION NODES --- */}
        <section style={{ borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(13, 17, 23, 0.5)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>NEURAL_AI_FEED</h2>
            <Activity size={14} color="var(--accent-cyan)" />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {zones.map((zone, idx) => (
              <motion.div key={zone.zone_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 900, fontSize: '0.85rem', color: '#fff' }}>{zone.zone_id.replace('_', ' ')}</span>
                  <div style={{ background: `${getStatusColor(zone.status)}20`, color: getStatusColor(zone.status), padding: '4px 10px', borderRadius: '8px', fontSize: '0.6rem', fontWeight: 900 }}>{zone.status.toUpperCase()}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>DENSITY</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: getStatusColor(zone.status) }}>{Math.round(zone.occupancy)}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={zone.occupancy} onChange={(e) => handleZoneChange(idx, 'occupancy', parseFloat(e.target.value))} style={{ width: '100%', accentColor: getStatusColor(zone.status) }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>WAIT</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#38bdf8' }}>{zone.wait_time}m</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>UNITS</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff' }}>{zone.count}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- CENTER: DIGITAL TWIN OPS --- */}
        <section style={{ position: 'relative', display: 'flex', flexDirection: 'column', background: '#0d1117' }}>
          <div className="tactical-grid" />
          <div style={{ position: 'absolute', top: '32px', left: '32px', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <Monitor size={20} color="#c084fc" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0, letterSpacing: '-0.03em' }}>STADIUM_TWIN_v4.2</h2>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.1em' }}>GLOBAL OVERRIDE MODE ENABLED</div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 5 }}>
            <StadiumBowl onSelect={(id) => setSelectedStandId(id)} standsData={stands} />
          </div>

          <div style={{ position: 'absolute', bottom: '32px', left: '32px', display: 'flex', gap: '12px', zIndex: 10 }}>
            {['#ef4444', '#f59e0b', '#10b981'].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(13, 17, 23, 0.8)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '2px', background: c }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{['CRITICAL', 'BUSY', 'OPTIMAL'][i]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* --- RIGHT: CONTROL PANELS --- */}
        <section style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(13, 17, 23, 0.5)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 950, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>PROPERTY_OVERRIDES</h2>
            <Database size={14} color="#f59e0b" />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <AnimatePresence mode="wait">
              {selectedStand ? (
                <motion.div key={selectedStand.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ background: '#161b22', border: `1px solid ${selectedStand.color}40`, borderRadius: '32px', padding: '32px', boxShadow: `0 20px 80px ${selectedStand.color}10` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: selectedStand.color }} />
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>{selectedStand.label.replace('\n', ' ')}</h3>
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} onClick={() => setSelectedStandId(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}>✕</motion.button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                      <StatBox icon={Activity} label="Status" value={selectedStand.healthStatus} color={getStatusColor(selectedStand.healthStatus)} />
                      <StatBox icon={Users} label="Density" value={`${Math.round(selectedStand.occupancyRate * 100)}%`} color="#c084fc" />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>CAPACITY_OVERRIDE</span>
                        <span style={{ fontSize: '1rem', fontWeight: 950, color: selectedStand.color }}>{Math.round(selectedStand.occupancyRate * 100)}%</span>
                      </div>
                      <input type="range" min="0" max="1" step="0.01" value={selectedStand.occupancyRate} onChange={(e) => handleStandChange(stands.findIndex(s => s.id === selectedStandId), 'occupancyRate', parseFloat(e.target.value))} style={{ width: '100%', accentColor: selectedStand.color }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>GATE_ASSIGNMENT</span>
                       {['Primary Gate', 'North Access', 'West Tunnel', 'VIP Express'].map(g => (
                         <motion.button key={g} whileHover={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => handleStandChange(stands.findIndex(s => s.id === selectedStandId), 'gateAccess', g)} style={{ textAlign: 'left', padding: '16px 20px', borderRadius: '18px', background: selectedStand.gateAccess === g ? `${selectedStand.color}15` : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedStand.gateAccess === g ? selectedStand.color : 'rgba(255,255,255,0.05)'}`, color: selectedStand.gateAccess === g ? selectedStand.color : '#94a3b8', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>{g}</motion.button>
                       ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', opacity: 0.3 }}>
                  <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <LayoutGrid size={64} strokeWidth={1} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 950, fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '8px' }}>INITIALIZATION_REQUIRED</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Select a stadium node to modify parameters</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- FOOTER: SYSTEM HEALTH --- */}
          <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(13, 17, 23, 0.8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Settings size={14} color="#c084fc" />
              <span style={{ fontSize: '0.7rem', fontWeight: 950, color: '#c084fc', letterSpacing: '0.1em' }}>CORE_ENGINE_HEALTH</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
               <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '14px' }}>
                 <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>CPU_LOAD</div>
                 <div style={{ fontSize: '0.9rem', fontWeight: 950, color: '#10b981' }}>12.4%</div>
               </div>
               <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '14px' }}>
                 <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>LATENCY</div>
                 <div style={{ fontSize: '0.9rem', fontWeight: 950, color: 'var(--accent-cyan)' }}>8ms</div>
               </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .tactical-grid { position: absolute; inset: 0; background-image: radial-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(rgba(34, 211, 238, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.02) 1px, transparent 1px); background-size: 40px 40px, 100px 100px, 100px 100px; z-index: 1; }
        @keyframes pulse-anim { 0% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0.4; transform: scale(1); } }
        .pulse { animation: pulse-anim 2s infinite ease-in-out; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
