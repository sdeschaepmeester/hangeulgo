import { Difficulty } from "./Difficulty";

export interface Question {
    fr: string;
    ko: string;
    phonetic: string;
    difficulty: Difficulty;
    correctAnswer: string;
    choices?: string[];
}
