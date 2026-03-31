export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="text-sm font-semibold tracking-tight text-gray-900">
          Coan
        </a>
        <div className="flex items-center gap-8">
          <a href="#research" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Research
          </a>
          <a href="#about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            About
          </a>
          <a href="#contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
