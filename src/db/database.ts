import * as SQLite from "expo-sqlite";

const dbPromise = SQLite.openDatabaseAsync("hangeulgo.db");

export async function initDatabase() {
  const db = await dbPromise;

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS lexicon (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     fr TEXT NOT NULL,
     ko TEXT NOT NULL,
     phonetic TEXT,
     difficulty TEXT NOT NULL,
     active INTEGER NOT NULL,
     tags TEXT
    );
  `);
}

export { dbPromise };