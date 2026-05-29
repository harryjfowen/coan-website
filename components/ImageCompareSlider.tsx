"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface Props {
  before: string;
  after: string;
  beforeAlt?: string;
  afterAlt?: string;
  minimal?: boolean;
}

export default function ImageCompareSlider({
  before,
  after,
  beforeAlt = "Before",
  afterAlt = "After",
  minimal = true
}: Props) {
  const [position, setPosition] = useState(50);
  const [isHovering, setIsHovering] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  if (minimal) {
    return (
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden select-none rounded-xl bg-gray-100"
        style={{ cursor: isHovering ? "col-resize" : "default", minHeight: "200px" }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Base image (wood/after) */}
        <img src={after} alt={afterAlt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />

        {/* Overlay image (leaf/before) — clipped to left */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={before} alt={beforeAlt} className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerWidth || "100%" }} draggable={false} />
        </div>

        {/* Subtle divider — only visible on hover */}
        {isHovering && (
          <div
            className="absolute top-0 bottom-0 w-px pointer-events-none transition-opacity duration-200"
            style={{
              left: `${position}%`,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3))",
              boxShadow: "0 0 8px rgba(255,255,255,0.2)"
            }}
          />
        )}
      </div>
    );
  }

  // Legacy version with handle and labels for fallback
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-col-resize rounded-xl"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <img src={after} alt={afterAlt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={before} alt={beforeAlt} className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerWidth || "100%" }} draggable={false} />
      </div>

      <div
        className="absolute top-0 bottom-0 w-px bg-white/80"
        style={{ left: `${position}%` }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center"
        style={{ left: `${position}%` }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M5 8L2 5M2 5L5 2M2 5H14M11 8L14 5M14 5L11 2M14 5H2" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <span className="absolute bottom-3 left-3 text-[10px] font-medium text-white/70 tracking-widest uppercase pointer-events-none">Raw</span>
      <span className="absolute bottom-3 right-3 text-[10px] font-medium text-white/70 tracking-widest uppercase pointer-events-none">Segmented</span>
    </div>
  );
}
