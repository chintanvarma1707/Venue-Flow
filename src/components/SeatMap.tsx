'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { STANDS, generateSeats, SEAT_TOP, SEAT_SIDE, type Stand } from './stadiumData';
import { StadiumBowl } from './StadiumBowl';

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
    <div style={{ 
      padding: '20px 10px', 
      textAlign: 'center', 
      background: 'rgba(2, 6, 23, 0.4)', 
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      animation: `fadeSlideIn 0.8s ease-out ${delay}s both`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '40px', 
        height: '2px', 
        background: color,
        boxShadow: `0 0 10px ${color}`
      }} />
      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: color, marginBottom: '4px', letterSpacing: '-0.02em' }}>
        {typeof value === 'string' && value.includes(',') ? count.toLocaleString() : count}
      </div>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>{label}</div>
    </div>
  );
};

// ─── Stand 3D Seat View ───────────────────────────────────────────────────────
const StandView = ({ stand, onBack }: { stand: Stand; onBack: () => void }) => {
  const [seats, setSeats] = useState(() => generateSeats(stand));
  const [hov, setHov] = useState<string | null>(null);
  const [clickedSeat, setClickedSeat] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const hovRC = hov ? hov.split('-').map(Number) : null;
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // React to live occupancy changes from Admin Dashboard
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
      setTimeout(() => setClickedSeat(null), 500);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* ── Holographic Header ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: `linear-gradient(180deg, ${stand.color}15 0%, transparent 100%)`,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '30px 24px 20px',
      }}>
        {/* Animated Scanning Line */}
        <div className="scan-line" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '2px', 
          background: `linear-gradient(90deg, transparent, ${stand.color}, transparent)`,
          zIndex: 2,
          opacity: 0.5
        }} />

        <button onClick={onBack} className="btn-hover" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'rgba(255,255,255,0.5)', 
          fontSize: '0.8rem', 
          cursor: 'pointer', 
          marginBottom: '20px', 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          padding: '8px 16px', 
          borderRadius: '12px',
          fontFamily: 'inherit',
          transition: 'all 0.3s'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
          BACK TO STANDS
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ animation: 'fadeSlideIn 0.8s ease-out forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div className="pulse" style={{ width: 12, height: 12, borderRadius: '50%', background: stand.color, boxShadow: `0 0 15px ${stand.color}` }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em' }}>{stand.label}</h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
              {stand.rows} ROWS · {stand.cols} SEATS · <span style={{ color: stand.color }}>SEC {stand.id.toUpperCase()}</span>
            </p>
          </div>
          <div style={{ textAlign: 'right', animation: 'fadeSlideIn 0.8s ease-out 0.2s both' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: stand.color, lineHeight: 1, letterSpacing: '-0.05em' }}>{pct}%</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, marginTop: '4px', letterSpacing: '0.1em' }}>OCCUPANCY</div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div style={{ marginTop: '24px', position: 'relative' }}>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div className="progress-fill" style={{ 
              height: '100%', 
              width: `${pct}%`, 
              background: `linear-gradient(90deg, ${stand.color}88, ${stand.color})`, 
              borderRadius: '10px', 
              boxShadow: `0 0 20px ${stand.color}66`, 
              transition: 'width 2s cubic-bezier(0.34, 1.56, 0.64, 1)' 
            }} />
          </div>
        </div>
      </div>

      {/* ── Premium Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(255,255,255,0.05)' }}>
        <StatCard label="Capacity" value={stand.capacity.toLocaleString()} color="#fff" delay={0.1} />
        <StatCard label="Occupied" value={stats.occupied} color="rgba(255,255,255,0.6)" delay={0.2} />
        <StatCard label="Available" value={stats.empty} color={stand.color} delay={0.3} />
        <StatCard label="VIP / Box" value={stats.vip} color="#fbbf24" delay={0.4} />
      </div>

      {/* ── 3D Atmosphere View ── */}
      <div style={{ position: 'relative', background: '#000' }}>
        {/* Dynamic Grid Background */}
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.15 }} />
        
        {/* Night sky with moving stars */}
        <div style={{ height: '120px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #020617 0%, #060a14 100%)' }}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className="star" style={{ 
              position: 'absolute', 
              width: i % 10 === 0 ? '2px' : '1px', 
              height: i % 10 === 0 ? '2px' : '1px', 
              borderRadius: '50%', 
              background: '#fff', 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`
            }} />
          ))}
          
          {/* Floodlights with flare */}
          {[-1, 1].map(s => (
            <div key={s} style={{ position: 'absolute', bottom: 0, [s === -1 ? 'left' : 'right']: '12%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5 }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ 
                    width: '10px', 
                    height: '6px', 
                    background: '#fff', 
                    borderRadius: '2px', 
                    boxShadow: '0 0 15px #fff, 0 0 30px var(--accent-cyan)' 
                  }} />
                ))}
              </div>
              <div style={{ width: '4px', height: '60px', background: 'linear-gradient(#475569, #1e293b)', borderRadius: '2px' }} />
            </div>
          ))}

          {/* Center Pitch Glow */}
          <div className="pitch-glow" style={{ 
            position: 'absolute', 
            bottom: '-20px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '400px', 
            height: '100px', 
            background: 'radial-gradient(ellipse, rgba(34, 211, 238, 0.2) 0%, transparent 70%)',
            zIndex: 1
          }} />
        </div>

        {/* Pitch Surface */}
        <div style={{ height: '40px', position: 'relative', overflow: 'hidden', background: '#064e3b' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #022c22, #064e3b 30%, #059669 50%, #064e3b 70%, #022c22)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <div className="crease" style={{ 
              width: '80px', 
              height: '20px', 
              border: '2px solid rgba(255,255,255,0.2)', 
              borderRadius: '4px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', fontWeight: 900, letterSpacing: '0.2em' }}>FIELD OF PLAY</span>
            </div>
          </div>
        </div>

        {/* ── Animated 3D Seat Map ── */}
        <div style={{ 
          perspective: '1200px', 
          perspectiveOrigin: '50% -10%', 
          background: 'radial-gradient(circle at center, #0a1628 0%, #020617 100%)',
          paddingTop: '20px',
          paddingBottom: '40px'
        }}>
          <div style={{ 
            transform: 'rotateX(25deg)', 
            transformOrigin: 'top center', 
            opacity: mounted ? 1 : 0, 
            transition: 'opacity 1s ease-out' 
          }}>
            {seats.map((row, rIdx) => {
              const w = Math.min(65 + rIdx * 1.5, 98);
              const scale = 1 - rIdx * 0.005;
              const sw = Math.max(12, 16 - rIdx * 0.15);
              const gap = Math.max(2, 3 - rIdx * 0.05);
              
              return (
                <div key={rIdx} style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'flex-end', 
                  gap: `${gap}px`, 
                  width: `${w}%`, 
                  margin: `0 auto ${4 + rIdx * 0.1}px`, 
                  transform: `scale(${scale})`, 
                  transformOrigin: 'center bottom',
                  animation: `rowEntry 0.6s ease-out ${rIdx * 0.05}s both`
                }}>
                  <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.1)', minWidth: '15px', textAlign: 'right', fontWeight: 900 }}>{String.fromCharCode(65+rIdx)}</span>
                  {row.map((status, cIdx) => {
                    const sid = `${rIdx}-${cIdx}`;
                    const isH = hov === sid;
                    const isClicked = clickedSeat === sid;
                    
                    return (
                      <div key={cIdx} 
                        onMouseEnter={() => setHov(sid)} 
                        onMouseLeave={() => setHov(null)}
                        onClick={() => handleSeatClick(rIdx, cIdx, status)}
                        style={{ 
                          width: `${sw}px`, 
                          height: `${sw * 0.9}px`, 
                          position: 'relative', 
                          cursor: status === 'empty' ? 'pointer' : 'default', 
                          transform: isClicked ? 'translateY(-15px) scale(2)' : isH ? 'translateY(-8px) scale(1.6)' : 'none', 
                          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
                          zIndex: isH || isClicked ? 100 : 1 
                        }}
                      >
                        {/* Seat Base */}
                        <div style={{ 
                          position: 'absolute', 
                          inset: 0, 
                          background: isH ? '#fff' : SEAT_TOP[status], 
                          borderRadius: '3px 3px 1px 1px', 
                          boxShadow: isH ? `0 0 20px #fff` : status === 'mine' ? `0 0 15px #22d3ee` : 'none',
                          transition: 'all 0.3s ease'
                        }} />
                        {/* Seat Front Depth */}
                        <div style={{ 
                          position: 'absolute', 
                          bottom: '-4px', 
                          left: 0, 
                          right: 0, 
                          height: '5px', 
                          background: isH ? '#cbd5e1' : SEAT_SIDE[status], 
                          borderRadius: '0 0 3px 3px',
                          transition: 'all 0.3s ease'
                        }} />
                        
                        {isClicked && <div className="seat-ripple" />}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Dynamic Legend ── */}
      <div style={{ 
        padding: '24px 20px', 
        background: 'rgba(2, 6, 23, 0.8)', 
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '24px', 
        flexWrap: 'wrap',
        backdropFilter: 'blur(20px)'
      }}>
        {[
          { color: '#1d4ed8', label: 'Available', glow: 'rgba(29, 78, 216, 0.3)' },
          { color: '#374151', label: 'Occupied', glow: 'transparent' },
          { color: '#d97706', label: 'VIP / Box', glow: 'rgba(217, 119, 6, 0.3)' },
          { color: '#22d3ee', label: 'Your Seat', glow: 'rgba(34, 211, 238, 0.5)' }
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '16px', 
              height: '10px', 
              borderRadius: '3px', 
              background: item.color,
              boxShadow: `0 0 10px ${item.glow}`
            }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── Hover Interactive Tooltip ── */}
      <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {hovRC ? (
          <div className="fade-in" style={{ 
            padding: '12px 24px', 
            background: 'rgba(34, 211, 238, 0.1)', 
            border: `1px solid ${stand.color}`, 
            borderRadius: '20px', 
            display: 'flex', 
            gap: '20px', 
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 30px ${stand.color}22`
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: stand.color, fontWeight: 900 }}>ROW</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{String.fromCharCode(65+hovRC[0])}</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: stand.color, fontWeight: 900 }}>SEAT</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{hovRC[1]+1}</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
              {seats[hovRC[0]][hovRC[1]] === 'mine' ? '✨ CONFIRMED' : 'OPEN FOR BOOKING'}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.1em' }}>HOVER OVER A SEAT TO VIEW DETAILS</p>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scan-line { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes rowEntry { from { opacity: 0; transform: scale(0.9) translateY(20px) rotateX(20deg); } to { opacity: 1; transform: scale(1) translateY(0) rotateX(25deg); } }
        @keyframes twinkle { from { opacity: 0.2; transform: scale(1); } to { opacity: 1; transform: scale(1.5); } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
        
        .scan-line { animation: scan-line 4s linear infinite; }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
        }
        .seat-ripple {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 100%; height: 100%; border: 2px solid #22d3ee; border-radius: 50%;
          animation: ripple 0.6s ease-out forwards;
        }
        @keyframes ripple { 0% { width: 0%; height: 0%; opacity: 1; } 100% { width: 400%; height: 400%; opacity: 0; } }
        .fade-in { animation: fadeSlideIn 0.3s ease-out forwards; }
        .btn-hover:hover { background: rgba(255,255,255,0.1) !important; color: #fff !important; transform: translateY(-2px); }
      `}</style>
    </div>
  );
};

// ─── Main SeatMap ─────────────────────────────────────────────────────────────
const SeatMap = () => {
  const [standsData, setStandsData] = useState<Stand[]>(STANDS);
  
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
      } catch (err) {
        console.error('Failed to fetch stadium state', err);
      }
    };
    fetchStands();
    const interval = setInterval(fetchStands, 2000);
    return () => clearInterval(interval);
  }, []);

  const [selected, setSelected] = useState<string | null>(null);
  const stand = standsData.find(s => s.id === selected);

  const handleSelect = (id: string) => { window.scrollTo({ top: 0, behavior: 'instant' }); setSelected(id); };
  const handleBack  = ()           => { window.scrollTo({ top: 0, behavior: 'instant' }); setSelected(null); };

  if (stand) return (
    <div key={selected} className="fade-in">
      <StandView stand={stand} onBack={handleBack} />
    </div>
  );

  const totalSeats = standsData.reduce((a,s) => a+s.capacity, 0);
  const avgOccupancy = Math.round(standsData.reduce((a,s) => a+s.occupancyRate, 0) / standsData.length * 100);

  return (
    <div key="picker" className="fade-in" style={{ minHeight: '100vh', background: '#020617', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      {/* ── Dynamic Header ── */}
      <div style={{ position: 'relative', padding: '40px 24px 20px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-50px', width: '300px', height: '300px', background: 'var(--accent-cyan)', filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ animation: 'fadeSlideIn 0.8s ease-out' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.05em', background: 'linear-gradient(90deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Seat Selection
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 800, marginTop: '4px', letterSpacing: '0.1em' }}>SHARJAH INTERNATIONAL STADIUM</p>
          </div>
          <div style={{ background: 'rgba(34, 211, 238, 0.1)', padding: '8px 16px', borderRadius: '24px', border: '1px solid rgba(34, 211, 238, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="pulse" style={{ width: '8px', height: '8px', background: 'var(--accent-cyan)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>LIVE FEED</span>
          </div>
        </div>
      </div>

      {/* ── Premium Summary Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '0 24px', marginBottom: '32px' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '24px', 
          padding: '20px', 
          animation: 'fadeSlideIn 0.8s ease-out 0.1s both',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '8px' }}>Total Capacity</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{totalSeats.toLocaleString()}</div>
          <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', fontSize: '3rem', opacity: 0.05 }}>🏟️</div>
        </div>
        <div style={{ 
          background: 'rgba(34, 211, 238, 0.03)', 
          border: '1px solid rgba(34, 211, 238, 0.1)', 
          borderRadius: '24px', 
          padding: '20px', 
          animation: 'fadeSlideIn 0.8s ease-out 0.2s both',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '8px' }}>Avg Occupancy</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>{avgOccupancy}%</div>
          <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', fontSize: '3rem', opacity: 0.05 }}>📈</div>
        </div>
      </div>

      {/* ── 3D Interactive Bowl ── */}
      <div style={{ padding: '0 12px', animation: 'fadeSlideIn 1s ease-out 0.3s both' }}>
        <StadiumBowl standsData={standsData} onSelect={handleSelect} />
      </div>

      {/* ── Stand Selection Grid ── */}
      <div style={{ padding: '40px 24px 140px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.1)' }} />
          <h3 style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)' }}>EXPLORE STANDS</h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {standsData.map((s, i) => {
            const pct = Math.round(s.occupancyRate * 100);
            return (
              <button 
                key={s.id} 
                onClick={() => handleSelect(s.id)}
                className="btn-hover"
                style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  border: `1px solid ${s.color}33`, 
                  borderRadius: '20px', 
                  padding: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '20px', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  textAlign: 'left', 
                  width: '100%', 
                  transition: 'all 0.3s',
                  animation: `fadeSlideIn 0.5s ease-out ${0.4 + i * 0.05}s both`
                }}
              >
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '14px', 
                  background: `${s.color}15`, 
                  border: `1px solid ${s.color}33`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0 
                }}>
                  <div className="pulse" style={{ width: 12, height: 12, borderRadius: '50%', background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '8px', letterSpacing: '-0.02em' }}>{s.label}</div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: '10px', boxShadow: `0 0 10px ${s.color}44` }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: s.color }}>{pct}%</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>{s.capacity.toLocaleString()} SEATS</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } 100% { transform: scale(1); opacity: 1; } }
        .fade-in { animation: fadeSlideIn 0.8s ease-out forwards; }
        .pulse { animation: pulse 2s infinite ease-in-out; }
        .btn-hover:hover { background: rgba(255,255,255,0.06) !important; border-color: #fff !important; transform: translateX(8px); }
      `}</style>
    </div>
  );
};

export default SeatMap;

