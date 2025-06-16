import { dbPromise } from "@/db/database";
import type { GameSettings } from "@/types/GameSettings";
import type { LexiconEntry } from "@/types/LexiconEntry";
import { Question } from "@/types/Question";

function shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

export async function generateQuestions(settings: GameSettings): Promise<Question[]> {
    const db = await dbPromise;

    let rows: (LexiconEntry & { tags: string | null })[] = [];

    if (settings.tags && settings.tags.length > 0) {
        const diffPlaceholders = settings.difficulties.map(() => "?").join(",");
        const tagPlaceholders = settings.tags.map(() => "?").join(",");

        // Fetch lexicon entries filtered by difficulties and tags
        // Add their tags for each entry
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

    const baseSet = shuffle(rows);
    const needed = settings.length === "unlimited" ? baseSet.length : settings.length;

    // Clean duplicates to ensure we have enough unique questions
    let extended: typeof rows = [];
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
            tags: entry.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [],
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