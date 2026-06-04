import { LEVEL_DISPLAY } from '@/lib/levels';
import type { Level } from '@/types';

const LEVEL_BAR_COLORS: Record<string, string> = {
  L3: '#94a3b8', SDE_I: '#94a3b8',
  L4: '#3b82f6', SDE_II: '#3b82f6',
  L5: '#6366f1', SDE_III: '#6366f1',
  L6: '#a855f7', STAFF: '#a855f7',
  PRINCIPAL: '#1e3a5f', IC4: '#7c3aed', IC5: '#c026d3',
};

interface Props {
  distribution: Record<string, number>;
}

export default function LevelDistributionBar({ distribution }: Props) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  const entries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {entries.map(([level, count]) => (
          <div
            key={level}
            style={{
              width: `${(count / total) * 100}%`,
              backgroundColor: LEVEL_BAR_COLORS[level] || '#6b7280',
            }}
            title={`${LEVEL_DISPLAY[level as Level] || level}: ${count} records (${Math.round((count / total) * 100)}%)`}
            className="min-w-[2px]"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {entries.map(([level, count]) => (
          <div key={level} className="flex items-center gap-1.5 text-xs text-td-muted">
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block flex-shrink-0"
              style={{ backgroundColor: LEVEL_BAR_COLORS[level] || '#6b7280' }}
            />
            <span className="font-medium text-td-dark">{LEVEL_DISPLAY[level as Level] || level}</span>
            <span>({count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
