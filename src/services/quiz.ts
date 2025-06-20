import { dbPromise } from "@/db/database";
import type { GameSettings } from "@/types/GameSettings";
import type { SavedQuizEntry } from "@/types/SavedQuizEntry";

export async function saveCustomQuiz(name: string, settings: GameSettings) {
    const db = await dbPromise;
    const { type, subType, inputMode, difficulties, length, tags } = settings;

    await db.runAsync(
        `INSERT INTO saved_quiz (name, type, subType, inputMode, difficulties, length, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        name,
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

export async function deleteSavedQuiz(id: number): Promise<void> {
    const db = await dbPromise;
    await db.runAsync(`DELETE FROM saved_quiz WHERE id = ?`, id);
}
