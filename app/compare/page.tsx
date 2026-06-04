'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LevelBadge from '@/components/ui/LevelBadge';
import { formatINR } from '@/lib/currency';
import type { SalaryWithCompany, Level } from '@/types';

interface CompareRecord {
  id: string;
  label: string;
}

function DeltaCell({ value, currency = 'INR' }: { value: number; currency?: string }) {
  if (value === 0) return <span className="text-td-muted text-sm">—</span>;
  const isPos = value > 0;
  const formatted = formatINR(Math.abs(value));
  return (
    <span className={`text-sm font-semibold ${isPos ? 'text-td-success' : 'text-td-error'}`}>
      {isPos ? '+' : '−'}{formatted}
    </span>
  );
}

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allRecords, setAllRecords] = useState<SalaryWithCompany[]>([]);
  const [s1, setS1] = useState(searchParams.get('s1') || '');
  const [s2, setS2] = useState(searchParams.get('s2') || '');
  const [compareData, setCompareData] = useState<{
    record1: SalaryWithCompany;
    record2: SalaryWithCompany;
    delta: { base_delta: number; bonus_delta: number; stock_delta: number; tc_delta: number; experience_delta: number };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/salaries?limit=100')
      .then(r => r.json())
      .then(j => setAllRecords(j.data));
  }, []);

  const fetchCompare = useCallback(async () => {
    if (!s1 || !s2) return;
    if (s1 === s2) { setError('Please select two different records.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/compare?s1=${s1}&s2=${s2}`);
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setCompareData(data);
      router.push(`/compare?s1=${s1}&s2=${s2}`, { scroll: false });
    } catch {
      setError('Failed to load comparison.');
    } finally {
      setLoading(false);
    }
  }, [s1, s2, router]);

  useEffect(() => { fetchCompare(); }, [s1, s2]);

  const recordLabel = (r: SalaryWithCompany) =>
    `${r.company.name} · ${r.role} · ${r.level} · ${r.location}`;

  const ROWS = [
    { label: 'Company', render: (r: SalaryWithCompany) => r.company.name, delta: null },
    { label: 'Role', render: (r: SalaryWithCompany) => r.role, delta: null },
    { label: 'Level', render: (r: SalaryWithCompany) => <LevelBadge level={r.level as Level} />, delta: null },
    { label: 'Location', render: (r: SalaryWithCompany) => r.location, delta: null },
    { label: 'Experience', render: (r: SalaryWithCompany) => `${r.experience_years} years`, delta: 'experience_delta' as const },
    { label: 'Base Salary', render: (r: SalaryWithCompany) => <span className="font-semibold">{formatINR(r.base_salary)}</span>, delta: 'base_delta' as const },
    { label: 'Bonus', render: (r: SalaryWithCompany) => r.bonus > 0 ? formatINR(r.bonus) : '—', delta: 'bonus_delta' as const },
    { label: 'Stock / RSU', render: (r: SalaryWithCompany) => r.stock > 0 ? formatINR(r.stock) : '—', delta: 'stock_delta' as const },
    { label: 'Total Comp', render: (r: SalaryWithCompany) => <span className="text-xl font-bold text-data-blue">{formatINR(r.total_compensation)}</span>, delta: 'tc_delta' as const },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-td-black mb-2">Compare Offers</h1>
      <p className="text-td-muted mb-8">Select two salary records to compare them side-by-side.</p>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[{ val: s1, set: setS1, label: 'Record A' }, { val: s2, set: setS2, label: 'Record B' }].map(({ val, set, label }) => (
          <div key={label}>
            <label className="block text-xs font-semibold text-td-muted uppercase tracking-wide mb-1.5">{label}</label>
            <select
              value={val}
              onChange={e => set(e.target.value)}
              className="w-full px-3 py-2.5 border border-td-border rounded-xl text-sm text-td-black bg-white focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
            >
              <option value="">— Select a record —</option>
              {allRecords.map(r => (
                <option key={r.id} value={r.id}>{recordLabel(r)}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-td-error text-sm rounded-lg px-4 py-3 mb-6">{error}</div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-3 border-coral border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {compareData && !loading && (
        <div className="bg-white rounded-xl border border-td-border overflow-hidden">
          {/* Winner banner */}
          {compareData.delta.tc_delta !== 0 && (
            <div className="grid grid-cols-[1fr_80px_1fr] bg-td-bg border-b border-td-border">
              <div className={`px-6 py-2 text-center ${compareData.delta.tc_delta > 0 ? 'bg-data-blue/5' : ''}`}>
                {compareData.delta.tc_delta > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-data-blue px-3 py-1 rounded-full">
                    ✓ Higher TC
                  </span>
                )}
              </div>
              <div />
              <div className={`px-6 py-2 text-center ${compareData.delta.tc_delta < 0 ? 'bg-data-blue/5' : ''}`}>
                {compareData.delta.tc_delta < 0 && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-data-blue px-3 py-1 rounded-full">
                    ✓ Higher TC
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Comparison grid */}
          {ROWS.map(({ label, render, delta }) => (
            <div key={label} className="grid grid-cols-[1fr_80px_1fr] border-b border-td-border last:border-b-0">
              <div className="px-6 py-3.5 flex items-center">
                {render(compareData.record1 as SalaryWithCompany)}
              </div>
              <div className="px-2 py-3.5 flex items-center justify-center border-x border-td-border bg-td-bg">
                <span className="text-[10px] font-bold text-td-muted uppercase tracking-wider">{label}</span>
              </div>
              <div className="px-6 py-3.5 flex items-center justify-end">
                {render(compareData.record2 as SalaryWithCompany)}
              </div>
            </div>
          ))}

          {/* Delta row */}
          <div className="grid grid-cols-[1fr_80px_1fr] bg-td-bg border-t-2 border-td-border">
            <div className="px-6 py-4 flex items-center">
              <DeltaCell value={compareData.delta.tc_delta} />
            </div>
            <div className="px-2 py-4 flex items-center justify-center border-x border-td-border">
              <span className="text-[10px] font-bold text-td-muted uppercase tracking-wider">Δ TC</span>
            </div>
            <div className="px-6 py-4 flex items-center justify-end">
              <DeltaCell value={-compareData.delta.tc_delta} />
            </div>
          </div>
        </div>
      )}

      {!s1 && !s2 && (
        <div className="text-center py-16 text-td-muted bg-white rounded-xl border border-td-border">
          <div className="text-4xl mb-3">⚖️</div>
          <p className="font-medium text-td-dark">Select two records above to compare them.</p>
        </div>
      )}
    </div>
  );
}
