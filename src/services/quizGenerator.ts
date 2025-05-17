import { dbPromise } from "@/db/database";
import type { GameSettings } from "@/types/GameSettings";
import type { LexiconEntry } from "@/types/LexiconEntry";

export interface Question {
    fr: string;
    ko: string;
    phonetic: string;
    difficulty: "easy" | "medium" | "hard";
    correctAnswer: string;
    choices?: string[];
}

function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export async function generateQuestions(settings: GameSettings): Promise<Question[]> {
    const db = await dbPromise;

    let rows: LexiconEntry[] = [];

    if (settings.tags && settings.tags.length > 0) {
        const diffPlaceholders = settings.difficulties.map(() => "?").join(",");
        const tagPlaceholders = settings.tags.map(() => "?").join(",");

        rows = await db.getAllAsync<LexiconEntry>(
            `
    SELECT l.* FROM lexicon l
    JOIN lexicon_tags t ON l.id = t.lexicon_id
    WHERE l.difficulty IN (${diffPlaceholders})
      AND l.active = 1
      AND t.tag IN (${tagPlaceholders})
    GROUP BY l.id
    `,
            ...settings.difficulties,
            ...settings.tags
        );
    } else {
        const placeholders = settings.difficulties.map(() => "?").join(",");
        rows = await db.getAllAsync<LexiconEntry>(
            `SELECT * FROM lexicon WHERE difficulty IN (${placeholders}) AND active = 1`,
            ...settings.difficulties
        );
    }

    const baseSet = shuffle(rows);
    const needed = settings.length === "unlimited" ? baseSet.length : settings.length;

    // Duplication propre pour atteindre le total
    let extended: LexiconEntry[] = [];
    while (extended.length < needed) {
        extended = extended.concat(shuffle(baseSet));
    }
    if (settings.length !== "unlimited") {
        extended = extended.slice(0, settings.length);
    }

    const questions: Question[] = extended.map((entry) => {
        const question: Question = {
            fr: entry.fr,
            ko: entry.ko,
            phonetic: entry.phonetic,
            difficulty: entry.difficulty,
            correctAnswer: settings.type === "translation" ? entry.ko : entry.fr,
        };

        if (settings.type === "translation" && settings.inputMode === "multiple") {
            const allAnswers = shuffle(rows.map((e) => e.ko).filter((v) => v !== entry.ko));
            question.choices = shuffle([entry.ko, ...allAnswers.slice(0, 3)]);
        }

        if (settings.type === "comprehension") {
            const allAnswers = shuffle(rows.map((e) => e.fr).filter((v) => v !== entry.fr));
            question.choices = shuffle([entry.fr, ...allAnswers.slice(0, 3)]);
        }

        return question;
    });

    return questions;
}