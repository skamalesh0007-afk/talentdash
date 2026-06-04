import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Level, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const company = searchParams.get('company') || '';
  const role = searchParams.get('role') || '';
  const level = searchParams.get('level') || '';
  const location = searchParams.get('location') || '';
  const sort = searchParams.get('sort') || 'total_comp_desc';
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const rawLimit = Number(searchParams.get('limit') || '25');
  const limit = Math.min(100, Math.max(1, rawLimit));

  const where: Prisma.SalaryWhereInput = {};

  if (company) {
    where.company = {
      OR: [
        { name: { contains: company, mode: 'insensitive' } },
        { normalized_name: { contains: company.toLowerCase() } },
      ],
    };
  }

  if (role) {
    where.role = { contains: role, mode: 'insensitive' };
  }

  if (level && Object.values(Level).includes(level as Level)) {
    where.level = level as Level;
  }

  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  const orderBy: Prisma.SalaryOrderByWithRelationInput =
    sort === 'total_comp_asc'
      ? { total_compensation: 'asc' }
      : sort === 'date_desc'
      ? { submitted_at: 'desc' }
      : { total_compensation: 'desc' };

  const [total, salaries] = await Promise.all([
    prisma.salary.count({ where }),
    prisma.salary.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { company: true },
    }),
  ]);

  const data = salaries.map((s) => ({
    ...s,
    base_salary: Number(s.base_salary),
    bonus: Number(s.bonus),
    stock: Number(s.stock),
    total_compensation: Number(s.total_compensation),
    confidence_score: Number(s.confidence_score),
  }));

  return NextResponse.json(
    {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    },
    {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=3600',
      },
    }
  );
}
