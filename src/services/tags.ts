import { MAX_SAVED_LEXICON_TAGS } from "@/data/constants";
import { dbPromise } from "@/db/database";

/**
 * Retrieves all unique tags from the lexicon_tags table.
 */
export async function getAllUniqueTags(): Promise<string[]> {
    const db = await dbPromise;
    const rows = await db.getAllAsync<{ tag: string }>(
        `SELECT DISTINCT tag FROM lexicon_tags ORDER BY tag ASC`
    );
    return rows.map((row) => row.tag);
}

/**
 * Checks if the maximum number of unique tags has been reached.
 */
export async function isTagsLimitReached(): Promise<boolean> {
  const db = await dbPromise;
  const result = await db.getFirstAsync<{ count: number }>(`
    SELECT COUNT(DISTINCT tag) as count FROM lexicon_tags
  `);
  return (result?.count ?? 0) >= MAX_SAVED_LEXICON_TAGS;
}