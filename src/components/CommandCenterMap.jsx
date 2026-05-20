import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const cities = [
  { id: 'mumbai', name: 'Mumbai, IN', x: '72%', y: '58%', color: '#00f09a' },
  { id: 'singapore', name: 'Singapore, SG', x: '82%', y: '68%', color: '#00f09a' },
  { id: 'us-east', name: 'US East, VA', x: '25%', y: '38%', color: '#00f09a' }
];

export const CommandCenterMap = ({ activePulse, riskLevel = 'Stable' }) => {
  const [pulses, setPulses] = useState([]);

  useEffect(() => {
    if (activePulse) {
      const city = cities.find(c => c.id === activePulse);
      if (city) {
        const id = Math.random();
        setPulses(prev => [...prev, { ...city, pulseId: id }]);
        setTimeout(() => {
          setPulses(prev => prev.filter(p => p.pulseId !== id));
        }, 2000);
      }
    }
  }, [activePulse]);

  return (
    <div className="relative w-full aspect-[2/1] bg-black/40 rounded-[32px] border border-white/5 overflow-hidden backdrop-blur-xl group">
      {/* Background World Map SVG (Simplified) */}
      <svg viewBox="0 0 800 400" className="w-full h-full opacity-20 transition-opacity group-hover:opacity-30">
        <path
          fill="currentColor"
          className="text-slate-500"
          d="M150,120 L180,110 L220,130 L250,120 L280,150 L300,180 L280,220 L250,240 L220,230 L180,250 L150,230 L130,200 Z M550,150 L600,130 L650,150 L680,180 L650,220 L600,240 L550,230 L520,200 Z" 
          // Note: This is a placeholder path for visual effect, real map path would be much longer
        />
        {/* Decorative Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.05"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Live Badge */}
      <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Live Global Pulse</span>
      </div>

      {/* Risk Indicator */}
      <div className="absolute top-6 right-6">
        <AnimatePresence>
          {riskLevel === 'High' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2"
            >
              <i className="fas fa-exclamation-triangle text-rose-500 text-[10px]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Anomaly Warning</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* City Markers */}
      {cities.map(city => (
        <div
          key={city.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: city.x, top: city.y }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
          <div className="mt-2 text-[8px] font-black uppercase tracking-tighter text-slate-500 whitespace-nowrap">
            {city.name}
          </div>
        </div>
      ))}

      {/* Pulse Animations */}
      <AnimatePresence>
        {pulses.map(pulse => (
          <motion.div
            key={pulse.pulseId}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{
              left: pulse.x,
              top: pulse.y,
              borderColor: riskLevel === 'High' ? '#f43f5e' : '#00f09a',
              width: 20,
              height: 20
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Visual Scan Line */}
      <motion.div
        animate={{ translateY: ['0%', '1000%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-transparent via-[#00f09a]/5 to-transparent pointer-events-none"
      />
    </div>
  );
};
