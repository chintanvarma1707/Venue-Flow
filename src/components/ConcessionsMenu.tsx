'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Zap, Star, Flame, Coffee, Pizza, Beer, IceCream, Utensils } from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ paddingBottom: '140px' }}>
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '24px 20px' }}
      >
        <h2 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '4px' }}>Food & <span style={{ color: 'var(--accent-cyan)' }}>Fuel</span></h2>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', marginBottom: '32px', fontWeight: 500 }}>Premium concessions delivered to your seat</p>
        
        {/* Search */}
        <motion.div 
          whileHover={{ borderColor: 'var(--accent-cyan)' }}
          style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '24px', 
            padding: '18px 24px', 
            display: 'flex', 
            gap: '14px',
            marginBottom: '32px',
            transition: 'border-color 0.3s'
          }}
        >
          <Search size={20} color="rgba(255,255,255,0.4)" />
          <input 
            placeholder="Search for snacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.1rem', outline: 'none', width: '100%', fontWeight: 500 }}
          />
        </motion.div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
          {cats.map(c => (
            <motion.button 
              key={c}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCat(c)}
              style={{
                padding: '14px 28px',
                borderRadius: '20px',
                background: activeCat === c ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                color: activeCat === c ? '#000' : '#fff',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
            >
              {c}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Smart Pickup Predictor */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ padding: '0 20px 40px' }}
      >
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(34, 211, 238, 0.2)',
          borderRadius: '28px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
          <div style={{ 
            background: 'var(--accent-cyan)', 
            padding: '14px', 
            borderRadius: '18px',
            color: '#000'
          }}>
            <Clock size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>Grab & Go: Half-Time Sync</h4>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, fontWeight: 500 }}>
              Order now to pick up exactly at the 45' whistle. <br/>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>🚶 4m walk + 🕒 6m prep</span>
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              padding: '12px 20px', 
              borderRadius: '16px', 
              fontSize: '0.8rem', 
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            SYNC NOW
          </motion.button>
        </div>
      </motion.div>

      {/* Featured Scroll */}
      <div style={{ padding: '0 0 40px' }}>
        <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-cyan)', letterSpacing: '0.15em', marginBottom: '20px', paddingLeft: '24px', textTransform: 'uppercase' }}>Popular Near You</h4>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '0 24px 24px', scrollbarWidth: 'none' }}>
          {menuItems.slice(0, 3).map(item => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => onAddToCart(item)}
              style={{
                flexShrink: 0,
                width: '300px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '32px',
                padding: '28px',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 900 }}>${item.price.toFixed(2)}</div>
              <div style={{ fontSize: '4.5rem', marginBottom: '24px' }}>{item.image}</div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.02em' }}>{item.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', lineHeight: 1.4 }}>{item.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ padding: '6px 12px', background: `${item.color}22`, color: item.color, borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900 }}>⚡ {item.wait} MIN</div>
                 <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>{item.calories}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={activeCat}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '20px' }}
        >
          {filtered.map(item => (
            <motion.div 
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -6, background: 'rgba(255,255,255,0.06)' }}
              onClick={() => onAddToCart(item)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '28px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{item.image}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h5 style={{ fontSize: '1.1rem', fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h5>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--accent-cyan)', marginBottom: '16px' }}>${item.price.toFixed(2)}</div>
              <motion.button 
                whileHover={{ background: 'var(--accent-cyan)', color: '#000' }}
                style={{ 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.08)', 
                  border: 'none', 
                  color: '#fff', 
                  padding: '12px', 
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                + ADD TO CART
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ConcessionsMenu;
