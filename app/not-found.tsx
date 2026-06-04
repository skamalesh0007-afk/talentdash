import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-4xl font-bold text-td-black mb-4">Page Not Found</h1>
      <p className="text-td-muted text-lg mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/" className="px-6 py-3 bg-coral text-white font-semibold rounded-xl hover:bg-red-500 transition-colors">
          Back to Home
        </Link>
        <Link href="/salaries" className="px-6 py-3 border-2 border-td-border text-td-dark font-semibold rounded-xl hover:border-coral hover:text-coral transition-colors">
          Browse Salaries
        </Link>
      </div>
    </div>
  );
}
