import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const sectors = [
  {
    title: "Nature",
    description: "Live monitoring of ecosystem condition through habitat classification, biodiversity baselines, and multi-sensor species surveillance. Quantify resilience, detect change, and support evidence-based conservation and restoration — aligned to BNG and natural capital frameworks.",
  },
  {
    title: "Infrastructure",
    description: "Terrain modelling, flood risk mapping, and hazard intelligence for roads, utilities, and coastal assets.",
  },
  {
    title: "Carbon",
    description: "Forest carbon stock, canopy structure, and afforestation monitoring aligned to Woodland Carbon Code verification.",
  },
  {
    title: "Land",
    description: "Crop health, pasture condition, and land productivity monitoring using multispectral drone and satellite data.",
  },
];

const products = [
  {
    name: "TerrainIntel",
    tagline: "Surface & Hydrological Intelligence",
    description:
      "High-resolution terrain analysis using LiDAR, drone photogrammetry, and satellite data. We produce digital terrain models, flood risk maps, drainage analysis, and infrastructure hazard assessments. From storm and windthrow risk on road networks to peatland restoration planning and coastal change monitoring — actionable intelligence derived from the landscape itself.",
    for: "Government infrastructure teams, flood risk managers, peatland restoration programmes",
  },
  {
    name: "CarbonView",
    tagline: "Forest Carbon & Planting Scheme Monitoring",
    description:
      "Above-ground biomass estimation, canopy height modelling, and individual tree segmentation using ML-driven satellite and LiDAR data. We track afforestation schemes over time — measuring growth, mortality, and carbon stock — aligned to Woodland Carbon Code verification standards. Precision forestry metrics including density, yield, and canopy structure also available.",
    for: "Forestry teams, carbon project developers, private landowners",
  },
  {
    name: "NatureMapper",
    tagline: "Ecosystem Condition Intelligence",
    description:
      "A live, multimodal monitoring platform combining satellite imagery, drone surveys, acoustic ecosystems analysis, and 3D point clouds to model ecosystem condition at landscape scale. We deliver habitat classification, species detection, resilience indicators, change forecasting, and long-term biodiversity trend analysis. Outputs are audit-ready and aligned to UK Biodiversity Net Gain requirements and Natural Capital reporting frameworks — providing the persistent intelligence layer for nature recovery programmes.",
    for: "Climate change departments, land developers, conservation bodies, private estates, restoration programmes",
  },
  {
    name: "FieldPulse",
    tagline: "Precision Land & Agriculture Monitoring",
    description:
      "Multispectral drone and satellite analysis for crop health, pasture condition, soil stress, and irrigation assessment. We deliver NDVI and vegetation index mapping, seasonal time-series comparisons, and SfM-derived terrain models — giving land managers actionable, repeatable data to improve productivity and reduce input costs.",
    for: "Farmers, estate managers, agri-environment scheme holders",
  },
];

export default function Consultancy() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">Consultancy</p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 max-w-2xl mb-8">
            Applied AI for environmental challenges.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-16">
            We build the data infrastructure for ecological intelligence — combining AI, remote sensing, and field science to create live, multimodal models of ecosystem condition. Our work helps organisations quantify resilience, forecast ecological change, and understand the living systems the economy depends on.
          </p>

          {/* Sectors */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 mb-20">
            {sectors.map((s) => (
              <div key={s.title} className="bg-white p-6">
                <h3 className="text-sm font-semibold mb-2" style={{ color: "#1B4D3E" }}>{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </section>

          {/* Products */}
          <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">Services</h2>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 mb-20">
            {products.map((p) => (
              <div key={p.name} className="bg-white p-8">
                <p className="text-xs font-medium tracking-widest uppercase mb-1" style={{ color: "#1B4D3E" }}>{p.name}</p>
                <h3 className="text-base font-semibold text-gray-900 mb-3">{p.tagline}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{p.description}</p>
                <p className="text-xs text-gray-400"><span className="font-medium text-gray-500">For:</span> {p.for}</p>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* Advisory band */}
      <section className="border-t border-gray-100 py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:flex md:items-start md:gap-16">
          <div className="mb-6 md:mb-0 md:w-64 flex-shrink-0">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">Need bespoke support?</p>
            <h2 className="text-xl font-semibold text-gray-900">Advisory &amp; Data Services</h2>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              We support organisations at every stage of their environmental data journey — from survey design and drone data collection through to processing, interpretation, and strategic advice on ecosystem restoration and nature recovery programmes.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                "UAV survey planning & data acquisition",
                "Drone data processing & deliverable production",
                "Ecosystem restoration scoping & monitoring design",
                "Remote sensing consultancy",
                "Nature market & carbon scheme advisory",
              ].map((item) => (
                <li key={item} className="text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm text-gray-500 mb-4">Interested in working together?</p>
          <a
            href="/contact"
            className="inline-block text-sm font-medium text-white px-6 py-3 transition-colors"
            style={{ backgroundColor: "#000000" }}
          >
            Get in touch
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
