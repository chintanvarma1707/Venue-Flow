'use client';

import React, { useState } from 'react';
import StadiumBowl from './StadiumBowl';

interface OnboardingProps {
  onComplete: (seat: string) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [seatCode, setSeatCode] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [step, setStep] = useState(1);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (seatCode.length < 3) return;
    setIsLocating(true);
    
    // Simulate finding seat animation
    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        onComplete(seatCode);
      }, 2500);
    }, 1500);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 5000, 
      background: '#020617', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px',
      fontFamily: 'Inter, sans-serif',
      color: '#fff'
    }}>
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--accent-cyan)', filter: 'blur(150px)', opacity: 0.1 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: '#8b5cf6', filter: 'blur(150px)', opacity: 0.1 }} />

      {step === 1 && (
        <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center', zIndex: 1 }} className="slide-up">
          <div style={{ 
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #3b82f6 100%)', 
            width: '80px', height: '80px', borderRadius: '24px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 32px',
            boxShadow: '0 0 40px rgba(34,211,238,0.4)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/><path d="M4 18v2"/><path d="M20 18v2"/></svg>
          </div>
          
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '12px' }}>
            Welcome to <span style={{ color: 'var(--accent-cyan)' }}>ApexStadium</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.5 }}>
            Enter your seat number to begin your premium stadium experience.
          </p>

          <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                autoFocus
                placeholder="Ex: SF-12 or SEC-204"
                value={seatCode}
                onChange={(e) => setSeatCode(e.target.value.toUpperCase())}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '2px solid rgba(255,255,255,0.1)', 
                  padding: '20px 24px', 
                  borderRadius: '20px', 
                  fontSize: '1.2rem', 
                  color: '#fff',
                  fontWeight: 700,
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-cyan)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            
            <button 
              disabled={seatCode.length < 3 || isLocating}
              type="submit"
              style={{ 
                background: isLocating ? 'transparent' : 'var(--accent-cyan)', 
                color: '#000', 
                border: isLocating ? '2px solid var(--accent-cyan)' : 'none', 
                padding: '20px', 
                borderRadius: '20px', 
                fontSize: '1.1rem', 
                fontWeight: 900,
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                opacity: seatCode.length < 3 ? 0.5 : 1
              }}
            >
              {isLocating ? (
                <>
                  <div className="pulse" style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                  <span style={{ color: 'var(--accent-cyan)' }}>LOCATING SEAT...</span>
                </>
              ) : (
                'GET STARTED'
              )}
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }} className="fade-in">
           <div style={{ position: 'relative', marginBottom: '40px' }}>
              <StadiumBowl onSelect={() => {}} />
              {/* Highlight Overlay */}
              <div style={{ 
                position: 'absolute', 
                top: '45%', 
                left: '25%', 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'var(--accent-cyan)', 
                boxShadow: '0 0 50px var(--accent-cyan)',
                opacity: 0.6,
                animation: 'ping 1.5s infinite'
              }} />
           </div>
           <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>Seat Found!</h2>
           <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Your premium assistant is ready for {seatCode}</p>
        </div>
      )}

      <style jsx>{`
        @keyframes ping { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
        .slide-up { animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .fade-in { animation: fadeIn 0.8s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Onboarding;
