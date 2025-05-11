import type { Difficulty } from "./Difficulty";

export type GameType = "translation" | "comprehension";
export type InputMode = "multiple" | "input";

export interface GameSettings {
    type: GameType;
    difficulties: Difficulty[];
    length: number | "unlimited";
    inputMode?: InputMode; // Only for traduction game
}