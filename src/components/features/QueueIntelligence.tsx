'use client';

import React, { useState, useEffect } from 'react';
import { AMENITIES } from '@/lib/stadiumData';

interface VisionStats {
  zone_id: string;
  occupancy: number;
  status: string;
  count: number;
  wait_time: number;
  last_update: string;
}

const QueueIntelligence = () => {
  const [visionData, setVisionData] = useState<VisionStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/vision_data.json?t=${Date.now()}`);
        const data = await res.json();
        setVisionData(data);
      } catch (err) {
        console.error('Failed to fetch vision data', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Map vision zones to amenities
  const getWaitTime = (amenityId: string) => {
    if (amenityId === 'am-1' || amenityId === 'am-2') {
      return visionData.find(v => v.zone_id === 'Food_Court')?.wait_time || 5;
    }
    if (amenityId === 'am-3') {
      return visionData.find(v => v.zone_id === 'Gate_A')?.wait_time || 2;
    }
    return 3;
  };

  const getStatus = (waitTime: number) => {
    if (waitTime < 5) return 'low';
    if (waitTime < 15) return 'moderate';
    return 'high';
  };

  return (
    <div style={{ padding: '0 20px', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ width: '24px', height: '2px', background: '#fbbf24', boxShadow: '0 0 8px #fbbf24' }} />
        <p style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          AI Queue Predictor
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
        {AMENITIES.map((amenity) => {
          const waitTime = getWaitTime(amenity.id);
          const status = getStatus(waitTime);
          
          return (
            <div key={amenity.id} style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '16px', 
              padding: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                width: '40px', 
                height: '40px', 
                background: status === 'low' ? '#4ade80' : status === 'moderate' ? '#fbbf24' : '#f43f5e',
                filter: 'blur(30px)',
                opacity: 0.1
              }} />
              
              <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
                {amenity.type === 'washroom' ? '🚻' : amenity.type === 'food' ? '🍔' : '🚪'}
              </div>
              
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{amenity.name}</h4>
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>{amenity.location}</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 900, 
                  color: status === 'low' ? '#4ade80' : status === 'moderate' ? '#fbbf24' : '#f43f5e' 
                }}>
                  {waitTime}
                </span>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>MINS</span>
              </div>

              {status === 'high' && (
                <div style={{ fontSize: '0.5rem', color: '#f43f5e', fontWeight: 800, marginTop: '8px' }}>⚠️ HIGH CONGESTION</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QueueIntelligence;

