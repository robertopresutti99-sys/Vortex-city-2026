import React from 'react';
import { Play, Pause, DollarSign, Activity, Cpu } from 'lucide-react';

interface TopHUDProps {
  isPaused: boolean;
  onTogglePause: () => void;
  totalCredits: number;
  avgLoad: number;
  criticalCount: number;
}

export const TopHUD: React.FC<TopHUDProps> = ({ isPaused, onTogglePause, totalCredits, avgLoad, criticalCount }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 p-4 flex justify-between items-start pointer-events-none">
      
      {/* LEFT: Pause Control */}
      <div className="pointer-events-auto">
        <button 
          onClick={onTogglePause}
          className={`flex items-center gap-2 px-4 py-1.5 border font-mono font-bold tracking-wider transition-all duration-200 text-xs
            ${isPaused 
              ? 'bg-neon-yellow text-black border-neon-yellow shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
              : 'bg-slate-900/80 text-neon-cyan border-neon-cyan/50 hover:border-neon-cyan hover:bg-neon-cyan hover:text-black'
            }`}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          {isPaused ? 'RESUME_UPLINK' : 'FREEZE_SYSTEM'}
        </button>
      </div>

      {/* RIGHT: Stats Panel (Compact Version) */}
      <div className="pointer-events-auto flex gap-4 bg-slate-950/80 backdrop-blur-md p-2 px-4 rounded-bl-xl border-b border-l border-slate-800 shadow-xl">
        
        {/* Credits */}
        <div className="text-right">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold leading-none mb-1">Revenue</div>
          <div className="text-base font-mono text-neon-green flex items-center justify-end gap-1.5 leading-none">
            {totalCredits.toLocaleString()} <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Load */}
        <div className="text-right border-l border-slate-800 pl-4">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold leading-none mb-1">Grid Load</div>
          <div className={`text-base font-mono flex items-center justify-end gap-1.5 leading-none ${avgLoad > 80 ? 'text-neon-red' : 'text-neon-cyan'}`}>
            {avgLoad.toFixed(1)}% <Activity className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Alerts */}
        <div className="text-right border-l border-slate-800 pl-4">
          <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold leading-none mb-1">Alerts</div>
          <div className={`text-base font-mono flex items-center justify-end gap-1.5 leading-none ${criticalCount > 0 ? 'text-neon-red animate-pulse font-bold' : 'text-slate-600'}`}>
            {criticalCount} <Cpu className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>
    </div>
  );
};