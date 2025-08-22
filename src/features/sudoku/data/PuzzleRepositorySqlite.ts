import { getDb } from '../../../core/db/sqlite';
import { log, warn } from '../../../core/logger/log';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type Grid = number[][];
export type Pair = { puzzle: Grid; solution: Grid; meta: { id: number; line?: number; difficulty: Difficulty } };

const toGrid = (s: string): Grid => {
  // 퍼즐은 0/./숫자 혼합 가능 → 0/1..9만 남기고 81자 보정
  const str = (s ?? '').replace(/[^0-9]/g, '').slice(0, 81).padEnd(81, '0');
  const g: Grid = [];
  for (let i = 0; i < 81; i += 9) g.push(str.slice(i, i + 9).split('').map(ch => Number(ch)));
  return g;
};

// 3초 이상 걸리면 어디서 막혔는지 알리기
function withTimeout<T>(p: Promise<T>, label: string, ms = 3000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`Timeout: ${label} > ${ms}ms`)), ms);
    p.then(v => { clearTimeout(t); resolve(v); }).catch(e => { clearTimeout(t); reject(e); });
  });
}

export async function getRandomPairByDifficulty(diff: Difficulty): Promise<Pair> {
  const db = await getDb();

  await log('PUZZLE', 'meta query start', { diff });
  const [m] = await withTimeout(
    db.executeSql('SELECT min_id, max_id, count FROM difficulties WHERE difficulty=?', [diff]),
    'SELECT difficulties'
  );

  if (m.rows.length === 0) {
    await warn('PUZZLE', 'no difficulties row', { diff });
    throw new Error(`No metadata for ${diff}`);
  }

  const meta = m.rows.item(0);
  const minId = meta.min_id as number;
  const maxId = meta.max_id as number;
  const count = meta.count as number;
  await log('PUZZLE', 'meta', { diff, minId, maxId, count });

  const span = maxId - minId + 1;
  const rand = minId + Math.floor(Math.random() * span);
  await log('PUZZLE', 'rand seed', { rand });

  await log('PUZZLE', 'select puzzle row start', { rand });
  const [r1] = await withTimeout(
    db.executeSql(
      'SELECT id, puzzle, solution, line_no FROM puzzles WHERE difficulty=? AND id>=? ORDER BY id LIMIT 1',
      [diff, rand]
    ),
    'SELECT puzzles >= rand'
  );

  let row: any | null = r1.rows.length ? r1.rows.item(0) : null;
  if (!row) {
    const [r2] = await withTimeout(
      db.executeSql('SELECT id, puzzle, solution, line_no FROM puzzles WHERE difficulty=? ORDER BY id LIMIT 1', [diff]),
      'SELECT puzzles wrap'
    );
    if (r2.rows.length) row = r2.rows.item(0);
  }

  if (!row) {
    await warn('PUZZLE', 'no row found', { diff, rand });
    throw new Error('No puzzle row found');
  }

  await log('PUZZLE', 'picked', { id: row.id, line: row.line_no });
  return {
    puzzle: toGrid(row.puzzle),
    solution: toGrid(row.solution),
    meta: { id: row.id, line: row.line_no ?? undefined, difficulty: diff },
  };
}