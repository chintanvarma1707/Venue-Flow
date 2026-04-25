'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Map as MapIcon, Clock, 
  TrendingUp, AlertTriangle, Lightbulb,
  Shield, Eye, Terminal, ChevronRight,
  Maximize2, Zap
} from 'lucide-react';
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

  for (let i = -6; i <= 7; i++) {
    const d = new Date(now.getTime() + i * 45 * 60000); 
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
  const currentIdx = 6; 

  const W = 320, H = 120, PAD_L = 10, PAD_R = 10, PAD_T = 16, PAD_B = 28;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const n = TIMELINE.length;

  const xOf = (i: number) => PAD_L + (i / (n - 1)) * chartW;
  const yOf = (v: number) => PAD_T + chartH - (v / 100) * chartH;

  const points = TIMELINE.map((p, i) => `${xOf(i)},${yOf(p.crowd)}`).join(' ');

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
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: '10px', padding: '12px 16px',
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${PHASE_COLOR[active.phase]}33`,
          borderRadius: '16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backdropFilter: 'blur(10px)'
        }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>{active.label}</div>
          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fff' }}>{active.note}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 950, color: PHASE_COLOR[active.phase], lineHeight: 1 }}>
            {active.crowd}%
          </div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>Density</div>
        </div>
      </motion.div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[25, 50, 75, 100].map(v => (
          <g key={v}>
            <line x1={PAD_L} y1={yOf(v)} x2={W - PAD_R} y2={yOf(v)}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </g>
        ))}

        <motion.path 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          d={areaPath} fill="url(#areaGrad)" 
        />

        {TIMELINE.slice(0, -1).map((p, i) => {
          const x1 = xOf(i), x2 = xOf(i + 1);
          return (
            <rect key={i} x={x1} y={PAD_T} width={x2 - x1} height={chartH}
              fill={PHASE_COLOR[p.phase]} opacity="0.03" />
          );
        })}

        <motion.polyline 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          points={points} fill="none" stroke="#22d3ee" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" 
        />

        <line x1={activeX} y1={PAD_T} x2={activeX} y2={PAD_T + chartH}
          stroke={PHASE_COLOR[active.phase]} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

        {TIMELINE.map((p, i) => {
          const isAct = i === (activeIdx ?? currentIdx);
          const isCur = i === currentIdx;
          return (
            <g key={i} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}>
              <motion.circle 
                animate={{ r: isAct ? 6 : 3.5 }}
                cx={xOf(i)} cy={yOf(p.crowd)} 
                fill={isAct ? PHASE_COLOR[p.phase] : '#020617'}
                stroke={PHASE_COLOR[p.phase]} strokeWidth={isAct ? 2 : 1.5}
              />
              {isCur && !isAct && (
                <circle cx={xOf(i)} cy={yOf(p.crowd)} r={6}
                  fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.5">
                  <animate attributeName="r" values="5;10;5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
        {(['pregame', 'match', 'halftime', 'postmatch'] as const).map(ph => (
          <div key={ph} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: PHASE_COLOR[ph] }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 800 }}>
              {ph}
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
    { time: TIMELINE[9].label, zone: 'Concessions & Restrooms', reason: 'Innings Break Surge', crowd: 97, color: '#f97316', icon: Zap },
    { time: TIMELINE[13].label, zone: 'All Exit Gates', reason: 'Match end exodus', crowd: 100, color: '#f43f5e', icon: AlertTriangle },
    { time: TIMELINE[3].label, zone: 'Entrance Gates A & B', reason: 'Pre-match surge', crowd: 68, color: '#fbbf24', icon: TrendingUp },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {peaks.map((p, i) => (
        <motion.div 
          key={i} 
          variants={item}
          whileHover={{ x: 6, background: `${p.color}15` }}
          style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            background: `${p.color}08`, border: `1px solid ${p.color}22`,
            borderRadius: '20px', padding: '16px', cursor: 'pointer'
          }}
        >
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: `linear-gradient(135deg, ${p.color}33 0%, ${p.color}05 100%)`,
            border: `1px solid ${p.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <p.icon size={24} color={p.color} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: '2px' }}>{p.zone}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{p.reason} · {p.time}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 950, color: p.color, lineHeight: 1 }}>{p.crowd}%</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800 }}>Peak</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
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
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', padding: '40px 24px 20px', marginBottom: '10px' }}
      >
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--accent-cyan)', filter: 'blur(100px)', opacity: 0.15, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 950, letterSpacing: '-0.04em', background: 'linear-gradient(90deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sharjah Stadium
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(34,211,238,0.08)', padding: '6px 14px', borderRadius: '12px', border: '1px solid rgba(34,211,238,0.2)' }}>
                <Activity size={14} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 900, letterSpacing: '0.05em' }}>88% CAPACITY</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdmin(true)}
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.65rem', fontWeight: 900, padding: '6px 12px', borderRadius: '10px', cursor: 'pointer' }}
              >
                GOD_MODE
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(168, 85, 247, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuperAdmin(true)}
                style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', color: '#c084fc', fontSize: '0.65rem', fontWeight: 900, padding: '6px 12px', borderRadius: '10px', cursor: 'pointer' }}
              >
                SUPER_ADMIN
              </motion.button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(74,222,128,0.1)', padding: '8px 16px', borderRadius: '24px', border: '1px solid rgba(74,222,128,0.2)' }}>
            <div className="pulse" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 15px #4ade80' }} />
            <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 900, letterSpacing: '0.05em' }}>LIVE_SYNC</span>
          </div>
        </div>
      </motion.div>

      {/* ── PREMIUM NEON TABS ── */}
      <div style={{ margin: '0 24px 32px', display: 'flex', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '20px', padding: '6px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
        <motion.div 
          layoutId="tabBg"
          style={{
            position: 'absolute',
            top: '6px',
            bottom: '6px',
            left: tab === 'map' ? '6px' : '50%',
            width: 'calc(50% - 6px)',
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #3b82f6 100%)',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(34,211,238,0.3)',
            zIndex: 0
          }} 
        />
        {(['map', 'timeline'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '14px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            background: 'transparent',
            color: tab === t ? '#000' : 'rgba(255,255,255,0.5)',
            fontWeight: tab === t ? 900 : 700, fontSize: '0.95rem',
            transition: 'all 0.3s',
            position: 'relative', zIndex: 1
          }}>
            {t === 'map' ? 'Stadium Map' : 'Density Timeline'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'map' ? (
          <motion.div 
            key="map"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div style={{ padding: '0 12px', marginBottom: '40px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-10px', left: '24px', zIndex: 10, background: 'rgba(2,6,23,0.85)', border: '1px solid rgba(250,204,21,0.4)', padding: '8px 16px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)' }}>
                <div className="pulse" style={{ width: '8px', height: '8px', background: '#facc15', borderRadius: '50%', boxShadow: '0 0 10px #facc15' }} />
                <span style={{ fontSize: '0.7rem', color: '#facc15', fontWeight: 900, letterSpacing: '0.1em' }}>GPS_FLOW_ACTIVE</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVision(true)}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '24px',
                  zIndex: 10,
                  background: 'rgba(34, 211, 238, 0.25)',
                  border: '1px solid var(--accent-cyan)',
                  padding: '10px 20px',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                }}
              >
                <Eye size={16} />
                VISION_AI
              </motion.button>

              <StadiumBowl onSelect={() => { }} />

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
                <path d="M 50 70 Q 70 50 80 20" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" strokeDasharray="2 4" strokeLinecap="round" className="flow-line" style={{ animation: 'flow 2s linear infinite' }} />
                <path d="M 50 60 Q 30 50 20 60" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" strokeDasharray="2 4" strokeLinecap="round" className="flow-line" style={{ animation: 'flow 3s linear infinite reverse' }} />
                <path d="M 40 40 Q 20 20 10 10" fill="none" stroke="url(#flowGrad1)" strokeWidth="0.8" strokeDasharray="1.5 3" strokeLinecap="round" className="flow-line" style={{ animation: 'flow 1.5s linear infinite' }} />
              </svg>
            </div>

            <div style={{ padding: '0 24px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Maximize2 size={18} color="var(--accent-cyan)" />
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  Vision_Live_Telemetry
                </p>
              </div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '32px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '8px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Heatmap />
              </motion.div>
            </div>

            <QueueIntelligence />
          </motion.div>
        ) : (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ padding: '0 24px' }}
          >
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '24px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>Load Prediction Engine</h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontWeight: 500 }}>Live Match Analysis · Stadium Cluster A</p>
                </div>
                <div style={{ padding: '8px 16px', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                  TIME_MARKER ▸ {TIMELINE[6].label}
                </div>
              </div>
              <CrowdTimeline />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Terminal size={18} color="rgba(255,255,255,0.4)" />
                <h4 style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  Critical_Surge_Alerts
                </h4>
              </div>
              <PeakAlerts />
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(59, 130, 246, 0.08) 100%)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: '28px', padding: '24px' }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px', background: 'var(--accent-cyan)', borderRadius: '16px', color: '#000' }}>
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-cyan)', marginBottom: '8px' }}>Operational Intelligence</h4>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontWeight: 500 }}>
                    Predictive modeling suggests visiting concessions between <strong style={{ color: 'white' }}>7:00–7:30 PM</strong>. Automated load balancing is currently diverting traffic to North Concourse to reduce wait times by <strong style={{ color: '#4ade80' }}>14%</strong>.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StadiumMapView;
