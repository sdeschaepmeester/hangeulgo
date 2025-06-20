import { dbPromise } from "@/db/database";
import type { GameSettings } from "@/types/GameSettings";
import type { LexiconEntry } from "@/types/LexiconEntry";
import { Question } from "@/types/Question";

function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

// Valid for puzzle game
function isValidForArrangement(word: string): boolean {
    const pieces = word.trim().split("");
    return pieces.length >= 2;
}


export async function generateQuestions(settings: GameSettings): Promise<Question[]> {
    const db = await dbPromise;
    let rows: (LexiconEntry & { tags: string | null })[] = [];

    if (settings.tags && settings.tags.length > 0) {
        const diffPlaceholders = settings.difficulties.map(() => "?").join(",");
        const tagPlaceholders = settings.tags.map(() => "?").join(",");

        rows = await db.getAllAsync(
            `
      SELECT filtered.*, GROUP_CONCAT(t_all.tag) AS tags
      FROM (
          SELECT l.id as id, l.fr, l.ko, l.phonetic, l.difficulty, l.active
          FROM lexicon l
          JOIN lexicon_tags t_filter ON l.id = t_filter.lexicon_id
          WHERE l.difficulty IN (${diffPlaceholders})
            AND l.active = 1
            AND t_filter.tag IN (${tagPlaceholders})
          GROUP BY l.id
      ) AS filtered
      LEFT JOIN lexicon_tags t_all ON filtered.id = t_all.lexicon_id
      GROUP BY filtered.id
      `,
            ...settings.difficulties,
            ...settings.tags
        );
    } else {
        const placeholders = settings.difficulties.map(() => "?").join(",");
        rows = await db.getAllAsync(
            `
      SELECT l.*, GROUP_CONCAT(t.tag) AS tags
      FROM lexicon l
      LEFT JOIN lexicon_tags t ON l.id = t.lexicon_id
      WHERE l.difficulty IN (${placeholders})
        AND l.active = 1
      GROUP BY l.id
      `,
            ...settings.difficulties
        );
    }

    // For puzzle game, filter out entries that are too short or don't have spaces
    if (settings.type === "arrangement") {
        rows = rows.filter((entry) => isValidForArrangement(entry.ko));
    }

    const baseSet = shuffle(rows);
    const needed = settings.length === "unlimited" ? baseSet.length : settings.length;

    let extended: typeof rows = [];
    while (extended.length < needed) {
        extended = extended.concat(shuffle(baseSet));
    }
    if (settings.length !== "unlimited") {
        extended = extended.slice(0, settings.length);
    }

    const questions: Question[] = extended.map((entry) => {
        const tags = entry.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];

        const q: Question = {
            prompt: "",
            correctAnswer: "",
            phonetic: entry.phonetic,
            difficulty: entry.difficulty,
            tags,
        };

        switch (settings.type) {
            case "comprehension":
                if (settings.subType === "koToFr") {
                    q.prompt = entry.ko;
                    q.correctAnswer = entry.fr;
                    q.choices = shuffle([
                        entry.fr,
                        ...shuffle(rows.map((e) => e.fr).filter((v) => v !== entry.fr)).slice(0, 3),
                    ]);
                } else {
                    q.prompt = entry.fr;
                    q.correctAnswer = entry.ko;
                    q.choices = shuffle([
                        entry.ko,
                        ...shuffle(rows.map((e) => e.ko).filter((v) => v !== entry.ko)).slice(0, 3),
                    ]);
                }
                break;

            case "ecriture":
                q.prompt = entry.fr;
                q.correctAnswer = entry.ko;
                break;
            case "ecoute":
                if (settings.subType === "koToFr") {
                    q.prompt = entry.ko;
                    q.correctAnswer = entry.fr;
                    q.choices = shuffle([
                        entry.fr,
                        ...shuffle(rows.map((e) => e.fr).filter((v) => v !== entry.fr)).slice(0, 3),
                    ]);
                } else {
                    q.prompt = entry.ko;
                    q.correctAnswer = entry.ko;
                    q.choices = shuffle([
                        entry.ko,
                        ...shuffle(rows.map((e) => e.ko).filter((v) => v !== entry.ko)).slice(0, 3),
                    ]);
                }
                break;
            case "arrangement":
                q.prompt = entry.fr;
                q.correctAnswer = entry.ko;
                q.choices = shuffle([
                    entry.ko,
                    ...shuffle(rows.map((e) => e.ko).filter((v) => v !== entry.ko)).slice(0, 3),
                ]);
                break;
        }
        return q;
    });

    return questions;
}
