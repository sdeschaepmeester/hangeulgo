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

export async function clearScores(): Promise<void> {
    const db = await dbPromise;
    await db.runAsync(`DELETE FROM scores`);
}

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

    await db.runAsync(
        `INSERT INTO scores (score, total, type, inputMode, date) VALUES (?, ?, ?, ?, ?)`,
        data.score,
        data.total,
        data.type,
        data.inputMode,
        new Date().toISOString()
    );
}

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