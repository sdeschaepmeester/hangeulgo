import { dbPromise } from "@/db/database";
import { initDatabase } from "@/db/database";

export async function injectPreviewLexicon() {
  await initDatabase();
  const db = await dbPromise;

  const entries: {
    fr: string;
    ko: string;
    phonetic: string;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
  }[] = [
      // Formules
      { fr: "Bonjour", ko: "안녕하세요", phonetic: "annyeonghaseyo", difficulty: "easy", tags: ["Formules", "Courant"] },
      { fr: "Enchanté", ko: "반갑습니다", phonetic: "bangapseumnida", difficulty: "easy", tags: ["Formules", "Soutenu"] },
      { fr: "Merci (gomawo)", ko: "고마워", phonetic: "gomawo", difficulty: "easy", tags: ["Formules", "Familier"] },
      { fr: "Merci (gomapseumnida)", ko: "고맙습니다", phonetic: "gomapseumnida", difficulty: "easy", tags: ["Formules", "Courant"] },
      { fr: "Merci (gamsahamnida)", ko: "감사합니다", phonetic: "gamsahamnida", difficulty: "easy", tags: ["Formules", "Soutenu"] },
      { fr: "De rien", ko: "천만에요", phonetic: "cheonmaneyo", difficulty: "medium", tags: ["Formules", "Soutenu"] },
      { fr: "Désolé", ko: "미안해요", phonetic: "mianhaeyo", difficulty: "easy", tags: ["Formules", "Courant"] },
      { fr: "Pardon (poli)", ko: "죄송합니다", phonetic: "joesonghamnida", difficulty: "medium", tags: ["Formules", "Soutenu"] },
      { fr: "Au revoir", ko: "안녕히 가세요", phonetic: "annyeonghi gaseyo", difficulty: "easy", tags: ["Formules", "Soutenu"] },
      { fr: "Bonne nuit", ko: "안녕히 주무세요", phonetic: "annyeonghi jumuseyo", difficulty: "medium", tags: ["Formules", "Soutenu"] },
      { fr: "Oui", ko: "네", phonetic: "ne", difficulty: "easy", tags: ["Formules"] },
      { fr: "Non", ko: "아니요", phonetic: "aniyo", difficulty: "easy", tags: ["Formules"] },
      { fr: "Je ne sais pas", ko: "모르겠어요", phonetic: "moreugesseoyo", difficulty: "medium", tags: ["Formules", "Courant"] },
      { fr: "C’est bon", ko: "괜찮아요", phonetic: "gwaenchanayo", difficulty: "easy", tags: ["Formules", "Courant"] },
      { fr: "Félicitations", ko: "축하합니다", phonetic: "chukahamnida", difficulty: "medium", tags: ["Formules", "Soutenu"] },
      // Famille
      { fr: "Maman", ko: "엄마", phonetic: "eomma", difficulty: "easy", tags: ["Famille"] },
      { fr: "Papa", ko: "아빠", phonetic: "appa", difficulty: "easy", tags: ["Famille"] },
      { fr: "Frère aîné (pour garçon)", ko: "형", phonetic: "hyeong", difficulty: "medium", tags: ["Famille"] },
      { fr: "Frère aîné (pour fille)", ko: "오빠", phonetic: "oppa", difficulty: "medium", tags: ["Famille"] },
      { fr: "Sœur aînée (pour garçon)", ko: "누나", phonetic: "nuna", difficulty: "medium", tags: ["Famille"] },
      { fr: "Sœur aînée (pour fille)", ko: "언니", phonetic: "eonni", difficulty: "medium", tags: ["Famille"] },
      { fr: "Parents", ko: "부모님", phonetic: "bumonim", difficulty: "medium", tags: ["Famille"] },
      { fr: "Cousin", ko: "사촌", phonetic: "sachon", difficulty: "medium", tags: ["Famille"] },
      { fr: "Grand-père", ko: "할아버지", phonetic: "harabeoji", difficulty: "medium", tags: ["Famille"] },
      { fr: "Grand-mère", ko: "할머니", phonetic: "halmeoni", difficulty: "medium", tags: ["Famille"] },
      // Nourriture
      { fr: "Riz", ko: "밥", phonetic: "bap", difficulty: "easy", tags: ["Nourriture"] },
      { fr: "Soupe", ko: "국", phonetic: "guk", difficulty: "easy", tags: ["Nourriture"] },
      { fr: "Kimchi", ko: "김치", phonetic: "kimchi", difficulty: "easy", tags: ["Nourriture"] },
      { fr: "Poulet frit", ko: "치킨", phonetic: "chikin", difficulty: "easy", tags: ["Nourriture"] },
      { fr: "Barbecue coréen", ko: "불고기", phonetic: "bulgogi", difficulty: "medium", tags: ["Nourriture"] },
      { fr: "Piment", ko: "고추", phonetic: "gochu", difficulty: "medium", tags: ["Nourriture"] },
      // Pays
      { fr: "Corée", ko: "한국", phonetic: "hanguk", difficulty: "easy", tags: ["Pays"] },
      { fr: "France", ko: "프랑스", phonetic: "peurangseu", difficulty: "easy", tags: ["Pays"] },
      { fr: "Japon", ko: "일본", phonetic: "ilbon", difficulty: "easy", tags: ["Pays"] },
      { fr: "Chine", ko: "중국", phonetic: "jungguk", difficulty: "easy", tags: ["Pays"] },
      { fr: "États-Unis", ko: "미국", phonetic: "miguk", difficulty: "easy", tags: ["Pays"] },
      // Dates
      { fr: "Lundi", ko: "월요일", phonetic: "woryoil", difficulty: "easy", tags: ["Jours", "Date"] },
      { fr: "Mardi", ko: "화요일", phonetic: "hwayoil", difficulty: "easy", tags: ["Jours", "Date"] },
      { fr: "Mercredi", ko: "수요일", phonetic: "suyoil", difficulty: "easy", tags: ["Jours", "Date"] },
      { fr: "Jeudi", ko: "목요일", phonetic: "mogyoil", difficulty: "easy", tags: ["Jours", "Date"] },
      { fr: "Vendredi", ko: "금요일", phonetic: "geumyoil", difficulty: "easy", tags: ["Jours", "Date"] },
      { fr: "Samedi", ko: "토요일", phonetic: "toyoil", difficulty: "easy", tags: ["Jours", "Date"] },
      { fr: "Dimanche", ko: "일요일", phonetic: "iryoil", difficulty: "easy", tags: ["Jours", "Date"] },
      { fr: "Janvier", ko: "1월", phonetic: "irwol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Février", ko: "2월", phonetic: "iwol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Mars", ko: "3월", phonetic: "samwol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Avril", ko: "4월", phonetic: "sawol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Mai", ko: "5월", phonetic: "owol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Juin", ko: "6월", phonetic: "yuwol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Juillet", ko: "7월", phonetic: "chirwol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Août", ko: "8월", phonetic: "parwol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Septembre", ko: "9월", phonetic: "guwol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Octobre", ko: "10월", phonetic: "sibwol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Novembre", ko: "11월", phonetic: "sibirwol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Décembre", ko: "12월", phonetic: "sibiwol", difficulty: "easy", tags: ["Mois", "Date"] },
      { fr: "Printemps", ko: "봄", phonetic: "bom", difficulty: "easy", tags: ["Saisons", "Date"] },
      { fr: "Été", ko: "여름", phonetic: "yeoreum", difficulty: "easy", tags: ["Saisons", "Date"] },
      { fr: "Automne", ko: "가을", phonetic: "gaeul", difficulty: "easy", tags: ["Saisons", "Date"] },
      { fr: "Hiver", ko: "겨울", phonetic: "gyeoul", difficulty: "easy", tags: ["Saisons", "Date"] },
    ];

  for (const entry of entries) {
    try {
      // Check if entry is already in lexicon
      const existing = await db.getFirstAsync<{ id: number }>(
        `SELECT id FROM lexicon WHERE fr = ? AND ko = ?`,
        [entry.fr, entry.ko]
      );

      if (existing?.id) continue;

      const inserted = await db.getFirstAsync<{ id: number }>(
        `INSERT INTO lexicon (fr, ko, phonetic, difficulty, active)
         VALUES (?, ?, ?, ?, ?) RETURNING id`,
        [entry.fr, entry.ko, entry.phonetic, entry.difficulty, 1]
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
      console.error(`Error inserting: "${entry.fr}"`, err);
    }
  }


  const quizzesToInsert = [
    {
      name: "Quiz Dates",
      type: "comprehension",
      subType: "frToKo",
      inputMode: "multiple",
      length: "10",
      difficulties: ["easy"],
      tags: ["Date"]
    },
    {
      name: "Quiz Famille",
      type: "comprehension",
      subType: "koToFr",
      inputMode: "multiple",
      length: "20",
      difficulties: ["easy", "medium"],
      tags: ["Famille"]
    },
    {
      name: "Quiz Pays",
      type: "comprehension",
      subType: "koToFr",
      inputMode: "multiple",
      length: "20",
      difficulties: ["easy"],
      tags: ["Pays"]
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