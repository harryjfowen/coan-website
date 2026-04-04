const links = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
  { label: "Consultancy", href: "/consultancy" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="font-bold tracking-tight pl-0" style={{ color: "#1A2B3C", fontSize: "3.5rem", marginLeft: "-0.1em" }}>
          Coan
        </a>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 transition-colors hover:text-[#1A2B3C]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
