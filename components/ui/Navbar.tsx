import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-td-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-td-black tracking-tight">
              Talent<span className="text-coral">Dash</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-td-dark">
              <Link href="/salaries" className="hover:text-coral transition-colors">Salaries</Link>
              <Link href="/companies/google" className="hover:text-coral transition-colors">Companies</Link>
              <Link href="/compare" className="hover:text-coral transition-colors">Compare</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/salaries"
              className="hidden sm:inline-flex items-center px-4 py-1.5 bg-coral text-white text-sm font-semibold rounded-lg hover:bg-red-500 transition-colors"
            >
              Explore Salaries
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
