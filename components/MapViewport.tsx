import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface MapViewportProps {
  children: React.ReactNode;
  activeId: string | null;
}

export interface MapViewportHandle {
  centerOn: (x: number, y: number, zoom: number) => void;
}

export const MapViewport = forwardRef<MapViewportHandle, MapViewportProps>(({ children, activeId }, ref) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Refs for high-performance direct DOM manipulation during interaction
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  
  // Interaction state tracking
  const stateRef = useRef({
    scale: 1,
    position: { x: 0, y: 0 },
    isDragging: false,
    lastMousePos: { x: 0, y: 0 },
    isProgrammatic: false
  });

  // Update DOM styles directly for maximum performance
  const updateTransform = useCallback((animate = false) => {
    if (!contentRef.current || !bgRef.current) return;
    
    const { x, y } = stateRef.current.position;
    const s = stateRef.current.scale;
    
    const transform = `translate(${x}px, ${y}px) scale(${s})`;
    const transition = animate ? 'transform 700px cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    
    contentRef.current.style.transition = transition;
    contentRef.current.style.transform = transform;
    
    // Background parallax slightly slower or same for grid feel
    bgRef.current.style.transition = transition;
    bgRef.current.style.transform = transform;
  }, []);

  useImperativeHandle(ref, () => ({
    centerOn: (x: number, y: number, zoom: number) => {
      const container = containerRef.current;
      if (!container) return;
      
      const targetScale = zoom;
      // Coordinates are normalized -0.5 to 0.5 relative to the 400x400 map
      const targetX = -x * (400 * targetScale);
      const targetY = -y * (400 * targetScale);
      
      stateRef.current.scale = targetScale;
      stateRef.current.position = { x: targetX, y: targetY };
      
      setScale(targetScale);
      setPosition({ x: targetX, y: targetY });
      updateTransform(true);
    }
  }));

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    const scaleSensitivity = 0.002;
    const zoomFactor = 1 - e.deltaY * scaleSensitivity;
    const newScale = Math.min(Math.max(0.4, stateRef.current.scale * zoomFactor), 8);
    
    // Zoom at cursor logic
    const scaleChange = newScale / stateRef.current.scale;
    const newX = mouseX - (mouseX - stateRef.current.position.x) * scaleChange;
    const newY = mouseY - (mouseY - stateRef.current.position.y) * scaleChange;

    stateRef.current.scale = newScale;
    stateRef.current.position = { x: newX, y: newY };
    
    setScale(newScale);
    setPosition({ x: newX, y: newY });
    updateTransform(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    stateRef.current.isDragging = true;
    stateRef.current.lastMousePos = { x: e.clientX, y: e.clientY };
    containerRef.current?.classList.add('cursor-grabbing');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!stateRef.current.isDragging) return;
    
    const deltaX = e.clientX - stateRef.current.lastMousePos.x;
    const deltaY = e.clientY - stateRef.current.lastMousePos.y;
    
    stateRef.current.position.x += deltaX;
    stateRef.current.position.y += deltaY;
    stateRef.current.lastMousePos = { x: e.clientX, y: e.clientY };
    
    updateTransform(false);
  };

  const handleMouseUp = () => {
    if (stateRef.current.isDragging) {
      stateRef.current.isDragging = false;
      setPosition({ ...stateRef.current.position });
      containerRef.current?.classList.remove('cursor-grabbing');
    }
  };

  const resetView = () => {
    stateRef.current.scale = 1;
    stateRef.current.position = { x: 0, y: 0 };
    setScale(1);
    setPosition({ x: 0, y: 0 });
    updateTransform(true);
  };

  // Sync initial state
  useEffect(() => {
    updateTransform(false);
  }, [updateTransform]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-grab bg-[#010409] touch-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Moving Grid Background */}
      <div 
        ref={bgRef}
        className="absolute inset-0 pointer-events-none opacity-10 will-change-transform"
        style={{
          backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          transformOrigin: 'center'
        }}
      />

      <div 
        ref={contentRef}
        className="w-full h-full flex items-center justify-center will-change-transform"
        style={{
          transformOrigin: 'center'
        }}
      >
        {children}
      </div>

      {/* Viewport UI - Standard React controls */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-3 pointer-events-auto select-none">
        <div className="flex flex-col bg-slate-900/90 backdrop-blur-md border border-slate-700 p-1 rounded-lg shadow-2xl">
          <button 
            onClick={() => {
              stateRef.current.scale = Math.min(stateRef.current.scale + 0.5, 8);
              setScale(stateRef.current.scale);
              updateTransform(true);
            }} 
            className="p-3 text-neon-cyan hover:bg-slate-800 transition-colors rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="h-px bg-slate-700 mx-2" />
          <button 
            onClick={() => {
              stateRef.current.scale = Math.max(stateRef.current.scale - 0.5, 0.4);
              setScale(stateRef.current.scale);
              updateTransform(true);
            }} 
            className="p-3 text-neon-cyan hover:bg-slate-800 transition-colors rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
        
        <button 
          onClick={resetView} 
          className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 border border-slate-700 text-xs font-mono text-neon-yellow hover:bg-slate-800 rounded shadow-lg uppercase tracking-widest transition-all group"
        >
          <Maximize className="w-4 h-4 group-hover:scale-110 transition-transform" /> Reset View
        </button>
      </div>
      
      <div className="absolute top-8 right-8 text-[10px] font-mono text-slate-500 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
        MAGNIFICATION: <span className="text-neon-cyan font-bold">{(scale * 100).toFixed(0)}%</span>
      </div>

      {/* Control Help (Subtle) */}
      <div className="absolute bottom-8 right-8 text-[9px] font-mono text-slate-600 pointer-events-none select-none uppercase tracking-tighter text-right">
        Drag to pan • Scroll to zoom<br/>
        Click districts for detail
      </div>
    </div>
  );
});