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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
        <a href="/" className="font-bold tracking-tight text-gray-900" style={{ fontSize: "2rem", lineHeight: 1 }}>
          Coan.
        </a>
        <div className="hidden sm:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base text-gray-500 transition-colors hover:text-[#1B4D3E]"
            >
              {link.label}
            </a>
          ))}
        </div>
        {/* Mobile menu button - just links hidden on mobile for now */}
        <div className="sm:hidden flex items-center gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 transition-colors hover:text-[#1B4D3E]"
            >
              {link.label.split(' ')[0]}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
