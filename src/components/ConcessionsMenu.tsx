'use client';

import React, { useState } from 'react';

const menuItems = [
  { id: 1, name: 'Cyber Burger', price: 12.50, category: 'Food', image: '🍔', calories: '650 kcal', stall: 'Nexa Grill', wait: 8, tags: ['Popular'], color: '#f43f5e', desc: 'Double wagyu beef, neon slaw.' },
  { id: 2, name: 'Neon Hotdog', price: 8.00, category: 'Food', image: '🌭', calories: '400 kcal', stall: 'Nexa Grill', wait: 5, tags: ['Quick'], color: '#fbbf24', desc: 'Caramelized onions, mustard glow.' },
  { id: 3, name: 'Glow Soda', price: 5.50, category: 'Drinks', image: '🥤', calories: '150 kcal', stall: 'Liquid Light', wait: 2, tags: ['Best Seller'], color: '#22d3ee', desc: 'Blue raspberry electrolyte.' },
  { id: 4, name: 'Electric Fries', price: 6.50, category: 'Snacks', image: '🍟', calories: '320 kcal', stall: 'Nexa Grill', wait: 4, tags: ['Classic'], color: '#10b981', desc: 'Radioactive salt, chipotle.' },
  { id: 5, name: 'Quantum Beer', price: 11.00, category: 'Drinks', image: '🍺', calories: '210 kcal', stall: 'Liquid Light', wait: 3, tags: ['Local'], color: '#8b5cf6', desc: 'Cold-brewed zero-gravity foam.' },
  { id: 6, name: 'Data Nachos', price: 9.50, category: 'Snacks', image: '🧀', calories: '580 kcal', stall: 'Nexa Grill', wait: 6, tags: ['Sharing'], color: '#f97316', desc: 'Binary cheese, jalapeño bits.' },
  { id: 7, name: 'Sushi Node', price: 15.00, category: 'Food', image: '🍣', calories: '350 kcal', stall: 'Zenith Eats', wait: 12, tags: ['Premium'], color: '#ec4899', desc: 'Fresh Atlantic salmon, wasabi.' },
  { id: 8, name: 'Taco Protocol', price: 10.50, category: 'Food', image: '🌮', calories: '420 kcal', stall: 'Nexa Grill', wait: 7, tags: ['Trending'], color: '#f59e0b', desc: 'Spicy carnitas, micro-greens.' },
  { id: 9, name: 'Holo Pizza', price: 14.00, category: 'Food', image: '🍕', calories: '750 kcal', stall: 'Crust Tech', wait: 10, tags: ['Sharing'], color: '#ef4444', desc: 'Wood-fired, pepperoni bytes.' },
  { id: 10, name: 'Pixel Popcorn', price: 7.00, category: 'Snacks', image: '🍿', calories: '280 kcal', stall: 'Snack Matrix', wait: 3, tags: ['Classic'], color: '#fcd34d', desc: 'Caramel infused butter crunch.' },
  { id: 11, name: 'Virtual Latte', price: 6.00, category: 'Drinks', image: '☕', calories: '180 kcal', stall: 'Brew Engine', wait: 4, tags: ['Hot'], color: '#d97706', desc: 'Espresso with oat milk cloud.' },
  { id: 12, name: 'Steak Interface', price: 22.00, category: 'Food', image: '🥩', calories: '800 kcal', stall: 'VIP Lounge', wait: 15, tags: ['VIP Only'], color: '#7f1d1d', desc: 'Prime ribeye, truffle mash.' },
];

const ConcessionsMenu = ({ onAddToCart }: { onAddToCart: (item: any) => void }) => {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');

  const cats = ['All', 'Food', 'Drinks', 'Snacks'];
  const filtered = menuItems.filter(item => 
    (activeCat === 'All' || item.category === activeCat) &&
    (item.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ paddingBottom: '140px' }}>
      {/* Header Area */}
      <div style={{ padding: '24px 20px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '4px' }}>Food & <span style={{ color: 'var(--accent-cyan)' }}>Fuel</span></h2>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Premium concessions delivered to your seat</p>
        
        {/* Search */}
        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '20px', 
          padding: '16px 20px', 
          display: 'flex', 
          gap: '12px',
          marginBottom: '32px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            placeholder="Search for snacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none', width: '100%' }}
          />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
          {cats.map(c => (
            <button 
              key={c}
              onClick={() => setActiveCat(c)}
              style={{
                padding: '12px 24px',
                borderRadius: '16px',
                background: activeCat === c ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                color: activeCat === c ? '#000' : '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Pickup Predictor */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(34, 211, 238, 0.2)',
          borderRadius: '24px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ 
            background: 'var(--accent-cyan)', 
            padding: '12px', 
            borderRadius: '16px',
            color: '#000'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v10l4.5 4.5"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff', marginBottom: '2px' }}>Grab & Go: Half-Time Sync</h4>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.3 }}>
              Order now to pick up exactly at the 45' whistle. <br/>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>🚶 4m walk + 🕒 6m prep</span>
            </p>
          </div>
          <button style={{ 
            background: '#fff', 
            color: '#000', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '12px', 
            fontSize: '0.75rem', 
            fontWeight: 800 
          }}>SYNC NOW</button>
        </div>
      </div>

      {/* Featured Scroll */}
      <div style={{ padding: '0 20px 32px' }}>
        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>Popular Near You</h4>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
          {menuItems.slice(0, 3).map(item => (
            <div 
              key={item.id}
              onClick={() => onAddToCart(item)}
              style={{
                flexShrink: 0,
                width: '280px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '32px',
                padding: '24px',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800 }}>${item.price.toFixed(2)}</div>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{item.image}</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '4px' }}>{item.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>{item.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <div style={{ padding: '4px 8px', background: `${item.color}22`, color: item.color, borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900 }}>⚡ {item.wait} MIN</div>
                 <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{item.calories}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
        {filtered.map(item => (
          <div 
            key={item.id}
            onClick={() => onAddToCart(item)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.image}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h5 style={{ fontSize: '1rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h5>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--accent-cyan)', marginBottom: '12px' }}>${item.price.toFixed(2)}</div>
            <button style={{ 
              width: '100%', 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              color: '#fff', 
              padding: '10px', 
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}>+ ADD</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConcessionsMenu;
