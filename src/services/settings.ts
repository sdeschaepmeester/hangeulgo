import Storage from "expo-sqlite/kv-store";
import type { Difficulty } from "@/types/Difficulty";
import type { InputMode } from "@/types/GameSettings";

const KEY = "gameSettings";

export const getSavedSettings = async (): Promise<{
    difficulties: Difficulty[];
    length: number | "unlimited";
    inputMode?: InputMode;
} | null> => {
    const data = await Storage.getItem(KEY);
    return data ? JSON.parse(data) : null;
};

export const saveSettings = async (
    difficulties: Difficulty[],
    length: number | "unlimited",
    inputMode?: InputMode
) => {
    return Storage.setItem(
        KEY,
        JSON.stringify({ difficulties, length, inputMode })
    );
};