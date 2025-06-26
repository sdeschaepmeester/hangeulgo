import { MAX_SAVED_SCORES } from "@/data/constants";
import { dbPromise } from "@/db/database";
import { GameSubType, GameType } from "@/types/GameSettings";

export type InputMode = "input" | "multiple" | "order";

export type SavedScore = {
  id: number;
  score: number;
  total: number;
  type: GameType;
  inputMode: InputMode;
  subType?: GameSubType;
  date: string;
};

/**
 * Delete all scores from the database.
 */
export async function clearScores(): Promise<void> {
  const db = await dbPromise;
  await db.runAsync(`DELETE FROM scores`);
}

/**
 * Save a new score to the database. Erase oldest scores if the limit is reached.
 */
export async function saveScore(data: {
  score: number;
  total: number;
  type: GameType;
  subType?: GameSubType;
  inputMode: InputMode;
}): Promise<void> {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      type TEXT NOT NULL,
      inputMode TEXT NOT NULL,
      subType TEXT,
      date TEXT NOT NULL
    );
  `);

  const countResult = await db.getFirstAsync<{ count: number }>(`
    SELECT COUNT(*) as count FROM scores
  `);
  const count = countResult?.count ?? 0;

  if (count >= MAX_SAVED_SCORES) {
    await db.runAsync(`
      DELETE FROM scores
      WHERE id = (
        SELECT id FROM scores
        ORDER BY date ASC
        LIMIT 1
      )
    `);
  }

  await db.runAsync(
    `INSERT INTO scores (score, total, type, inputMode, subType, date) VALUES (?, ?, ?, ?, ?, ?)`,
    data.score,
    data.total,
    data.type,
    data.inputMode,
    data.subType ?? null,
    new Date().toISOString()
  );
}

/**
 * Get all saved scores from the database.
 */
export async function getScores(): Promise<SavedScore[]> {
  const db = await dbPromise;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      type TEXT NOT NULL,
      inputMode TEXT NOT NULL,
      subType TEXT,
      date TEXT NOT NULL
    );
  `);
  const result = await db.getAllAsync<SavedScore>(`SELECT * FROM scores ORDER BY date DESC`);
  return result;
}

/**
 * Check if the score limit has been reached.
 */
export async function isScoreLimitReached(): Promise<boolean> {
  const db = await dbPromise;

  const result = await db.getFirstAsync<{ count: number }>(`
    SELECT COUNT(*) as count FROM scores
  `);

  return (result?.count ?? 0) >= MAX_SAVED_SCORES;
}
