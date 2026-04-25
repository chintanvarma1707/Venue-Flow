// Real Sharjah Cricket Stadium data
export type SeatStatus = 'empty' | 'occupied' | 'vip' | 'mine';

export interface Stand {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  rows: number;
  cols: number;
  capacity: number;           // real capacity
  occupancyRate: number;
  // SVG arc: start/end angles (degrees, 0=top, clockwise)
  startAngle: number;
  endAngle: number;
  labelAngle: number;          // where to place text on ring
}

export const STANDS: Stand[] = [
  { id: 'nw',  label: 'North-West Stand',   shortLabel: 'NW Stand',   color: '#fbbf24', rows: 18, cols: 32, capacity: 3800, occupancyRate: 0.70, startAngle: 210, endAngle: 310, labelAngle: 260 },
  { id: 'ne',  label: 'North-East Stand',   shortLabel: 'NE Stand',   color: '#f97316', rows: 18, cols: 32, capacity: 3200, occupancyRate: 0.78, startAngle: 310, endAngle: 390, labelAngle: 350 },
  { id: 'e',   label: 'East Stand',         shortLabel: 'East Stand', color: '#22d3ee', rows: 16, cols: 28, capacity: 2800, occupancyRate: 0.62, startAngle: 390, endAngle: 480, labelAngle: 435 },
  { id: 'se',  label: 'South-East Stand',   shortLabel: 'SE Stand',   color: '#a78bfa', rows: 14, cols: 24, capacity: 2200, occupancyRate: 0.55, startAngle: 480, endAngle: 540, labelAngle: 510 },
  { id: 'sw',  label: 'South-West Stand',   shortLabel: 'SW Stand',   color: '#4ade80', rows: 14, cols: 24, capacity: 2000, occupancyRate: 0.48, startAngle: 540, endAngle: 600, labelAngle: 570 },
  { id: 'w',   label: 'West Stand (VIP)',   shortLabel: 'West VIP',   color: '#f43f5e', rows: 16, cols: 28, capacity: 2500, occupancyRate: 0.91, startAngle: 600, endAngle: 690, labelAngle: 645 },
];

// Seeded RNG for stable, consistent seat states
function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

export function generateSeats(stand: Stand): SeatStatus[][] {
  const rand = rng(stand.id.charCodeAt(0) * 999 + stand.capacity);
  return Array.from({ length: stand.rows }, (_, r) =>
    Array.from({ length: stand.cols }, (_, c) => {
      // fixed "my seat" at row 6, col middle
      if (r === 6 && c === Math.floor(stand.cols / 2)) return 'mine';
      const v = rand();
      if (v < stand.occupancyRate * 0.9) return 'occupied';
      if (v < stand.occupancyRate * 0.9 + 0.05) return 'vip';
      return 'empty';
    })
  );
}

// Degrees to radians helper
export function deg2rad(d: number) { return (d * Math.PI) / 180; }

export const SEAT_TOP: Record<SeatStatus, string> = {
  empty:    '#1d4ed8',
  occupied: '#374151',
  vip:      '#d97706',
  mine:     '#22d3ee',
};
export const SEAT_SIDE: Record<SeatStatus, string> = {
  empty:    '#1e3a8a',
  occupied: '#1f2937',
  vip:      '#92400e',
  mine:     '#0891b2',
};

export interface Amenity {
  id: string;
  name: string;
  type: 'washroom' | 'food' | 'exit';
  waitTime: number; // minutes
  status: 'low' | 'moderate' | 'high';
  location: string;
}

export const AMENITIES: Amenity[] = [
  { id: 'w1', name: 'West Washroom (M)', type: 'washroom', waitTime: 2, status: 'low', location: 'Level 1, West' },
  { id: 'w2', name: 'West Washroom (F)', type: 'washroom', waitTime: 8, status: 'moderate', location: 'Level 1, West' },
  { id: 'f1', name: 'Main Concession', type: 'food', waitTime: 14, status: 'high', location: 'Level 2, North' },
  { id: 'f2', name: 'Express Snacks', type: 'food', waitTime: 3, status: 'low', location: 'Level 1, East' },
  { id: 'e1', name: 'North Exit Gate', type: 'exit', waitTime: 5, status: 'low', location: 'Ground, North' },
];
