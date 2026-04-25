'use client';

import React, { useState, useEffect } from 'react';

const teams = {
  MI: { fullName: 'Mumbai Indians', color: '#004BA0', icon: '🏏' },
  CSK: { fullName: 'Chennai Super Kings', color: '#FFFF00', icon: '🦁' }
};

const playersList = {
  MI: ['Rohit Sharma', 'Ishan Kishan', 'Suryakumar Yadav', 'Hardik Pandya', 'Tim David'],
  CSK: ['R. Jadeja', 'M. Pathirana', 'M. Theekshana', 'D. Chahar', 'T. Deshpande']
};

const commentaries = {
  'W': ['OUT! What a delivery!', 'GONE! The finger goes up!', 'CLEAN BOWLED! Stumps flying!'],
  '6': ['SIX! Massive hit!', 'Into the top tier!', 'That is out of the ground!'],
  '4': ['FOUR! Timing at its best!', 'Elegant drive through covers!', 'Cruched to the boundary!'],
  '1': ['Single taken.', 'Quick run between wickets.', 'Rotating the strike.'],
  '2': ['Double. Good running!', 'Easy two there.', 'Pushing for the second!'],
  '0': ['Dot ball.', 'Solid defense.', 'Beaten by the pace!']
};

const LiveScoreboard = () => {
  const [runs, setRuns] = useState(48);
  const [wickets, setWickets] = useState(1);
  const [overs, setOvers] = useState(6.0);
  const [ballsThisOver, setBallsThisOver] = useState<string[]>([]);
  
  const [batsman, setBatsman] = useState({ name: 'Rohit Sharma', runs: 24, balls: 18 });
  const [bowler, setBowler] = useState({ name: 'D. Chahar', figures: '1/12 (2.0)' });
  const [commentary, setCommentary] = useState('Powerplay over. CSK pulling things back.');

  useEffect(() => {
    const interval = setInterval(() => {
      setOvers(prevOvers => {
        if (prevOvers >= 20.0) {
          setCommentary('MATCH COMPLETED! MI vs CSK Final ends.');
          clearInterval(interval);
          return 20.0;
        }

        // 1. Calculate new ball outcome
        const rand = Math.random();
        let outcome = '0';
        if (rand > 0.97) outcome = 'W';
        else if (rand > 0.90) outcome = '6';
        else if (rand > 0.80) outcome = '4';
        else if (rand > 0.45) outcome = '1';
        else if (rand > 0.25) outcome = '2';

        // 2. Update Overs and reset array
        let currentBalls = Math.round((prevOvers % 1) * 10);
        let newOvers = prevOvers;

        if (currentBalls >= 5) {
          newOvers = Math.floor(prevOvers) + 1.0;
          setBallsThisOver([]);
          setBowler({ 
            name: playersList.CSK[Math.floor(Math.random() * playersList.CSK.length)],
            figures: `${Math.floor(Math.random() * 3)}/${Math.floor(Math.random() * 40)} (${Math.floor(Math.random() * 4)}.0)`
          });
        } else {
          newOvers = Number((prevOvers + 0.1).toFixed(1));
          setBallsThisOver(prev => [...prev, outcome]);
        }

        // 3. Update Runs and Wickets
        if (outcome === 'W') {
          setWickets(w => w + 1);
          setBatsman({ name: playersList.MI[Math.floor(Math.random() * playersList.MI.length)], runs: 0, balls: 0 });
        } else {
          const r = parseInt(outcome) || 0;
          setRuns(runsPrev => runsPrev + r);
          setBatsman(batsPrev => ({ ...batsPrev, runs: batsPrev.runs + r, balls: batsPrev.balls + 1 }));
        }

        // 4. Update Commentary
        const pool = commentaries[outcome as keyof typeof commentaries];
        setCommentary(pool[Math.floor(Math.random() * pool.length)]);

        return newOvers;
      });

    }, 5000); // 5 second gap

    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
      borderRadius: '32px', 
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
    }}>
      <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
          <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#ef4444', letterSpacing: '0.1em' }}>LIVE MATCH</span>
        </div>
        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)' }}>MI vs CSK • IPL FINAL</span>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#004BA0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 8px' }}>🏏</div>
            <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>MI</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>{runs}/{wickets}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>{overs} OVERS</div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#FFFF00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 8px' }}>🦁</div>
            <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>CSK</span>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
             <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{batsman.name}*</span>
             <span style={{ fontWeight: 900, color: 'var(--accent-cyan)' }}>{batsman.runs} ({batsman.balls})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
             <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{bowler.name}</span>
             <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{bowler.figures}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.4 }}>OVER:</span>
          {ballsThisOver.map((b, i) => (
            <div key={i} style={{ 
              width: '24px', height: '24px', borderRadius: '50%', 
              background: b === 'W' ? '#ef4444' : b === '6' || b === '4' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900,
              color: (b==='W' || b==='6' || b==='4') ? '#000' : '#fff'
            }}>{b}</div>
          ))}
          {Array(Math.max(0, 6 - ballsThisOver.length)).fill(0).map((_, i) => (
            <div key={i+20} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px dotted rgba(255,255,255,0.2)' }} />
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--accent-cyan)', color: '#000', padding: '10px 20px', fontSize: '0.8rem', fontWeight: 800 }}>
        {commentary}
      </div>

      <style jsx>{`
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
      `}</style>
    </section>
  );
};

export default LiveScoreboard;
