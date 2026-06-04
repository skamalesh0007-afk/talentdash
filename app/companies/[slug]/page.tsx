import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import SalaryTable from '@/components/features/SalaryTable';
import LevelDistributionBar from '@/components/features/LevelDistributionBar';
import { formatINR } from '@/lib/currency';

export const revalidate = 3600;

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({ select: { slug: true } });
  return companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const company = await prisma.company.findUnique({ where: { slug: params.slug } });
  if (!company) return {};
  return {
    title: `${company.name} Salaries & Compensation — All Levels`,
    description: `Explore salary data, level distribution, and compensation ranges at ${company.name}. See what engineers and PMs earn at ${company.name} in India.`,
    alternates: { canonical: `/companies/${params.slug}` },
    openGraph: {
      title: `${company.name} Salaries | TalentDash`,
      description: `Salary data and compensation insights for ${company.name}`,
      url: `/companies/${params.slug}`,
    },
  };
}

async function getCompanyData(slug: string) {
  const company = await prisma.company.findUnique({ where: { slug } });
  if (!company) return null;

  const salaries = await prisma.salary.findMany({
    where: { company_id: company.id },
    orderBy: { total_compensation: 'desc' },
    include: { company: true },
  });

  const tcValues = salaries.map((s) => Number(s.total_compensation)).sort((a, b) => a - b);
  const mid = Math.floor(tcValues.length / 2);
  const medianTC =
    tcValues.length === 0 ? 0
    : tcValues.length % 2 === 0 ? (tcValues[mid - 1] + tcValues[mid]) / 2
    : tcValues[mid];

  const distribution: Record<string, number> = {};
  for (const s of salaries) {
    distribution[s.level] = (distribution[s.level] || 0) + 1;
  }

  const tcList = tcValues;
  const minTC = tcList[0] || 0;
  const maxTC = tcList[tcList.length - 1] || 0;

  return {
    company: {
      ...company,
      created_at: company.created_at.toISOString(),
      updated_at: company.updated_at.toISOString(),
    },
    salaries: salaries.map((s) => ({
      ...s,
      base_salary: Number(s.base_salary),
      bonus: Number(s.bonus),
      stock: Number(s.stock),
      total_compensation: Number(s.total_compensation),
      confidence_score: Number(s.confidence_score),
      submitted_at: s.submitted_at.toISOString(),
      company: {
        ...s.company,
        created_at: s.company.created_at.toISOString(),
        updated_at: s.company.updated_at.toISOString(),
      },
    })),
    medianTC,
    minTC,
    maxTC,
    distribution,
    total: salaries.length,
  };
}

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const data = await getCompanyData(params.slug);
  if (!data) notFound();

  const { company, salaries, medianTC, minTC, maxTC, distribution, total } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${company.name} Salary Data`,
    description: `Compensation data for ${company.name} employees in India`,
    url: `https://talentdash.vercel.app/companies/${params.slug}`,
    creator: { '@type': 'Organization', name: 'TalentDash' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="bg-white rounded-xl border border-td-border p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-td-black">{company.name}</h1>
                {company.industry && (
                  <span className="px-2 py-0.5 bg-td-bg border border-td-border rounded text-xs font-medium text-td-muted">
                    {company.industry}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-td-muted">
                {company.headquarters && <span>📍 {company.headquarters}</span>}
                {company.founded_year && <span>🗓 Founded {company.founded_year}</span>}
                {company.headcount_range && <span>👥 {company.headcount_range} employees</span>}
              </div>
            </div>
            <Link
              href={`/compare?c1=${params.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-coral text-coral font-semibold rounded-lg hover:bg-coral hover:text-white transition-colors text-sm whitespace-nowrap"
            >
              ⚖️ Compare
            </Link>
          </div>
        </div>

        {/* Compensation Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-td-border p-5 text-center">
            <div className="text-xs font-semibold text-td-muted uppercase tracking-wide mb-2">Median Total Comp</div>
            <div className="text-3xl font-bold text-data-blue">{formatINR(medianTC)}</div>
            <div className="text-xs text-td-muted mt-1">per year</div>
          </div>
          <div className="bg-white rounded-xl border border-td-border p-5 text-center">
            <div className="text-xs font-semibold text-td-muted uppercase tracking-wide mb-2">TC Range</div>
            <div className="text-lg font-bold text-td-black">
              {formatINR(minTC)} — {formatINR(maxTC)}
            </div>
            <div className="text-xs text-td-muted mt-1">min to max</div>
          </div>
          <div className="bg-white rounded-xl border border-td-border p-5 text-center">
            <div className="text-xs font-semibold text-td-muted uppercase tracking-wide mb-2">Data Points</div>
            <div className="text-3xl font-bold text-td-black">{total}</div>
            <div className="text-xs text-td-muted mt-1">salary records</div>
          </div>
        </div>

        {/* Level Distribution */}
        {Object.keys(distribution).length > 0 && (
          <div className="bg-white rounded-xl border border-td-border p-6">
            <h2 className="text-base font-semibold text-td-black mb-4">Level Distribution</h2>
            <LevelDistributionBar distribution={distribution} />
          </div>
        )}

        {/* Salary Table */}
        <div>
          <h2 className="text-xl font-bold text-td-black mb-4">All Salaries at {company.name}</h2>
          <SalaryTable
            initialData={salaries as any}
            initialMeta={{ total, page: 1, limit: total, totalPages: 1 }}
            showCompanyColumn={false}
          />
        </div>
      </div>
    </>
  );
}
