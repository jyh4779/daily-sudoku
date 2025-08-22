import { create } from 'zustand';
import { getRandomPairByDifficulty } from '../data/PuzzleRepositorySqlite';
import { log, warn } from '../../../core/logger/log';

const N = 9;
const empty9 = () => Array.from({ length: N }, () => Array(N).fill(0));
const to9x9 = (g?: number[][]) =>
  Array.isArray(g) && g.length === N && g.every(r => Array.isArray(r) && r.length === N) ? g : empty9();
const clone9 = (g: number[][]) => g.map(r => r.slice());

type RC = { r: number; c: number };
type SudokuState = {
  values: number[][]; puzzle: number[][]; solution: number[][]; grid: number[][]; selected: RC | null;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  setSelected: (rc: RC | null) => void;
  setValue: (r: number, c: number, v: number) => void;
  loadRandomEasy: () => Promise<void>;
};

export const useSudokuStore = create<SudokuState>((set) => ({
  values: empty9(),
  puzzle: empty9(),
  solution: empty9(),
  grid: empty9(),
  selected: null,
  difficulty: 'easy',

  setSelected: (rc) => set({ selected: rc }),
  setValue: (r, c, v) => set(state => {
    const next = state.values.map(row => row.slice());
    next[r][c] = v;
    return { values: next, grid: next };
  }),

  loadRandomEasy: async () => {
    await log('PUZZLE', 'load start', { diff: 'easy' });
    try {
      const pair = await getRandomPairByDifficulty('easy');
      const puz = to9x9(pair.puzzle);
      const sol = to9x9(pair.solution);
      const vals = clone9(puz);
      set({ puzzle: puz, solution: sol, values: vals, grid: vals, selected: null, difficulty: 'easy' });
      await log('PUZZLE', 'load success', { id: pair.meta.id, line: pair.meta.line });
    } catch (e: any) {
      const z = empty9();
      set({ puzzle: z, solution: z, values: z, grid: z, selected: null });
      await warn('PUZZLE', 'load failed', { error: String(e?.message ?? e) });
    }
  },
}));