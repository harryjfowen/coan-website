"use client";

import { useRef, useState, useCallback } from "react";

interface Props {
  before: string;
  after: string;
  beforeAlt?: string;
  afterAlt?: string;
}

export default function ImageCompareSlider({ before, after, beforeAlt = "Before", afterAlt = "After" }: Props) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    update(e.clientX);
    const onMove = (ev: MouseEvent) => { if (dragging.current) update(ev.clientX); };
    const onUp = () => { dragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const onMove = (ev: TouchEvent) => update(ev.touches[0].clientX);
    const onEnd = () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    update(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-col-resize rounded-xl"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* After (instance) — full width base */}
      <img src={after} alt={afterAlt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      {/* Before — clipped to left of slider */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={before} alt={beforeAlt} className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current?.offsetWidth ?? "100%" }} draggable={false} />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/80"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center"
        style={{ left: `${position}%` }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M5 8L2 5M2 5L5 2M2 5H14M11 8L14 5M14 5L11 2M14 5H2" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Labels */}
      <span className="absolute bottom-3 left-3 text-[10px] font-medium text-white/70 tracking-widest uppercase pointer-events-none">Raw</span>
      <span className="absolute bottom-3 right-3 text-[10px] font-medium text-white/70 tracking-widest uppercase pointer-events-none">Segmented</span>
    </div>
  );
}
