"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ResearchScroll from "@/components/ResearchScroll";
import ImageCompareSlider from "@/components/ImageCompareSlider";
import dynamic from "next/dynamic";

const WetWoodlandPreview = dynamic(() => import("@/components/WetWoodlandPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-gray-100 flex items-center justify-center rounded-xl" style={{ aspectRatio: "16/10" }}>
      <span className="text-xs text-gray-400">Loading map…</span>
    </div>
  ),
});

const affiliations = [
  { name: "University College London",            logo: "/images/logos/University_College_London_logo.svg.png" },
  { name: "Queen Mary University of London",      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Queen_Mary_University_of_London_coat_of_arms.svg" },
  { name: "University of Cambridge",              logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg" },
  { name: "Royal Holloway, University of London", logo: "/images/logos/rhul-logo.webp" },
  { name: "Institute of Zoology, ZSL",            logo: "/images/logos/ioz-logo.jpg" },
  { name: "Forest Research",                      logo: "https://cdn.forestresearch.gov.uk/2024/10/Forestry-logo-2024.svg" },
];

const featuredProjects = [
  {
    tag: "Restoration · Defra UK",
    title: "Wet Woodland Distribution in England",
    description:
      "Interactive mapping of wet woodland extent, density and restoration potential across England at 10m resolution. Delivered for Defra UK.",
    href: "/research/wet-woodland",
    image: "/images/wetwood-density.png",
    external: false,
  },
  {
    tag: "Carbon · LiDAR",
    title: "Forest Carbon Structure from Point Clouds",
    description:
      "Above-ground biomass and canopy structure quantified using deep learning segmentation of airborne LiDAR — delivering MRV-grade carbon stock estimates at individual-tree scale.",
    href: "/research/forest-carbon",
    image: null,
    external: false,
  },
  {
    tag: "Landscape Intelligence · Satellite",
    title: "Landscape-Scale Change Monitoring",
    description:
      "Time-series satellite analysis to detect, attribute, and quantify land cover change — providing the persistent monitoring layer for long-term nature market and restoration commitments.",
    href: "/research",
    image: null,
    external: false,
  },
];


const publications = [
  {
    title: "Publication title",
    journal: "Journal · Year",
    href: "#",
  },
  {
    title: "Publication title 2",
    journal: "Journal · Year",
    href: "#",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="relative border-b border-gray-100" style={{ aspectRatio: "16/9" }}>
        <img
          src="/forest-hero.jpg"
          alt="Forest canopy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.7) 100%)"
        }} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:pb-16 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white max-w-3xl leading-tight mb-4 sm:mb-6">
              From field to market. Verifiable by design.
            </h1>
            <p className="text-base sm:text-lg text-gray-100 max-w-xl leading-relaxed mb-6 sm:mb-10">
              We measure, model, and monitor ecosystems — producing audit-ready outputs for nature markets, carbon schemes, and landscape-scale risk decisions. Grounded in field science. Scaled with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="/research" className="text-sm font-medium text-white px-5 py-2.5 rounded-full transition-colors text-center" style={{ backgroundColor: "#000000" }}>
                View research
              </a>
              <a href="/consultancy" className="text-sm font-medium px-5 py-2.5 rounded-full border transition-colors text-white text-center" style={{ borderColor: "#1B4D3E" }}>
                Our services
              </a>
            </div>
          </div>
        </div>
      </section>

      <ResearchScroll />

      {/* Affiliations strip */}
      <section className="py-8 sm:py-12 border-b border-gray-100">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase text-center mb-8">Academic background</p>
        <div className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6">
          {/* Fade edges */}
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, white, transparent)" }} />
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, white, transparent)" }} />
          {/* Scrolling track — items duplicated so it loops seamlessly */}
          <div className="flex animate-marquee" style={{ width: "max-content" }}>
            {[...affiliations, ...affiliations].map((a, i) => (
              <div key={i} className="flex flex-col items-center justify-center mx-6 sm:mx-12 gap-2" style={{ width: 100 }}>
                <img
                  src={a.logo}
                  alt={a.name}
                  className="max-h-8 sm:max-h-10 max-w-full object-contain opacity-80 transition-all group-hover:opacity-100"
                />
                <span className="text-[8px] sm:text-[10px] text-gray-400 text-center leading-tight">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="py-12 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 mb-8 sm:mb-12">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase">Recent work</h2>
            <a href="/research" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">All projects →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <a
                key={project.title}
                href={project.href}
                target={project.external ? "_blank" : undefined}
                rel={project.external ? "noopener noreferrer" : undefined}
                className="group bg-gray-50 rounded-2xl overflow-hidden hover:bg-gray-100 transition-colors flex flex-col"
              >
                <div className="overflow-hidden rounded-xl m-3 w-full h-full" style={{ aspectRatio: "16/10" }}>
                  {idx === 0 ? (
                    <WetWoodlandPreview />
                  ) : idx === 1 ? (
                    <div className="w-full h-full">
                      <ImageCompareSlider
                        before="/images/webpage-ptw.png"
                        after="/images/webpage-ptw-wood.png"
                        beforeAlt="Leaf + Wood Classification"
                        afterAlt="Wood Classification"
                        minimal={true}
                      />
                    </div>
                  ) : project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-400">Visual coming soon</span>
                    </div>
                  )}
                </div>
                <div className="px-5 pb-6 pt-3 flex flex-col flex-1">
                  <p className="text-xs text-gray-400 mb-2">{project.tag}</p>
                  <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{project.description}</p>
                  <span className="inline-block text-xs font-medium text-white px-3 py-1.5 rounded-full transition-colors self-start" style={{ backgroundColor: "#000000" }}>
                    Explore →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Twin / Isle of Man */}
      <section className="py-12 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">Live proof of concept</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-start">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-6 leading-snug">
                The Isle of Man as digital twin.
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-4">
                The Isle of Man is where all three capabilities operate simultaneously at landscape scale — the world's first UNESCO Biosphere Reserve monitored end-to-end across biodiversity, carbon, and risk intelligence.
              </p>
              <p className="text-base text-gray-500 leading-relaxed mb-8">
                Every habitat type, elevation zone, and coastal margin on the island is captured in a continuous monitoring pipeline: drone surveys feeding acoustic and structural models, satellite embeddings tracking seasonal change, and terrain models informing flood and windthrow exposure. This is what working at digital twin scale looks like.
              </p>

              <div className="space-y-2 mb-8">
                <p className="text-sm text-gray-700"><span className="font-medium">Habitat baseline:</span> island-wide classification at 10m</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Carbon monitoring:</span> TLS-calibrated woodland carbon stocks</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Risk modelling:</span> flood and windthrow exposure, full road network</p>
              </div>

              <a href="/consultancy" className="inline-block text-sm font-medium text-white px-5 py-2.5 rounded-full transition-colors text-center" style={{ backgroundColor: "#1B4D3E" }}>
                Work with us →
              </a>
            </div>

            <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-xl">
              <span className="text-xs text-gray-300">Isle of Man · Digital twin coverage</span>
            </div>
          </div>
        </div>
      </section>


      {/* Trusted by */}
      <section className="py-8 sm:py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase text-center mb-8">Trusted by</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mb-8">
            <span className="text-sm font-medium text-gray-700">Defra UK</span>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-3">Outputs aligned to:</p>
            <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-gray-500">
              <span>Biodiversity Net Gain (BNG)</span>
              <span className="text-gray-300">·</span>
              <span>Woodland Carbon Code</span>
              <span className="text-gray-300">·</span>
              <span>TNFD</span>
              <span className="text-gray-300">·</span>
              <span>CSRD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest publications */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 mb-8 sm:mb-12">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase">Latest publications</h2>
            <a href="/research#publications" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">All publications →</a>
          </div>
          <div className="divide-y divide-gray-100">
            {publications.map((pub) => (
              <a key={pub.title} href={pub.href} className="flex justify-between items-center py-5 group">
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-gray-500 transition-colors">{pub.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{pub.journal}</p>
                </div>
                <span className="text-xs text-gray-300 group-hover:text-gray-900 transition-colors">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
