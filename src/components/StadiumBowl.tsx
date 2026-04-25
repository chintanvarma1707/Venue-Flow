'use client';
import React, { useState, useEffect } from 'react';
import { STANDS, Stand } from './stadiumData';

// ── helpers ────────────────────────────────────────────────────────────────
const R = (d: number) => (d * Math.PI) / 180;
const px = (cx: number, r: number, a: number) => cx + r * Math.cos(R(a));
const py = (cy: number, r: number, a: number) => cy + r * Math.sin(R(a));

function arc(cx: number, cy: number, r1: number, r2: number, a1: number, a2: number) {
  const lg = a2 - a1 > 180 ? 1 : 0;
  return [
    `M ${px(cx, r1, a1)} ${py(cy, r1, a1)}`,
    `A ${r1} ${r1} 0 ${lg} 1 ${px(cx, r1, a2)} ${py(cy, r1, a2)}`,
    `L ${px(cx, r2, a2)} ${py(cy, r2, a2)}`,
    `A ${r2} ${r2} 0 ${lg} 0 ${px(cx, r2, a1)} ${py(cy, r2, a1)}`,
    `Z`,
  ].join(' ');
}

// ── Section data ──────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'w', label: 'West\nStand', lx: 12, ly: 50, a1: 155, a2: 220, floors: ['#94a3b8', '#78716c', '#57534e', '#44403c'] },
  { id: 'nw', label: 'NW\nStand', lx: 22, ly: 22, a1: 220, a2: 270, floors: ['#7dd3fc', '#22d3ee', '#06b6d4', '#e879f9'] },
  { id: 'nc', label: 'North\nCentral', lx: 50, ly: 8, a1: 270, a2: 290, floors: ['#94a3b8', '#22d3ee', '#94a3b8'] },
  { id: 'ne', label: 'NE\nStand', lx: 76, ly: 20, a1: 290, a2: 340, floors: ['#8b5cf6', '#7dd3fc', '#22d3ee', '#e879f9'] },
  { id: 'e', label: 'East\nStand', lx: 90, ly: 50, a1: 340, a2: 430, floors: ['#7c3aed', '#0e7490', '#0891b2'] },
  { id: 'se', label: 'Hill A\nSE', lx: 76, ly: 80, a1: 70, a2: 115, floors: ['#94a3b8', '#78716c'] },
  { id: 's', label: 'South\nSide', lx: 50, ly: 92, a1: 115, a2: 165, floors: ['#78716c', '#57534e', '#44403c'] },
  { id: 'sw', label: 'Hill B\nSW', lx: 24, ly: 80, a1: 165, a2: 210, floors: ['#94a3b8', '#78716c'] },
] as const;

const CX = 100, CY = 100;
const FLOOR_BANDS = [[32, 48], [48, 61], [61, 73], [73, 83]] as const;

// ── Amenity definitions (placed in concourse ring at r≈27) ─────────────────
type AmenityType = 'exit' | 'food' | 'water' | 'toilet' | 'aid' | 'parking';
interface Amenity {
  id: string; type: AmenityType; label: string;
  angle: number; // degrees
}
const AMENITIES: Amenity[] = [
  { id: 'exit1', type: 'exit', label: 'Exit Gate A', angle: 180 },
  { id: 'exit2', type: 'exit', label: 'Exit Gate B', angle: 0 },
  { id: 'exit3', type: 'exit', label: 'Exit Gate C', angle: 270 },
  { id: 'exit4', type: 'exit', label: 'Exit Gate D', angle: 90 },
  { id: 'food1', type: 'food', label: 'Food Court NE', angle: 315 },
  { id: 'food2', type: 'food', label: 'Food Court SW', angle: 135 },
  { id: 'water1', type: 'water', label: 'Water Station', angle: 45 },
  { id: 'water2', type: 'water', label: 'Water Station', angle: 225 },
  { id: 'toilet1', type: 'toilet', label: 'Restroom West', angle: 167 },
  { id: 'toilet2', type: 'toilet', label: 'Restroom East', angle: 13 },
  { id: 'toilet3', type: 'toilet', label: 'Restroom South', angle: 103 },
  { id: 'aid1', type: 'aid', label: 'First Aid', angle: 247 },
  { id: 'parking', type: 'parking', label: 'Parking / Entry', angle: 205 },
];

const AMENITY_STYLE: Record<AmenityType, { bg: string; border: string; text: string; icon: string }> = {
  exit: { bg: '#dc2626', border: '#ef4444', text: '#fff', icon: '🚪' },
  food: { bg: '#d97706', border: '#f59e0b', text: '#fff', icon: '🍔' },
  water: { bg: '#0284c7', border: '#38bdf8', text: '#fff', icon: '💧' },
  toilet: { bg: '#0891b2', border: '#22d3ee', text: '#fff', icon: '🚻' },
  aid: { bg: '#dc2626', border: '#f43f5e', text: '#fff', icon: '🏥' },
  parking: { bg: '#4338ca', border: '#818cf8', text: '#fff', icon: '🅿️' },
};

// ── Small SVG icon component (paths drawn inline) ─────────────────────────
const AmenityIcon = ({ type, x, y, size = 5 }: { type: AmenityType; x: number; y: number; size?: number }) => {
  const s = AMENITY_STYLE[type];
  const hs = size / 2;
  return (
    <g>
      {/* Background circle */}
      <circle cx={x} cy={y} r={hs + 1.5} fill={s.bg} stroke={s.border} strokeWidth="0.8" opacity="0.95" />
      {/* Icon character */}
      <text x={x} y={y + 0.3} textAnchor="middle" dominantBaseline="middle" fontSize={size - 0.5}
        fontFamily="system-ui,sans-serif" style={{ pointerEvents: 'none' }}>
        {s.icon}
      </text>
    </g>
  );
};

// ── Main StadiumBowl ───────────────────────────────────────────────────────
export const StadiumBowl = ({ standsData, onSelect }: { standsData?: Stand[]; onSelect: (id: string) => void }) => {
  const [mounted, setMounted] = useState(false);
  const [hovSection, setHovSection] = useState<string | null>(null);
  const [hovAmenity, setHovAmenity] = useState<Amenity | null>(null);
  const [amenityPos, setAmenityPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Amenities placed OUTSIDE the stadium rim at r=100
  const AMENITY_R = 100;

  return (
    <div style={{ position: 'relative', minHeight: '380px' }}>
      <div style={{ perspective: '1200px', perspectiveOrigin: '50% 40%', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ transform: 'rotateX(28deg)', transformOrigin: 'center center' }}>
          {mounted ? (
            <svg viewBox="-20 -20 240 240" style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.8))' }}>

              {/* Outer rim */}
              <circle cx={CX} cy={CY} r={90} fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

              {/* Stand Sections */}
              {SECTIONS.map(sec => {
                const isHov = hovSection === sec.id;
                const stand = standsData ? standsData.find(s => s.id === sec.id) : STANDS.find(s => s.id === sec.id);
                return (
                  <g key={sec.id} style={{ cursor: 'pointer' }}
                    onClick={() => onSelect(sec.id)}
                    onMouseEnter={() => setHovSection(sec.id)}
                    onMouseLeave={() => setHovSection(null)}>
                    {sec.floors.map((color, fi) => {
                      if (fi >= FLOOR_BANDS.length) return null;
                      const [r1, r2] = FLOOR_BANDS[fi];
                      const pathStr = sec.a2 > 360
                        ? arc(CX, CY, r1, r2, sec.a1, 360) + ' ' + arc(CX, CY, r1, r2, 0, sec.a2 - 360)
                        : arc(CX, CY, r1, r2, sec.a1, sec.a2);
                      return (
                        <path key={fi} d={pathStr}
                          fill={isHov ? '#ffffff' : color}
                          stroke="#0f172a" strokeWidth="0.4"
                          opacity={isHov ? 0.9 : 0.95}
                          style={{ transition: 'fill 0.15s' }} />
                      );
                    })}
                    <text x={sec.lx * 2} y={sec.ly * 2} textAnchor="middle" fontSize="4.2" fontWeight="800"
                      fill={isHov ? '#0f172a' : '#fff'} style={{ pointerEvents: 'none' }}>
                      {sec.label.split('\n').map((t, i) => (
                        <tspan key={i} x={sec.lx * 2} dy={i === 0 ? 0 : 5.5} fontSize="3.6">{t}</tspan>
                      ))}
                    </text>
                    {stand && (
                      <text x={sec.lx * 2} y={sec.ly * 2 + 8} textAnchor="middle" fontSize="2.8"
                        fill={isHov ? '#0f172a' : 'rgba(255,255,255,0.6)'} style={{ pointerEvents: 'none' }}>
                        {Math.round(stand.occupancyRate * 100)}% full
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Radial dividers */}
              {SECTIONS.map(sec => (
                <line key={`div-${sec.id}`}
                  x1={px(CX, 32, sec.a1)} y1={py(CY, 32, sec.a1)}
                  x2={px(CX, 88, sec.a1)} y2={py(CY, 88, sec.a1)}
                  stroke="#0f172a" strokeWidth="0.6" style={{ pointerEvents: 'none' }} />
              ))}

              {/* Inner concourse ring */}
              <circle cx={CX} cy={CY} r={32} fill="#1a2540" stroke="#2d3f60" strokeWidth="0.8" />
              {/* Concourse track */}
              <circle cx={CX} cy={CY} r={28} fill="none" stroke="#2d3f6088" strokeWidth="0.4" strokeDasharray="1 2" />

              {/* ── Amenity icons — outside stadium rim ── */}
              {AMENITIES.map(am => {
                const ax = px(CX, AMENITY_R, am.angle);
                const ay = py(CY, AMENITY_R, am.angle);
                // connector line from outer rim to icon
                const lx1 = px(CX, 90, am.angle);
                const ly1 = py(CY, 90, am.angle);
                const lx2 = px(CX, 94, am.angle);
                const ly2 = py(CY, 94, am.angle);
                return (
                  <g key={am.id} style={{ cursor: 'pointer' }}
                    onMouseEnter={() => { setHovAmenity(am); setAmenityPos({ x: ax, y: ay }); }}
                    onMouseLeave={() => { setHovAmenity(null); setAmenityPos(null); }}>
                    {/* Connector dot on rim */}
                    <line x1={lx1} y1={ly1} x2={lx2} y2={ly2}
                      stroke={AMENITY_STYLE[am.type].border} strokeWidth="0.6" opacity="0.6" />
                    <AmenityIcon type={am.type} x={ax} y={ay} size={8} />
                  </g>
                );
              })}

              {/* Pitch */}
              <ellipse cx={CX} cy={CY} rx={18} ry={18} fill="#15803d" stroke="#166534" strokeWidth="0.8" />
              <ellipse cx={CX} cy={CY} rx={18} ry={18} fill="url(#pitchGrad)" />
              <rect x={97} y={91} width={6} height={18} rx="1" fill="none" stroke="#bbf7d0" strokeWidth="0.5" opacity="0.7" />
              <line x1={88} y1={100} x2={112} y2={100} stroke="#bbf7d0" strokeWidth="0.35" opacity="0.5" />
              <text x={CX} y={CY + 1.5} textAnchor="middle" fontSize="3" fill="#bbf7d0" fontWeight="bold" style={{ pointerEvents: 'none' }}>PITCH</text>

              {/* Amenity hover tooltip in SVG */}
              {hovAmenity && amenityPos && (() => {
                // tooltip appears toward center from the icon
                const toward = amenityPos.x > 100 ? -1 : 1;
                const ttW = 40;
                const ttx = amenityPos.x + toward * (ttW / 2 + 6);
                const tty = amenityPos.y - 6;
                const s = AMENITY_STYLE[hovAmenity.type];
                return (
                  <g style={{ pointerEvents: 'none' }}>
                    <rect x={ttx - ttW / 2} y={tty} width={ttW} height={10} rx="2.5"
                      fill={s.bg} stroke={s.border} strokeWidth="0.6" opacity="0.97" />
                    <text x={ttx} y={tty + 6.2} textAnchor="middle" fontSize="3.4" fill="#fff" fontWeight="800">{hovAmenity.label}</text>
                  </g>
                );
              })()}

              <defs>
                <radialGradient id="pitchGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          ) : (
            <div style={{ width: '100%', paddingTop: '100%' }} />
          )}
        </div>

        {/* Ground shadow */}
        <div style={{ height: '14px', background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)', marginTop: '-4px' }} />
      </div>

      {/* ── Amenity Legend ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '14px', padding: '0 8px' }}>
        {(Object.entries(AMENITY_STYLE) as [AmenityType, typeof AMENITY_STYLE[AmenityType]][]).map(([type, s]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: `${s.bg}22`, border: `1px solid ${s.border}55`, borderRadius: '8px', padding: '4px 10px' }}>
            <span style={{ fontSize: '0.75rem' }}>{s.icon}</span>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, textTransform: 'capitalize' }}>{type === 'aid' ? 'First Aid' : type === 'toilet' ? 'Restroom' : type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StadiumBowl;
