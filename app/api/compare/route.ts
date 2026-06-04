import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const s1 = searchParams.get('s1');
  const s2 = searchParams.get('s2');

  if (!s1 || !s2) {
    return NextResponse.json({ error: true, message: 's1 and s2 query params are required' }, { status: 400 });
  }

  if (s1 === s2) {
    return NextResponse.json({ error: true, message: 's1 and s2 must be different record IDs' }, { status: 400 });
  }

  const [record1raw, record2raw] = await Promise.all([
    prisma.salary.findUnique({ where: { id: s1 }, include: { company: true } }),
    prisma.salary.findUnique({ where: { id: s2 }, include: { company: true } }),
  ]);

  if (!record1raw) {
    return NextResponse.json({ error: true, message: `Salary record with id ${s1} not found` }, { status: 404 });
  }
  if (!record2raw) {
    return NextResponse.json({ error: true, message: `Salary record with id ${s2} not found` }, { status: 404 });
  }

  const serialize = (r: typeof record1raw) => ({
    ...r,
    base_salary: Number(r!.base_salary),
    bonus: Number(r!.bonus),
    stock: Number(r!.stock),
    total_compensation: Number(r!.total_compensation),
    confidence_score: Number(r!.confidence_score),
  });

  const record1 = serialize(record1raw);
  const record2 = serialize(record2raw);

  const delta = {
    base_delta: record1.base_salary - record2.base_salary,
    bonus_delta: record1.bonus - record2.bonus,
    stock_delta: record1.stock - record2.stock,
    tc_delta: record1.total_compensation - record2.total_compensation,
    experience_delta: record1.experience_years - record2.experience_years,
  };

  return NextResponse.json({ record1, record2, delta });
}
