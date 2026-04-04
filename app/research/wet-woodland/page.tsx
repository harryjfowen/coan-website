"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const WetWoodlandMap = dynamic(() => import("@/components/WetWoodlandMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-gray-100 flex items-center justify-center" style={{ height: "480px" }}>
      <span className="text-xs text-gray-300">Loading map…</span>
    </div>
  ),
});

export default function WetWoodland() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="pt-28">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="mb-16 pb-16 border-b border-gray-100">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">
              Research · Mapping
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 max-w-3xl leading-tight mb-6">
              Wet Woodland Extent Mapping in England
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
              National-scale mapping of wet woodland distribution, density, and restoration potential across England at 10m resolution, using LiDAR-derived features and satellite embeddings.
            </p>
            <div className="flex gap-4">
              <a
                href="https://harryjfowen.github.io/wetwoodland-map/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white px-5 py-2.5 transition-colors"
                style={{ backgroundColor: "#0D9488" }}
              >
                Live demo →
              </a>
              <a
                href="https://github.com/harryjfowen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 border border-gray-200 px-5 py-2.5 hover:border-gray-900 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Main content + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">

            {/* Body */}
            <div className="lg:col-span-2 space-y-12">

              {/* Interactive map */}
              <WetWoodlandMap />

              {/* Overview */}
              <section>
                <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Overview</h2>
                <p className="text-base text-gray-600 leading-relaxed mb-4">
                  Wet woodland is one of the UK's most threatened and poorly mapped habitat types. This project produced the first national-scale, high-resolution map of wet woodland extent in England — a critical baseline for biodiversity monitoring, carbon accounting, and nature recovery planning under the Local Nature Recovery Strategy framework.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  Delivered for Defra UK, the outputs include extent mapping at 10m resolution, density analysis at 5km hexagonal grid cells, and restoration potential scoring across agricultural land grades.
                </p>
              </section>

              {/* Methodology */}
              <section>
                <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Methodology</h2>
                <p className="text-base text-gray-600 leading-relaxed mb-4">
                  Classification was driven by a combination of LiDAR-derived structural features and satellite embeddings. LiDAR data provided canopy height, terrain wetness indices, and vegetation structure metrics. Satellite imagery embeddings captured spectral and temporal signatures associated with wet woodland conditions across seasons.
                </p>
                <p className="text-base text-gray-600 leading-relaxed mb-4">
                  These feature sets were fused and used to train a classification model capable of distinguishing wet woodland from adjacent dry woodland, scrub, and riparian vegetation — classes that are spectrally similar but structurally distinct.
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  Outputs were validated against field survey data and existing habitat inventories, and delivered as Cloud Optimized GeoTIFFs (COG) for efficient web streaming.
                </p>
              </section>

              {/* Visualisations */}
              <section>
                <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Interactive demo</h2>
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  The live demo provides four visualisation modes: extent raster, density hexgrid, LNRS regional breakdowns, and restoration potential filtering by agricultural land grade.
                </p>
                <a
                  href="https://harryjfowen.github.io/wetwoodland-map/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium text-gray-900 border border-gray-200 px-5 py-2.5 hover:border-gray-900 transition-colors"
                >
                  Open interactive map →
                </a>
              </section>

            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Details</p>
                <dl className="space-y-4">
                  {[
                    { label: "Delivered for", value: "Defra UK" },
                    { label: "Coverage", value: "England" },
                    { label: "Resolution", value: "10m" },
                    { label: "Methods", value: "LiDAR + Satellite Embeddings" },
                    { label: "Data format", value: "Cloud Optimized GeoTIFF" },
                    { label: "Status", value: "Delivered" },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs text-gray-400 mb-1">{item.label}</dt>
                      <dd className="text-sm text-gray-900">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {["Wet Woodland", "LiDAR", "Satellite Embeddings", "Habitat Mapping", "England", "Defra", "LNRS", "COG"].map((tag) => (
                    <span key={tag} className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
