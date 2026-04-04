"use client";

import { useEffect, useRef, useState } from "react";

const areas = [
  {
    number: "01",
    title: "Habitat Classification & Ecosystem Mapping",
    description:
      "Multi-sensor AI systems combining satellite imagery, airborne LiDAR, and drone surveys to classify and map habitats at national scale — producing outputs aligned to UK Biodiversity Net Gain and Natural Capital accounting frameworks.",
    image: "/images/wetwood-density.png",
    alt: "Wet woodland extent map",
  },
  {
    number: "02",
    title: "3D Forest Structure & Point Cloud Analysis",
    description:
      "Deep learning segmentation of LiDAR point clouds to extract individual tree structure, wood-leaf separation, canopy architecture, and structural parameters at scale.",
    image: null,
    alt: "3D forest point cloud",
  },
  {
    number: "03",
    title: "Carbon & Biomass Estimation",
    description:
      "Machine learning methods for above-ground biomass and carbon stock estimation using LiDAR-derived canopy height models, multispectral indices, and allometric relationships.",
    image: null,
    alt: "Carbon stock estimation",
  },
  {
    number: "04",
    title: "Landscape-Scale Change Detection",
    description:
      "Time-series analysis of multi-temporal satellite and aerial imagery to detect, quantify, and attribute land cover change across large environmental monitoring areas.",
    image: null,
    alt: "Change detection",
  },
  {
    number: "05",
    title: "Multi-sensor Data Fusion",
    description:
      "Integrating optical, SAR, LiDAR, acoustic, and hyperspectral data into unified environmental intelligence products robust across sensor combinations and acquisition conditions.",
    image: null,
    alt: "Multi-sensor fusion",
  },
];

export default function ResearchScroll() {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = panelRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    panelRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-baseline">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase">Our research</p>
          <a href="/research" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">All research →</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex relative">
        {/* Sticky left panel */}
        <div className="hidden md:flex sticky top-0 h-screen w-2/5 flex-col justify-center pr-12 flex-shrink-0">
          <div className="max-w-xs">
            <span className="text-xs text-gray-300 block mb-4">{areas[active].number}</span>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 leading-snug">
              {areas[active].title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {areas[active].description}
            </p>
          </div>
        </div>

        {/* Scrolling right panels */}
        <div className="w-full md:w-3/5 py-6 flex flex-col gap-4">
          {areas.map((area, i) => (
            <div
              key={area.number}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="h-screen rounded-xl flex flex-col justify-center relative overflow-hidden"
            >
              {area.image ? (
                <img
                  src={area.image}
                  alt={area.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, #1A2B3C ${i * 8}%, #2d4a63 100%)`,
                  }}
                />
              )}
              {/* Mobile-only text overlay */}
              <div className="relative z-10 p-8 md:hidden">
                <span className="text-xs text-white/50 block mb-3">{area.number}</span>
                <h2 className="text-lg font-semibold text-white mb-3">{area.title}</h2>
                <p className="text-sm text-white/70 leading-relaxed">{area.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
