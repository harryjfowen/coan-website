"use client";

import { useEffect, useRef, useState } from "react";
import LandscapeVisualization from "./LandscapeVisualization";
import ForestIntelCard from "./ForestIntelCard";

const areas = [
  {
    number: "01",
    title: "Restoration & Biodiversity Monitoring",
    description:
      "From drone transects and acoustic surveys to repeat satellite sampling — we build verifiable recovery trajectories. Habitat baselines, species detection, and long-term change records that meet BNG, TNFD, and nature market audit requirements. Methods: UAV survey, TLS, bioacoustics, satellite time-series.",
    image: null,
    video: null,
    alt: "Forest intelligence monitoring card",
  },
  {
    number: "02",
    title: "Carbon & Nature Markets",
    description:
      "MRV-grade measurement from field to satellite. We quantify above-ground biomass and carbon stock using TLS-derived allometrics, LiDAR canopy structure, and satellite embeddings — producing audit-ready outputs aligned to Woodland Carbon Code, BNG statutory metric, CSRD, and TNFD disclosure.",
    image: null,
    video: null,
    alt: "Carbon and nature markets",
  },
  {
    number: "03",
    title: "Landscape Intelligence",
    description:
      "Digital twin-scale modelling for risk and resilience. Flood exposure, windthrow probability, storm impact corridors, and infrastructure hazard derived from high-resolution terrain, canopy structure, and hydrological models. Designed for government, infrastructure managers, and institutional clients operating at catchment to national scale.",
    image: null,
    video: null,
    alt: "Landscape risk modelling",
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
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    panelRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase">What we do</p>
          <a href="/consultancy" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Our services →</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row relative">
        {/* Sticky left panel */}
        <div className="hidden md:flex sticky top-[10vh] h-[80vh] w-2/5 flex-col justify-center pr-16 flex-shrink-0">
          <div className="max-w-xs">
            <span className="text-sm text-gray-300 block mb-5">{areas[active].number}</span>
            <h2 className="text-3xl font-semibold text-gray-900 mb-5 leading-snug">
              {areas[active].title}
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">
              {areas[active].description}
            </p>
          </div>
        </div>

        {/* Scrolling right panels */}
        <div className="w-full md:w-3/5 py-8 flex flex-col gap-6">
          {areas.map((area, i) => (
            <div
              key={area.number}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="h-[80vh] rounded-xl flex flex-col justify-center relative overflow-hidden"
            >
              {i === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="scale-[0.72] sm:scale-[0.85] md:scale-[0.78] lg:scale-90 xl:scale-100 origin-center">
                    <ForestIntelCard />
                  </div>
                </div>
              ) : area.video ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={area.video} type="video/mp4" />
                </video>
              ) : area.image ? (
                <img
                  src={area.image}
                  alt={area.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : i === 2 ? (
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <LandscapeVisualization />
                </div>
              ) : (
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1B4D3E 0%, #2d4a63 100%)" }}
                >
                  <span className="text-white/20 text-xs tracking-widest uppercase">Visual coming soon</span>
                </div>
              )}
              {/* Mobile-only text overlay */}
              <div className="relative z-10 p-4 sm:p-8 md:hidden">
                <span className="text-xs text-white/50 block mb-2 sm:mb-3">{area.number}</span>
                <h2 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">{area.title}</h2>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed line-clamp-3">{area.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
