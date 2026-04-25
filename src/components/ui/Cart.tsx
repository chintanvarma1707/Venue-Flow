'use client';

import React from 'react';

interface CartProps {
  items: any[];
  onCheckout: () => void;
  onClear: () => void;
}

const Cart = ({ items, onCheckout, onClear }: CartProps) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  if (items.length === 0) return null;

  return (
    <div 
      className="glass-morphism" 
      style={{ 
        position: 'fixed', 
        bottom: '100px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '90%', 
        maxWidth: '400px', 
        padding: '20px', 
        zIndex: 200,
        border: '1px solid var(--accent-cyan)',
        boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h4 style={{ fontWeight: 700 }}>Your Order</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{items.length} items</p>
        </div>
        <button onClick={onClear} style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>Clear All</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Total</span>
        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>${total.toFixed(2)}</span>
      </div>

      <button 
        className="btn-primary" 
        style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
        onClick={onCheckout}
      >
        Confirm Order • Pay Now
      </button>
      
      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
        Estimated pickup: 12 mins • Level 2 Express
      </p>
    </div>
  );
};

export default Cart;
