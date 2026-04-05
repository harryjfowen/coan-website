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
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/images/coan-logo.png"
            alt="Coan logo"
            style={{ height: "2.5rem", width: "auto" }}
          />
          <span className="font-bold tracking-tight text-gray-900" style={{ fontSize: "2.5rem", lineHeight: 1 }}>
            Coan
          </span>
        </a>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 transition-colors hover:text-[#0D9488]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
