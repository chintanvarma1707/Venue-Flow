'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VisionStats {
  zone_id: string;
  occupancy: number;
  status: string;
  count: number;
  wait_time: number;
  last_update: string;
}

const Heatmap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visionData, setVisionData] = useState<VisionStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/vision_data.json?t=${Date.now()}`);
        const data = await res.json();
        setVisionData(data);
      } catch (err) {
        // retry silently;
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw base stadium outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(canvas.width/2, canvas.height/2, canvas.width*0.4, canvas.height*0.35, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Map vision data to points
      const points = visionData.map((v, i) => ({
        x: i % 2 === 0 ? 0.3 : 0.7,
        y: i < 2 ? 0.3 : 0.7,
        intensity: v.occupancy / 100,
        label: v.zone_id
      }));

      // Draw heatmap points
      points.forEach(p => {
        const x = p.x * canvas.width;
        const y = p.y * canvas.height;
        const radius = 120 * p.intensity;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const color = p.intensity > 0.7 ? '239, 68, 68' : p.intensity > 0.4 ? '251, 191, 36' : '34, 211, 238';
        
        gradient.addColorStop(0, `rgba(${color}, 0.6)`);
        gradient.addColorStop(0.5, `rgba(${color}, 0.2)`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(p.label, x, y);
      });

      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animId);
    };
  }, [visionData]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '300px', 
      background: 'rgba(255,255,255,0.02)', 
      borderRadius: '24px', 
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', letterSpacing: '0.1em' }}>LIVE HEATMAP</h3>
        <p style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>VISION ENGINE ACTIVE</p>
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

export default Heatmap;

