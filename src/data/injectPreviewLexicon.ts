import { dbPromise } from "@/db/database";

export async function injectPreviewLexicon() {
    const db = await dbPromise;
    
    await db.runAsync(`
    CREATE TABLE IF NOT EXISTS lexicon (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fr TEXT NOT NULL,
      ko TEXT NOT NULL,
      phonetic TEXT,
      difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
      active INTEGER NOT NULL DEFAULT 1
    );
  `);

    await db.runAsync(`
    CREATE TABLE IF NOT EXISTS lexicon_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lexicon_id INTEGER,
      tag TEXT,
      FOREIGN KEY (lexicon_id) REFERENCES lexicon(id)
    );
  `);

    await db.runAsync(`
    CREATE TABLE IF NOT EXISTS saved_quiz (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      subType TEXT,
      inputMode TEXT,
      length TEXT,
      difficulties TEXT,
      tags TEXT
    );
  `);

    const entries: {
        fr: string;
        ko: string;
        phonetic: string;
        difficulty: "easy" | "medium" | "hard";
        tags: string[];
    }[] = [
            // Communs
            { fr: "Bonjour", ko: "안녕하세요", phonetic: "annyeonghaseyo", difficulty: "easy", tags: ["Courant"] },
            { fr: "Enchanté", ko: "반갑습니다", phonetic: "bangapseumnida", difficulty: "easy", tags: ["Soutenu"] },
            { fr: "Merci (familier)", ko: "고마워", phonetic: "gomawo", difficulty: "easy", tags: ["Familier"] },
            { fr: "Merci (courant)", ko: "고맙습니다", phonetic: "gomapseumnida", difficulty: "easy", tags: ["Courant"] },
            { fr: "Merci (soutenu)", ko: "감사합니다", phonetic: "gamsahamnida", difficulty: "easy", tags: ["Soutenu"] },
            { fr: "Oui", ko: "네", phonetic: "ne", difficulty: "easy", tags: [] },
            { fr: "Non", ko: "아니요", phonetic: "aniyo", difficulty: "easy", tags: [] },
            // Famille
            { fr: "Maman", ko: "엄마", phonetic: "eomma", difficulty: "easy", tags: ["Famille"] },
            { fr: "Papa", ko: "아빠", phonetic: "appa", difficulty: "easy", tags: ["Famille"] },
            { fr: "Frère aîné (pour garçon)", ko: "형", phonetic: "hyeong", difficulty: "medium", tags: ["Famille"] },
            { fr: "Frère aîné (pour fille)", ko: "오빠", phonetic: "oppa", difficulty: "medium", tags: ["Famille"] },
            { fr: "Sœur aînée (pour garçon)", ko: "누나", phonetic: "nuna", difficulty: "medium", tags: ["Famille"] },
            { fr: "Sœur aînée (pour fille)", ko: "언니", phonetic: "eonni", difficulty: "medium", tags: ["Famille"] },
            { fr: "Parents", ko: "부모님", phonetic: "bumonim", difficulty: "medium", tags: ["Famille"] },
            { fr: "Cousin", ko: "사촌", phonetic: "sachon", difficulty: "medium", tags: ["Famille"] },
            { fr: "Grand-père", ko: "할아버지", phonetic: "harabeoji", difficulty: "medium", tags: ["Famille"] },
            { fr: "Grand-mère", ko: "할머니", phonetic: "halmeoni", difficulty: "medium", tags: ["Famille"] },
            // Nourriture
            { fr: "Riz", ko: "밥", phonetic: "bap", difficulty: "easy", tags: ["Nourriture"] },
            { fr: "Soupe", ko: "국", phonetic: "guk", difficulty: "easy", tags: ["Nourriture"] },
            { fr: "Kimchi", ko: "김치", phonetic: "kimchi", difficulty: "easy", tags: ["Nourriture"] },
            { fr: "Poulet frit", ko: "치킨", phonetic: "chikin", difficulty: "easy", tags: ["Nourriture"] },
            { fr: "Barbecue coréen", ko: "불고기", phonetic: "bulgogi", difficulty: "medium", tags: ["Nourriture"] },
            { fr: "Piment", ko: "고추", phonetic: "gochu", difficulty: "medium", tags: ["Nourriture"] },
            // Pays
            { fr: "Corée", ko: "한국", phonetic: "hanguk", difficulty: "easy", tags: ["Pays"] },
            { fr: "France", ko: "프랑스", phonetic: "peurangseu", difficulty: "easy", tags: ["Pays"] },
            { fr: "Japon", ko: "일본", phonetic: "ilbon", difficulty: "easy", tags: ["Pays"] },
            { fr: "Chine", ko: "중국", phonetic: "jungguk", difficulty: "easy", tags: ["Pays"] },
            { fr: "États-Unis", ko: "미국", phonetic: "miguk", difficulty: "easy", tags: ["Pays"] },
        ];

    for (const entry of entries) {
        try {
            const inserted = await db.getFirstAsync<{ id: number }>(
                `INSERT INTO lexicon (fr, ko, phonetic, difficulty, active)
         VALUES (?, ?, ?, ?, ?) RETURNING id`,
                [entry.fr, entry.ko, entry.phonetic, entry.difficulty, 1]
            );

            if (inserted?.id) {
                for (const tag of entry.tags) {
                    await db.runAsync(
                        `INSERT INTO lexicon_tags (lexicon_id, tag) VALUES (?, ?)`,
                        [inserted.id, tag]
                    );
                }
            }
        } catch (err) {
            console.error(`Error inserting: "${entry.fr}"`, err);
        }
    }

    // Quiz Famille
    await db.runAsync(
        `INSERT INTO saved_quiz (name, type, subType, inputMode, length, difficulties, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        "Quiz Famille",
        "comprehension",
        "koToFr",
        "multiple",
        "20",
        JSON.stringify(["easy", "medium"]),
        JSON.stringify(["Famille"])
    );

    // Quiz Pays
    await db.runAsync(
        `INSERT INTO saved_quiz (name, type, subType, inputMode, length, difficulties, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        "Quiz Pays",
        "comprehension",
        "koToFr",
        "multiple",
        "20",
        JSON.stringify(["easy"]),
        JSON.stringify(["Pays"])
    );
}
