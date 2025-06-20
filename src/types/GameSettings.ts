import { Difficulty } from "./Difficulty";

export type GameType = "comprehension" | "ecriture" | "arrangement" | "ecoute";

export type GameSubType =
    | "koToFr"
    | "frToKo"
    | "order"
    | "koToKo";

export type InputMode = "multiple" | "input" | "order"; // QCM, Saisie, puzzle

export interface GameSettings {
    type: GameType;
    subType: GameSubType;
    inputMode: InputMode;
    difficulties: Difficulty[];
    length: number | "unlimited";
    tags?: string[];
}