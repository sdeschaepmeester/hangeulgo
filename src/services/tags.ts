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

/**
 * Return valid tags for puzzle game
 * at least 2 characters long or contains at least one space
 */
export async function getFilteredTagsForPuzzle(): Promise<string[]> {
  const db = await dbPromise;

  const rows = await db.getAllAsync<{ tag: string }>(`
        SELECT DISTINCT t.tag
        FROM lexicon l
        JOIN lexicon_tags t ON l.id = t.lexicon_id
        WHERE l.active = 1
          AND (
            (LENGTH(REPLACE(l.ko, ' ', '')) > 1)
            OR (INSTR(l.ko, ' ') > 0 AND LENGTH(l.ko) - LENGTH(REPLACE(l.ko, ' ', '')) >= 1)
          )
    `);

  return rows.map((row) => row.tag);
}
