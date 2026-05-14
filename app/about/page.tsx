import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6">
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
          <section className="border-t border-gray-100 pt-16 mb-16">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">Team</h2>
            <div className="flex items-start gap-6 max-w-lg">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Dr Harry Owen</p>
                <p className="text-sm text-gray-400 mb-3">Founder & Director</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Environmental AI researcher specialising in 3D point cloud analysis, remote sensing, and landscape-scale ecological mapping. Published as Harry J. F. Owen.
                </p>
                <div className="flex gap-4">
                  <a href="mailto:harry.owen@coan.io" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">harry.owen@coan.io</a>
                  <a href="https://scholar.google.com/citations?user=xDapL-gAAAAJ&hl=en" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Google Scholar</a>
                  <a href="https://www.linkedin.com/in/harry-owen-316533243/" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">LinkedIn</a>
                </div>
              </div>
            </div>
          </section>

          {/* Collaborators */}
          <section className="border-t border-gray-100 pt-16">
            <h2 className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-8">Collaborators</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
              {[
                { name: "Name", role: "Marine Scientist", affiliation: "Institution" },
                { name: "Name", role: "Remote Sensing Specialist", affiliation: "Institution" },
                { name: "Name", role: "Ecologist", affiliation: "Institution" },
              ].map((person) => (
                <div key={person.name + person.role} className="bg-white p-8">
                  <div className="w-12 h-12 rounded-full bg-gray-100 mb-4" />
                  <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                  <p className="text-sm text-gray-400 mb-1">{person.role}</p>
                  <p className="text-xs text-gray-300">{person.affiliation}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
