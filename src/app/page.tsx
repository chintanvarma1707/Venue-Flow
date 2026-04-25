'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/ui/BottomNav';
import StatusCard from '@/components/ui/StatusCard';
import ConcessionsMenu from '@/components/features/ConcessionsMenu';
import SeatMap from '@/components/stadium/SeatMap';
import Cart from '@/components/ui/Cart';
import Wayfinding from '@/components/features/Wayfinding';
import StadiumMapView from '@/components/stadium/StadiumMapView';
import StadiumBowl from '@/components/stadium/StadiumBowl';
import FanSync from '@/components/features/FanSync';
import Onboarding from '@/components/auth/Onboarding';
import LiveScoreboard from '@/components/features/LiveScoreboard';
import EmergencySystem from '@/components/features/EmergencySystem';
import NotificationHub, { type AppNotification } from '@/components/ui/NotificationHub';
import { Bell, Trophy, Activity, Cloud, Wind, Droplets, Utensils, MapPin, Zap, AlertCircle } from 'lucide-react';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [seatCode, setSeatCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'laptop'>('mobile');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: '1', title: 'Welcome to ApexStadium', message: 'Your seat SF-12 is ready. Enjoy the match!', time: '1 min ago', type: 'info' }
  ]);

  useEffect(() => {
    if (!seatCode) return;
    const interval = setInterval(() => {
      const msgs = [
        { title: 'Crowd Alert', message: 'Gate 4 is experiencing high traffic. Use Gate 6 for faster exit.', type: 'alert' as const },
        { title: 'Food Ready', message: 'Nexa Grill is now serving hot burgers with 0 wait time.', type: 'success' as const },
        { title: 'Match Update', message: 'Rohit Sharma reached his half-century! What a knock!', type: 'info' as const },
        { title: 'FanSync Active', message: 'Wave your phone! Stadium light show starting in 2 mins.', type: 'info' as const },
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      setNotifications(prev => [
        { id: Date.now().toString(), ...randomMsg, time: 'Just now' },
        ...prev.slice(0, 4)
      ]);
    }, 25000);
    return () => clearInterval(interval);
  }, [seatCode]);

  const addToCart = (item: any) => {
    setCartItems(prev => [...prev, item]);
    setNotifications(prev => [
      { id: Date.now().toString(), title: 'Added to Cart', message: `${item.name} added. Ready to checkout?`, time: 'Just now', type: 'success' },
      ...prev
    ]);
  };
  
  const clearCart = () => setCartItems([]);
  const handleCheckout = () => {
    setShowOrderSuccess(true);
    clearCart();
    setTimeout(() => {
      setShowOrderSuccess(false);
      setCurrentView('home');
    }, 3500); 
  };

  if (!seatCode) {
    return <Onboarding onComplete={setSeatCode} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      background: '#020617', 
      color: 'white', 
      position: 'relative', 
      overflowX: 'hidden',
    }}>
      {/* BACKGROUND DECORATION */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)', borderRadius: '50%', top: '-200px', left: '-100px' }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(129, 140, 248, 0.08) 0%, transparent 70%)', borderRadius: '50%', bottom: '-100px', right: '-100px' }} />
      </div>

      {/* VIEW MODE SWITCHER */}
      <div style={{ 
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 1500, display: 'flex', 
        background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '32px', padding: '4px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        {['mobile', 'laptop'].map(mode => (
          <button 
            key={mode}
            onClick={() => setViewMode(mode as any)} 
            style={{ 
              background: viewMode === mode ? 'var(--accent-cyan)' : 'transparent', 
              color: viewMode === mode ? '#000' : '#fff', 
              border: 'none', padding: '8px 16px', borderRadius: '28px', 
              fontSize: '0.65rem', fontWeight: 950, cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ 
        position: 'relative', zIndex: 1, width: '100%', 
        maxWidth: viewMode === 'laptop' ? '1600px' : '600px',
        margin: '0 auto', padding: 'clamp(16px, 4vw, 32px)', paddingBottom: '140px', 
        transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}>

        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div 
              key="home-view" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }}
              style={{ display: 'grid', gridTemplateColumns: viewMode === 'laptop' ? '320px 1fr 340px' : '1fr', gap: '24px' }}
            >
              {/* --- LEFT COLUMN: PROFILE & STATS --- */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <motion.header variants={itemVariants} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 950, color: '#000' }}>{seatCode.charAt(0)}</div>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNotifications(true)} style={{ position: 'relative', width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Bell size={20} />
                      {notifications.length > 0 && <div style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid #020617' }} />}
                    </motion.button>
                  </div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 950, letterSpacing: '-0.04em', margin: 0 }}>Hello, {seatCode.split('-')[0]}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '8px', fontWeight: 700 }}>
                    <MapPin size={14} color="var(--accent-cyan)" /> {seatCode} 
                    <span style={{ opacity: 0.2 }}>|</span>
                    <Trophy size={14} color="#fbbf24" /> 2.4k PTS
                  </div>
                </motion.header>

                <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { label: 'WEATHER', value: '24°C', icon: Cloud, color: '#fff' },
                    { label: 'ROOF', value: 'OPEN', icon: Wind, color: 'var(--accent-cyan)' },
                    { label: 'HUMID', value: '45%', icon: Droplets, color: '#fff' }
                  ].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '16px 8px', textAlign: 'center' }}>
                      <item.icon size={16} color={item.color} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <div style={{ fontSize: '1rem', fontWeight: 950, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: '0.5rem', fontWeight: 800, opacity: 0.3, letterSpacing: '0.1em', marginTop: '4px' }}>{item.label}</div>
                    </div>
                  ))}
                </motion.div>

                <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <Wayfinding />
                   <FanSync />
                </motion.div>
              </div>

              {/* --- CENTER COLUMN: STADIUM & SCORE --- */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <motion.div variants={itemVariants}>
                  <LiveScoreboard />
                </motion.div>
                
                <motion.div variants={itemVariants} style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '40px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '24px', left: '32px', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Activity size={16} color="var(--accent-cyan)" />
                      <h3 style={{ fontSize: '0.85rem', fontWeight: 950, margin: 0 }}>LIVE_DIGITAL_TWIN</h3>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: '0.05em' }}>Sharjah Intl Stadium Cluster A</div>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <StadiumBowl onSelect={() => setCurrentView('map')} />
                  </div>
                </motion.div>
              </div>

              {/* --- RIGHT COLUMN: NAVIGATION & NEAR BY --- */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { id: 'map', label: 'VISION AI', icon: Activity, color: 'var(--accent-cyan)', text: '#000' },
                    { id: 'order', label: 'FOOD ORDER', icon: Utensils, color: '#f59e0b', text: '#fff' },
                    { id: 'seats', label: 'FIND SEAT', icon: MapPin, color: '#3b82f6', text: '#fff' },
                    { id: 'sos', label: 'SOS HELP', icon: AlertCircle, color: '#ef4444', text: '#fff' }
                  ].map(btn => (
                    <motion.button key={btn.id} whileHover={{ y: -4, background: btn.color, color: btn.text }} whileTap={{ scale: 0.96 }} onClick={() => btn.id === 'sos' ? setShowSOS(true) : setCurrentView(btn.id)} style={{ padding: '24px 12px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontWeight: 950, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.3s' }}>
                      <btn.icon size={22} />
                      <span style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>{btn.label}</span>
                    </motion.button>
                  ))}
                </motion.div>

                <motion.section variants={itemVariants} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '24px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontWeight: 950, fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>NEAR_YOU</h3>
                      <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>REALTIME</div>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <StatusCard title="Nexa Grill" location="Gate 4" waitTime={4} status="optimal" />
                      <StatusCard title="Washroom A" location="Sec 208" waitTime={12} status="congested" />
                   </div>
                </motion.section>
              </div>
            </motion.div>
          )}

          {currentView === 'seats' && <motion.div key="seats" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><SeatMap /></motion.div>}
          {currentView === 'order' && <motion.div key="order" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><ConcessionsMenu onAddToCart={addToCart} /></motion.div>}
          {currentView === 'map' && <motion.div key="map" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><StadiumMapView /></motion.div>}
        </AnimatePresence>
      </div>

      <Cart items={cartItems} onCheckout={handleCheckout} onClear={clearCart} />
      <BottomNav activeView={currentView} onViewChange={setCurrentView} />

      <AnimatePresence>
        {showSOS && <EmergencySystem onClose={() => setShowSOS(false)} />}
        {showNotifications && <NotificationHub notifications={notifications} onClose={() => setShowNotifications(false)} onClear={() => setNotifications([])} />}
      </AnimatePresence>

      <AnimatePresence>
        {showOrderSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(20px)' }}>
            <motion.div initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }} style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(34,211,238,0.02) 100%)', border: '1px solid rgba(34,211,238,0.4)', borderRadius: '40px', padding: '48px', textAlign: 'center', boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(34,211,238,0.2)', maxWidth: '440px', width: '90%' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-cyan)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px var(--accent-cyan)' }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
              <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '12px', letterSpacing: '-0.04em' }}>ORDER_PLACED</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.5, fontWeight: 500 }}>Preparing your request. Delivery to <strong style={{ color: 'var(--accent-cyan)' }}>Seat {seatCode}</strong> in ~8m.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
