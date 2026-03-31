import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">Contact</p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 max-w-2xl mb-8">
            Get in touch.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed mb-12">
            For consultancy enquiries, research collaborations, or general questions.
          </p>
          <a
            href="mailto:harry.owen@coan.io"
            className="text-2xl font-semibold text-gray-900 hover:text-gray-500 transition-colors"
          >
            harry.owen@coan.io
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
