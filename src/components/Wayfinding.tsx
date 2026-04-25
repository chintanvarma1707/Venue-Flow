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

const Wayfinding = () => {
  const [active, setActive] = useState(false);
  const [distance, setDistance] = useState(42);
  const [signalStrength, setSignalStrength] = useState(98);
  const [visionData, setVisionData] = useState<VisionStats[]>([]);
  const [navigationMode, setNavigationMode] = useState<'seat' | 'exit'>('seat');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/vision_data.json?t=${Date.now()}`);
        const data = await res.json();
        setVisionData(data);
      } catch (err) {
        console.error('Failed to fetch vision data', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setDistance(prev => (prev > 0 ? prev - 0.2 : 0));
        setSignalStrength(prev => 95 + Math.random() * 5);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [active]);

  const getOptimalExit = () => {
    const gates = visionData.filter(v => v.zone_id.startsWith('Gate'));
    if (gates.length === 0) return 'Gate A';
    
    // Simple logic: Find gate with lowest occupancy
    const optimal = gates.reduce((prev, curr) => prev.occupancy < curr.occupancy ? prev : curr);
    return optimal.zone_id.replace('_', ' ');
  };

  if (!active) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* AR Seat Navigation */}
        <div 
          onClick={() => { setNavigationMode('seat'); setActive(true); }}
          style={{ 
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '20px', 
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #3b82f6 100%)', padding: '16px', borderRadius: '18px', color: 'black' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>AR Wayfinding</h4>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Navigate to your assigned seat</p>
            </div>
          </div>
        </div>

        {/* Dynamic Exit Routing Card */}
        <div 
          onClick={() => { setNavigationMode('exit'); setActive(true); }}
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '24px',
            padding: '20px', 
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#ef4444', padding: '16px', borderRadius: '18px', color: 'white' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Smart Exit Routing</h4>
                <div style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Recommended: <span style={{ color: '#ef4444', fontWeight: 900 }}>{getOptimalExit()}</span> (Low Density)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: '#000', overflow: 'hidden' }}>
      
      {/* Mock Camera Feed with scan lines */}
      <div style={{ position: 'absolute', inset: 0, background: 'url(/hero-banner.png) center/cover', opacity: 0.4 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none' }} />
      
      {/* HUD Corner Brackets */}
      <div style={{ position: 'absolute', top: '40px', left: '20px', width: '40px', height: '40px', borderTop: '3px solid var(--accent-cyan)', borderLeft: '3px solid var(--accent-cyan)' }} />
      <div style={{ position: 'absolute', top: '40px', right: '20px', width: '40px', height: '40px', borderTop: '3px solid var(--accent-cyan)', borderRight: '3px solid var(--accent-cyan)' }} />

      {/* AR Overlays */}
      <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* HUD Header Status */}
        <div style={{ position: 'absolute', top: '50px', left: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '20px', backdropFilter: 'blur(10px)', border: '1px solid rgba(34,211,238,0.3)' }}>
            <div className="pulse" style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>{navigationMode === 'exit' ? 'EXIT ROUTING ACTIVE' : 'SEAT TRACKING ACTIVE'}</span>
          </div>
        </div>

        {/* Animated Directional Arrows (The navigation UI) */}
        <div style={{ position: 'absolute', bottom: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', animation: 'flow 2s infinite linear' }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><polyline points="18 15 12 9 6 15"/></svg>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}><polyline points="18 15 12 9 6 15"/></svg>
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
        </div>

        {/* Floating Destination Marker */}
        <div style={{ transform: 'perspective(500px) translateY(-100px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            background: 'rgba(2,6,23,0.8)', 
            border: `2px solid ${navigationMode === 'exit' ? '#ef4444' : 'var(--accent-cyan)'}`, 
            padding: '16px 32px', 
            borderRadius: '16px',
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
            boxShadow: `0 0 40px ${navigationMode === 'exit' ? 'rgba(239,68,68,0.4)' : 'rgba(34,211,238,0.4)'}`,
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{navigationMode === 'exit' ? getOptimalExit() : 'SEC 204'}</h2>
            <div style={{ fontSize: '0.8rem', color: navigationMode === 'exit' ? '#ef4444' : 'var(--accent-cyan)', fontWeight: 800, marginTop: '4px' }}>{navigationMode === 'exit' ? 'OPTIMAL EXIT PATH' : 'ROW J • SEAT 12'}</div>
          </div>
          <div style={{ width: '4px', height: '40px', background: `linear-gradient(to bottom, ${navigationMode === 'exit' ? '#ef4444' : 'var(--accent-cyan)'}, transparent)` }} />
        </div>

        {/* Close Button & Distance Left */}
        <div style={{ position: 'absolute', bottom: '40px', width: '100%', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid var(--accent-cyan)', padding: '16px', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '4px' }}>EST. ARRIVAL</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{Math.ceil(distance / 10)}<span style={{ fontSize: '1rem' }}>m</span></div>
          </div>

          <button 
            onClick={() => setActive(false)}
            style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid #ef4444', padding: '20px', borderRadius: '50%', backdropFilter: 'blur(10px)', cursor: 'pointer' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes flow { 0% { transform: translateY(20px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-40px); opacity: 0; } }
      `}</style>
    </div>
  );
};

export default Wayfinding;

