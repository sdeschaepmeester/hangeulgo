import { dbPromise } from "@/db/database";

export async function injectPreviewLexicon() {
    const db = await dbPromise;

    // Verify is lexicon exists, if yes skip whole function
    const existing = await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM lexicon");
    if (existing?.count && existing.count > 0) {
        return;
    }

    await db.runAsync(`
    CREATE TABLE IF NOT EXISTS lexicon_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lexicon_id INTEGER,
      tag TEXT,
      FOREIGN KEY (lexicon_id) REFERENCES lexicon(id)
    )
  `);

    const entries: {
        fr: string;
        ko: string;
        phonetic: string;
        difficulty: "easy" | "medium" | "hard";
        tags: string[];
    }[] = [
            { fr: "Bonjour", ko: "안녕하세요", phonetic: "annyeonghaseyo", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Enchanté", ko: "반갑습니다", phonetic: "bangapseumnida", difficulty: "easy", tags: ["soutenu", "présentation"] },
            { fr: "Merci (familier)", ko: "고마워", phonetic: "gomawo", difficulty: "easy", tags: ["familier", "présentation"] },
            { fr: "Merci (courant)", ko: "고맙습니다", phonetic: "gomapseumnida", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Merci (soutenu)", ko: "감사합니다", phonetic: "gamsahamnida", difficulty: "easy", tags: ["soutenu", "présentation"] },
            { fr: "Derien", ko: "아니에요", phonetic: "anieyo", difficulty: "easy", tags: ["courant"] },
            { fr: "Pas de problèmes", ko: "괜찮아요", phonetic: "gwaenchanayo", difficulty: "easy", tags: ["courant"] },
            { fr: "Pardon", ko: "미안합니다", phonetic: "mianhamnida", difficulty: "easy", tags: ["soutenu"] },
            { fr: "Pardon", ko: "미안해", phonetic: "mianhae", difficulty: "easy", tags: ["familier"] },
            { fr: "Oui", ko: "네", phonetic: "ne", difficulty: "easy", tags: ["basique"] },
            { fr: "Non", ko: "아니요", phonetic: "aniyo", difficulty: "easy", tags: ["basique"] },
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
            console.error(`Error insert "${entry.fr}"`, err);
        }
    }
}