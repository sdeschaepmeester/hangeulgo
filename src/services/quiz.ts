import { dbPromise } from "@/db/database";
import type { GameSettings } from "@/types/GameSettings";
import type { SavedQuizEntry } from "@/types/SavedQuizEntry";
import { generateQuestions } from "./quizGenerator";
import i18n from "@/i18n";

/**
 * Save a custom quiz to the database.
 */
export async function saveCustomQuiz(name: string, settings: GameSettings) {
    const db = await dbPromise;
    const { type, subType, inputMode, difficulties, length, tags } = settings;
    const finalName = name.trim() === "" ? i18n.t("unnamed") : name.trim();

    await db.runAsync(
        `INSERT INTO saved_quiz (name, type, subType, inputMode, difficulties, length, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        finalName,
        type,
        subType,
        inputMode,
        JSON.stringify(difficulties),
        length,
        tags ? JSON.stringify(tags) : null
    );
}

type RawSavedQuiz = {
    id: number;
    name: string;
    type: string;
    subType: string;
    inputMode: string;
    difficulties: string;
    length: number;
    tags: string | null;
};

/**
 * Fetch all saved quizzes from the database.
 */
export async function getAllSavedQuizzes(): Promise<SavedQuizEntry[]> {
    const db = await dbPromise;
    const rows = await db.getAllAsync<RawSavedQuiz>(`SELECT * FROM saved_quiz ORDER BY id DESC`);

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type as SavedQuizEntry["type"],
        subType: row.subType as SavedQuizEntry["subType"],
        inputMode: row.inputMode as SavedQuizEntry["inputMode"],
        difficulties: JSON.parse(row.difficulties),
        length: row.length,
        tags: row.tags ? JSON.parse(row.tags) : [],
    }));
}

/**
 * Delete single saved quiz by ID.
 */
export async function deleteSavedQuiz(id: number): Promise<void> {
    const db = await dbPromise;
    await db.runAsync(`DELETE FROM saved_quiz WHERE id = ?`, id);
}


/**
 * Get number of saved quizzes in the database.
 */
export async function getSavedQuizCount(): Promise<number> {
    const db = await dbPromise;
    const result = await db.getFirstAsync<{ count: number }>(`
    SELECT COUNT(*) as count FROM saved_quiz
  `);
    return result?.count ?? 0;
}

/**
 * Check if a quiz is valid by generating questions based on the settings.
 */
export async function isQuizValid(settings: GameSettings): Promise<boolean> {
    try {
        const questions = await generateQuestions(settings);
        return questions.length > 0;
    } catch (error) {
        return false;
    }
}
