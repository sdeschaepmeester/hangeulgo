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
    ORDER BY l.native COLLATE NOCASE ${sortOrder.toUpperCase()}
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
 * Check if a Korean word already exists in the lexicon
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
 * Add phonetic to existing duplicate native entries (if not already formatted)
 */
export async function handleNativeDuplicates(native: string, phonetic: string): Promise<string> {
    const db = await dbPromise;
    const frBase = native.trim().split("(")[0].trim().toLowerCase();
    const rows = await db.getAllAsync<{ id: number; native: string; phonetic: string | null }>(
        `SELECT id, native, phonetic FROM lexicon`
    );

    for (const row of rows) {
        const rowBase = row.native.split("(")[0].trim().toLowerCase();
        if (rowBase === frBase) {
            const alreadyFormatted = row.native.includes("(");
            if (!alreadyFormatted && row.phonetic?.trim()) {
                const updatedFr = `${row.native.trim()} (${row.phonetic.trim()})`;
                await db.runAsync(`UPDATE lexicon SET native = ? WHERE id = ?`, [updatedFr, row.id]);
            }
            return `${native.trim()} (${phonetic.trim()})`;
        }
    }
    return native.trim();
}


/**
 * Ensure consistency for native entries on edit (in case of phonetic update or native update)
 */
export async function updateFrenchDuplicateFormatting(updatedId: number): Promise<void> {
    const db = await dbPromise;

    const current = await db.getFirstAsync<{ id: number; native: string; phonetic: string | null }>(
        `SELECT id, native, phonetic FROM lexicon WHERE id = ?`,
        [updatedId]
    );
    if (!current) return;

    const frBase = current.native.split("(")[0].trim().toLowerCase();

    const rows = await db.getAllAsync<{ id: number; native: string; phonetic: string | null }>(
        `SELECT id, native, phonetic FROM lexicon WHERE id != ?`,
        [updatedId]
    );

    const duplicateRows = rows.filter((row) => {
        const rowBase = row.native.split("(")[0].trim().toLowerCase();
        return rowBase === frBase;
    });

    // If entry is unique, no need to format
    if (duplicateRows.length === 0) return;

    // Else, format all duplicates
    for (const row of duplicateRows) {
        if (!row.native.includes("(") && row.phonetic?.trim()) {
            const updatedFr = `${row.native.trim()} (${row.phonetic.trim()})`;
            await db.runAsync(`UPDATE lexicon SET native = ? WHERE id = ?`, [updatedFr, row.id]);
        }
    }

    if (!current.native.includes("(") && current.phonetic?.trim()) {
        const updatedFr = `${current.native.trim()} (${current.phonetic.trim()})`;
        await db.runAsync(`UPDATE lexicon SET native = ? WHERE id = ?`, [updatedFr, current.id]);
    }
}

/**
 * Add a new entry to lexicon or update existing one
 */
export async function saveWord({ native, ko, phonetic, difficulty, tags, edit, id, }: {
    native: string;
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
            `UPDATE lexicon SET native = ?, ko = ?, phonetic = ?, difficulty = ? WHERE id = ?`,
            native,
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
        // Check is a word with same korean input exists. There cannot be a duplicate of korean word.
        const alreadyExists = await checkIfKoreanWordExists(ko);
        if (alreadyExists) return;

        // Check if duplicates native term exists. There CAN be several inputs with same native word.
        native = await handleNativeDuplicates(native, phonetic);

        await db.runAsync(
            `INSERT INTO lexicon (native, ko, phonetic, difficulty, active) VALUES (?, ?, ?, ?, 1)`,
            native,
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
export async function getAvailableDifficultiesFromTags(
    tags: string[],
    forPuzzle: boolean = false
): Promise<Difficulty[]> {
    const rows = await getFilteredLexicon([], tags);

    const difficulties = new Set<Difficulty>();

    for (const row of rows) {
        const ko = row.ko.trim();

        if (forPuzzle) {
            // Ignore entries with only one syllable or one word
            const hasMultipleSyllables = ko.replace(/ /g, "").length > 1;
            const hasMultipleWords = ko.trim().split(" ").length > 1;
            if (!hasMultipleSyllables && !hasMultipleWords) continue;
        }

        difficulties.add(row.difficulty);
    }

    return Array.from(difficulties);
}