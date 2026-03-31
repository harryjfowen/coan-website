import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <ProjectGrid />
      <Footer />
    </main>
  );
}
