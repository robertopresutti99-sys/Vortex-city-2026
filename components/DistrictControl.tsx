import React from 'react';
import { DistrictData } from '../types';
import { X, Zap, Thermometer, Users, ShieldAlert } from 'lucide-react';

interface DistrictControlProps {
  district: DistrictData;
  onFlushCoolant: (id: string) => void;
  onReroutePower: (id: string) => void;
  onClose: () => void;
}

export const DistrictControl: React.FC<DistrictControlProps> = ({ district, onFlushCoolant, onReroutePower, onClose }) => {
  return (
    <div className="bg-slate-950/90 backdrop-blur-2xl border border-slate-700 p-8 rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] w-96 relative overflow-hidden group">
      {/* Visual Glitch Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <ShieldAlert className="w-24 h-24" />
      </div>

      <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-neon-pink transition-colors">
        <X className="w-6 h-6" />
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan mb-2">
          <div className="w-2 h-2 bg-neon-cyan animate-pulse rounded-full" />
          UPLINK_ESTABLISHED
        </div>
        <h2 className="text-3xl font-black text-white tracking-widest uppercase">{district.name}</h2>
        <div className="flex gap-4 mt-2">
           <div className="text-[10px] font-mono text-slate-500 px-2 py-1 bg-slate-900 rounded">ID: {district.id}</div>
           <div className={`text-[10px] font-mono px-2 py-1 rounded ${district.status === 'CRITICAL' ? 'bg-red-950 text-red-500 border border-red-500 animate-pulse' : 'bg-green-950 text-green-500 border border-green-500'}`}>
             STATUS: {district.status}
           </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Population */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-900 rounded-lg text-slate-400">
               <Users className="w-5 h-5" />
             </div>
             <div>
               <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Current Census</div>
               <div className="text-lg font-mono text-slate-200">{district.population.toFixed(1)}k <span className="text-[10px] opacity-50 uppercase">Souls</span></div>
             </div>
           </div>
        </div>

        {/* Load Metric */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1"><Zap className="w-3 h-3 text-neon-yellow" /> POWER_CONSUMPTION</span>
            <span className="text-xl font-mono font-bold text-white">{district.powerLoad.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
             <div className="h-full bg-gradient-to-r from-neon-cyan to-blue-600 transition-all duration-700" style={{ width: `${Math.min(district.powerLoad, 100)}%` }} />
          </div>
        </div>

        {/* Temp Metric */}
        <div>
          <div className="flex justify-between items-end mb-2">
             <span className="text-xs font-mono text-slate-400 flex items-center gap-1"><Thermometer className="w-3 h-3 text-neon-pink" /> THERMAL_STRESS</span>
             <span className={`text-xl font-mono font-bold ${district.temperature > 90 ? 'text-neon-red' : 'text-white'}`}>{district.temperature.toFixed(1)}°C</span>
          </div>
          <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
             <div className={`h-full transition-all duration-700 ${district.temperature > 80 ? 'bg-neon-red shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-neon-pink'}`} style={{ width: `${Math.min((district.temperature / 110) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-10">
        <button 
          onClick={() => onFlushCoolant(district.id)}
          className="group flex flex-col items-center py-4 bg-slate-900 border border-slate-700 hover:border-neon-cyan transition-all rounded-lg active:scale-95"
        >
          <span className="text-[10px] font-mono text-slate-500 group-hover:text-neon-cyan mb-1">MAINTENANCE</span>
          <span className="text-xs font-black text-neon-cyan tracking-widest uppercase">Flush Coolant</span>
        </button>
        <button 
          onClick={() => onReroutePower(district.id)}
          className="group flex flex-col items-center py-4 bg-slate-900 border border-slate-700 hover:border-neon-yellow transition-all rounded-lg active:scale-95"
        >
          <span className="text-[10px] font-mono text-slate-500 group-hover:text-neon-yellow mb-1">MANAGEMENT</span>
          <span className="text-xs font-black text-neon-yellow tracking-widest uppercase">Reroute Power</span>
        </button>
      </div>

      {/* Footer Decoration */}
      <div className="mt-8 pt-4 border-t border-slate-900 flex justify-between">
        <div className="text-[8px] font-mono text-slate-700">SEC_LEVEL: 04</div>
        <div className="text-[8px] font-mono text-slate-700">COORD: {district.id}</div>
      </div>
    </div>
  );
};
