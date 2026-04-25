'use client';

import React, { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import StatusCard from '@/components/StatusCard';
import ConcessionsMenu from '@/components/ConcessionsMenu';
import SeatMap from '@/components/SeatMap';
import Cart from '@/components/Cart';
import Wayfinding from '@/components/Wayfinding';
import StadiumMapView from '@/components/StadiumMapView';
import StadiumBowl from '@/components/StadiumBowl';
import FanSync from '@/components/FanSync';
import Onboarding from '@/components/Onboarding';
import LiveScoreboard from '@/components/LiveScoreboard';
import EmergencySystem from '@/components/EmergencySystem';
import NotificationHub, { type AppNotification } from '@/components/NotificationHub';
import Image from 'next/image';

const isPadded = (view: string) => ['home'].includes(view);

export default function Home() {
  const [currentView, setCurrentView] = useState('home');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [seatCode, setSeatCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'laptop'>('mobile');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [showSOS, setShowSOS] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: '1', title: 'Welcome to VenueFlow', message: 'Your seat SF-12 is ready. Enjoy the match!', time: '1 min ago', type: 'info' }
  ]);

  // Real-time Notification Generator
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
    }, 25000); // New notification every 25 seconds
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


  const padded = isPadded(currentView);

  if (!seatCode) {
    return <Onboarding onComplete={setSeatCode} />;
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      background: '#020617', 
      color: 'white', 
      position: 'relative', 
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* VIEW MODE SWITCHER */}
      <div style={{ 
        position: 'fixed', top: '20px', right: '20px', zIndex: 2000, display: 'flex', 
        background: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', padding: '4px'
      }}>
        <button onClick={() => setViewMode('mobile')} style={{ background: viewMode === 'mobile' ? 'var(--accent-cyan)' : 'transparent', color: viewMode === 'mobile' ? '#000' : '#fff', border: 'none', padding: '8px 16px', borderRadius: '26px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>MOBILE</button>
        <button onClick={() => setViewMode('laptop')} style={{ background: viewMode === 'laptop' ? 'var(--accent-cyan)' : 'transparent', color: viewMode === 'laptop' ? '#000' : '#fff', border: 'none', padding: '8px 16px', borderRadius: '26px', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer' }}>LAPTOP</button>
      </div>

      <div style={{ 
        position: 'relative', zIndex: 1, width: '100%', maxWidth: viewMode === 'laptop' ? '1200px' : '600px',
        margin: '0 auto', paddingTop: padded ? '24px' : '0', paddingLeft: padded ? '24px' : '0',
        paddingRight: padded ? '24px' : '0', paddingBottom: '120px', transition: 'max-width 0.5s'
      }}>

        {currentView === 'home' && (
          <div key="home-view">
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: '#000' }}>C</div>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{seatCode.split('-')[0]} User</h1>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{seatCode} • 2,450 PTS</span>
                </div>
              </div>
              <button 
                onClick={() => setShowNotifications(true)}
                style={{ 
                  position: 'relative', width: '48px', height: '48px', borderRadius: '16px', 
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {notifications.length > 0 && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%', border: '2px solid #020617' }} />
                )}
              </button>
            </header>

            <div style={{ 
              display: viewMode === 'laptop' ? 'grid' : 'block',
              gridTemplateColumns: viewMode === 'laptop' ? '1.2fr 1fr' : '1fr',
              gap: '32px'
            }}>
              {/* COL 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <LiveScoreboard />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                   <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>24°C</div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>WEATHER</div>
                   </div>
                   <div style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid var(--accent-cyan)', borderRadius: '20px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>OPEN</div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>ROOF</div>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>45%</div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>HUMIDITY</div>
                   </div>
                </div>
                <FanSync />
                <Wayfinding />
              </div>

              {/* COL 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <section className="glass-morphism" style={{ padding: '24px' }}>
                   <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Live Density</h3>
                   <StadiumBowl onSelect={() => setCurrentView('map')} />
                </section>
                <section>
                   <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Amenities</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <StatusCard title="Nexa Grill" location="Gate 4" waitTime={4} status="optimal" />
                      <StatusCard title="Restroom" location="Sec 208" waitTime={12} status="congested" />
                   </div>
                </section>
                <section>
                   <h3 style={{ marginBottom: '16px', fontWeight: 800 }}>Quick Actions</h3>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button onClick={() => setCurrentView('map')} style={{ padding: '16px', borderRadius: '16px', background: 'var(--accent-cyan)', color: '#000', border: 'none', fontWeight: 900, cursor: 'pointer' }}>VISION AI</button>
                      <button onClick={() => setCurrentView('order')} style={{ padding: '16px', borderRadius: '16px', background: '#f59e0b', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}>ORDER FOOD</button>
                      <button onClick={() => setCurrentView('seats')} style={{ padding: '16px', borderRadius: '16px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}>FIND SEAT</button>
                      <button onClick={() => setShowSOS(true)} style={{ padding: '16px', borderRadius: '16px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}>SOS HELP</button>
                   </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {currentView === 'seats' && <SeatMap />}
        {currentView === 'order' && <ConcessionsMenu onAddToCart={addToCart} />}
        {currentView === 'map' && <StadiumMapView />}
      </div>

      <Cart items={cartItems} onCheckout={handleCheckout} onClear={clearCart} />
      <BottomNav activeView={currentView} onViewChange={setCurrentView} />

      {/* MODALS */}
      {showSOS && <EmergencySystem onClose={() => setShowSOS(false)} />}
      {showNotifications && (
        <NotificationHub 
          notifications={notifications} 
          onClose={() => setShowNotifications(false)} 
          onClear={() => setNotifications([])} 
        />
      )}

      {/* ── Order Success Modal ── */}
      {showOrderSuccess && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(34,211,238,0.02) 100%)',
            border: '1px solid rgba(34,211,238,0.3)',
            borderRadius: '32px', padding: '40px', textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(34,211,238,0.2)',
            animation: 'slideUpBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            maxWidth: '400px', width: '90%'
          }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-cyan)', 
              margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px var(--accent-cyan)', animation: 'pulseRing 2s infinite'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Order Placed!</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.5 }}>
              Your food is being prepared.<br/>It will be delivered to <strong style={{ color: 'var(--accent-cyan)' }}>Seat {seatCode}</strong> in ~8 minutes.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpBounce { from { transform: translateY(40px) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(34,211,238,0.7); } 70% { box-shadow: 0 0 0 20px rgba(34,211,238,0); } 100% { box-shadow: 0 0 0 0 rgba(34,211,238,0); } }
      `}</style>
    </main>
  );
}
