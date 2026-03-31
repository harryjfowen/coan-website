import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Research() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">Research</p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 max-w-2xl mb-16">
            Projects, papers & datasets
          </h1>

          {/* Projects */}
          <section className="mb-20">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
              {/* Cards will go here */}
              <div className="bg-white p-8">
                <div className="aspect-video bg-gray-50 mb-6 flex items-center justify-center">
                  <span className="text-xs text-gray-300">Visual coming soon</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">LiDAR · Semantic Segmentation</p>
                <h3 className="text-base font-semibold text-gray-900 mb-2">3D Forest Structure from Point Clouds</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Deep learning segmentation of airborne LiDAR point clouds to extract individual tree structure, wood-leaf separation, and canopy metrics at scale.
                </p>
              </div>
            </div>
          </section>

          {/* Publications */}
          <section id="publications" className="mb-20">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">Publications</h2>
            <p className="text-sm text-gray-400">Papers coming soon.</p>
          </section>

          {/* Datasets */}
          <section id="demos">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">Datasets</h2>
            <p className="text-sm text-gray-400">Datasets coming soon.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
