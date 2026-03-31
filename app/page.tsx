import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const featuredProjects = [
  {
    tag: "LiDAR · Semantic Segmentation",
    title: "3D Forest Structure from Point Clouds",
    description:
      "Deep learning segmentation of airborne LiDAR point clouds to extract individual tree structure, wood-leaf separation, and canopy metrics at scale.",
    href: "/research",
  },
  {
    tag: "Aerial Imagery · Classification",
    title: "Wetland Habitat Mapping",
    description:
      "Automated classification of wet woodland and riparian habitats from multispectral imagery, supporting biodiversity and carbon monitoring.",
    href: "/research",
  },
  {
    tag: "Remote Sensing · Change Detection",
    title: "Landscape-Scale Change Detection",
    description:
      "Time-series analysis of satellite imagery to detect and quantify land cover change across large environmental monitoring areas.",
    href: "/research",
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
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">
            Environmental AI
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 max-w-3xl leading-tight mb-6">
            Mapping the natural world with AI.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-10">
            Coan develops machine learning systems for environmental mapping and monitoring — from 3D point cloud analysis to landscape-scale classification from aerial and satellite imagery.
          </p>
          <div className="flex gap-4">
            <a href="/research" className="text-sm font-medium text-white bg-gray-900 px-5 py-2.5 hover:bg-gray-700 transition-colors">
              View research
            </a>
            <a href="/consultancy" className="text-sm font-medium text-gray-900 border border-gray-200 px-5 py-2.5 hover:border-gray-900 transition-colors">
              Work with us
            </a>
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
              <a key={project.title} href={project.href} className="bg-white p-8 group hover:bg-gray-50 transition-colors">
                <div className="aspect-video bg-gray-100 mb-6 flex items-center justify-center">
                  <span className="text-xs text-gray-300">Visual coming soon</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{project.tag}</p>
                <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
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
