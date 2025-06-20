import { MAX_SAVED_LEXICON_ENTRIES } from "@/data/constants";
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
 * Check if the lexicon limit has been reached
 */
export async function isLexiconLimitReached(): Promise<boolean> {
    const db = await dbPromise;
    const result = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM lexicon"
    );
    return (result?.count ?? 0) >= MAX_SAVED_LEXICON_ENTRIES;
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
 * Add phonetic to existing duplicate fr entries (if not already formatted)
 */
export async function handleFrenchDuplicates(fr: string, phonetic: string): Promise<string> {
    const db = await dbPromise;
    const frBase = fr.trim().split("(")[0].trim().toLowerCase();
    const rows = await db.getAllAsync<{ id: number; fr: string; phonetic: string | null }>(
        `SELECT id, fr, phonetic FROM lexicon`
    );

    for (const row of rows) {
        const rowBase = row.fr.split("(")[0].trim().toLowerCase();
        if (rowBase === frBase) {
            const alreadyFormatted = row.fr.includes("(");
            if (!alreadyFormatted && row.phonetic?.trim()) {
                const updatedFr = `${row.fr.trim()} (${row.phonetic.trim()})`;
                await db.runAsync(`UPDATE lexicon SET fr = ? WHERE id = ?`, [updatedFr, row.id]);
            }
            return `${fr.trim()} (${phonetic.trim()})`;
        }
    }
    return fr.trim();
}


/**
 * Ensure consistency for fr entries on edit (in case of phonetic update or fr update)
 */
export async function updateFrenchDuplicateFormatting(updatedId: number): Promise<void> {
    const db = await dbPromise;

    const current = await db.getFirstAsync<{ id: number; fr: string; phonetic: string | null }>(
        `SELECT id, fr, phonetic FROM lexicon WHERE id = ?`,
        [updatedId]
    );
    if (!current) return;

    const frBase = current.fr.split("(")[0].trim().toLowerCase();

    const rows = await db.getAllAsync<{ id: number; fr: string; phonetic: string | null }>(
        `SELECT id, fr, phonetic FROM lexicon WHERE id != ?`,
        [updatedId]
    );

    const duplicateRows = rows.filter((row) => {
        const rowBase = row.fr.split("(")[0].trim().toLowerCase();
        return rowBase === frBase;
    });

    // If entry is unique, no need to format
    if (duplicateRows.length === 0) return;

    // Else, format all duplicates
    for (const row of duplicateRows) {
        if (!row.fr.includes("(") && row.phonetic?.trim()) {
            const updatedFr = `${row.fr.trim()} (${row.phonetic.trim()})`;
            await db.runAsync(`UPDATE lexicon SET fr = ? WHERE id = ?`, [updatedFr, row.id]);
        }
    }

    if (!current.fr.includes("(") && current.phonetic?.trim()) {
        const updatedFr = `${current.fr.trim()} (${current.phonetic.trim()})`;
        await db.runAsync(`UPDATE lexicon SET fr = ? WHERE id = ?`, [updatedFr, current.id]);
    }
}

/**
 * Add a new entry to lexicon or update existing one
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
        await updateFrenchDuplicateFormatting(id);
    } else {
        // Vérifie doublon FR et modifie si besoin
        fr = await handleFrenchDuplicates(fr, phonetic);

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