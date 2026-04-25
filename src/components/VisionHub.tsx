'use client';

import React, { useState, useEffect } from 'react';

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
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 2000, 
      background: '#020617', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'rgba(34, 211, 238, 0.1)', 
            padding: '8px', 
            borderRadius: '10px',
            border: '1px solid rgba(34, 211, 238, 0.2)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>VISIONFLOW AI</h3>
            <p style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>LIVE CROWD ANALYTICS</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            color: '#fff', 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>

      {/* Main Viewport */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '10px' }}>
        <div style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '24px', 
          background: '#000', 
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {loading ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <div className="pulse" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--accent-cyan)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
              <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em' }}>INITIALIZING VISION NEURAL LINK...</p>
            </div>
          ) : (
            <>
              {/* Simulated Feed Background */}
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: `url(/cam-${currentCam.id.split('-')[1].toLowerCase()}.png) center/cover`,
                opacity: 0.6,
                filter: 'grayscale(30%) contrast(120%) brightness(0.8)'
              }} />
              
              {/* Camera Lens Vignette */}
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%)',
                pointerEvents: 'none'
              }} />

              {/* CRT Scanlines Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%', pointerEvents: 'none', opacity: 0.5 }} />

              {/* AI Overlay Elements */}
              <div style={{ position: 'absolute', inset: '40px', pointerEvents: 'none' }}>
                {/* Bounding Boxes */}
                {[
                  { t: '15%', l: '20%', w: '40px', h: '60px', id: 'P-992' },
                  { t: '45%', l: '60%', w: '45px', h: '65px', id: 'P-104' },
                  { t: '30%', l: '35%', w: '38px', h: '55px', id: 'P-442' },
                  { t: '60%', l: '15%', w: '42px', h: '62px', id: 'P-021' },
                ].map((box, i) => (
                  <div key={i} style={{ 
                    position: 'absolute', 
                    top: box.t, 
                    left: box.l, 
                    width: box.w, 
                    height: box.h, 
                    border: '1px solid var(--accent-cyan)',
                    boxShadow: '0 0 10px rgba(34, 211, 238, 0.3)'
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: '-15px', 
                      left: '-1px', 
                      background: 'var(--accent-cyan)', 
                      color: '#000', 
                      fontSize: '8px', 
                      fontWeight: 900, 
                      padding: '1px 4px' 
                    }}>{box.id}</div>
                  </div>
                ))}

                {/* Heatmap Area */}
                <div style={{ 
                  position: 'absolute', 
                  bottom: '10%', 
                  right: '10%', 
                  width: '150px', 
                  height: '150px', 
                  borderRadius: '50%', 
                  background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(239,68,68,0.1) 50%, transparent 100%)',
                  filter: 'blur(20px)',
                  animation: 'pulse 3s infinite'
                }} />
                <div style={{ position: 'absolute', bottom: '8%', right: '12%', color: '#ef4444', fontSize: '10px', fontWeight: 900 }}>DENSITY HOTSPOT (92%)</div>
              </div>

              {/* HUD Telemetry */}
              <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff' }}>{currentCam.id} // {currentCam.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>REC ● 24.04.2026 // 20:34:12</div>
              </div>

              <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentCam.status === 'congested' ? '#ef4444' : currentCam.status === 'busy' ? '#f97316' : '#4ade80' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>STATUS: {currentCam.status}</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>{currentCam.occupancy}% <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>FLOW RATE</span></div>
              </div>

              {/* Target Reticle */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100px', height: '100px', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid white', borderLeft: '2px solid white' }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid white', borderRight: '2px solid white' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid white', borderLeft: '2px solid white' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid white', borderRight: '2px solid white' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '4px', height: '4px', background: 'white', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Camera Selector Footbar */}
      <div style={{ 
        padding: '20px', 
        background: 'rgba(0,0,0,0.8)', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {cams.map((cam, i) => (
          <button 
            key={cam.id}
            onClick={() => { setActiveCam(i); setLoading(true); }}
            style={{ 
              flexShrink: 0,
              width: '120px',
              padding: '12px',
              borderRadius: '14px',
              background: activeCam === i ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${activeCam === i ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)'}`,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, marginBottom: '4px' }}>{cam.id}</div>
            <div style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cam.name}</div>
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } 100% { opacity: 0.2; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default VisionHub;
