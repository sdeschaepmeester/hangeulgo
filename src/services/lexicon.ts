import { dbPromise } from "@/db/database";
import type { Difficulty } from "@/types/Difficulty";
import type { LexiconEntry } from "@/types/LexiconEntry";

/**
 * Fetch lexicon entries filtered by difficulty and tags
 */
export async function getFilteredLexicon(
    selectedDifficulties: Difficulty[],
    selectedTags: string[],
    sortOrder: "asc" | "desc" = "asc"
): Promise<(LexiconEntry & { tags: string | null })[]> {
    const db = await dbPromise;
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (selectedDifficulties.length > 0) {
        whereClauses.push(`l.difficulty IN (${selectedDifficulties.map(() => "?").join(",")})`);
        params.push(...selectedDifficulties);
    }

    if (selectedTags.length > 0) {
        const tagsClause = selectedTags.map(() => "t.tag LIKE ?").join(" OR ");
        whereClauses.push(`(${tagsClause})`);
        params.push(...selectedTags.map((tag) => `%${tag}%`));
    }

    const rows = await db.getAllAsync<(LexiconEntry & { tags: string | null })>(
        `
    SELECT l.*, GROUP_CONCAT(t.tag, ', ') AS tags
    FROM lexicon l
    LEFT JOIN lexicon_tags t ON l.id = t.lexicon_id
    ${selectedTags.length > 0
            ? `WHERE EXISTS (
            SELECT 1
            FROM lexicon_tags lt
            WHERE lt.lexicon_id = l.id
            AND (${selectedTags.map(() => "lt.tag LIKE ?").join(" OR ")})
          )`
            : ""
        }
    ${selectedDifficulties.length > 0
            ? `${selectedTags.length > 0 ? "AND" : "WHERE"} l.difficulty IN (${selectedDifficulties.map(() => "?").join(",")})`
            : ""
        }
    GROUP BY l.id
    ORDER BY l.fr COLLATE NOCASE ${sortOrder.toUpperCase()}
    `,
        ...[...selectedTags.map((tag) => `%${tag}%`), ...selectedDifficulties]
    );

    return rows;
}

/**
 * Check if a Korean word already exists in the lexicon (not french input as it is not unique)
 */
export async function checkIfKoreanWordExists(korean: string): Promise<boolean> {
    const db = await dbPromise;
    const query = `SELECT COUNT(*) as count FROM lexicon WHERE ko = ?`;
    const result = await db.getFirstAsync<{ count: number }>(query, [korean.trim()]);
    return !!result?.count;
}

/**
 * Activate or deactivate a single entry from lexicon
 */
export async function toggleLexiconActive(id: number, current: number): Promise<void> {
    const db = await dbPromise;
    await db.runAsync("UPDATE lexicon SET active = ? WHERE id = ?", current ? 0 : 1, id);
}

/**
 * Delete a single entry from lexicon
 */
export async function deleteLexiconEntry(id: number): Promise<void> {
    const db = await dbPromise;
    await db.runAsync("DELETE FROM lexicon WHERE id = ?", id);
    await db.runAsync("DELETE FROM lexicon_tags WHERE lexicon_id = ?", id);
}

/**
 * Delete whole lexicon
 */
export async function resetLexicon(): Promise<void> {
    const db = await dbPromise;
    await db.runAsync("DELETE FROM lexicon");
    await db.runAsync("DELETE FROM lexicon_tags");
}

/**
 * Add a new entry to lexicon
 */
export async function saveWord({ fr, ko, phonetic, difficulty, tags, edit, id, }: {
    fr: string;
    ko: string;
    phonetic: string;
    difficulty: Difficulty;
    tags: string[];
    edit: boolean;
    id?: number;
}) {
    const db = await dbPromise;

    if (edit && id != null) {
        await db.runAsync(
            `UPDATE lexicon SET fr = ?, ko = ?, phonetic = ?, difficulty = ? WHERE id = ?`,
            fr,
            ko,
            phonetic,
            difficulty,
            id
        );
        await db.runAsync(`DELETE FROM lexicon_tags WHERE lexicon_id = ?`, [id]);
        for (const tag of tags) {
            await db.runAsync(
                `INSERT INTO lexicon_tags (lexicon_id, tag) VALUES (?, ?)`,
                [id, tag]
            );
        }
    } else {
        await db.runAsync(
            `INSERT INTO lexicon (fr, ko, phonetic, difficulty, active) VALUES (?, ?, ?, ?, 1)`,
            fr,
            ko,
            phonetic,
            difficulty
        );
        const lastInsert = await db.getFirstAsync<{ id: number }>(
            `SELECT last_insert_rowid() as id`
        );
        if (lastInsert?.id) {
            for (const tag of tags) {
                await db.runAsync(
                    `INSERT INTO lexicon_tags (lexicon_id, tag) VALUES (?, ?)`,
                    [lastInsert.id, tag]
                );
            }
        }
    }
}

/**
 * Return available difficulties based on the tags provided: Check if there's at least one entry for each difficulty
 */
export async function getAvailableDifficultiesFromTags(tags: string[]): Promise<Difficulty[]> {
    const rows = await getFilteredLexicon([], tags); // on ignore les difficultés pour ce filtre

    const difficulties = new Set<Difficulty>();
    for (const row of rows) {
        difficulties.add(row.difficulty);
    }

    return Array.from(difficulties);
}