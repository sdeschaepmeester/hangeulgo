import type { Difficulty } from "./Difficulty";

export interface QuizEntry {
    id: number;
    fr: string;
    ko: string;
    phonetic: string;
    difficulty: Difficulty;
}