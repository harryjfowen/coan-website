const projects = [
  {
    tag: "LiDAR · Semantic Segmentation",
    title: "3D Forest Structure from Point Clouds",
    description:
      "Deep learning segmentation of airborne LiDAR point clouds to extract individual tree structure, wood-leaf separation, and canopy metrics at scale.",
    image: null,
    href: "#",
  },
  {
    tag: "Aerial Imagery · Classification",
    title: "Wetland Habitat Mapping",
    description:
      "Automated classification of wet woodland and riparian habitats from multispectral imagery, supporting biodiversity and carbon monitoring programmes.",
    image: null,
    href: "#",
  },
  {
    tag: "Remote Sensing · Change Detection",
    title: "Landscape-Scale Change Detection",
    description:
      "Time-series analysis of satellite imagery to detect and quantify land cover change across large environmental monitoring areas.",
    image: null,
    href: "#",
  },
];

export default function ProjectGrid() {
  return (
    <section id="research" className="py-16 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-12">
          Research
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.href}
              className="bg-white p-8 group hover:bg-gray-50 transition-colors"
            >
              <div className="aspect-video bg-gray-100 mb-6 overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
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
              <p className="text-sm text-gray-500 leading-relaxed">
                {project.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
