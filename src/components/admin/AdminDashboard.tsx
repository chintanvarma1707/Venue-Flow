'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Shield, AlertCircle, 
  Settings, Database, Cpu, 
  Terminal, Monitor, Zap,
  Wifi, Signal, Lock, X,
  LayoutGrid, Map as MapIcon, BarChart3
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'map' | 'telemetry'>('map');

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
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 4000, background: '#020617', color: '#fff',
        display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif'
      }}>
      
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1, opacity: 0.1 }}>
        <div className="scanner" />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -50 }} animate={{ y: 0 }}
        style={{
          padding: 'clamp(16px, 3vw, 24px) clamp(16px, 4vw, 40px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(32px)', zIndex: 10
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.div 
            animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ padding: 'clamp(8px, 2vw, 10px)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px' }}
          >
            <Shield size={22} color="#ef4444" />
          </motion.div>
          <div>
            <h1 style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', fontWeight: 950, letterSpacing: '-0.02em', margin: 0 }}>GOD_MODE_v4</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <div className="pulse" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '0.1em' }}>NEURAL_LIVE</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 16px)' }}>
          <div className="mobile-tabs-container" style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '3px' }}>
            <button onClick={() => setActiveTab('map')} style={{ padding: '6px 14px', background: activeTab === 'map' ? '#fff' : 'transparent', color: activeTab === 'map' ? '#000' : '#fff', border: 'none', borderRadius: '9px', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}>TWIN</button>
            <button onClick={() => setActiveTab('telemetry')} style={{ padding: '6px 14px', background: activeTab === 'telemetry' ? '#fff' : 'transparent', color: activeTab === 'telemetry' ? '#000' : '#fff', border: 'none', borderRadius: '9px', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}>DATA</button>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={20} strokeWidth={3} />
          </motion.button>
        </div>
      </motion.div>

      <div className="dashboard-grid">
        <div className={`section-map ${activeTab === 'map' ? 'active' : ''}`}>
          <div className="digital-twin-container">
            <div className="map-grid" />
            <svg viewBox="0 0 800 600" className="stadium-svg">
              <motion.ellipse animate={{ rx: [320, 330, 320], ry: [220, 230, 220] }} transition={{ duration: 4, repeat: Infinity }} cx="400" cy="300" rx="320" ry="220" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="1" strokeDasharray="10,10" />
              <ellipse cx="400" cy="300" rx="240" ry="170" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="2" />
            </svg>
            <div className="zones-container">
              {stats.map((zone, i) => (
                <motion.div
                  key={zone.zone_id} onClick={() => setSelectedZone(zone.zone_id)} className={`zone-bubble zone-${i}`}
                  style={{ border: `2px solid ${getStatusColor(zone.status)}`, boxShadow: `0 0 30px ${getStatusColor(zone.status)}22`, background: `radial-gradient(circle, ${getStatusColor(zone.status)}11 0%, transparent 80%)` }}
                >
                  <div className="zone-indicator" style={{ background: getStatusColor(zone.status) }} />
                  <span className="zone-label">{zone.zone_id.replace('_', ' ')}</span>
                  <span className="zone-value">{Math.round(zone.occupancy)}%</span>
                </motion.div>
              ))}
            </div>
            <div className="engine-status">
              <Terminal size={12} color="var(--accent-cyan)" />
              <span>CORE_ENGINE_LINK_v4.2 // VERIFIED</span>
            </div>
          </div>
        </div>

        <div className={`section-telemetry ${activeTab === 'telemetry' ? 'active' : ''}`}>
          <div className="telemetry-inner">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="alert-panel">
              <div className="panel-header"><AlertCircle size={14} color="#ef4444" /><span>CRITICAL_ANOMALIES</span></div>
              <div className="alert-list">
                <AnimatePresence mode="popLayout">
                  {stats.filter(s => s.status === 'Critical').map(s => (
                    <motion.div key={s.zone_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="alert-item">
                      <div className="alert-title">DENSITY_SPIKE</div>
                      <div className="alert-subtitle">{s.zone_id.toUpperCase()} • {s.occupancy.toFixed(1)}%</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="telemetry-panel">
              <div className="panel-header"><Activity size={14} color="var(--accent-cyan)" /><span>ZONE_TELEMETRY</span></div>
              <div className="zone-list">
                {stats.map(s => (
                  <div key={s.zone_id} className="zone-telemetry-row">
                    <div className="zone-info"><div className="zone-name">{s.zone_id.replace('_', ' ')}</div><div className="zone-meta">WAIT: {s.wait_time}M // {s.count} UNITS</div></div>
                    <div className="zone-stats"><div className="stat-value" style={{ color: getStatusColor(s.status) }}>{Math.round(s.occupancy)}%</div><div className="stat-label">DENSITY</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card"><div className="metric-label">CPU_LOAD</div><div className="metric-value green">12%</div></div>
              <div className="metric-card"><div className="metric-label">LATENCY</div><div className="metric-value cyan">8ms</div></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-grid { flex: 1; display: grid; grid-template-columns: 2fr 1fr; overflow: hidden; position: relative; z-index: 5; }
        .section-map { flex: 1; position: relative; padding: clamp(16px, 4vw, 40px); border-right: 1px solid rgba(255,255,255,0.05); }
        .section-telemetry { flex: 1; position: relative; padding: clamp(16px, 4vw, 40px); overflow-y: auto; background: rgba(0,0,0,0.2); }
        .digital-twin-container { width: 100%; height: 100%; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); borderRadius: 32px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; boxShadow: inset 0 0 100px rgba(0,0,0,0.5); }
        .map-grid { position: absolute; inset: 0; background-image: radial-gradient(rgba(34, 211, 238, 0.08) 1px, transparent 1px); background-size: 30px 30px; opacity: 0.5; }
        .stadium-svg { width: 90%; height: 90%; z-index: 2; opacity: 0.4; }
        .zones-container { position: absolute; inset: 0; z-index: 3; }
        .zone-bubble { position: absolute; width: clamp(80px, 15vw, 110px); height: clamp(80px, 15vw, 110px); borderRadius: 50%; display: flex; flexDirection: column; alignItems: center; justifyContent: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .zone-0 { top: 15%; left: 15%; } .zone-1 { top: 15%; right: 15%; } .zone-2 { bottom: 15%; left: 15%; } .zone-3 { bottom: 15%; right: 15%; }
        .zone-indicator { width: 6px; height: 6px; borderRadius: 50%; marginBottom: 4px; animation: blink 2s infinite; }
        .zone-label { fontSize: 0.55rem; fontWeight: 900; color: rgba(255,255,255,0.4); textTransform: uppercase; letterSpacing: 0.05em; }
        .zone-value { fontSize: clamp(1rem, 3vw, 1.3rem); fontWeight: 950; color: #fff; }
        .engine-status { position: absolute; bottom: 16px; left: 16px; display: flex; alignItems: center; gap: 8px; fontSize: 0.5rem; fontWeight: 800; color: rgba(255,255,255,0.2); letterSpacing: 0.1em; }
        .telemetry-inner { display: flex; flexDirection: column; gap: 24px; }
        .alert-panel { background: rgba(239, 68, 68, 0.03); border: 1px solid rgba(239, 68, 68, 0.1); borderRadius: 24px; padding: 20px; }
        .panel-header { display: flex; alignItems: center; gap: 10px; marginBottom: 16px; fontSize: 0.75rem; fontWeight: 900; letterSpacing: 0.05em; }
        .alert-item { padding: 12px; background: rgba(239, 68, 68, 0.08); borderRadius: 16px; border-left: 3px solid #ef4444; marginBottom: 8px; }
        .alert-title { fontSize: 0.75rem; fontWeight: 950; }
        .alert-subtitle { fontSize: 0.65rem; color: rgba(255,255,255,0.4); marginTop: 2px; }
        .telemetry-panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); borderRadius: 24px; padding: 20px; }
        .zone-telemetry-row { display: flex; justifyContent: space-between; alignItems: center; padding: 10px; borderBottom: 1px solid rgba(255,255,255,0.03); }
        .zone-name { fontSize: 0.8rem; fontWeight: 800; }
        .zone-meta { fontSize: 0.55rem; color: rgba(255,255,255,0.3); marginTop: 1px; }
        .stat-value { fontSize: 1rem; fontWeight: 950; }
        .stat-label { fontSize: 0.5rem; color: rgba(255,255,255,0.3); fontWeight: 800; }
        .metrics-grid { display: grid; gridTemplateColumns: 1fr 1fr; gap: 12px; }
        .metric-card { padding: 16px; background: rgba(255,255,255,0.02); borderRadius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .metric-label { fontSize: 0.55rem; color: rgba(255,255,255,0.4); fontWeight: 900; marginBottom: 2px; }
        .metric-value { fontSize: 1rem; fontWeight: 950; }
        .metric-value.green { color: #10b981; } .metric-value.cyan { color: var(--accent-cyan); }
        .scanner { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--accent-cyan); boxShadow: 0 0 15px var(--accent-cyan); animation: scan 4s linear infinite; }
        .mobile-tabs-container { display: none; }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(0.9); opacity: 0.4; } 50% { transform: scale(1.1); opacity: 1; } }
        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .section-map, .section-telemetry { display: none; border-right: none; }
          .section-map.active, .section-telemetry.active { display: block; }
          .mobile-tabs-container { display: flex; }
        }
        @media (max-width: 640px) {
          .section-map { height: 70vh; }
          .zone-bubble { width: 75px; height: 75px; }
        }
      `}</style>
    </motion.div>
  );
};

export default AdminDashboard;
