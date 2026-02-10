import React, { useEffect, useRef } from 'react';
import { Terminal, Wifi } from 'lucide-react';
import { TransmissionLogEntry } from '../types';

interface LogTerminalProps {
  logs: TransmissionLogEntry[];
}

export const LogTerminal: React.FC<LogTerminalProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-black/80 backdrop-blur-sm border border-slate-700 rounded-sm overflow-hidden text-[10px] shadow-xl">
      <div className="bg-slate-900/90 p-1.5 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2 text-neon-cyan">
          <Terminal className="w-3 h-3" />
          <span className="font-mono font-bold tracking-tight">TRANSMISSION_LOG</span>
        </div>
        <div className="flex items-center gap-1 text-neon-green font-mono animate-pulse">
          <Wifi className="w-2.5 h-2.5" />
          <span className="text-[9px]">ONLINE</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 font-mono space-y-1.5 bg-black/50 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {logs.length === 0 && (
          <div className="text-slate-600 italic">Waiting for uplink...</div>
        )}
        {logs.map((log, index) => (
          <div key={index} className="flex flex-col border-l border-slate-800 pl-2 hover:border-neon-pink transition-colors group">
            <div className="text-slate-500 flex items-center gap-1 leading-none mb-0.5">
              <span className="text-neon-pink text-[9px]">{log.timestamp.split('T')[1].split('.')[0]}</span>
              <span className="text-slate-700 text-[9px]">ID_{index}</span>
            </div>
            <div className="text-slate-400 break-all opacity-80 group-hover:opacity-100 transition-opacity leading-tight">
               {`credits:${log.payload.globalStats.totalCredits}`}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};