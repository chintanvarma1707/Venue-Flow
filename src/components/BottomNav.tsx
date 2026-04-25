'use client';

import React from 'react';

interface BottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const BottomNav = ({ activeView, onViewChange }: BottomNavProps) => {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      id: 'seats',
      label: 'Seats',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/>
          <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/>
          <path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 4v9"/>
        </svg>
      ),
    },
    {
      id: 'map',
      label: 'Map',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
          <line x1="8" y1="2" x2="8" y2="18"/>
          <line x1="16" y1="6" x2="16" y2="22"/>
        </svg>
      ),
    },
    {
      id: 'order',
      label: 'Order',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <path d="M3 6h18"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 40px)',
      maxWidth: '420px',
      zIndex: 1000,
    }}>
      <nav style={{
        background: 'rgba(10, 15, 25, 0.85)',
        backdropFilter: 'blur(24px)',
        borderRadius: '24px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      }}>
        {tabs.map(tab => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 0',
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                fontFamily: 'inherit',
              }}
            >
              {/* Active Indicator Pillar */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  width: '32px',
                  height: '2px',
                  background: 'var(--accent-cyan)',
                  borderRadius: '10px',
                  boxShadow: '0 0 12px var(--accent-cyan)',
                }} />
              )}
              
              <div style={{
                transform: isActive ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}>
                {tab.icon}
              </div>
              
              <span style={{ 
                fontSize: '0.65rem', 
                fontWeight: isActive ? 800 : 500,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                opacity: isActive ? 1 : 0.8
              }}>
                {tab.label}
              </span>

              {/* Active background glow */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 50% 50%, var(--accent-cyan) 0%, transparent 70%)',
                  opacity: 0.1,
                  borderRadius: '16px',
                  pointerEvents: 'none'
                }} />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
