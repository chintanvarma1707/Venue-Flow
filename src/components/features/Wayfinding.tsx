'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, MapPin, X, 
  Compass, ArrowUp, Info,
  LogOut, Activity, Signal, TrendingUp
} from 'lucide-react';

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
      } catch (err) { console.error('Fetch failed', err); }
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
    const optimal = gates.reduce((prev, curr) => prev.occupancy < curr.occupancy ? prev : curr);
    return optimal.zone_id.replace('_', ' ');
  };

  return (
    <div style={{ padding: '0 4px' }}>
      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div 
            key="selection" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <motion.div 
              whileTap={{ scale: 0.98 }} onClick={() => { setNavigationMode('seat'); setActive(true); }}
              style={{ 
                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1px solid rgba(34, 211, 238, 0.2)', borderRadius: '24px', padding: '20px', cursor: 'pointer', position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 2 }}>
                <div style={{ background: 'var(--accent-cyan)', padding: '10px', borderRadius: '14px', color: '#000' }}>
                  <Navigation size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 950, color: '#fff', margin: 0 }}>AR_PRECISION_PATH</h4>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, marginTop: '2px', letterSpacing: '0.02em' }}>TO: SEC_204_ROW_F</p>
                </div>
                <Compass size={18} color="var(--accent-cyan)" className="spin-slow" />
              </div>
            </motion.div>

            <motion.div 
              whileTap={{ scale: 0.98 }} onClick={() => { setNavigationMode('exit'); setActive(true); }}
              style={{ 
                background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '24px', padding: '20px', cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#ef4444', padding: '10px', borderRadius: '14px', color: 'white' }}>
                  <LogOut size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 950, color: '#fff', margin: 0 }}>SMART_EXIT_HUD</h4>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, marginTop: '2px' }}>VIA: <span style={{ color: '#ef4444' }}>{getOptimalExit()}</span></p>
                </div>
                <TrendingUp size={18} color="#ef4444" />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="ar-hud" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'fixed', inset: 0, zIndex: 3000, background: '#000', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 10%, #000 130%)', zIndex: 1 }} />
            <div className="scanlines" />

            <div style={{ position: 'relative', height: '100%', width: '100%', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: 'clamp(32px, 8vw, 50px) 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(34, 211, 238, 0.2)', padding: '10px 14px', borderRadius: '12px', backdropFilter: 'blur(32px)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="pulse" style={{ width: '5px', height: '5px', background: '#22d3ee', borderRadius: '50%' }} />
                  <span style={{ fontSize: '0.55rem', fontWeight: 950, color: '#fff', letterSpacing: '0.1em' }}>AR_LINK_ESTABLISHED</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', background: 'rgba(0,0,0,0.5)', padding: '6px 10px', borderRadius: '10px' }}>
                  <Signal size={12} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950 }}>{Math.round(signalStrength)}%</span>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div 
                  animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '90%' }}
                >
                  <div style={{ 
                    background: 'rgba(2, 6, 23, 0.9)', border: `2px solid ${navigationMode === 'exit' ? '#ef4444' : 'var(--accent-cyan)'}`, 
                    padding: 'clamp(20px, 6vw, 32px)', borderRadius: '28px', textAlign: 'center', backdropFilter: 'blur(40px)',
                    boxShadow: `0 0 50px ${navigationMode === 'exit' ? 'rgba(239,68,68,0.2)' : 'rgba(34,211,238,0.15)'}`, width: '100%', maxWidth: '300px'
                  }}>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: '0.15em', marginBottom: '6px' }}>NAV_TARGET_LOCK</div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 7vw, 2.2rem)', fontWeight: 950, color: '#fff', margin: 0, lineHeight: 1, letterSpacing: '-0.04em' }}>{navigationMode === 'exit' ? getOptimalExit() : 'SECTION_204'}</h2>
                  </div>
                  <div style={{ width: '2px', height: '30px', background: `linear-gradient(to bottom, ${navigationMode === 'exit' ? '#ef4444' : 'var(--accent-cyan)'}, transparent)` }} />
                </motion.div>

                <div style={{ position: 'absolute', bottom: '18%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {[1, 0.6, 0.2].map((op, i) => (
                    <motion.div
                      key={i} animate={{ y: [30, -30], opacity: [0, op, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                      style={{ color: navigationMode === 'exit' ? '#ef4444' : 'var(--accent-cyan)', marginTop: '-15px' }}
                    >
                      <ArrowUp size={50 - i * 12} strokeWidth={4} />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '20px 20px clamp(40px, 8vw, 60px)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: '18px', backdropFilter: 'blur(32px)' }}>
                  <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', fontWeight: 950, marginBottom: '2px', letterSpacing: '0.05em' }}>DISTANCE</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#fff', lineHeight: 1 }}>{Math.ceil(distance / 5)}<span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginLeft: '4px' }}>M</span></div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.9 }} onClick={() => setActive(false)}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '2px solid #ef4444', width: '56px', height: '56px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={24} strokeWidth={3} />
                </motion.button>
              </div>
            </div>

            {/* Corner Bracket Overlays */}
            <div style={{ position: 'absolute', inset: '20px', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 5 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '15px', height: '15px', borderTop: '2px solid var(--accent-cyan)', borderLeft: '2px solid var(--accent-cyan)' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '15px', height: '15px', borderTop: '2px solid var(--accent-cyan)', borderRight: '2px solid var(--accent-cyan)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '15px', height: '15px', borderBottom: '2px solid var(--accent-cyan)', borderLeft: '2px solid var(--accent-cyan)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px', borderBottom: '2px solid var(--accent-cyan)', borderRight: '2px solid var(--accent-cyan)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scanlines { position: absolute; inset: 0; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%); background-size: 100% 4px; z-index: 2; pointer-events: none; opacity: 0.2; }
        @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.5; } }
        .pulse { animation: pulse 2s infinite; }
        .spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Wayfinding;
