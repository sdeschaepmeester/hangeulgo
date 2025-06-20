import { MAX_SAVED_SCORES } from "@/data/constants";
import { dbPromise } from "@/db/database";

export type GameType = "translation" | "comprehension";
export type InputMode = "input" | "multiple";

export type SavedScore = {
  id: number;
  score: number;
  total: number;
  type: GameType;
  inputMode: InputMode;
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
      date TEXT NOT NULL
    );
  `);

  // Count current scores
  const countResult = await db.getFirstAsync<{ count: number }>(`
    SELECT COUNT(*) as count FROM scores
  `);
  const count = countResult?.count ?? 0;

  // If limit is reached, delete the oldest score
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

  // Insert new score
  await db.runAsync(
    `INSERT INTO scores (score, total, type, inputMode, date) VALUES (?, ?, ?, ?, ?)`,
    data.score,
    data.total,
    data.type,
    data.inputMode,
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