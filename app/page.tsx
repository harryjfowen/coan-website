import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ResearchScroll from "@/components/ResearchScroll";

const affiliations = [
  { name: "University College London",            logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/University_College_London_logo.svg" },
  { name: "Queen Mary University of London",      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Queen_Mary_University_of_London_coat_of_arms.svg" },
  { name: "University of Cambridge",              logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg" },
  { name: "Royal Holloway, University of London", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Shield_of_Royal_Holloway_University_of_London.svg" },
  { name: "Institute of Zoology, ZSL",            logo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Zoological_Society_of_London_%28ZSL%29_logo.svg" },
  { name: "Forest Research",                      logo: "https://cdn.forestresearch.gov.uk/2024/10/Forestry-logo-2024.svg" },
];

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

const sectors = [
  { title: "Nature",          description: "Habitat classification, biodiversity baselines, and multi-sensor species monitoring aligned to BNG and natural capital frameworks." },
  { title: "Infrastructure",  description: "Terrain modelling, flood risk mapping, and hazard intelligence for roads, utilities, and coastal assets." },
  { title: "Carbon",          description: "Forest carbon stock, canopy structure, and afforestation monitoring aligned to Woodland Carbon Code verification." },
  { title: "Land",            description: "Crop health, pasture condition, and land productivity monitoring using multispectral drone and satellite data." },
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
      <section className="pt-32 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "#0D9488" }}>
            Environmental Intelligence
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 max-w-3xl leading-tight mb-6">
            Building a digital understanding of the natural world.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-10">
            Coan integrates drone, satellite, and sensor data using AI to measure, model, and monitor ecosystems — from fine-scale 3D structure to landscape-scale change — supporting carbon, biodiversity, and environmental risk assessment.
          </p>
          <div className="flex gap-4 mb-16">
            <a href="/research" className="text-sm font-medium text-white px-5 py-2.5 rounded-full transition-colors" style={{ backgroundColor: "#0D9488" }}>
              View research
            </a>
            <a href="/consultancy" className="text-sm font-medium px-5 py-2.5 rounded-full border transition-colors" style={{ color: "#0D9488", borderColor: "#0D9488" }}>
              Work with us
            </a>
          </div>
          <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: "21/9" }}>
            <img
              src="/images/drone-map-hero.png"
              alt="Drone mapping survey"
              className="w-full h-full object-cover"
              style={{ filter: "contrast(1.15) brightness(1.05)" }}
            />
          </div>
        </div>
      </section>

      {/* Affiliations strip */}
      <section className="py-12 border-b border-gray-100">
        <p className="text-xs font-medium tracking-widest text-gray-400 uppercase text-center mb-8">Academic background</p>
        <div className="relative overflow-hidden max-w-7xl mx-auto px-6">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, white, transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, white, transparent)" }} />
          {/* Scrolling track — items duplicated so it loops seamlessly */}
          <div className="flex animate-marquee" style={{ width: "max-content" }}>
            {[...affiliations, ...affiliations].map((a, i) => (
              <div key={i} className="flex flex-col items-center justify-center mx-12 gap-2" style={{ width: 120 }}>
                <img
                  src={a.logo}
                  alt={a.name}
                  className="max-h-10 max-w-full object-contain opacity-40 grayscale transition-all group-hover:opacity-70"
                />
                <span className="text-[10px] text-gray-400 text-center leading-tight">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ResearchScroll />

      {/* Featured projects */}
      <section className="py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase">Featured work</h2>
            <a href="/research" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">All projects →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <a
                key={project.title}
                href={project.href}
                target={project.external ? "_blank" : undefined}
                rel={project.external ? "noopener noreferrer" : undefined}
                className="group bg-gray-50 rounded-2xl overflow-hidden hover:bg-gray-100 transition-colors flex flex-col"
              >
                <div className="overflow-hidden rounded-xl m-3" style={{ aspectRatio: "16/10" }}>
                  {project.image ? (
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
                  <span className="inline-block text-xs font-medium text-white px-3 py-1.5 rounded-full transition-colors self-start" style={{ backgroundColor: "#0D9488" }}>
                    Explore →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Isle of Man */}
      <section className="py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
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
          
          <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-xl">
            <span className="text-xs text-gray-300">Isle of Man imagery</span>
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-baseline mb-12">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase">What we do</h2>
            <a href="/consultancy" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">All services →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100">
            {sectors.map((s) => (
              <a key={s.title} href="/consultancy" className="group bg-white p-8 hover:bg-gray-50 transition-colors">
                <h3 className="text-sm font-semibold mb-3 transition-colors" style={{ color: "#0D9488" }}>{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Latest publications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
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
