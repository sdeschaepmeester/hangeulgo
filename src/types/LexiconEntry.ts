import type { Difficulty } from "./Difficulty";

export interface LexiconEntry {
  id: number;
  native: string;
  ko: string;
  phonetic: string;
  difficulty: Difficulty;
  active: number; // 0 or 1
  tags?: string;
}