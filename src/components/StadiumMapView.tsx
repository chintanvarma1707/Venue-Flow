'use client';
import React, { useState } from 'react';
import { StadiumBowl } from './StadiumBowl';
import VisionHub from './VisionHub';
import QueueIntelligence from './QueueIntelligence';
import AdminDashboard from './AdminDashboard';
import Heatmap from './Heatmap';
import SuperAdminControl from './SuperAdminControl';


// ── Crowd Timeline Data (Generated Dynamically) ────────────────────────────────
interface TimePoint {
  time: string;
  label: string;
  crowd: number;      // 0–100
  phase: 'pregame' | 'match' | 'halftime' | 'postmatch';
  note: string;
}

const generateTimeline = (): TimePoint[] => {
  const now = new Date();
  const points: TimePoint[] = [];
  
  // Create 14 points spanning -4 hours to +4 hours from now
  for (let i = -6; i <= 7; i++) {
    const d = new Date(now.getTime() + i * 45 * 60000); // 45 min intervals
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    const label = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    
    let phase: TimePoint['phase'] = 'match';
    let note = 'In Play';
    let crowd = 85 + Math.random() * 10;

    if (i < -2) { phase = 'pregame'; note = 'Gates Open'; crowd = 20 + (i + 6) * 10; }
    else if (i === 0) { phase = 'match'; note = '🏏 CRITICAL OVER'; crowd = 98; }
    else if (i === 3) { phase = 'halftime'; note = '⚡ Mid-Innings'; crowd = 94; }
    else if (i > 5) { phase = 'postmatch'; note = 'Exit Rush'; crowd = 40 + (7 - i) * 10; }

    points.push({ 
      time: `${hh}:${mm}`, 
      label, 
      crowd: Math.min(100, Math.max(5, crowd)), 
      phase, 
      note 
    });
  }
  return points;
};

const TIMELINE = generateTimeline();

const PHASE_COLOR: Record<TimePoint['phase'], string> = {
  pregame: '#fbbf24',
  match: '#22d3ee',
  halftime: '#f97316',
  postmatch: '#f43f5e',
};

// ── SVG Timeline Chart ─────────────────────────────────────────────────────────
const CrowdTimeline = () => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const currentIdx = 6; // The "Now" marker in our generated 14-point array (index 6 is roughly now)

  const W = 320, H = 120, PAD_L = 10, PAD_R = 10, PAD_T = 16, PAD_B = 28;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const n = TIMELINE.length;

  const xOf = (i: number) => PAD_L + (i / (n - 1)) * chartW;
  const yOf = (v: number) => PAD_T + chartH - (v / 100) * chartH;

  // Build polyline points
  const points = TIMELINE.map((p, i) => `${xOf(i)},${yOf(p.crowd)}`).join(' ');

  // Area fill path
  const areaPath = [
    `M ${xOf(0)} ${yOf(0)}`,
    ...TIMELINE.map((p, i) => `L ${xOf(i)} ${yOf(p.crowd)}`),
    `L ${xOf(n - 1)} ${yOf(0)}`,
    'Z',
  ].join(' ');

  const active = activeIdx !== null ? TIMELINE[activeIdx] : TIMELINE[currentIdx];
  const activeX = xOf(activeIdx ?? currentIdx);

  return (
    <div>
      {/* Tooltip bar */}
      <div style={{
        marginBottom: '10px', padding: '10px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${PHASE_COLOR[active.phase]}44`,
        borderRadius: '12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{active.label}</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{active.note}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: PHASE_COLOR[active.phase], lineHeight: 1 }}>
            {active.crowd}%
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Crowd Density</div>
        </div>
      </div>

      {/* SVG Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={PAD_L} y1={yOf(v)} x2={W - PAD_R} y2={yOf(v)}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PAD_L - 2} y={yOf(v) + 1} textAnchor="end" fontSize="5"
              fill="rgba(255,255,255,0.25)" dominantBaseline="middle">{v}%</text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Phase color segments underlay */}
        {TIMELINE.slice(0, -1).map((p, i) => {
          const x1 = xOf(i), x2 = xOf(i + 1);
          return (
            <rect key={i} x={x1} y={PAD_T} width={x2 - x1} height={chartH}
              fill={PHASE_COLOR[p.phase]} opacity="0.04" />
          );
        })}

        {/* Line */}
        <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Active vertical guide */}
        <line x1={activeX} y1={PAD_T} x2={activeX} y2={PAD_T + chartH}
          stroke={PHASE_COLOR[active.phase]} strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />

        {/* Data points */}
        {TIMELINE.map((p, i) => {
          const isAct = i === (activeIdx ?? currentIdx);
          const isCur = i === currentIdx;
          return (
            <g key={i} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}>
              <circle cx={xOf(i)} cy={yOf(p.crowd)} r={isAct ? 5 : 3}
                fill={isAct ? PHASE_COLOR[p.phase] : '#0f172a'}
                stroke={PHASE_COLOR[p.phase]} strokeWidth={isAct ? 1.5 : 1}
                style={{ transition: 'r 0.1s' }} />
              {isCur && !isAct && (
                <circle cx={xOf(i)} cy={yOf(p.crowd)} r={6}
                  fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.5">
                  <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}

        {/* X-axis time labels (every other) */}
        {TIMELINE.map((p, i) => i % 2 === 0 && (
          <text key={i} x={xOf(i)} y={H - 4} textAnchor="middle"
            fontSize="4.5" fill="rgba(255,255,255,0.35)">
            {p.label.split(' ')[0]}
          </text>
        ))}
      </svg>

      {/* Phase legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
        {(['pregame', 'match', 'halftime', 'postmatch'] as const).map(ph => (
          <div key={ph} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: PHASE_COLOR[ph] }} />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {ph === 'pregame' ? 'Pre-Game' : ph === 'postmatch' ? 'Post-Match' : ph === 'halftime' ? 'Half-Time' : 'In-Play'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Peak Crowd Alert Cards ─────────────────────────────────────────────────────
const PeakAlerts = () => {
  const peaks = [
    { time: TIMELINE[9].label, zone: 'Concessions & Restrooms', reason: 'Innings Break Surge', crowd: 97, color: '#f97316' },
    { time: TIMELINE[13].label, zone: 'All Exit Gates', reason: 'Match end exodus', crowd: 100, color: '#f43f5e' },
    { time: TIMELINE[3].label, zone: 'Entrance Gates A & B', reason: 'Pre-match surge', crowd: 68, color: '#fbbf24' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {peaks.map((p, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          background: `${p.color}0d`, border: `1px solid ${p.color}33`,
          borderRadius: '14px', padding: '14px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: `linear-gradient(135deg, ${p.color}44 0%, ${p.color}11 100%)`,
            border: `1px solid ${p.color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: '1.4rem',
            boxShadow: `0 0 15px ${p.color}33 inset`
          }}>
            {p.crowd >= 90 ? '🔴' : p.crowd >= 60 ? '🟡' : '🟢'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '3px' }}>{p.zone}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{p.reason} · {p.time}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: p.color }}>{p.crowd}%</div>
            <div style={{ fontSize: '0.58rem', color: 'var(--text-secondary)' }}>peak</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main View ──────────────────────────────────────────────────────────────────
const StadiumMapView = () => {
  const [tab, setTab] = useState<'map' | 'timeline'>('map');
  const [showVision, setShowVision] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#020617', paddingBottom: '120px' }}>
      {showVision && <VisionHub onClose={() => setShowVision(false)} />}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      {showSuperAdmin && <SuperAdminControl onClose={() => setShowSuperAdmin(false)} />}
      
      {/* ── PREMIUM HEADER ── */}
      <div style={{ position: 'relative', padding: '32px 20px 20px', marginBottom: '10px' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-cyan)', filter: 'blur(100px)', opacity: 0.15, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sharjah Stadium
            </h2>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.02em', marginRight: '4px' }}>LIVE DENSITY</p>
              <button 
                onClick={() => setShowAdmin(true)}
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                GOD-VIEW
              </button>
              <button 
                onClick={() => setShowSuperAdmin(true)}
                style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '0.6rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                SUPER ADMIN
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(74,222,128,0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(74,222,128,0.2)' }}>
            <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80' }} />
            <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 800 }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* ── PREMIUM NEON TABS ── */}
      <div style={{ margin: '0 20px 24px', display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '6px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '6px',
          bottom: '6px',
          left: tab === 'map' ? '6px' : '50%',
          width: 'calc(50% - 6px)',
          background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #3b82f6 100%)',
          borderRadius: '12px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 15px rgba(34,211,238,0.3)',
          zIndex: 0
        }} />
        {(['map', 'timeline'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            background: 'transparent',
            color: tab === t ? '#000' : 'rgba(255,255,255,0.6)',
            fontWeight: tab === t ? 800 : 600, fontSize: '0.9rem',
            transition: 'all 0.3s',
            position: 'relative', zIndex: 1,
            textShadow: tab === t ? 'none' : '0 1px 2px rgba(0,0,0,0.5)'
          }}>
            {t === 'map' ? '🏟️ Map Overlay' : '📈 Timeline'}
          </button>
        ))}
      </div>

      {tab === 'map' && (
        <div className="slide-up">
          {/* Stadium bowl with GPS Crowd Tracking Overlay */}
          <div style={{ padding: '0 12px', marginBottom: '32px', position: 'relative' }}>
            {/* GPS Tracking Overlay Header */}
            <div style={{ position: 'absolute', top: '-10px', left: '20px', zIndex: 10, background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(250,204,21,0.3)', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)' }}>
              <div className="pulse" style={{ width: '8px', height: '8px', background: '#facc15', borderRadius: '50%', boxShadow: '0 0 10px #facc15' }} />
              <span style={{ fontSize: '0.65rem', color: '#facc15', fontWeight: 800, letterSpacing: '0.1em' }}>GPS CROWD FLOW ACTIVE</span>
            </div>

            <button
              onClick={() => setShowVision(true)}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '20px',
                zIndex: 10,
                background: 'rgba(34, 211, 238, 0.2)',
                border: '1px solid var(--accent-cyan)',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 800,
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
              VISION HUB
            </button>

            <StadiumBowl onSelect={() => { }} />

            {/* SVG Flow Lines (GPS Tracking) */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
                  <stop offset="50%" stopColor="#f43f5e" stopOpacity="1" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="flowGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Path 1: Moving towards North Exit */}
              <path d="M 50 70 Q 70 50 80 20" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" strokeDasharray="2 4" strokeLinecap="round" className="flow-line" style={{ animation: 'flow 2s linear infinite' }} />
              <path d="M 50 70 Q 70 50 80 20" fill="none" stroke="#f43f5e" strokeWidth="3" opacity="0.2" strokeLinecap="round" />

              {/* Path 2: Moving towards West Concessions */}
              <path d="M 50 60 Q 30 50 20 60" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" strokeDasharray="2 4" strokeLinecap="round" className="flow-line" style={{ animation: 'flow 3s linear infinite reverse' }} />
              <path d="M 50 60 Q 30 50 20 60" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.2" strokeLinecap="round" />

              {/* Path 3: Moving out from Center */}
              <path d="M 40 40 Q 20 20 10 10" fill="none" stroke="url(#flowGrad1)" strokeWidth="0.8" strokeDasharray="1.5 3" strokeLinecap="round" className="flow-line" style={{ animation: 'flow 1.5s linear infinite' }} />
            </svg>
          </div>

          {/* Quick density cards */}
          <div style={{ padding: '0 20px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ width: '24px', height: '2px', background: 'var(--accent-cyan)', boxShadow: '0 0 8px var(--accent-cyan)' }} />
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Vision Live Heatmap
              </p>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '4px',
              position: 'relative'
            }}>
               <Heatmap />
            </div>
          </div>

          <QueueIntelligence />
        </div>
      )}

      {tab === 'timeline' && (
        <div className="slide-up" style={{ padding: '0 20px' }}>
          {/* Chart */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Crowd Density Over Time</h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Today · MI vs CSK (IPL Final)</p>
              </div>
              <div style={{ padding: '4px 10px', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                NOW ▸ {TIMELINE[6].label}
              </div>
            </div>
            <CrowdTimeline />
          </div>

          {/* Peak alerts */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              ⚡ Predicted Peak Moments
            </p>
            <PeakAlerts />
          </div>

          {/* Best times tip */}
          <div style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.4rem' }}>💡</span>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>Best Times to Move</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Visit concessions between <strong style={{ color: 'white' }}>7:00–7:30 PM</strong> (match start — low foot traffic). Avoid exits until <strong style={{ color: 'white' }}>11:00 PM</strong> when crowds clear by 55%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StadiumMapView;
