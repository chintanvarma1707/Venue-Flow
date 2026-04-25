'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Activity, Eye, Zap, Shield, Maximize, Cpu, Scan } from 'lucide-react';

interface CameraFeed {
  id: string;
  name: string;
  occupancy: number;
  status: 'optimal' | 'busy' | 'congested';
  type: 'gate' | 'concession' | 'concourse';
}

const VisionHub = ({ onClose }: { onClose: () => void }) => {
  const [activeCam, setActiveCam] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const cams: CameraFeed[] = [
    { id: 'CAM-01', name: 'NORTH GATE ENTRY', occupancy: 82, status: 'congested', type: 'gate' },
    { id: 'CAM-04', name: 'SEC 204 CONCOURSE', occupancy: 45, status: 'optimal', type: 'concourse' },
    { id: 'CAM-09', name: 'FOOD COURT WEST', occupancy: 71, status: 'busy', type: 'concession' },
    { id: 'CAM-12', name: 'VIP LOUNGE ENTRY', occupancy: 12, status: 'optimal', type: 'gate' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeCam]);

  const currentCam = cams[activeCam];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ 
        position: 'fixed', inset: 0, zIndex: 3000, background: '#000', 
        display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif'
      }}>
      
      {/* Header */}
      <motion.div 
        initial={{ y: -20 }} animate={{ y: 0 }}
        style={{ 
          padding: 'clamp(16px, 4vw, 24px) clamp(16px, 5vw, 32px)', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(32px)', zIndex: 100
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: 'clamp(8px, 2vw, 10px)', borderRadius: '14px', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
            <Scan size={20} color="var(--accent-cyan)" />
          </div>
          <div>
            <h3 style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)', fontWeight: 950, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>VISION_NEURAL_HUD</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <div className="pulse" style={{ width: '5px', height: '5px', background: '#22d3ee', borderRadius: '50%' }} />
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '0.1em', margin: 0 }}>LIVE_DATALINK_ESTABLISHED</p>
            </div>
          </div>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }} onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={22} strokeWidth={3} />
        </motion.button>
      </motion.div>

      {/* Main Viewport */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: 'clamp(8px, 2vw, 20px)' }}>
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ 
            width: '100%', height: '100%', borderRadius: 'clamp(20px, 4vw, 32px)', 
            background: '#050505', position: 'relative', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 80px rgba(0,0,0,0.8)'
          }}>
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}
              >
                <div style={{ position: 'relative' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid rgba(34, 211, 238, 0.1)', borderTopColor: 'var(--accent-cyan)' }} />
                  <Cpu style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.5 }} size={20} color="var(--accent-cyan)" />
                </div>
                <p style={{ color: 'var(--accent-cyan)', fontSize: '0.65rem', fontWeight: 950, letterSpacing: '0.2em' }}>BUFFERING_STREAM...</p>
              </motion.div>
            ) : (
              <motion.div
                key={currentCam.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <div className="neural-grid" />
                <div className="crt-effect" style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }} />
                
                {/* AI Tracking Visuals */}
                {[
                  { t: '25%', l: '20%', w: '12%', h: '22%', id: 'ID_772' },
                  { t: '40%', l: '65%', w: '15%', h: '28%', id: 'ID_901' },
                  { t: '60%', l: '35%', w: '10%', h: '20%', id: 'ID_114' },
                ].map((box, i) => (
                  <motion.div 
                    key={i} animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    style={{ position: 'absolute', top: box.t, left: box.l, width: box.w, height: box.h, border: '1px solid var(--accent-cyan)', boxShadow: '0 0 15px rgba(34, 211, 238, 0.2)', zIndex: 10 }}
                  >
                    <div style={{ position: 'absolute', top: '-16px', left: '-1px', background: 'var(--accent-cyan)', color: '#000', fontSize: '8px', fontWeight: 950, padding: '1px 5px', whiteSpace: 'nowrap' }}>
                      {box.id} // VERIFIED
                    </div>
                  </motion.div>
                ))}

                {/* Cam ID Overlay */}
                <div style={{ position: 'absolute', top: 'clamp(16px, 4vw, 24px)', left: 'clamp(16px, 4vw, 24px)', zIndex: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#ef4444', width: '8px', height: '8px', borderRadius: '50%', animation: 'blink 1s infinite' }} />
                    <span style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 950, color: '#fff', letterSpacing: '-0.04em' }}>LIVE::{currentCam.id}</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, marginTop: '2px', letterSpacing: '0.05em' }}>LOC: {currentCam.name}</div>
                </div>

                {/* Telemetry Footer */}
                <div style={{ 
                  position: 'absolute', bottom: 'clamp(12px, 3vw, 20px)', left: 'clamp(12px, 3vw, 20px)', right: 'clamp(12px, 3vw, 20px)',
                  background: 'rgba(15, 23, 42, 0.9)', padding: 'clamp(12px, 3vw, 20px)', borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(32px)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 4vw, 32px)' }}>
                    <div>
                      <div style={{ fontSize: '0.55rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>THREAT_LVL</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 950, color: currentCam.status === 'congested' ? '#ef4444' : '#4ade80' }}>{currentCam.status.toUpperCase()}</div>
                    </div>
                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
                    <div>
                      <div style={{ fontSize: 'clamp(1rem, 4vw, 1.4rem)', fontWeight: 950, color: 'var(--accent-cyan)', lineHeight: 1 }}>{currentCam.occupancy}%</div>
                      <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900, marginTop: '2px' }}>NEURAL_DENSITY</div>
                    </div>
                  </div>
                  <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <Maximize size={16} color="#fff" />
                  </div>
                </div>

                <div className="reticle" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Touch-Optimized Cam Selector */}
      <div style={{ 
        padding: '16px', background: '#020617', borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', gap: '10px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none'
      }}>
        {cams.map((cam, i) => (
          <motion.button 
            key={cam.id} whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveCam(i); setLoading(true); }}
            style={{ 
              flexShrink: 0, width: 'clamp(130px, 35vw, 160px)', padding: '14px', borderRadius: '18px',
              background: activeCam === i ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${activeCam === i ? 'var(--accent-cyan)' : 'transparent'}`,
              cursor: 'pointer', textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.6rem', color: activeCam === i ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.3)', fontWeight: 950 }}>{cam.id}</span>
              <Camera size={12} color={activeCam === i ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.2)'} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cam.name}</div>
          </motion.button>
        ))}
      </div>

      <style jsx>{`
        .pulse { animation: pulse 2s infinite ease-in-out; }
        @keyframes pulse { 0%, 100% { transform: scale(0.9); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .crt-effect { background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%); background-size: 100% 4px; opacity: 0.3; pointer-events: none; }
        .neural-grid { position: absolute; inset: 0; background-image: radial-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.2; }
        .reticle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; opacity: 0.1; border: 1px solid #fff; border-radius: 50%; pointer-events: none; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </motion.div>
  );
};

export default VisionHub;
