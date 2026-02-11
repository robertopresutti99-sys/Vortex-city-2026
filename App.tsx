import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DistrictData, TransmissionLogEntry } from './types';
import { LogTerminal } from './components/LogTerminal';
import { CityMap } from './components/CityMap';
import { DistrictControl } from './components/DistrictControl';
import { TopHUD } from './components/TopHUD';
import { MapViewport, MapViewportHandle } from './components/MapViewport';
import { LandingPage } from './components/LandingPage';
import { Play, Cpu } from 'lucide-react';

const INITIAL_DISTRICTS: DistrictData[] = [
  { id: 'D-01', name: 'AMBER HAZE', powerLoad: 45, temperature: 42, population: 12.5, creditsGenerated: 1250, status: 'NORMAL' },
  { id: 'D-02', name: 'VIOLET SKY', powerLoad: 65, temperature: 55, population: 45.2, creditsGenerated: 800, status: 'NORMAL' },
  { id: 'D-03', name: 'RED LIGHT DISTRICT', powerLoad: 30, temperature: 28, population: 8.9, creditsGenerated: 2100, status: 'NORMAL' },
  { id: 'D-04', name: 'EMERALD PARK', powerLoad: 15, temperature: 22, population: 3.4, creditsGenerated: 4500, status: 'NORMAL' },
];

const MAX_LOGS = 50;

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [districts, setDistricts] = useState<DistrictData[]>(INITIAL_DISTRICTS);
  const [logs, setLogs] = useState<TransmissionLogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);

  const viewportRef = useRef<MapViewportHandle>(null);
  const districtsRef = useRef<DistrictData[]>(INITIAL_DISTRICTS);
  const pausedRef = useRef(isPaused);

  useEffect(() => {
    districtsRef.current = districts;
  }, [districts]);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  // Simulation Loop
  useEffect(() => {
    if (!gameStarted) return;
    const timer = setInterval(() => {
      if (pausedRef.current) return;

      setDistricts(prev => prev.map(d => {
        const loadVar = (Math.random() - 0.45) * 4;
        const tempVar = (Math.random() - 0.45) * 2;
        const newLoad = Math.max(0, Math.min(100, d.powerLoad + loadVar));
        const newTemp = Math.max(10, Math.min(110, d.temperature + tempVar));

        let status: DistrictData['status'] = 'NORMAL';
        if (newLoad > 85 || newTemp > 90) status = 'CRITICAL';
        else if (newLoad > 70 || newTemp > 75) status = 'WARNING';

        return {
          ...d,
          powerLoad: newLoad,
          temperature: newTemp,
          creditsGenerated: d.creditsGenerated + Math.floor(newLoad * 0.5),
          status
        };
      }));
    }, 1500);

    return () => clearInterval(timer);
  }, [gameStarted]);

  // Transmission Logic (Logs)
  useEffect(() => {
    if (!gameStarted) return;
    const transmissionInterval = setInterval(() => {
      if (pausedRef.current) return;

      const currentData = districtsRef.current;
      const timestamp = new Date().toISOString();

      const payload = {
        districts: currentData,
        globalStats: {
          totalCredits: currentData.reduce((acc, d) => acc + d.creditsGenerated, 0),
          averageStability: 100 - (currentData.reduce((acc, d) => acc + d.powerLoad, 0) / 4)
        }
      };

      const logEntry: TransmissionLogEntry = { timestamp, payload };

      setLogs(prev => {
        const newLogs = [...prev, logEntry];
        if (newLogs.length > MAX_LOGS) return newLogs.slice(newLogs.length - MAX_LOGS);
        return newLogs;
      });

    }, 3000);

    return () => clearInterval(transmissionInterval);
  }, [gameStarted]);

  const handleDistrictSelect = useCallback((id: string) => {
    setSelectedDistrictId(id);
    if (viewportRef.current) {
      switch (id) {
        case 'D-01': viewportRef.current.centerOn(-0.5, -0.5, 2.5); break;
        case 'D-02': viewportRef.current.centerOn(0.5, -0.5, 2.5); break;
        case 'D-03': viewportRef.current.centerOn(-0.5, 0.5, 2.5); break;
        case 'D-04': viewportRef.current.centerOn(0.5, 0.5, 2.5); break;
        case 'HQ': viewportRef.current.centerOn(0, 0, 3.5); break;
      }
    }
  }, []);

  const handleFlushCoolant = (id: string) => {
    setDistricts(prev => prev.map(d => d.id === id ? { ...d, temperature: d.temperature - 15 } : d));
  };

  const handleReroutePower = (id: string) => {
    setDistricts(prev => prev.map(d => d.id === id ? { ...d, powerLoad: d.powerLoad - 10 } : d));
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return <LandingPage onStart={handleStartGame} />;
  }

  const activeDistrict = districts.find(d => d.id === selectedDistrictId);
  const totalCredits = districts.reduce((acc, d) => acc + d.creditsGenerated, 0);
  const avgLoad = districts.reduce((acc, d) => acc + d.powerLoad, 0) / 4;
  const criticalCount = districts.filter(d => d.status === 'CRITICAL').length;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 font-sans animate-in fade-in duration-500 delay-300">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 bg-radial-gradient from-indigo-950/20 to-transparent pointer-events-none" />

      {/* HUD Elements */}
      <TopHUD
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        totalCredits={totalCredits}
        avgLoad={avgLoad}
        criticalCount={criticalCount}
      />

      {/* Transmission Log */}
      <div className="absolute top-24 left-6 z-30 w-64 h-48 pointer-events-auto opacity-90 hover:opacity-100 transition-opacity shadow-2xl">
        <LogTerminal logs={logs} />
      </div>

      {/* Map Viewport */}
      <div className="absolute inset-0 z-10">
        <MapViewport ref={viewportRef} activeId={selectedDistrictId}>
          <CityMap
            districts={districts}
            selectedId={selectedDistrictId}
            onSelect={handleDistrictSelect}
          />
        </MapViewport>
      </div>

      {/* Overlay District Control */}
      {selectedDistrictId && selectedDistrictId !== 'HQ' && activeDistrict && (
        <div className="absolute top-1/2 right-12 -translate-y-1/2 z-40 pointer-events-auto animate-in slide-in-from-right-10 fade-in duration-500">
          <DistrictControl
            district={activeDistrict}
            onFlushCoolant={handleFlushCoolant}
            onReroutePower={handleReroutePower}
            onClose={() => setSelectedDistrictId(null)}
          />
        </div>
      )}

      {/* HQ Detail Modal */}
      {selectedDistrictId === 'HQ' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border-2 border-neon-cyan p-12 rounded shadow-[0_0_80px_rgba(6,182,212,0.3)] text-center relative max-w-lg">
            <h2 className="text-4xl font-black text-white mb-6 tracking-[0.4em] uppercase">The Nexus</h2>
            <div className="space-y-4 font-mono text-sm text-slate-400 text-left border-y border-slate-800 py-6 my-6">
              <div className="flex justify-between"><span>CORE_STABILITY:</span> <span className="text-neon-green">99.8%</span></div>
              <div className="flex justify-between"><span>UPLINK_STATUS:</span> <span className="text-neon-cyan">SECURE</span></div>
            </div>
            <button
              onClick={() => setSelectedDistrictId(null)}
              className="px-8 py-3 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold tracking-widest hover:bg-neon-cyan hover:text-black transition-all"
            >
              DISCONNECT_CORE
            </button>
          </div>
        </div>
      )}

      {/* Improved Pause Simulation Modal */}
      {isPaused && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-300 pointer-events-auto">
          <div className="text-center flex flex-col items-center max-w-xl px-6">
            <div className="text-neon-cyan text-xs tracking-[0.8em] font-bold mb-4 animate-pulse uppercase">
              // DATA_STREAM_INTERRUPTED
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-[0.2em] glitch-text opacity-90 select-none uppercase" data-text="On Pause">
              On Pause
            </h1>
            <p className="text-slate-500 font-mono mb-16 tracking-widest uppercase text-sm leading-relaxed">
              Operational flow suspended by administrator command. Grid state persisted in neural cache.
            </p>

            <button
              onClick={() => setIsPaused(false)}
              className="group relative px-14 py-5 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {/* High-tech cyan layer */}
              <div className="absolute inset-0 bg-neon-cyan cyber-button transition-all duration-300 group-hover:bg-neon-yellow group-hover:shadow-[0_0_50px_rgba(234,179,8,0.7)]" />

              <div className="relative flex items-center justify-center gap-4 text-black font-black text-xl tracking-[0.3em] uppercase">
                <Play className="w-6 h-6 fill-current transition-transform duration-300 group-hover:scale-110" />
                RESUME SIMULATION
              </div>

              {/* Outer Frame Decoration */}
              <div className="absolute -inset-2.5 border border-neon-cyan/20 cyber-button group-hover:border-neon-yellow/50 pointer-events-none transition-colors" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}