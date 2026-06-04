export type Level = 'L3' | 'L4' | 'L5' | 'L6' | 'SDE_I' | 'SDE_II' | 'SDE_III' | 'STAFF' | 'PRINCIPAL' | 'IC4' | 'IC5';
export type Currency = 'INR' | 'USD' | 'GBP' | 'EUR';
export type Source = 'CONTRIBUTOR' | 'SCRAPED' | 'AI_INFERRED';

export interface Company {
  id: string;
  name: string;
  slug: string;
  normalized_name: string;
  industry: string | null;
  headquarters: string | null;
  founded_year: number | null;
  headcount_range: string | null;
  created_at: string;
  updated_at: string;
}

export interface Salary {
  id: string;
  company_id: string;
  company?: Company;
  role: string;
  level: Level;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  total_compensation: number;
  source: Source;
  confidence_score: number;
  is_verified: boolean;
  submitted_at: string;
}

export interface SalaryWithCompany extends Salary {
  company: Company;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SalariesResponse {
  data: SalaryWithCompany[];
  meta: PaginationMeta;
}

export interface CompanyResponse {
  company: Company;
  salaries: SalaryWithCompany[];
  median_total_compensation: number;
  level_distribution: Record<string, number>;
}

export interface CompareResponse {
  record1: SalaryWithCompany;
  record2: SalaryWithCompany;
  delta: {
    base_delta: number;
    bonus_delta: number;
    stock_delta: number;
    tc_delta: number;
    experience_delta: number;
  };
}

export interface IngestSalaryInput {
  company: string;
  role: string;
  level: Level;
  location: string;
  currency?: Currency;
  experience_years: number;
  base_salary: number;
  bonus?: number;
  stock?: number;
  source?: Source;
  confidence_score?: number;
}
