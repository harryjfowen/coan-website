const research = [
  { label: "Projects", href: "/research" },
  { label: "Publications", href: "/research#publications" },
  { label: "Demos", href: "/research#demos" },
];

const company = [
  { label: "About", href: "/about" },
  { label: "Consultancy", href: "/consultancy" },
  { label: "Contact", href: "/contact" },
];

const connect = [
  { label: "hello@coan.io", href: "mailto:hello@coan.io" },
  { label: "GitHub", href: "https://github.com/harryjfowen" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-16 mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Coan</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Environmental AI mapping & consultancy
            </p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Research</p>
            <ul className="space-y-2">
              {research.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Company</p>
            <ul className="space-y-2">
              {company.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">Connect</p>
            <ul className="space-y-2">
              {connect.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-8 gap-4">
          <p className="text-xs text-gray-300">© {new Date().getFullYear()} Coan Ltd</p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
