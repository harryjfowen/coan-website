import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const featuredProjects = [
  {
    tag: "Mapping · Defra UK",
    title: "Wet Woodland Distribution in England",
    description:
      "Interactive mapping of wet woodland extent, density and restoration potential across England at 10m resolution. Delivered for Defra UK.",
    href: "/research/wet-woodland",
    image: "/images/wetwood-density.png",
    external: false,
  },
  {
    tag: "LiDAR · Semantic Segmentation",
    title: "3D Forest Structure from Point Clouds",
    description:
      "Deep learning segmentation of airborne LiDAR point clouds to extract individual tree structure, wood-leaf separation, and canopy metrics at scale.",
    href: "/research",
    image: null,
    external: false,
  },
  {
    tag: "Remote Sensing · Change Detection",
    title: "Landscape-Scale Change Detection",
    description:
      "Time-series analysis of satellite imagery to detect and quantify land cover change across large environmental monitoring areas.",
    href: "/research",
    image: null,
    external: false,
  },
];

const services = [
  { title: "Environmental Mapping", description: "AI-driven habitat and land cover mapping from LiDAR, aerial, and satellite data." },
  { title: "Point Cloud Analysis", description: "3D analysis of terrestrial and airborne LiDAR — tree segmentation, canopy metrics, structural parameters." },
  { title: "Custom ML Pipelines", description: "End-to-end machine learning pipeline development for environmental datasets." },
];

const publications = [
  {
    title: "Publication title",
    journal: "Journal · Year",
    href: "#",
  },
  {
    title: "Publication title",
    journal: "Journal · Year",
    href: "#",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "#1A2B3C" }}>
            Environmental Intelligence Systems
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 max-w-3xl leading-tight mb-6">
            Building a digital understanding of the natural world.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-10">
            Coan integrates drone, satellite, and sensor data into AI-driven systems that measure, model, and monitor ecosystems — from fine-scale 3D structure to landscape-scale change.
          </p>
          <div className="flex gap-4">
            <a href="/research" className="text-sm font-medium text-white px-5 py-2.5 transition-colors" style={{ backgroundColor: "#1A2B3C" }}>
              View research
            </a>
            <a href="/consultancy" className="text-sm font-medium px-5 py-2.5 border transition-colors" style={{ color: "#1A2B3C", borderColor: "#1A2B3C" }}>
              Work with us
            </a>
          </div>
        </div>
      </section>

      {/* Affiliations strip */}
      <section className="py-12 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">Delivered for</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
              {["Defra UK"].map((org) => (
                <span key={org} className="text-sm font-medium text-gray-500">{org}</span>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">Academic background</p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
              {[
                "University College London",
                "Queen Mary University of London",
                "University of Cambridge",
                "Royal Holloway, University of London",
                "Institute of Zoology, ZSL",
                "Forest Research",
              ].map((org) => (
                <span key={org} className="text-sm text-gray-400">{org}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="py-20 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase">Featured work</h2>
            <a href="/research" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">All projects →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
            {featuredProjects.map((project) => (
              <a
                key={project.title}
                href={project.href}
                target={project.external ? "_blank" : undefined}
                rel={project.external ? "noopener noreferrer" : undefined}
                className="bg-white p-8 group hover:bg-gray-50 transition-colors border-t-2"
                style={{ borderTopColor: "#1A2B3C" }}
              >
                <div className="aspect-video bg-gray-100 mb-6 overflow-hidden">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xs text-gray-300">Visual coming soon</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-3">{project.tag}</p>
                <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
                {project.external && (
                  <p className="text-xs text-gray-300 mt-3">View demo →</p>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Isle of Man */}
      <section className="py-20 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">Where we work</p>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-6 leading-snug">
              Developed on the Isle of Man.<br />Applicable everywhere.
            </h2>
            <p className="text-base text-gray-500 leading-relaxed mb-4">
              Based on the Isle of Man — one of the world's first UNESCO Biosphere Reserves — we use this living laboratory to develop and validate AI systems for environmental monitoring at scale.
            </p>
            <p className="text-base text-gray-500 leading-relaxed">
              From ancient uplands to coastal margins, the island's ecological complexity makes it a rigorous test bed for deep learning applied to real, dynamic ecosystems.
            </p>
          </div>
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <span className="text-xs text-gray-300">Isle of Man imagery</span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase">Services</h2>
            <a href="/consultancy" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">All services →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
            {services.map((s) => (
              <div key={s.title} className="bg-white p-8">
                <h3 className="text-base font-semibold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest publications */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-baseline mb-12">
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
