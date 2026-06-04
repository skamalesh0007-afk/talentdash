import type { Metadata } from 'next';
import { Suspense } from 'react';
import SalaryTable from '@/components/features/SalaryTable';
import { prisma } from '@/lib/db';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Software Engineer Salaries in India — All Levels & Companies',
  description: 'Browse verified salary data for software engineers, product managers, and data scientists at Google, Amazon, Meta, Flipkart and more. Filter by level, location, and company.',
  alternates: { canonical: '/salaries' },
  openGraph: {
    title: 'Software Engineer Salaries in India | TalentDash',
    description: 'Level-aware compensation data for tech professionals. Find what engineers earn at top India tech companies.',
    url: '/salaries',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'TalentDash India Tech Salary Data',
  description: 'Structured compensation data for software engineers and tech professionals in India',
  url: 'https://talentdash.vercel.app/salaries',
  creator: { '@type': 'Organization', name: 'TalentDash' },
  keywords: ['salary', 'compensation', 'software engineer', 'India', 'tech jobs'],
};

async function getSalaries() {
  const [salaries, total] = await Promise.all([
    prisma.salary.findMany({
      orderBy: { total_compensation: 'desc' },
      take: 25,
      include: { company: true },
    }),
    prisma.salary.count(),
  ]);

  return {
    data: salaries.map((s) => ({
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
    meta: { total, page: 1, limit: 25, totalPages: Math.ceil(total / 25) },
  };
}

export default async function SalariesPage() {
  const { data, meta } = await getSalaries();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-td-black">Salary Data</h1>
          <p className="text-td-muted mt-1">
            Verified compensation records from engineers across India's top tech companies.
          </p>
        </div>
        <Suspense fallback={<div className="h-96 bg-white rounded-xl border border-td-border animate-pulse" />}>
          <SalaryTable initialData={data as any} initialMeta={meta} />
        </Suspense>
      </div>
    </>
  );
}
