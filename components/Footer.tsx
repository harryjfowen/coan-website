export default function Footer() {
  return (
    <footer id="contact" className="py-16 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-1">Coan</p>
          <p className="text-sm text-gray-400">Environmental AI mapping & consultancy</p>
        </div>
        <div className="flex flex-col gap-2">
          <a href="mailto:hello@coan.io" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            hello@coan.io
          </a>
          <a href="https://github.com/harryjfowen" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            GitHub
          </a>
        </div>
        <p className="text-xs text-gray-300 self-end">© {new Date().getFullYear()} Coan Ltd</p>
      </div>
    </footer>
  );
}
