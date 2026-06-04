import type { Level } from '@/types';

export const LEVEL_COLORS: Record<Level, string> = {
  L3:        'bg-slate-100 text-slate-700 border border-slate-200',
  SDE_I:     'bg-slate-100 text-slate-700 border border-slate-200',
  L4:        'bg-blue-100 text-blue-700 border border-blue-200',
  SDE_II:    'bg-blue-100 text-blue-700 border border-blue-200',
  L5:        'bg-indigo-100 text-indigo-700 border border-indigo-200',
  SDE_III:   'bg-indigo-100 text-indigo-700 border border-indigo-200',
  L6:        'bg-purple-100 text-purple-700 border border-purple-200',
  STAFF:     'bg-purple-100 text-purple-700 border border-purple-200',
  PRINCIPAL: 'bg-navy-100 text-blue-900 border border-blue-900 bg-blue-950 text-blue-100',
  IC4:       'bg-violet-100 text-violet-700 border border-violet-200',
  IC5:       'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200',
};

export const LEVEL_DISPLAY: Record<Level, string> = {
  L3: 'L3', L4: 'L4', L5: 'L5', L6: 'L6',
  SDE_I: 'SDE-I', SDE_II: 'SDE-II', SDE_III: 'SDE-III',
  STAFF: 'Staff', PRINCIPAL: 'Principal', IC4: 'IC4', IC5: 'IC5',
};

export const ALL_LEVELS: Level[] = ['L3', 'L4', 'L5', 'L6', 'SDE_I', 'SDE_II', 'SDE_III', 'STAFF', 'PRINCIPAL', 'IC4', 'IC5'];
