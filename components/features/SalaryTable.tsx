'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import LevelBadge from '@/components/ui/LevelBadge';
import { formatSalaryDisplay } from '@/lib/currency';
import { ALL_LEVELS, LEVEL_DISPLAY } from '@/lib/levels';
import type { SalaryWithCompany, Level } from '@/types';

interface Props {
  initialData: SalaryWithCompany[];
  initialMeta: { total: number; page: number; limit: number; totalPages: number };
  showCompanyColumn?: boolean;
}

type SortField = 'total_compensation' | 'base_salary' | 'experience_years';
type SortDir = 'asc' | 'desc';

export default function SalaryTable({ initialData, initialMeta, showCompanyColumn = true }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState(initialData);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<'INR' | 'USD'>('INR');

  // Filter state from URL
  const [company, setCompany] = useState(searchParams.get('company') || '');
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedLevels, setSelectedLevels] = useState<Level[]>(
    searchParams.get('level') ? [searchParams.get('level') as Level] : []
  );
  const [sortField, setSortField] = useState<SortField>('total_compensation');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (company) params.set('company', company);
    if (role) params.set('role', role);
    if (selectedLevels.length === 1) params.set('level', selectedLevels[0]);
    if (location) params.set('location', location);
    params.set('sort', sortDir === 'asc' ? 'total_comp_asc' : 'total_comp_desc');
    params.set('page', String(page));
    params.set('limit', '25');

    try {
      const res = await fetch(`/api/salaries?${params.toString()}`);
      const json = await res.json();
      setData(json.data);
      setMeta(json.meta);

      // Update URL
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [company, role, selectedLevels, location, sortDir, page, pathname, router]);

  // Debounced company/role filter
  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [company, role, fetchData]);

  useEffect(() => { fetchData(); }, [selectedLevels, location, sortDir, page]);

  const handleSort = (field: SortField) => {
    if (field === sortField) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
    setPage(1);
  };

  const clearFilters = () => {
    setCompany(''); setRole(''); setLocation(''); setSelectedLevels([]); setPage(1);
  };

  const toggleLevel = (level: Level) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-td-muted ml-1">↕</span>;
    return <span className="text-coral ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const hasFilters = company || role || location || selectedLevels.length > 0;
  const start = (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-td-border p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-td-muted mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={e => { setCompany(e.target.value); setPage(1); }}
              placeholder="Search company..."
              className="w-full px-3 py-2 border border-td-border rounded-lg text-sm text-td-black placeholder-td-muted focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-td-muted mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={e => { setRole(e.target.value); setPage(1); }}
              placeholder="Search role..."
              className="w-full px-3 py-2 border border-td-border rounded-lg text-sm text-td-black placeholder-td-muted focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
            />
          </div>
          <div className="flex-1 min-w-[130px]">
            <label className="block text-xs font-medium text-td-muted mb-1">Location</label>
            <select
              value={location}
              onChange={e => { setLocation(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-td-border rounded-lg text-sm text-td-black focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral bg-white"
            >
              <option value="">All Locations</option>
              {['Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai', 'San Francisco', 'London'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[130px] relative">
            <label className="block text-xs font-medium text-td-muted mb-1">Level</label>
            <button
              onClick={() => setShowLevelDropdown(!showLevelDropdown)}
              className="w-full px-3 py-2 border border-td-border rounded-lg text-sm text-td-black focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral bg-white text-left flex items-center justify-between"
            >
              <span>{selectedLevels.length === 0 ? 'All Levels' : selectedLevels.map(l => LEVEL_DISPLAY[l]).join(', ')}</span>
              <span className="text-td-muted">▾</span>
            </button>
            {showLevelDropdown && (
              <div className="absolute top-full left-0 z-20 mt-1 bg-white border border-td-border rounded-lg shadow-lg p-2 min-w-[180px]">
                {ALL_LEVELS.map(level => (
                  <label key={level} className="flex items-center gap-2 px-2 py-1.5 hover:bg-td-bg rounded cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(level)}
                      onChange={() => toggleLevel(level)}
                      className="accent-coral"
                    />
                    <span>{LEVEL_DISPLAY[level]}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-end gap-2">
            <div>
              <label className="block text-xs font-medium text-td-muted mb-1">Currency</label>
              <div className="flex rounded-lg border border-td-border overflow-hidden">
                {(['INR', 'USD'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setDisplayCurrency(c)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${displayCurrency === c ? 'bg-coral text-white' : 'bg-white text-td-dark hover:bg-td-bg'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="px-3 py-2 text-sm text-coral hover:underline font-medium">
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-td-border overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-xl">
            <div className="w-6 h-6 border-2 border-coral border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-td-border bg-td-bg">
                {showCompanyColumn && (
                  <th className="text-left px-4 py-3 text-xs font-semibold text-td-muted uppercase tracking-wide">Company</th>
                )}
                <th className="text-left px-4 py-3 text-xs font-semibold text-td-muted uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-td-muted uppercase tracking-wide">Level</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-td-muted uppercase tracking-wide">Location</th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-td-muted uppercase tracking-wide cursor-pointer hover:text-td-black"
                  onClick={() => handleSort('experience_years')}
                >
                  Exp <SortIcon field="experience_years" />
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-td-muted uppercase tracking-wide cursor-pointer hover:text-td-black"
                  onClick={() => handleSort('base_salary')}
                >
                  Base <SortIcon field="base_salary" />
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-td-muted uppercase tracking-wide">Stock</th>
                <th
                  className="text-right px-4 py-3 text-xs font-semibold text-td-muted uppercase tracking-wide cursor-pointer hover:text-td-black"
                  onClick={() => handleSort('total_compensation')}
                >
                  Total Comp <SortIcon field="total_compensation" />
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={showCompanyColumn ? 8 : 7} className="text-center py-16 text-td-muted">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="font-medium text-td-dark">No records found for these filters.</p>
                    <p className="text-sm mt-1">
                      Try removing a filter.{' '}
                      <button onClick={clearFilters} className="text-coral hover:underline">Clear all filters</button>
                    </p>
                  </td>
                </tr>
              ) : (
                data.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-td-border hover:bg-td-hover transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}
                  >
                    {showCompanyColumn && (
                      <td className="px-4 py-3">
                        <a
                          href={`/companies/${s.company.slug}`}
                          className="font-semibold text-td-black hover:text-coral transition-colors"
                        >
                          {s.company.name}
                        </a>
                      </td>
                    )}
                    <td className="px-4 py-3 text-td-dark max-w-[200px] truncate">{s.role}</td>
                    <td className="px-4 py-3">
                      <LevelBadge level={s.level as import('@/types').Level} />
                    </td>
                    <td className="px-4 py-3 text-td-dark">{s.location}</td>
                    <td className="px-4 py-3 text-right text-td-muted">{s.experience_years}y</td>
                    <td className="px-4 py-3 text-right text-td-dark">
                      {formatSalaryDisplay(s.base_salary, s.currency, displayCurrency)}
                    </td>
                    <td className="px-4 py-3 text-right text-td-muted">
                      {s.stock > 0 ? formatSalaryDisplay(s.stock, s.currency, displayCurrency) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-base font-bold text-data-blue">
                        {formatSalaryDisplay(s.total_compensation, s.currency, displayCurrency)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-td-border bg-td-bg">
            <p className="text-sm text-td-muted">
              Showing <span className="font-medium text-td-dark">{start}–{end}</span> of{' '}
              <span className="font-medium text-td-dark">{meta.total}</span> records
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm border border-td-border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
              >
                ← Previous
              </button>
              <span className="text-sm text-td-muted px-2">Page {meta.page} of {meta.totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="px-3 py-1.5 text-sm border border-td-border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
