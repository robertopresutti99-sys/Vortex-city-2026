import React, { useState, useMemo } from 'react';
import { DistrictData } from '../types';

interface CityMapProps {
  districts: DistrictData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const CityMap: React.FC<CityMapProps> = ({ districts, selectedId, onSelect }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isHqHovered, setIsHqHovered] = useState(false);

  const mapSize = 400; // Larger coordinate system for better detail
  const mid = mapSize / 2;
  const hqSize = 44;

  // Shapes for quadrants with HQ cutout
  const shapes = {
    'D-01': `M0 0 L${mid} 0 L${mid} ${mid - hqSize / 2} L${mid - hqSize / 2} ${mid} L0 ${mid} Z`, // Top Left
    'D-02': `M${mid} 0 L${mapSize} 0 L${mapSize} ${mid} L${mid + hqSize / 2} ${mid} L${mid} ${mid - hqSize / 2} Z`, // Top Right
    'D-03': `M0 ${mid} L${mid - hqSize / 2} ${mid} L${mid} ${mid + hqSize / 2} L${mid} ${mapSize} L0 ${mapSize} Z`, // Bottom Left
    'D-04': `M${mid} ${mid + hqSize / 2} L${mid + hqSize / 2} ${mid} L${mapSize} ${mid} L${mapSize} ${mapSize} L${mid} ${mapSize} Z`, // Bottom Right
  };

  // Content Generation
  const amberHazeBuildings = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    x: 20 + Math.random() * 150,
    y: 20 + Math.random() * 150,
    w: 10 + Math.random() * 20,
    h: 10 + Math.random() * 20,
    pipes: Math.random() > 0.5
  })), []);

  const violetNeonBuildings = useMemo(() => Array.from({ length: 45 }).map((_, i) => ({
    x: 220 + Math.random() * 150,
    y: 20 + Math.random() * 150,
    w: 5 + Math.random() * 15,
    h: 15 + Math.random() * 30,
    ad: Math.random() > 0.6
  })), []);

  const neonRain = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    x: 200 + Math.random() * 200,
    y: Math.random() * 200,
    len: 10 + Math.random() * 15,
    dur: 0.5 + Math.random() * 1
  })), []);

  const redClubBuildings = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    x: 20 + Math.random() * 150,
    y: 220 + Math.random() * 150,
    w: 20 + Math.random() * 25,
    h: 20 + Math.random() * 25,
    brutal: true
  })), []);

  const parkTrees = useMemo(() => Array.from({ length: 120 }).map((_, i) => ({
    x: 235 + Math.random() * 135,
    y: 235 + Math.random() * 135,
    r: 2 + Math.random() * 4
  })), []);

  const digitalMist = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    x: 220 + Math.random() * 180,
    y: 220 + Math.random() * 180,
    r: 20 + Math.random() * 30,
    dur: 5 + Math.random() * 10
  })), []);

  const getDistrictColor = (id: string) => {
    switch (id) {
      case 'D-01': return '#eab308'; // Amber Haze
      case 'D-02': return '#a855f7'; // Violet
      case 'D-03': return '#ef4444'; // Red
      case 'D-04': return '#22c55e'; // Emerald Park
      default: return '#06b6d4';
    }
  };

  const isHqSelected = selectedId === 'HQ';

  return (
    <div className="w-[1000px] h-[1000px] relative select-none">
      <svg viewBox={`0 0 ${mapSize} ${mapSize}`} className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="hq-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#06b6d4" result="flood" />
            <feComposite in="flood" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="clip-D01"><path d={shapes['D-01']} /></clipPath>
          <clipPath id="clip-D02"><path d={shapes['D-02']} /></clipPath>
          <clipPath id="clip-D03"><path d={shapes['D-03']} /></clipPath>
          <clipPath id="clip-D04"><path d={shapes['D-04']} /></clipPath>

          <linearGradient id="smokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(234, 179, 8, 0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          <linearGradient id="mistGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Global Grid Background */}
        <rect width={mapSize} height={mapSize} fill="url(#grid)" />

        {/* DISTRICT CONTENT */}
        {districts.map(d => {
          const isSelected = selectedId === d.id;
          const isHovered = hoveredId === d.id;
          const color = getDistrictColor(d.id);

          return (
            <g
              key={d.id}
              onClick={(e) => { e.stopPropagation(); onSelect(d.id); }}
              onMouseEnter={() => setHoveredId(d.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer transition-opacity duration-500"
              style={{ opacity: selectedId && !isSelected ? 0.3 : 1 }}
            >
              {/* Background Plate */}
              <path d={shapes[d.id as keyof typeof shapes]} fill="#020617" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />

              {/* District Specific Geometry */}
              <g clipPath={`url(#clip-${d.id.replace('-', '')})`}>
                {/* D-01: Amber Haze (Industrial - Enhanced Smog) */}
                {d.id === 'D-01' && (
                  <g>
                    {amberHazeBuildings.map((b, i) => (
                      <g key={i}>
                        <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#422006" stroke="#eab308" strokeWidth="0.2" />
                        {b.pipes && (
                          <line x1={b.x} y1={b.y} x2={b.x - 5} y2={b.y - 5} stroke="#713f12" strokeWidth="0.5" />
                        )}
                        {i % 4 === 0 && (
                          <circle cx={b.x + b.w / 2} cy={b.y + b.h / 2} r={4 + Math.random() * 6} fill="url(#smokeGrad)">
                            <animate attributeName="cy" from={b.y + b.h / 2} to={b.y - 30 - Math.random() * 40} dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="1;0" dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" />
                            <animate attributeName="r" values="4;10" dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" />
                          </circle>
                        )}
                      </g>
                    ))}
                  </g>
                )}

                {/* D-02: Violet District (Residencial/Neon - Neon Rain) */}
                {d.id === 'D-02' && (
                  <g>
                    {violetNeonBuildings.map((b, i) => (
                      <g key={i}>
                        <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#1e1b4b" stroke="#a855f7" strokeWidth="0.2" />
                        <rect x={b.x + 1} y={b.y + 1} width={b.w - 2} height={b.h - 2} fill="#3b0764" opacity="0.4" />
                        {b.ad && (
                          <rect x={b.x + 2} y={b.y + b.h - 8} width={b.w - 4} height={4} fill="#d946ef">
                            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                          </rect>
                        )}
                      </g>
                    ))}
                    {/* Neon Rain Particles */}
                    {neonRain.map((r, i) => (
                      <line key={`rain-${i}`} x1={r.x} y1={r.y} x2={r.x - 2} y2={r.y + r.len} stroke="#a855f7" strokeWidth="0.5" opacity="0.6">
                        <animate attributeName="y1" from={r.y - 50} to={r.y + 200} dur={`${r.dur}s`} repeatCount="indefinite" />
                        <animate attributeName="y2" from={r.y - 50 + r.len} to={r.y + 200 + r.len} dur={`${r.dur}s`} repeatCount="indefinite" />
                      </line>
                    ))}
                  </g>
                )}

                {/* D-03: Red District (Brutalism/Clubs - Security Sweep) */}
                {d.id === 'D-03' && (
                  <g>
                    {redClubBuildings.map((b, i) => (
                      <g key={i}>
                        <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#450a0a" stroke="#ef4444" strokeWidth="0.4" />
                        <path d={`M${b.x} ${b.y} L${b.x + b.w} ${b.y + b.h}`} stroke="#ef4444" strokeWidth="0.1" opacity="0.3" />
                        {i % 4 === 0 && (
                          <circle cx={b.x + b.w / 2} cy={b.y + b.h / 2} r="1" fill="#ef4444" filter="url(#glow)" className="animate-pulse" />
                        )}
                      </g>
                    ))}
                    {/* Security Scanner Line */}
                    <rect x="0" y="200" width="200" height="2" fill="rgba(239, 68, 68, 0.4)">
                      <animate attributeName="y" from="200" to="400" dur="4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0;0.5;0" dur="4s" repeatCount="indefinite" />
                    </rect>
                  </g>
                )}

                {/* D-04: Emerald Park (Digital Mist) */}
                {d.id === 'D-04' && (
                  <g>
                    {/* Park Base */}
                    <rect x={mid + 10} y={mid + 10} width={mid - 20} height={mid - 20} fill="#052e16" rx="2" />

                    {/* Trees */}
                    {parkTrees.map((t, i) => (
                      <circle key={i} cx={t.x} cy={t.y} r={t.r} fill="#15803d" opacity="0.8" />
                    ))}

                    {/* Digital Mist */}
                    {digitalMist.map((m, i) => (
                      <circle key={`mist-${i}`} cx={m.x} cy={m.y} r={m.r} fill="url(#mistGrad)" opacity="0.5">
                        <animate attributeName="cx" values={`${m.x - 10};${m.x + 10};${m.x - 10}`} dur={`${m.dur}s`} repeatCount="indefinite" />
                        <animate attributeName="cy" values={`${m.y - 5};${m.y + 5};${m.y - 5}`} dur={`${m.dur * 0.8}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${m.dur}s`} repeatCount="indefinite" />
                      </circle>
                    ))}

                    {/* Hi-Tech Borders */}
                    <rect x={mid + 10} y={mid + 10} width={mid - 20} height={mid - 20} fill="none" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="10 5" rx="2" />
                    <path d={`M${mid + 10} ${mid + 10} L${mid + 25} ${mid + 10} M${mid + 10} ${mid + 10} L${mid + 10} ${mid + 25}`} stroke="#22c55e" strokeWidth="2" fill="none" />
                    <path d={`M${mapSize - 10} ${mid + 10} L${mapSize - 25} ${mid + 10} M${mapSize - 10} ${mid + 10} L${mapSize - 10} ${mid + 25}`} stroke="#22c55e" strokeWidth="2" fill="none" />
                    <path d={`M${mid + 10} ${mapSize - 10} L${mid + 25} ${mapSize - 10} M${mid + 10} ${mapSize - 10} L${mid + 10} ${mapSize - 25}`} stroke="#22c55e" strokeWidth="2" fill="none" />
                    <path d={`M${mapSize - 10} ${mapSize - 10} L${mapSize - 25} ${mapSize - 10} M${mapSize - 10} ${mapSize - 10} L${mapSize - 10} ${mapSize - 25}`} stroke="#22c55e" strokeWidth="2" fill="none" />

                    {/* Lake */}
                    <path d="M280 280 Q320 250 360 300 T280 340 Z" fill="#0ea5e9" opacity="0.4" />

                    {/* Security Sentinels */}
                    <circle cx={mid + 25} cy={mid + 25} r="2" fill="#22c55e" filter="url(#glow)">
                      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={mapSize - 25} cy={mapSize - 25} r="2" fill="#22c55e" filter="url(#glow)">
                      <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" delay="1s" />
                    </circle>
                  </g>
                )}
              </g>

              {/* Hover Highlight */}
              <path
                d={shapes[d.id as keyof typeof shapes]}
                fill={color}
                fillOpacity={isSelected ? 0.1 : (isHovered ? 0.05 : 0)}
                className="transition-all duration-300 pointer-events-none"
              />

              {/* Telemetry Label Overlay */}
              <g transform={`translate(${d.id === 'D-01' || d.id === 'D-03' ? 15 : 285}, ${d.id === 'D-01' || d.id === 'D-02' ? 15 : 285})`}>
                <rect width="100" height="25" fill="rgba(0,0,0,0.6)" rx="2" />
                <text x="5" y="10" className="font-mono text-[6px] fill-white font-bold tracking-widest uppercase">{d.name}</text>
                <text x="5" y="18" className={`font-mono text-[5px] ${d.status === 'CRITICAL' ? 'fill-red-500 animate-pulse' : 'fill-slate-400'}`}>STATUS: {d.status}</text>
                <line x1="0" y1="22" x2="100" y2="22" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
              </g>
            </g>
          );
        })}

        {/* THE NEXUS HQ (Modern Diamond Center) */}
        <g
          className="cursor-pointer group transition-all duration-300"
          onClick={(e) => { e.stopPropagation(); onSelect('HQ'); }}
          onMouseEnter={() => setIsHqHovered(true)}
          onMouseLeave={() => setIsHqHovered(false)}
          style={{
            transform: (isHqHovered || isHqSelected) ? 'scale(1.05)' : 'scale(1)',
            transformOrigin: `${mid}px ${mid}px`
          }}
        >
          {/* Base Diamond Shadow/Glow (Stronger when hovered or selected) */}
          <path
            d={`M${mid} ${mid - hqSize / 2} L${mid + hqSize / 2} ${mid} L${mid} ${mid + hqSize / 2} L${mid - hqSize / 2} ${mid} Z`}
            fill="#06b6d4"
            fillOpacity={(isHqHovered || isHqSelected) ? 0.25 : 0.1}
            filter={(isHqHovered || isHqSelected) ? "url(#hq-glow)" : "url(#glow)"}
            className="transition-all duration-300"
          />

          {/* Core Diamond Structure */}
          <path
            d={`M${mid} ${mid - hqSize / 2} L${mid + hqSize / 2} ${mid} L${mid} ${mid + hqSize / 2} L${mid - hqSize / 2} ${mid} Z`}
            fill={isHqSelected ? "#082f49" : "#0f172a"}
            stroke={isHqSelected ? "#22d3ee" : "#06b6d4"}
            strokeWidth={isHqHovered ? 1.5 : 1}
            className="transition-all duration-300"
          />

          {/* Internal Geometric Detail */}
          <path
            d={`M${mid} ${mid - hqSize / 3} L${mid + hqSize / 3} ${mid} L${mid} ${mid + hqSize / 3} L${mid - hqSize / 3} ${mid} Z`}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="0.5"
            strokeOpacity={(isHqHovered || isHqSelected) ? 0.8 : 0.5}
            className="transition-all duration-300"
          />

          {/* Central Pulsing Node (Flashes white when selected) */}
          <circle cx={mid} cy={mid} r={(isHqHovered || isHqSelected) ? 3 : 2} fill={isHqSelected ? "#fff" : "#06b6d4"} filter="url(#glow)">
            <animate attributeName="r" values={(isHqHovered || isHqSelected) ? "2.5;4;2.5" : "2;3;2"} dur={isHqSelected ? "0.8s" : "1.5s"} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" />
          </circle>

          {/* Rotating Rings */}
          <circle cx={mid} cy={mid} r={hqSize / 2 + 5} fill="none" stroke="#06b6d4" strokeWidth="0.2" strokeDasharray="4 2">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${mid} ${mid}`} to={`360 ${mid} ${mid}`} dur={isHqHovered ? "8s" : "15s"} repeatCount="indefinite" />
          </circle>

          <circle cx={mid} cy={mid} r={hqSize / 2 + 8} fill="none" stroke="#a855f7" strokeWidth="0.1" strokeDasharray="1 3" opacity={(isHqHovered || isHqSelected) ? 0.8 : 0.4}>
            <animateTransform attributeName="transform" type="rotate" from={`360 ${mid} ${mid}`} to={`0 ${mid} ${mid}`} dur={isHqHovered ? "10s" : "20s"} repeatCount="indefinite" />
          </circle>

          {/* Extra Decorative Data Ring on Hover */}
          {(isHqHovered || isHqSelected) && (
            <circle cx={mid} cy={mid} r={hqSize / 2 + 12} fill="none" stroke="#06b6d4" strokeWidth="0.1" strokeDasharray="20 100" opacity="0.3">
              <animateTransform attributeName="transform" type="rotate" from={`0 ${mid} ${mid}`} to={`360 ${mid} ${mid}`} dur="5s" repeatCount="indefinite" />
            </circle>
          )}

          {/* HQ HUD Label */}
          <g transform={`translate(${mid}, ${mid - hqSize / 2 - (isHqHovered ? 14 : 10)})`} className="transition-all duration-300">
            <text
              textAnchor="middle"
              fill={isHqHovered ? "#22d3ee" : "#06b6d4"}
              className="font-mono text-[4px] font-bold tracking-[0.4em] uppercase"
              style={{ textShadow: isHqHovered ? '0 0 5px rgba(34, 211, 238, 0.5)' : 'none' }}
            >
              {isHqSelected ? "CORE_SYNC_ESTABLISHED" : "SYSTEM_CORE_SYNC"}
            </text>
            <rect x="-20" y="2" width="40" height="0.5" fill={isHqHovered ? "#22d3ee" : "#06b6d4"} opacity={isHqHovered ? 0.6 : 0.3} />

            {isHqHovered && (
              <g opacity="0.6">
                <rect x="-25" y="4" width="50" height="0.2" fill="#06b6d4" />
                <rect x="-25" y="4" width="2" height="1" fill="#06b6d4" />
                <rect x="23" y="4" width="2" height="1" fill="#06b6d4" />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};