import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TalentDash — India Salary & Career Intelligence',
  description: 'Structured compensation data for tech professionals in India. Compare salaries, research companies, and make informed career decisions.',
};

const STATS = [
  { label: 'Salary Records', value: '80+' },
  { label: 'Companies Covered', value: '15' },
  { label: 'Cities', value: '8' },
  { label: 'Roles Tracked', value: '12+' },
];

const COMPANIES = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Flipkart', 'Razorpay', 'NVIDIA', 'Meesho', 'TCS', 'Infosys', 'Zepto', 'Wipro', 'Swiggy', 'PhonePe', 'Accenture'];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-td-bg">
      {/* Hero */}
      <section className="bg-white border-b border-td-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-coral/10 text-coral text-xs font-semibold rounded-full mb-6">
            🇮🇳 India's Compensation Intelligence Platform
          </div>
          <h1 className="text-5xl font-bold text-td-black mb-5 leading-tight">
            Know exactly what you're worth.<br />
            <span className="text-coral">Before you negotiate.</span>
          </h1>
          <p className="text-lg text-td-dark max-w-2xl mx-auto mb-10">
            Structured, level-aware salary data for tech professionals in India.
            Research compensation at Google, Amazon, Flipkart, and 100s more — by role, level, and city.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/salaries"
              className="px-8 py-3.5 bg-coral text-white font-semibold rounded-xl hover:bg-red-500 transition-colors text-lg"
            >
              Explore Salaries
            </Link>
            <Link
              href="/compare"
              className="px-8 py-3.5 bg-white border-2 border-td-border text-td-black font-semibold rounded-xl hover:border-coral hover:text-coral transition-colors text-lg"
            >
              Compare Offers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-td-border p-6 text-center">
              <div className="text-3xl font-bold text-coral mb-1">{s.value}</div>
              <div className="text-sm text-td-muted font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-td-black mb-6">Browse by Company</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {COMPANIES.map((name) => (
            <Link
              key={name}
              href={`/companies/${name.toLowerCase()}`}
              className="bg-white border border-td-border rounded-xl px-4 py-4 text-center hover:border-coral hover:shadow-sm transition-all group"
            >
              <span className="font-semibold text-td-dark group-hover:text-coral transition-colors">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-td-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Got an offer? Find out if it's fair.</h2>
          <p className="text-td-muted mb-8">Compare your offer against real data from engineers who've been there.</p>
          <Link
            href="/compare"
            className="inline-flex items-center px-8 py-3.5 bg-coral text-white font-semibold rounded-xl hover:bg-red-500 transition-colors"
          >
            Compare Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
