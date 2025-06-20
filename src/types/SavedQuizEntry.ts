import type { Difficulty } from "./Difficulty";
import type { GameType, GameSubType, InputMode } from "./GameSettings";

export interface SavedQuizEntry {
    id: number;
    name: string;
    type: GameType;
    subType: GameSubType;
    inputMode: InputMode;
    difficulties: Difficulty[];
    length: number | "unlimited";
    tags?: string[];
}