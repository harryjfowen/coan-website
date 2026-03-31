import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const services = [
  {
    title: "Environmental Mapping",
    description:
      "AI-driven mapping of habitats, vegetation, and land cover from LiDAR, aerial, and satellite data. Delivered as classified rasters, vector layers, or interactive maps.",
  },
  {
    title: "Point Cloud Analysis",
    description:
      "3D analysis of terrestrial and airborne LiDAR datasets — tree segmentation, canopy metrics, wood-leaf separation, and structural parameter extraction.",
  },
  {
    title: "Custom ML Pipelines",
    description:
      "End-to-end machine learning pipeline development for environmental datasets — from data preparation and model training to deployment and monitoring.",
  },
  {
    title: "Technical Advisory",
    description:
      "Strategic advice for organisations integrating AI into environmental monitoring workflows. Research partnerships and grant-supported collaborations welcome.",
  },
];

export default function Consultancy() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="pt-56 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">Consultancy</p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 max-w-2xl mb-8">
            Applied AI for environmental challenges.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-16">
            We work with conservation organisations, government agencies, and research institutions to apply AI to real environmental problems.
          </p>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 mb-20">
            {services.map((s) => (
              <div key={s.title} className="bg-white p-8">
                <h3 className="text-base font-semibold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </section>

          <div className="border-t border-gray-100 pt-16">
            <p className="text-sm text-gray-500 mb-4">Interested in working together?</p>
            <a
              href="/contact"
              className="inline-block text-sm font-medium text-white px-6 py-3 transition-colors"
            style={{ backgroundColor: "#1A2B3C" }}
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
