
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Power, Terminal, Globe, Cpu } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

interface Building {
  id: number;
  left: number;
  width: number;
  height: number;
  hasAntenna: boolean;
  antennaHeight: number;
  topStyle: 'flat' | 'sloped';
  lightColor: 'cyan' | 'red';
}

interface BuildingElementProps {
  b: Building;
  opacity: number;
  blur: string;
  color: string;
  parallaxFactor: number;
  mousePos: { x: number; y: number };
  glowColor: string;
}

const BuildingElement: React.FC<BuildingElementProps> = ({ b, opacity, blur, color, parallaxFactor, mousePos, glowColor }) => (
  <div 
    className="absolute bottom-0 flex flex-col items-center"
    style={{ 
      left: `${b.left}%`, 
      width: `${b.width}%`, 
      height: `${b.height}%`,
      opacity: opacity,
      filter: blur !== '0' ? `blur(${blur})` : 'none',
      transform: `translateX(${mousePos.x * parallaxFactor}px)`
    }}
  >
    {/* Antenna */}
    {b.hasAntenna && (
      <div className="absolute bottom-full flex flex-col items-center" style={{ height: b.antennaHeight }}>
        <div className="w-[1px] h-full bg-slate-500/50" />
        <div 
          className={`absolute top-0 w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px] ${b.lightColor === 'cyan' ? 'bg-neon-cyan shadow-neon-cyan' : 'bg-neon-red shadow-neon-red'}`} 
        />
      </div>
    )}
    
    {/* Building Body with light-top gradient to blend with sun atmosphere */}
    <div 
      className="w-full h-full relative"
      style={{ 
        background: `linear-gradient(to bottom, ${glowColor} 0%, ${color} 30%, ${color} 100%)`,
        clipPath: b.topStyle === 'sloped' ? 'polygon(0 15%, 100% 0, 100% 100%, 0 100%)' : 'none',
        backgroundImage: `linear-gradient(to bottom, ${glowColor}22 0%, transparent 40%), repeating-linear-gradient(to bottom, transparent, transparent 4px, rgba(255,255,255,0.02) 4px, rgba(255,255,255,0.02) 5px)`,
        borderLeft: '1px solid rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(255,255,255,0.03)',
      }}
    >
      {/* Subtle floor highlights */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, transparent 48%, rgba(255,255,255,0.1) 50%, transparent 52%)' }} />
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [particles, setParticles] = useState<{ id: number; left: string; duration: string; delay: string; char: string }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const chars = "0101010101ABCDEF";
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${3 + Math.random() * 5}s`,
      delay: `${Math.random() * 5}s`,
      char: chars[Math.floor(Math.random() * chars.length)]
    }));
    setParticles(newParticles);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  }, []);

  const handleStartClick = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStart();
    }, 800);
  };

  // Generate building data for 3 layers with increased height range
  const layers = useMemo(() => {
    const generateLayer = (count: number, minH: number, maxH: number): Building[] => {
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: (100 / count) * i + (Math.random() * 6 - 3),
        width: 2.5 + Math.random() * 5,
        height: minH + Math.random() * (maxH - minH),
        hasAntenna: Math.random() > 0.3,
        antennaHeight: 15 + Math.random() * 25,
        topStyle: (Math.random() > 0.6 ? 'sloped' : 'flat') as Building['topStyle'],
        lightColor: (Math.random() > 0.5 ? 'cyan' : 'red') as Building['lightColor']
      }));
    };

    return [
      generateLayer(14, 50, 95), // Background - Tallest, reaching towards the sun
      generateLayer(18, 40, 75), // Midground
      generateLayer(12, 25, 55), // Foreground - Shortest
    ];
  }, []);

  return (
    <div 
      className="relative w-screen h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-mono select-none"
      onMouseMove={handleMouseMove}
    >
      {/* Background Deep Space */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-black" />

      {/* Parallax Layer: Retro Sun (Positioned slightly higher) */}
      <div 
        className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-full flex items-center justify-center transition-transform duration-300 ease-out pointer-events-none"
        style={{ transform: `translate(calc(-50% + ${mousePos.x * 0.5}px), calc(-80% + ${mousePos.y * 0.5}px))` }}
      >
        <div className="relative">
          <div className="absolute inset-0 w-[450px] h-[450px] bg-orange-500/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute inset-0 w-[450px] h-[450px] bg-purple-600/10 blur-[150px] rounded-full" />
          
          <div 
            className="w-[380px] h-[380px] rounded-full relative overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.3)]"
            style={{ background: 'linear-gradient(to bottom, #f97316 10%, #a855f7 90%)' }}
          >
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 18px, rgba(0,0,0,0.8) 18px, rgba(0,0,0,0.8) 24px)',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Parallax Skyline Layers (Increased container height for 'altura') */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 1: Background Buildings (Reaching high, atmospheric blending) */}
        <div className="absolute bottom-0 w-full h-[60%] flex items-end">
          {layers[0].map(b => (
            <BuildingElement 
              key={`b1-${b.id}`} 
              b={b} 
              opacity={0.3} 
              blur="1.5px" 
              color="#1e293b" 
              glowColor="#f97316" // Glow from sun
              parallaxFactor={0.4} 
              mousePos={mousePos} 
            />
          ))}
        </div>

        {/* Layer 2: Midground Buildings */}
        <div className="absolute bottom-0 w-full h-[60%] flex items-end">
          {layers[1].map(b => (
            <BuildingElement 
              key={`b2-${b.id}`} 
              b={b} 
              opacity={0.6} 
              blur="0.5px" 
              color="#0f172a" 
              glowColor="#9333ea" // Glow from lower sun/atmosphere
              parallaxFactor={0.8} 
              mousePos={mousePos} 
            />
          ))}
        </div>

        {/* Layer 3: Foreground Buildings (Sharp, Silhouette) */}
        <div className="absolute bottom-0 w-full h-[60%] flex items-end">
          {layers[2].map(b => (
            <BuildingElement 
              key={`b3-${b.id}`} 
              b={b} 
              opacity={1} 
              blur="0" 
              color="#000000" 
              glowColor="#334155"
              parallaxFactor={1.5} 
              mousePos={mousePos} 
            />
          ))}
        </div>
      </div>

      {/* UI Elements */}
      <div className="absolute inset-0 bg-moving-grid opacity-10 pointer-events-none" />
      
      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left: p.left, animationDuration: p.duration, animationDelay: p.delay }}>
          {p.char}
        </div>
      ))}

      {/* Decorative Overlays */}
      <div className="absolute top-8 left-8 text-[10px] text-neon-cyan/60 flex flex-col gap-1 uppercase tracking-tighter z-20">
        <div className="flex items-center gap-2"><Terminal className="w-3 h-3" /><span>SYNC_MODE: ACTIVE</span></div>
        <div className="flex items-center gap-2"><Globe className="w-3 h-3" /><span>LATENCY: 12ms</span></div>
      </div>

      <div className="absolute bottom-8 right-8 text-[10px] text-neon-cyan/60 flex flex-col items-end gap-1 uppercase tracking-tighter text-right z-20">
        <div className="flex items-center gap-2"><span>KERNEL_v2026.4</span><Power className="w-3 h-3" /></div>
        <div className="text-neon-yellow">RESTRICTED ACCESS AREA</div>
      </div>

      {/* Main Branding & Start Button */}
      <div className="relative z-30 text-center flex flex-col items-center mt-[100px]">
        <div className="mb-4 text-neon-cyan text-xs tracking-[0.8em] font-bold animate-pulse">
          // ESTABLISHING NEURAL CONNECTION
        </div>
        
        <h1 
          className="text-5xl md:text-7xl font-black text-white mb-2 tracking-[0.2em] glitch-text uppercase select-none drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          data-text="NEON NEXUS"
        >
          NEON NEXUS
        </h1>
        
        <div className="text-base md:text-lg text-neon-pink font-bold tracking-[0.6em] mb-16 uppercase italic opacity-80">
          ECO-SYSTEM 2026
        </div>

        <button 
          onClick={handleStartClick}
          className="group relative px-14 py-5 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-neon-cyan cyber-button transition-all duration-300 group-hover:bg-neon-yellow group-hover:shadow-[0_0_50px_rgba(234,179,8,0.7)]" />
          <div className="relative flex items-center justify-center gap-4 text-black font-black text-xl tracking-[0.4em] uppercase">
             <Cpu className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
             START PLAY
          </div>
          <div className="absolute -inset-2.5 border border-neon-cyan/20 cyber-button group-hover:border-neon-yellow/50 pointer-events-none transition-colors" />
        </button>

        <p className="mt-12 text-slate-400 text-[10px] font-mono tracking-widest uppercase opacity-50">
          Neural-interface link required for full immersion
        </p>
      </div>

      {/* Entry Flash Effect */}
      {isStarting && (
        <div className="absolute inset-0 z-[100] bg-white animate-[flash_0.8s_ease-out_forwards] pointer-events-none" />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flash {
          0% { opacity: 0; }
          40% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}} />
    </div>
  );
};
