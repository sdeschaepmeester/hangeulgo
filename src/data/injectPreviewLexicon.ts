import { dbPromise, initDatabase } from "@/db/database";
import * as SecureStore from "expo-secure-store";
import { getLocales } from "expo-localization";
import { previewLexiconFr } from "./previewLexicon.fr";
import { previewLexiconEn } from "./previewLexicon.en";

export async function injectPreviewLexicon() {
  await initDatabase();
  const db = await dbPromise;

  const storedLang = await SecureStore.getItemAsync("userLang");
  const fallbackLang = getLocales()[0]?.languageCode === "fr" ? "fr" : "en";
  const lang = storedLang === "fr" || storedLang === "en" ? storedLang : fallbackLang;

  const entries: {
    native: string;
    ko: string;
    phonetic: string;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
  }[] = lang === "fr" ? previewLexiconFr : previewLexiconEn;

  for (const entry of entries) {
    try {
      const existing = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM lexicon WHERE native = ? AND ko = ?`,
        [entry.native, entry.ko]
      );

      if (existing?.id) continue;

      const inserted = await db.getFirstAsync<{ id: number }>(
        `INSERT INTO lexicon (native, ko, phonetic, difficulty, active)
         VALUES (?, ?, ?, ?, ?) RETURNING id`,
        [entry.native, entry.ko, entry.phonetic, entry.difficulty, 1]
      );

      if (inserted?.id) {
        for (const tag of entry.tags) {
          await db.runAsync(
            `INSERT INTO lexicon_tags (lexicon_id, tag) VALUES (?, ?)`,
            [inserted.id, tag]
          );
        }
      }
    } catch (err) {
      console.error(`Error inserting: "${entry.native}"`, err);
    }
  }

  // Saved quizzes samples
  const quizzesToInsert = [
    {
      name: lang === "fr" ? "Quiz Dates" : "Date Quiz",
      type: "comprehension",
      subType: "nativeToKo",
      inputMode: "multiple",
      length: 10,
      difficulties: ["easy"],
      tags: ["Date"]
    },
    {
      name: lang === "fr" ? "Quiz Famille" : "Family Quiz",
      type: "comprehension",
      subType: "nativeToKo",
      inputMode: "multiple",
      length: 10,
      difficulties: ["easy", "medium"],
      tags: [lang === "fr" ? "Famille" : "Family"],
    },
    {
      name: lang === "fr" ? "Quiz Pays" : "Country Quiz",
      type: "comprehension",
      subType: "koToNative",
      inputMode: "multiple",
      length: 10,
      difficulties: ["easy"],
      tags: [lang === "fr" ? "Pays" : "Countries"],
    }
  ];

  for (const quiz of quizzesToInsert) {
    const existing = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM saved_quiz WHERE name = ?`,
      [quiz.name]
    );

    if (existing?.id) continue;

    try {
      await db.runAsync(
        `INSERT INTO saved_quiz (name, type, subType, inputMode, length, difficulties, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          quiz.name,
          quiz.type,
          quiz.subType,
          quiz.inputMode,
          quiz.length,
          JSON.stringify(quiz.difficulties),
          JSON.stringify(quiz.tags)
        ]
      );
    } catch (err) {
      console.error(`Error inserting quiz: "${quiz.name}"`, err);
    }
  }
}
