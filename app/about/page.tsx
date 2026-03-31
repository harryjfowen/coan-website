import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">About</p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 max-w-2xl mb-8">
            Environmental intelligence, grounded in science.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-12">
            Coan is an environmental AI research and consultancy founded by Harry Owen. We build machine learning systems for mapping, monitoring, and understanding the natural world at scale.
          </p>

          {/* Location / UNESCO */}
          <section className="border-t border-gray-100 pt-16 mb-16">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">Where we work</h2>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed mb-4">
              Based on the Isle of Man — one of the world's first UNESCO Biosphere Reserves — Coan uses this living laboratory to develop and validate AI systems for environmental monitoring at scale.
            </p>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              From ancient uplands to coastal margins, the island offers a rare and complex test bed for deep learning applied to real ecosystems. What works here, works anywhere.
            </p>
          </section>

          {/* Team / founder */}
          <section className="border-t border-gray-100 pt-16">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">People</h2>
            <div className="flex items-start gap-6 max-w-lg">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Harry Owen</p>
                <p className="text-sm text-gray-400 mb-3">Founder</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Environmental AI researcher specialising in 3D point cloud analysis, remote sensing, and landscape-scale ecological mapping.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
