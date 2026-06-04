import aliasMap from './aliases.json';

const LEGAL_SUFFIXES = [
  'pvt ltd', 'pvt. ltd.', 'pvt. ltd', 'pvt ltd.',
  'private limited', 'private ltd', 'ltd.', ' ltd',
  'inc.', ' inc', 'llc', 'llp', 'corp.', ' corp',
  'technologies', 'technology', 'solutions', 'services',
  'india', 'bpo', 'internet', 'web services', '.com',
];

export function normalizeCompanyName(raw: string): string {
  let name = raw.toLowerCase().trim();

  // Remove legal suffixes
  for (const suffix of LEGAL_SUFFIXES) {
    if (name.endsWith(suffix)) {
      name = name.slice(0, name.length - suffix.length).trim();
    }
  }

  // Remove special characters except alphanumeric and spaces
  name = name.replace(/[^a-z0-9\s]/g, '').trim();

  // Check alias map
  const alias = (aliasMap as Record<string, string>)[name];
  if (alias) return alias;

  return name;
}

export function companyNameToSlug(normalized: string): string {
  return normalized.replace(/\s+/g, '-');
}
