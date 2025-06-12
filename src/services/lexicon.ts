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

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

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
