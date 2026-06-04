import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { normalizeCompanyName, companyNameToSlug } from '@/lib/normalize';
import { Level, Currency, Source } from '@prisma/client';

const VALID_LEVELS = Object.values(Level);
const VALID_CURRENCIES = Object.values(Currency);

function validationError(field: string, message: string) {
  return NextResponse.json({ error: true, field, message }, { status: 400 });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: true, message: 'Invalid JSON body' }, { status: 400 });
  }

  // Required fields
  const required = ['company', 'role', 'level', 'location', 'experience_years', 'base_salary'];
  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return validationError(field, `${field} is required`);
    }
  }

  const level = body.level as string;
  if (!VALID_LEVELS.includes(level as Level)) {
    return validationError('level', `Level must be one of: ${VALID_LEVELS.join(', ')}`);
  }

  const currency = (body.currency as string) || 'INR';
  if (!VALID_CURRENCIES.includes(currency as Currency)) {
    return validationError('currency', `Currency must be one of: ${VALID_CURRENCIES.join(', ')}`);
  }

  const experience_years = Number(body.experience_years);
  if (!Number.isInteger(experience_years) || experience_years <= 0 || experience_years > 50) {
    return validationError('experience_years', 'experience_years must be an integer between 1 and 50');
  }

  const base_salary = Number(body.base_salary);
  if (!base_salary || base_salary <= 0) {
    return validationError('base_salary', 'base_salary must be a positive number');
  }

  const bonus = Number(body.bonus ?? 0);
  const stock = Number(body.stock ?? 0);
  const confidence_score = Number(body.confidence_score ?? 0.9);
  if (confidence_score < 0 || confidence_score > 1) {
    return validationError('confidence_score', 'confidence_score must be between 0.0 and 1.0');
  }

  // Recompute total_compensation server-side always
  const total_compensation = base_salary + bonus + stock;

  // Normalize company
  const rawCompany = String(body.company);
  const normalizedName = normalizeCompanyName(rawCompany);
  const slug = companyNameToSlug(normalizedName);

  // Find or create company
  let company = await prisma.company.findFirst({ where: { normalized_name: normalizedName } });
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: rawCompany.trim(),
        slug,
        normalized_name: normalizedName,
      },
    });
  }

  // Duplicate check: same company+role+level+location within 48h with base within 10%
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const existing = await prisma.salary.findFirst({
    where: {
      company_id: company.id,
      role: String(body.role),
      level: level as Level,
      location: String(body.location),
      submitted_at: { gte: fortyEightHoursAgo },
    },
  });

  if (existing) {
    const existingBase = Number(existing.base_salary);
    const diff = Math.abs(existingBase - base_salary) / existingBase;
    if (diff <= 0.1) {
      return NextResponse.json(
        { error: true, message: 'Duplicate record: similar record submitted within the last 48 hours' },
        { status: 409 }
      );
    }
  }

  const salary = await prisma.salary.create({
    data: {
      company_id: company.id,
      role: String(body.role),
      level: level as Level,
      location: String(body.location),
      currency: currency as Currency,
      experience_years,
      base_salary: BigInt(base_salary),
      bonus: BigInt(bonus),
      stock: BigInt(stock),
      total_compensation: BigInt(total_compensation),
      source: (body.source as Source) || Source.CONTRIBUTOR,
      confidence_score,
      is_verified: false,
    },
    include: { company: true },
  });

  return NextResponse.json(
    {
      ...salary,
      base_salary: Number(salary.base_salary),
      bonus: Number(salary.bonus),
      stock: Number(salary.stock),
      total_compensation: Number(salary.total_compensation),
    },
    { status: 201 }
  );
}
