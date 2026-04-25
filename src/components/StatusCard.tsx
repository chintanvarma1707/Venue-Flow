import React from 'react';

interface StatusCardProps {
  title: string;
  location: string;
  waitTime: number;
  status: 'optimal' | 'congested' | 'moderate';
  icon?: React.ReactNode;
}

const StatusCard = ({ title, location, waitTime, status, icon }: StatusCardProps) => {
  const statusConfig = {
    optimal:   { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)', text: 'Optimal' },
    moderate:  { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', text: 'Moderate' },
    congested: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', text: 'Congested' },
  };

  const config = statusConfig[status];

  return (
    <div style={{ 
      background: 'rgba(255,255,255,0.03)', 
      border: `1px solid ${config.color}33`, 
      borderRadius: '24px', 
      padding: '16px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '16px', 
      marginBottom: '16px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}>
      {/* Subtle background glow based on status */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, transparent, ${config.color}, transparent)` }} />
      <div style={{ position: 'absolute', top: '50%', right: '-20px', width: '80px', height: '80px', background: config.color, filter: 'blur(40px)', opacity: 0.1, transform: 'translateY(-50%)' }} />

      <div style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: '16px', 
        background: config.bg, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: config.color,
        flexShrink: 0
      }}>
        {icon || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{title}</h4>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{location}</p>
      </div>

      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: config.color, lineHeight: 1 }}>{waitTime}<span style={{ fontSize: '0.8rem', marginLeft: '2px' }}>m</span></div>
        <div style={{ 
          fontSize: '0.65rem', 
          fontWeight: 800, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          background: config.bg,
          color: config.color,
          padding: '2px 8px',
          borderRadius: '8px'
        }}>
          {config.text}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
