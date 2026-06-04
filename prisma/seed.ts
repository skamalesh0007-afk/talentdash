import { PrismaClient, Level, Currency, Source } from '@prisma/client';

const prisma = new PrismaClient();

const companies = [
  { name: 'Google', slug: 'google', normalized_name: 'google', industry: 'Technology', headquarters: 'Bengaluru', founded_year: 1998, headcount_range: '10000+' },
  { name: 'Amazon', slug: 'amazon', normalized_name: 'amazon', industry: 'Technology / E-Commerce', headquarters: 'Bengaluru', founded_year: 1994, headcount_range: '10000+' },
  { name: 'Meta', slug: 'meta', normalized_name: 'meta', industry: 'Technology', headquarters: 'Bengaluru', founded_year: 2004, headcount_range: '5000-10000' },
  { name: 'Microsoft', slug: 'microsoft', normalized_name: 'microsoft', industry: 'Technology', headquarters: 'Hyderabad', founded_year: 1975, headcount_range: '10000+' },
  { name: 'Flipkart', slug: 'flipkart', normalized_name: 'flipkart', industry: 'E-Commerce', headquarters: 'Bengaluru', founded_year: 2007, headcount_range: '5000-10000' },
  { name: 'Meesho', slug: 'meesho', normalized_name: 'meesho', industry: 'E-Commerce', headquarters: 'Bengaluru', founded_year: 2015, headcount_range: '1000-5000' },
  { name: 'NVIDIA', slug: 'nvidia', normalized_name: 'nvidia', industry: 'Semiconductors', headquarters: 'Pune', founded_year: 1993, headcount_range: '1000-5000' },
  { name: 'TCS', slug: 'tcs', normalized_name: 'tcs', industry: 'IT Services', headquarters: 'Mumbai', founded_year: 1968, headcount_range: '10000+' },
  { name: 'Infosys', slug: 'infosys', normalized_name: 'infosys', industry: 'IT Services', headquarters: 'Bengaluru', founded_year: 1981, headcount_range: '10000+' },
  { name: 'Razorpay', slug: 'razorpay', normalized_name: 'razorpay', industry: 'Fintech', headquarters: 'Bengaluru', founded_year: 2014, headcount_range: '1000-5000' },
  { name: 'Zepto', slug: 'zepto', normalized_name: 'zepto', industry: 'Quick Commerce', headquarters: 'Mumbai', founded_year: 2021, headcount_range: '500-1000' },
  { name: 'Wipro', slug: 'wipro', normalized_name: 'wipro', industry: 'IT Services', headquarters: 'Bengaluru', founded_year: 1945, headcount_range: '10000+' },
  { name: 'Swiggy', slug: 'swiggy', normalized_name: 'swiggy', industry: 'Food Tech', headquarters: 'Bengaluru', founded_year: 2014, headcount_range: '5000-10000' },
  { name: 'PhonePe', slug: 'phonepe', normalized_name: 'phonepe', industry: 'Fintech', headquarters: 'Bengaluru', founded_year: 2015, headcount_range: '1000-5000' },
  { name: 'Accenture', slug: 'accenture', normalized_name: 'accenture', industry: 'IT Consulting', headquarters: 'Mumbai', founded_year: 1989, headcount_range: '10000+' },
];

type SalaryInput = {
  role: string;
  level: Level;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: bigint;
  bonus: bigint;
  stock: bigint;
  source: Source;
  confidence_score: number;
  is_verified: boolean;
};

const salaryData: Record<string, SalaryInput[]> = {
  google: [
    { role: 'Software Engineer', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: BigInt(2200000), bonus: BigInt(300000), stock: BigInt(500000), source: Source.CONTRIBUTOR, confidence_score: 0.95, is_verified: true },
    { role: 'Software Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: BigInt(3800000), bonus: BigInt(600000), stock: BigInt(1200000), source: Source.CONTRIBUTOR, confidence_score: 0.95, is_verified: true },
    { role: 'Software Engineer', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experience_years: 7, base_salary: BigInt(5500000), bonus: BigInt(1000000), stock: BigInt(2500000), source: Source.CONTRIBUTOR, confidence_score: 0.92, is_verified: true },
    { role: 'Software Engineer', level: Level.L6, location: 'Bengaluru', currency: Currency.INR, experience_years: 11, base_salary: BigInt(8000000), bonus: BigInt(1800000), stock: BigInt(5000000), source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
    { role: 'Software Engineer', level: Level.L4, location: 'Hyderabad', currency: Currency.INR, experience_years: 5, base_salary: BigInt(3600000), bonus: BigInt(550000), stock: BigInt(1100000), source: Source.SCRAPED, confidence_score: 0.75, is_verified: false },
    { role: 'Product Manager', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experience_years: 8, base_salary: BigInt(6000000), bonus: BigInt(1200000), stock: BigInt(3000000), source: Source.CONTRIBUTOR, confidence_score: 0.92, is_verified: true },
    { role: 'Staff Engineer', level: Level.STAFF, location: 'Bengaluru', currency: Currency.INR, experience_years: 14, base_salary: BigInt(12000000), bonus: BigInt(2500000), stock: BigInt(8000000), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
    { role: 'Software Engineer', level: Level.L4, location: 'San Francisco', currency: Currency.USD, experience_years: 5, base_salary: BigInt(22000000), bonus: BigInt(4000000), stock: BigInt(10000000), source: Source.CONTRIBUTOR, confidence_score: 0.93, is_verified: true },
  ],
  amazon: [
    { role: 'Software Development Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: BigInt(1800000), bonus: BigInt(200000), stock: BigInt(600000), source: Source.CONTRIBUTOR, confidence_score: 0.94, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: BigInt(3200000), bonus: BigInt(500000), stock: BigInt(1500000), source: Source.CONTRIBUTOR, confidence_score: 0.93, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 8, base_salary: BigInt(5000000), bonus: BigInt(900000), stock: BigInt(3000000), source: Source.CONTRIBUTOR, confidence_score: 0.91, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_II, location: 'Hyderabad', currency: Currency.INR, experience_years: 4, base_salary: BigInt(3000000), bonus: BigInt(450000), stock: BigInt(1400000), source: Source.SCRAPED, confidence_score: 0.72, is_verified: false },
    { role: 'Data Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: BigInt(2900000), bonus: BigInt(400000), stock: BigInt(1200000), source: Source.CONTRIBUTOR, confidence_score: 0.89, is_verified: true },
    { role: 'Principal Engineer', level: Level.PRINCIPAL, location: 'Bengaluru', currency: Currency.INR, experience_years: 16, base_salary: BigInt(15000000), bonus: BigInt(3000000), stock: BigInt(10000000), source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_I, location: 'Chennai', currency: Currency.INR, experience_years: 2, base_salary: BigInt(1700000), bonus: BigInt(180000), stock: BigInt(550000), source: Source.SCRAPED, confidence_score: 0.68, is_verified: false },
  ],
  meta: [
    { role: 'Software Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: BigInt(4500000), bonus: BigInt(800000), stock: BigInt(2000000), source: Source.CONTRIBUTOR, confidence_score: 0.94, is_verified: true },
    { role: 'Software Engineer', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experience_years: 8, base_salary: BigInt(7000000), bonus: BigInt(1500000), stock: BigInt(4000000), source: Source.CONTRIBUTOR, confidence_score: 0.91, is_verified: true },
    { role: 'Software Engineer', level: Level.L6, location: 'Bengaluru', currency: Currency.INR, experience_years: 12, base_salary: BigInt(10000000), bonus: BigInt(2500000), stock: BigInt(7000000), source: Source.CONTRIBUTOR, confidence_score: 0.89, is_verified: true },
    { role: 'Product Manager', level: Level.IC4, location: 'Bengaluru', currency: Currency.INR, experience_years: 6, base_salary: BigInt(6500000), bonus: BigInt(1200000), stock: BigInt(3500000), source: Source.CONTRIBUTOR, confidence_score: 0.87, is_verified: true },
    { role: 'Software Engineer', level: Level.L5, location: 'London', currency: Currency.GBP, experience_years: 9, base_salary: BigInt(15000000), bonus: BigInt(3000000), stock: BigInt(8000000), source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
  ],
  microsoft: [
    { role: 'Software Engineer', level: Level.L4, location: 'Hyderabad', currency: Currency.INR, experience_years: 4, base_salary: BigInt(3000000), bonus: BigInt(450000), stock: BigInt(900000), source: Source.CONTRIBUTOR, confidence_score: 0.93, is_verified: true },
    { role: 'Software Engineer', level: Level.L5, location: 'Hyderabad', currency: Currency.INR, experience_years: 7, base_salary: BigInt(4800000), bonus: BigInt(800000), stock: BigInt(2000000), source: Source.CONTRIBUTOR, confidence_score: 0.91, is_verified: true },
    { role: 'Software Engineer', level: Level.L6, location: 'Hyderabad', currency: Currency.INR, experience_years: 11, base_salary: BigInt(7500000), bonus: BigInt(1500000), stock: BigInt(4000000), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
    { role: 'Product Manager', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: BigInt(3500000), bonus: BigInt(600000), stock: BigInt(1200000), source: Source.SCRAPED, confidence_score: 0.74, is_verified: false },
    { role: 'Data Scientist', level: Level.L4, location: 'Hyderabad', currency: Currency.INR, experience_years: 4, base_salary: BigInt(2800000), bonus: BigInt(350000), stock: BigInt(800000), source: Source.CONTRIBUTOR, confidence_score: 0.89, is_verified: true },
    { role: 'Staff Engineer', level: Level.STAFF, location: 'Hyderabad', currency: Currency.INR, experience_years: 13, base_salary: BigInt(11000000), bonus: BigInt(2000000), stock: BigInt(6000000), source: Source.CONTRIBUTOR, confidence_score: 0.86, is_verified: true },
  ],
  flipkart: [
    { role: 'Software Development Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: BigInt(1400000), bonus: BigInt(150000), stock: BigInt(300000), source: Source.CONTRIBUTOR, confidence_score: 0.91, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: BigInt(2600000), bonus: BigInt(350000), stock: BigInt(800000), source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 8, base_salary: BigInt(4200000), bonus: BigInt(700000), stock: BigInt(2000000), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
    { role: 'Data Scientist', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: BigInt(2400000), bonus: BigInt(300000), stock: BigInt(700000), source: Source.SCRAPED, confidence_score: 0.71, is_verified: false },
    { role: 'Product Manager', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experience_years: 7, base_salary: BigInt(3800000), bonus: BigInt(600000), stock: BigInt(1500000), source: Source.CONTRIBUTOR, confidence_score: 0.87, is_verified: true },
  ],
  meesho: [
    { role: 'Software Development Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: BigInt(1200000), bonus: BigInt(100000), stock: BigInt(200000), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: BigInt(2100000), bonus: BigInt(250000), stock: BigInt(500000), source: Source.CONTRIBUTOR, confidence_score: 0.87, is_verified: true },
    { role: 'Data Scientist', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 3, base_salary: BigInt(1500000), bonus: BigInt(150000), stock: BigInt(300000), source: Source.SCRAPED, confidence_score: 0.69, is_verified: false },
    { role: 'Product Manager', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: BigInt(2800000), bonus: BigInt(400000), stock: BigInt(800000), source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: true },
  ],
  nvidia: [
    { role: 'Software Engineer', level: Level.L4, location: 'Pune', currency: Currency.INR, experience_years: 5, base_salary: BigInt(4200000), bonus: BigInt(700000), stock: BigInt(2500000), source: Source.CONTRIBUTOR, confidence_score: 0.92, is_verified: true },
    { role: 'Software Engineer', level: Level.L5, location: 'Pune', currency: Currency.INR, experience_years: 8, base_salary: BigInt(6500000), bonus: BigInt(1200000), stock: BigInt(5000000), source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
    { role: 'Deep Learning Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: BigInt(5000000), bonus: BigInt(900000), stock: BigInt(3000000), source: Source.CONTRIBUTOR, confidence_score: 0.91, is_verified: true },
    { role: 'Deep Learning Engineer', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experience_years: 9, base_salary: BigInt(8000000), bonus: BigInt(1600000), stock: BigInt(6000000), source: Source.CONTRIBUTOR, confidence_score: 0.89, is_verified: true },
  ],
  tcs: [
    { role: 'Software Engineer', level: Level.SDE_I, location: 'Chennai', currency: Currency.INR, experience_years: 1, base_salary: BigInt(700000), bonus: BigInt(50000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
    { role: 'Software Engineer', level: Level.SDE_II, location: 'Chennai', currency: Currency.INR, experience_years: 4, base_salary: BigInt(1100000), bonus: BigInt(80000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.89, is_verified: true },
    { role: 'Software Engineer', level: Level.SDE_III, location: 'Mumbai', currency: Currency.INR, experience_years: 8, base_salary: BigInt(1600000), bonus: BigInt(120000), stock: BigInt(0), source: Source.SCRAPED, confidence_score: 0.70, is_verified: false },
    { role: 'Data Analyst', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: BigInt(800000), bonus: BigInt(60000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
    { role: 'Project Manager', level: Level.L4, location: 'Delhi', currency: Currency.INR, experience_years: 9, base_salary: BigInt(2000000), bonus: BigInt(200000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.86, is_verified: true },
  ],
  infosys: [
    { role: 'Software Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: BigInt(650000), bonus: BigInt(40000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.89, is_verified: true },
    { role: 'Software Engineer', level: Level.SDE_II, location: 'Pune', currency: Currency.INR, experience_years: 4, base_salary: BigInt(1000000), bonus: BigInt(70000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
    { role: 'Data Scientist', level: Level.SDE_II, location: 'Hyderabad', currency: Currency.INR, experience_years: 5, base_salary: BigInt(1400000), bonus: BigInt(100000), stock: BigInt(0), source: Source.SCRAPED, confidence_score: 0.68, is_verified: false },
    { role: 'Tech Lead', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 9, base_salary: BigInt(2200000), bonus: BigInt(180000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.87, is_verified: true },
  ],
  razorpay: [
    { role: 'Software Development Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: BigInt(1600000), bonus: BigInt(200000), stock: BigInt(400000), source: Source.CONTRIBUTOR, confidence_score: 0.92, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: BigInt(2800000), bonus: BigInt(400000), stock: BigInt(900000), source: Source.CONTRIBUTOR, confidence_score: 0.91, is_verified: true },
    { role: 'Backend Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: BigInt(2600000), bonus: BigInt(350000), stock: BigInt(800000), source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
    { role: 'Product Manager', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 6, base_salary: BigInt(3200000), bonus: BigInt(500000), stock: BigInt(1200000), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  ],
  zepto: [
    { role: 'Software Development Engineer', level: Level.SDE_I, location: 'Mumbai', currency: Currency.INR, experience_years: 1, base_salary: BigInt(1300000), bonus: BigInt(150000), stock: BigInt(300000), source: Source.CONTRIBUTOR, confidence_score: 0.87, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_II, location: 'Mumbai', currency: Currency.INR, experience_years: 4, base_salary: BigInt(2400000), bonus: BigInt(300000), stock: BigInt(700000), source: Source.CONTRIBUTOR, confidence_score: 0.86, is_verified: true },
    { role: 'Data Engineer', level: Level.SDE_I, location: 'Mumbai', currency: Currency.INR, experience_years: 2, base_salary: BigInt(1500000), bonus: BigInt(0), stock: BigInt(400000), source: Source.CONTRIBUTOR, confidence_score: 0.85, is_verified: false },
  ],
  wipro: [
    { role: 'Software Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: BigInt(600000), bonus: BigInt(30000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
    { role: 'Software Engineer', level: Level.SDE_II, location: 'Pune', currency: Currency.INR, experience_years: 5, base_salary: BigInt(1000000), bonus: BigInt(60000), stock: BigInt(0), source: Source.SCRAPED, confidence_score: 0.67, is_verified: false },
    { role: 'Tech Lead', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 10, base_salary: BigInt(1800000), bonus: BigInt(150000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.86, is_verified: true },
  ],
  swiggy: [
    { role: 'Software Development Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: BigInt(1400000), bonus: BigInt(150000), stock: BigInt(350000), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: BigInt(2600000), bonus: BigInt(300000), stock: BigInt(700000), source: Source.CONTRIBUTOR, confidence_score: 0.87, is_verified: true },
    { role: 'Data Scientist', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: BigInt(2400000), bonus: BigInt(250000), stock: BigInt(600000), source: Source.SCRAPED, confidence_score: 0.72, is_verified: false },
  ],
  phonepe: [
    { role: 'Software Development Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: BigInt(1700000), bonus: BigInt(200000), stock: BigInt(500000), source: Source.CONTRIBUTOR, confidence_score: 0.90, is_verified: true },
    { role: 'Software Development Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: BigInt(2900000), bonus: BigInt(400000), stock: BigInt(900000), source: Source.CONTRIBUTOR, confidence_score: 0.89, is_verified: true },
    { role: 'Backend Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: BigInt(3100000), bonus: BigInt(450000), stock: BigInt(1000000), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
  ],
  accenture: [
    { role: 'Software Engineer', level: Level.SDE_I, location: 'Mumbai', currency: Currency.INR, experience_years: 1, base_salary: BigInt(700000), bonus: BigInt(40000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.88, is_verified: true },
    { role: 'Software Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: BigInt(1200000), bonus: BigInt(80000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.87, is_verified: true },
    { role: 'Tech Lead', level: Level.SDE_III, location: 'Hyderabad', currency: Currency.INR, experience_years: 8, base_salary: BigInt(2000000), bonus: BigInt(150000), stock: BigInt(0), source: Source.SCRAPED, confidence_score: 0.70, is_verified: false },
    { role: 'Data Analyst', level: Level.SDE_I, location: 'Chennai', currency: Currency.INR, experience_years: 2, base_salary: BigInt(800000), bonus: BigInt(50000), stock: BigInt(0), source: Source.CONTRIBUTOR, confidence_score: 0.86, is_verified: true },
  ],
};

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.salary.deleteMany();
  await prisma.company.deleteMany();

  for (const companyData of companies) {
    const company = await prisma.company.create({ data: companyData });
    console.log(`✅ Created company: ${company.name}`);

    const records = salaryData[company.slug] || [];
    for (const record of records) {
      const total_compensation = record.base_salary + record.bonus + record.stock;
      await prisma.salary.create({
        data: { ...record, company_id: company.id, total_compensation },
      });
    }
    console.log(`   → Seeded ${records.length} salary records`);
  }

  const total = await prisma.salary.count();
  console.log(`\n🎉 Done! ${total} total salary records seeded.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
