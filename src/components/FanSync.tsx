'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Smartphone, Radio, Zap, Activity } from 'lucide-react';

const FanSync = () => {
  const [synced, setSynced] = useState(false);
  const [pulseColor, setPulseColor] = useState('#22d3ee');

  useEffect(() => {
    if (synced) {
      const interval = setInterval(() => {
        setPulseColor(prev => prev === '#22d3ee' ? '#8b5cf6' : prev === '#8b5cf6' ? '#ec4899' : '#22d3ee');
        if ('vibrate' in navigator) navigator.vibrate(100);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [synced]);

  return (
    <div style={{ padding: '0 4px', margin: 'clamp(16px, 4vw, 24px) 0' }}>
      <motion.div 
        layout onClick={() => setSynced(!synced)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        style={{ 
          background: synced ? `linear-gradient(135deg, ${pulseColor}22 0%, #020617 100%)` : 'rgba(255,255,255,0.02)',
          border: `2px solid ${synced ? pulseColor : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '32px', padding: 'clamp(24px, 6vw, 48px) 24px', cursor: 'pointer', textAlign: 'center', position: 'relative', overflow: 'hidden',
          boxShadow: synced ? `0 20px 80px ${pulseColor}33` : '0 10px 30px rgba(0,0,0,0.1)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <AnimatePresence>
          {synced && (
            <>
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }} exit={{ opacity: 0 }} transition={{ duration: 2, repeat: Infinity }}
                style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${pulseColor} 0%, transparent 70%)`, pointerEvents: 'none' }} 
              />
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i} initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0], y: [20, -100], x: (Math.random() * 40 - 20) }}
                  transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: i * 0.2 }}
                  style={{ position: 'absolute', bottom: '20%', left: '50%', width: '2px', height: '2px', borderRadius: '50%', background: pulseColor, filter: `blur(1px) drop-shadow(0 0 8px ${pulseColor})` }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            animate={synced ? { scale: [1, 1.1, 1], boxShadow: [`0 0 20px ${pulseColor}33`, `0 0 40px ${pulseColor}66`, `0 0 20px ${pulseColor}33`] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ 
              display: 'inline-flex', padding: 'clamp(16px, 4vw, 24px)', borderRadius: '22px', 
              background: synced ? pulseColor : 'rgba(255,255,255,0.04)', color: synced ? '#000' : '#fff', marginBottom: '24px'
            }}
          >
            {synced ? <Sparkles size={28} /> : <Smartphone size={28} />}
          </motion.div>

          <h3 style={{ fontSize: 'clamp(1.2rem, 5vw, 1.6rem)', fontWeight: 950, color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {synced ? 'SYNCHRONIZED' : 'FAN_SYNC_ULTRA'}
          </h3>
          
          <p style={{ fontSize: 'clamp(0.8rem, 3vw, 0.95rem)', color: synced ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: synced ? 800 : 500, maxWidth: '280px', margin: '0 auto', lineHeight: 1.5 }}>
            {synced ? 'Linked to Stadium Orchestra. Feel the pulse.' : 'Join 40k+ fans in coordinated real-time light shows.'}
          </p>
          
          <div style={{ height: '32px', marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              {synced ? (
                <motion.div 
                  key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', gap: '8px' }}
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay }}
                      style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} 
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="inactive" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}
                >
                  <Activity size={14} className="pulse-slow" />
                  <span style={{ fontSize: '0.65rem', fontWeight: 950, letterSpacing: '0.15em' }}>LINK_READY</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes pulse-slow { 0% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 0.4; } }
        .pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default FanSync;
