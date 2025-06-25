import { Difficulty } from "./Difficulty";

export type GameType = "comprehension" | "ecriture" | "arrangement" | "ecoute";

export type GameSubType =
    | "koToNative" // Korean to user's native language
    | "nativeToKo" // User's native language to korean
    | "order" // Specific to puzzle quiz
    | "koToKo"; // Specific to listening quiz

export type InputMode = "multiple" | "input" | "order"; // QCM, Writing, puzzle

export interface GameSettings {
    type: GameType;
    subType: GameSubType;
    inputMode: InputMode;
    difficulties: Difficulty[];
    length: number | "unlimited";
    tags?: string[];
}