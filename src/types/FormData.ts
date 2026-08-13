import type { Difficulty } from "@/types/Difficulty";

// Add word form data type
export type FormData = {
    native: string;
    ko: string;
    phonetic: string;
    tags: string[];
    difficulty: Difficulty;
};