import SQLite from 'react-native-sqlite-storage';
import { log, warn, error as logError } from '../logger/log';

SQLite.enablePromise(true);

export async function getDb() {
  await log('DB', 'openDatabase begin');
  const db = await SQLite.openDatabase({
    name: 'puzzles.db',
    location: 'default',
    
    createFromLocation: '~www/puzzles.db', // android/app/src/main/assets/www/puzzles.db 에 있어야 복사됩니다.
  });
  await log('DB', 'openDatabase success');
  return db;
}

/** 개발/점검용 헬스체스트: 테이블/카운트만 기록 */
export async function dbSelfTest() {
  try {
    const db = await getDb();
    const [t] = await db.executeSql("SELECT name FROM sqlite_master WHERE type='table'");
    const tables: string[] = [];
    for (let i = 0; i < t.rows.length; i++) tables.push(t.rows.item(i).name);
    await log('DB', 'tables', { tables });

    // 퍼즐/난이도 카운트
    const [c1] = await db.executeSql("SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' AND name='puzzles'");
    const [c2] = await db.executeSql("SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' AND name='difficulties'");
    await log('DB', 'table existence', { puzzles: c1.rows.item(0).cnt, difficulties: c2.rows.item(0).cnt });

    if (c1.rows.item(0).cnt) {
      const [pc] = await db.executeSql('SELECT COUNT(*) AS cnt FROM puzzles');
      await log('DB', 'puzzles count', { count: pc.rows.item(0).cnt });
    }
  } catch (e: any) {
    await warn('DB', 'self test failed', { error: String(e?.message ?? e) });
  }
}

export async function dbDebug_whereIsIt() {
  const db = await getDb();
  const [res] = await db.executeSql('PRAGMA database_list');
  const out: any[] = [];
  for (let i = 0; i < res.rows.length; i++) out.push(res.rows.item(i));
  await log('DB', 'database_list', { out }); // file 경로까지 찍힘
}
