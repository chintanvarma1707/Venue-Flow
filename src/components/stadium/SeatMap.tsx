'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STANDS, generateSeats, SEAT_TOP, SEAT_SIDE, type Stand, AMENITIES } from '@/lib/stadiumData';
import StadiumBowl from './StadiumBowl';
import { ChevronLeft, MapPin, Users, Star, Shield, Info, Activity } from 'lucide-react';

// ─── Stat Card Component with Animation ───
const StatCard = ({ label, value, color, delay }: { label: string, value: string | number, color: string, delay: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = typeof value === 'string' ? parseInt(value.replace(/,/g, '')) : value;
    if (isNaN(end)) return;
    const duration = 1500;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      style={{
        padding: 'clamp(12px, 3vw, 24px) 8px', textAlign: 'center',
        background: 'rgba(2, 6, 23, 0.4)', backdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(255,255,255,0.05)', position: 'relative'
      }}>
      <div style={{ fontSize: 'clamp(1rem, 4.5vw, 1.4rem)', fontWeight: 950, color: color, marginBottom: '2px', letterSpacing: '-0.04em' }}>
        {typeof value === 'string' && value.includes(',') ? count.toLocaleString() : count}
      </div>
      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900 }}>{label}</div>
    </motion.div>
  );
};

// ─── Stand 3D Seat View ───────────────────────────────────────────────────────
const StandView = ({ stand, onBack }: { stand: Stand; onBack: () => void }) => {
  const [seats, setSeats] = useState(() => generateSeats(stand));
  const [hov, setHov] = useState<string | null>(null);
  const [clickedSeat, setClickedSeat] = useState<string | null>(null);
  const hovRC = hov ? hov.split('-').map(Number) : null;

  useEffect(() => {
    const freshSeats = generateSeats(stand);
    setSeats(currentSeats => {
      return freshSeats.map((row, r) => row.map((cell, c) => {
        if (currentSeats[r][c] === 'mine') return 'mine';
        return cell;
      }));
    });
  }, [stand.occupancyRate]);

  const stats = useMemo(() => {
    let e = 0, o = 0, v = 0, m = 0;
    seats.forEach(r => r.forEach(s => {
      if (s === 'empty') e++;
      else if (s === 'occupied') o++;
      else if (s === 'vip') v++;
      else if (s === 'mine') m++;
    }));
    return { empty: e, occupied: o + m, vip: v, total: stand.rows * stand.cols };
  }, [seats, stand]);

  const pct = Math.round(stats.occupied / stats.total * 100);

  const handleSeatClick = (rIdx: number, cIdx: number, status: string) => {
    if (status === 'empty') {
      const newSeats = [...seats];
      newSeats[rIdx] = [...newSeats[rIdx]];
      newSeats[rIdx][cIdx] = 'mine';
      setSeats(newSeats);
      setClickedSeat(`${rIdx}-${cIdx}`);
      setTimeout(() => setClickedSeat(null), 800);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', background: '#020617', color: '#fff', fontFamily: 'Inter, sans-serif', paddingBottom: '120px' }}
    >
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(180deg, ${stand.color}15 0%, transparent 100%)`,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: 'clamp(20px, 5vw, 40px) clamp(16px, 4vw, 32px)',
      }}>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onBack} 
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.7rem', fontWeight: 900,
            cursor: 'pointer', marginBottom: '20px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: '12px'
          }}>
          <ChevronLeft size={14} strokeWidth={3} /> BACK_MAP
        </motion.button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
              <div className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: stand.color, boxShadow: `0 0 15px ${stand.color}` }} />
              <h2 style={{ fontSize: 'clamp(1.2rem, 6vw, 2rem)', fontWeight: 950, letterSpacing: '-0.04em', margin: 0 }}>{stand.label}</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>
              <span style={{ color: stand.color }}>SEC_{stand.id.toUpperCase()}</span>
              <span>•</span>
              <span>{stand.capacity} SEATS</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'clamp(1.5rem, 8vw, 2.5rem)', fontWeight: 950, color: stand.color, lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900, letterSpacing: '0.1em' }}>CAPACITY</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <StatCard label="Total" value={stand.capacity} color="#fff" delay={0.1} />
        <StatCard label="Empty" value={stats.empty} color={stand.color} delay={0.2} />
      </div>

      <div style={{ position: 'relative', background: '#000', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ 
          minHeight: '400px', padding: '40px 10px', perspective: '1000px', perspectiveOrigin: '50% 0%',
          background: 'radial-gradient(circle at center, #0a1628 0%, #000 100%)' 
        }}>
          <div style={{ transform: 'rotateX(25deg)', transformOrigin: 'top center', minWidth: '500px', margin: '0 auto' }}>
            {seats.map((row, rIdx) => (
              <motion.div 
                key={rIdx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: rIdx * 0.03 }}
                style={{
                  display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '5px',
                  width: `${80 + rIdx * 1}%`, margin: '0 auto 5px'
                }}
              >
                <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.1)', minWidth: '12px', fontWeight: 950 }}>{String.fromCharCode(65 + rIdx)}</span>
                {row.map((status, cIdx) => (
                  <motion.div 
                    key={cIdx} onMouseEnter={() => setHov(`${rIdx}-${cIdx}`)} onMouseLeave={() => setHov(null)}
                    onClick={() => handleSeatClick(rIdx, cIdx, status)} whileHover={{ y: -5, scale: 1.3 }}
                    style={{
                      width: 'clamp(12px, 2vw, 18px)', height: 'clamp(10px, 1.8vw, 15px)', position: 'relative',
                      background: hov === `${rIdx}-${cIdx}` ? '#fff' : SEAT_TOP[status],
                      borderRadius: '2px', cursor: status === 'empty' ? 'pointer' : 'default',
                      boxShadow: status === 'mine' ? '0 0 10px #22d3ee' : 'none',
                    }}
                  />
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        padding: '20px', background: 'rgba(15, 23, 42, 0.85)', borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', backdropFilter: 'blur(20px)'
      }}>
        {[
          { color: '#1d4ed8', label: 'OPEN' },
          { color: '#374151', label: 'TAKEN' },
          { color: '#d97706', label: 'VIP' },
          { color: '#22d3ee', label: 'MINE' }
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: item.color }} />
            <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 950 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, width: '90%', maxWidth: '380px' }}>
        <AnimatePresence mode="wait">
          {hovRC ? (
            <motion.div 
              key="tip" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{
                padding: '14px 20px', background: 'rgba(34, 211, 238, 0.1)', border: `1px solid ${stand.color}44`,
                borderRadius: '16px', backdropFilter: 'blur(32px)', display: 'flex', gap: '16px', alignItems: 'center',
                boxShadow: `0 10px 40px rgba(0,0,0,0.5)`
              }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.55rem', color: stand.color, fontWeight: 950 }}>SEAT_HUD</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 950 }}>{String.fromCharCode(65 + hovRC[0])}{hovRC[1] + 1}</div>
              </div>
              <div style={{ background: stand.color, color: '#000', padding: '6px 12px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 950 }}>
                {seats[hovRC[0]][hovRC[1]] === 'mine' ? 'VERIFIED' : 'RESERVE'}
              </div>
            </motion.div>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.15em' }}>
              INTERACTIVE_SEATING_LAYER
            </div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.6; } }
      `}</style>
    </motion.div>
  );
};

// ─── Main SeatMap ─────────────────────────────────────────────────────────────
const SeatMap = () => {
  const [standsData, setStandsData] = useState<Stand[]>(STANDS);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const fetchStands = async () => {
      try {
        const res = await fetch('/stadium_state.json?t=' + Date.now());
        const data = await res.json();
        setStandsData(prev => prev.map(s => {
          const match = data.find((d: any) => d.id === s.id);
          if (match) return { ...s, occupancyRate: match.occupancyRate };
          return s;
        }));
      } catch (err) { console.error('Failed fetch', err); }
    };
    fetchStands();
    const interval = setInterval(fetchStands, 2000);
    return () => clearInterval(interval);
  }, []);

  const stand = standsData.find(s => s.id === selected);
  const handleSelect = (id: string) => { window.scrollTo({ top: 0 }); setSelected(id); };
  const handleBack = () => { window.scrollTo({ top: 0 }); setSelected(null); };

  return (
    <AnimatePresence mode="wait">
      {stand ? (
        <StandView key="stand" stand={stand} onBack={handleBack} />
      ) : (
        <motion.div 
          key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ minHeight: '100vh', background: '#020617', color: '#fff', fontFamily: 'Inter, sans-serif' }}
        >
          <div style={{ padding: 'clamp(24px, 8vw, 60px) 24px 24px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 8vw, 2.4rem)', fontWeight: 950, letterSpacing: '-0.04em', margin: 0 }}>Seat_Hologram</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <MapPin size={14} color="var(--accent-cyan)" />
              <p style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 900, letterSpacing: '0.1em' }}>SHARJAH_INTL_HUB</p>
            </div>
          </div>

          <div style={{ padding: '0 16px' }}>
            <StadiumBowl standsData={standsData} onSelect={handleSelect} />
          </div>

          <div style={{ padding: '32px 24px 140px' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 950, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginBottom: '20px' }}>ZONE_DIAGNOSTICS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {standsData.map((s, i) => (
                <motion.button
                  key={s.id} whileTap={{ scale: 0.98 }} onClick={() => handleSelect(s.id)}
                  style={{
                    background: 'rgba(255,255,255,0.015)', border: `1px solid ${s.color}22`,
                    borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px',
                    color: '#fff', cursor: 'pointer', textAlign: 'left', width: '100%'
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 950, fontSize: '1rem', letterSpacing: '-0.02em' }}>{s.label}</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>{Math.round(s.occupancyRate * 100)}% OCCUPANCY</div>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 950, color: s.color }}>{s.id.toUpperCase()}</div>
                </motion.button>
              ))}
            </div>
          </div>
          <style jsx>{`
            .pulse { animation: pulse 2s infinite; }
            @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.5; } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SeatMap;
