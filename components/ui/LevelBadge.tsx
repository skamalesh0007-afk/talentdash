import { LEVEL_COLORS, LEVEL_DISPLAY } from '@/lib/levels';
import type { Level } from '@/types';

export default function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${LEVEL_COLORS[level]}`}>
      {LEVEL_DISPLAY[level]}
    </span>
  );
}
