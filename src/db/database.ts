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

    CREATE TABLE IF NOT EXISTS lexicon_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lexicon_id INTEGER,
      tag TEXT,
      FOREIGN KEY (lexicon_id) REFERENCES lexicon(id)
    );

    CREATE TABLE IF NOT EXISTS saved_quiz (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      subType TEXT NOT NULL,
      inputMode TEXT NOT NULL,
      difficulties TEXT NOT NULL,
      length INTEGER NOT NULL,
      tags TEXT
    );
  `);
}

export { dbPromise };