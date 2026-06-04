import type { Metadata } from 'next';
import { Suspense } from 'react';
import ComparePageClient from './page';

export const metadata: Metadata = {
  title: 'Compare Salary Offers — Side-by-Side Breakdown',
  description: 'Compare two salary records side by side. See base, bonus, stock, and total compensation differences instantly.',
  alternates: { canonical: '/compare' },
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto px-8 py-8"><div className="h-96 bg-white rounded-xl border border-td-border animate-pulse" /></div>}>
      <ComparePageClient />
    </Suspense>
  );
}
