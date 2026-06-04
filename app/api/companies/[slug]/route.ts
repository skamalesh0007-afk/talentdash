import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const company = await prisma.company.findUnique({
    where: { slug: params.slug },
  });

  if (!company) {
    return NextResponse.json({ error: true, message: 'Company not found' }, { status: 404 });
  }

  const salaries = await prisma.salary.findMany({
    where: { company_id: company.id },
    orderBy: { total_compensation: 'desc' },
    include: { company: true },
  });

  const tcValues = salaries.map((s) => Number(s.total_compensation)).sort((a, b) => a - b);
  const mid = Math.floor(tcValues.length / 2);
  const median_total_compensation =
    tcValues.length === 0
      ? 0
      : tcValues.length % 2 === 0
      ? (tcValues[mid - 1] + tcValues[mid]) / 2
      : tcValues[mid];

  const level_distribution: Record<string, number> = {};
  for (const s of salaries) {
    level_distribution[s.level] = (level_distribution[s.level] || 0) + 1;
  }

  const data = salaries.map((s) => ({
    ...s,
    base_salary: Number(s.base_salary),
    bonus: Number(s.bonus),
    stock: Number(s.stock),
    total_compensation: Number(s.total_compensation),
    confidence_score: Number(s.confidence_score),
  }));

  return NextResponse.json(
    { company, salaries: data, median_total_compensation, level_distribution },
    {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
