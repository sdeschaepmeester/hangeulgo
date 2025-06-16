import Storage from "expo-sqlite/kv-store";
import type { Difficulty } from "@/types/Difficulty";
import type { InputMode } from "@/types/GameSettings";

const KEY = "gameSettings";

// Retrieve game saved settings to local storage
export const getSavedSettings = async (): Promise<{
    difficulties: Difficulty[];
    length: number;
    inputMode?: InputMode;
    tags?: string[];
} | null> => {
    const data = await Storage.getItem(KEY);
    return data ? JSON.parse(data) : null;
};

// Save game settings to local storage
export const saveSettings = async (
    difficulties: Difficulty[],
    length: number,
    inputMode?: InputMode,
    tags?: string[]
) => {
    return Storage.setItem(
        KEY,
        JSON.stringify({ difficulties, length, inputMode, tags })
    );
};

// Clear saved game settings, when unchecking "Remember settings"
export const clearSettings = async () => {
    await Storage.removeItem(KEY);
};