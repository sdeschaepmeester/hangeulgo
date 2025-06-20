import { Difficulty } from "./Difficulty";

export interface Question {
    prompt: string;
    correctAnswer: string;
    phonetic: string;
    difficulty: Difficulty;
    choices?: string[]; // QCM choices, if applicable
    tags: string[];
}
