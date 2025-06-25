import type { Difficulty } from "./Difficulty";

export interface QuizEntry {
    id: number;
    native: string;
    ko: string;
    phonetic: string;
    difficulty: Difficulty;
}