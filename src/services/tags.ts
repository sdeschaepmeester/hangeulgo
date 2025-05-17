import { dbPromise } from "@/db/database";

export async function getAllUniqueTags(): Promise<string[]> {
    const db = await dbPromise;
    const rows = await db.getAllAsync<{ tag: string }>(
        `SELECT DISTINCT tag FROM lexicon_tags ORDER BY tag ASC`
    );
    return rows.map((row) => row.tag);
}
