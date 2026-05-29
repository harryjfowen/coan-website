"use client";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageCompareSlider from "@/components/ImageCompareSlider";

export default function ForestCarbon() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="pt-28">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="mb-16 pb-16 border-b border-gray-100">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">
              Research · Carbon Quantification
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 max-w-3xl leading-tight mb-6">
              Forest Carbon Structure from Point Clouds
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
              Deep learning segmentation of airborne LiDAR point clouds to quantify above-ground biomass and canopy structure at individual-tree scale. Delivering MRV-grade carbon stock estimates for nature markets and carbon verification schemes.
            </p>
          </div>

          {/* Main content + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">

            {/* Body */}
            <div className="lg:col-span-2 space-y-12">

              {/* Figure: Interactive Slider */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Wood-Leaf Segmentation
                </h2>
                <p className="text-base text-gray-500 leading-relaxed">
                  Drag the slider below to compare the full point cloud classification (leaf + wood) with wood-only structure. This segmentation is the foundation for biomass estimation and canopy metrics.
                </p>
                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100" style={{ aspectRatio: "16/10" }}>
                  <ImageCompareSlider
                    before="/images/webpage-ptw.png"
                    after="/images/webpage-ptw-wood.png"
                    beforeAlt="Leaf + Wood Classification"
                    afterAlt="Wood Classification"
                    minimal={true}
                  />
                </div>
              </div>

              {/* Text sections */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Methodology
                </h2>
                <p className="text-base text-gray-500 leading-relaxed">
                  We use convolutional neural networks trained on terrestrial laser scanning (TLS) ground truth to segment airborne LiDAR point clouds into vegetation components. The model learns to distinguish wood from leaf material across varied forest types and canopy structures.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Key Outputs
                </h2>
                <ul className="space-y-3">
                  <li className="flex gap-4">
                    <span className="text-gray-400 font-medium">•</span>
                    <span className="text-base text-gray-500"><span className="font-medium text-gray-900">Individual tree biomass estimates</span> — above-ground biomass quantified at single-tree resolution</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-gray-400 font-medium">•</span>
                    <span className="text-base text-gray-500"><span className="font-medium text-gray-900">Canopy structure metrics</span> — leaf area, wood volume, height profiles, and crown dimensions</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-gray-400 font-medium">•</span>
                    <span className="text-base text-gray-500"><span className="font-medium text-gray-900">MRV-grade carbon verification</span> — audit-ready outputs for carbon markets and compliance schemes</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="rounded-xl bg-gray-50 p-6">
                <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Details</p>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Data Source</p>
                    <p className="text-gray-900 font-medium">Airborne LiDAR</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Model Type</p>
                    <p className="text-gray-900 font-medium">Deep Learning (CNN)</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Resolution</p>
                    <p className="text-gray-900 font-medium">Individual tree scale</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Output Format</p>
                    <p className="text-gray-900 font-medium">Point cloud segmentation + metrics</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
