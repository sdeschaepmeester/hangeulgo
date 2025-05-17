import { dbPromise } from "@/db/database";

export async function injectPreviewLexicon() {
    const db = await dbPromise;

    await db.runAsync(`
    CREATE TABLE IF NOT EXISTS lexicon_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lexicon_id INTEGER,
      tag TEXT,
      FOREIGN KEY (lexicon_id) REFERENCES lexicon(id)
    )
  `);

    const entries: {
        fr: string;
        ko: string;
        phonetic: string;
        difficulty: "easy" | "medium" | "hard";
        tags: string[];
    }[] = [
            { fr: "Bonjour", ko: "안녕하세요", phonetic: "annyeonghaseyo", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Enchanté", ko: "반갑습니다", phonetic: "bangapseumnida", difficulty: "easy", tags: ["soutenu", "présentation"] },
            { fr: "Je m'appelle XX", ko: "제 이름은 XX입니다", phonetic: "je ireumeun XX-imnida", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Merci", ko: "감사합니다", phonetic: "gamsahamnida", difficulty: "easy", tags: ["soutenu", "présentation"] },
            { fr: "Merci", ko: "고맙습니다", phonetic: "gomapseumnida", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Derien", ko: "아니에요", phonetic: "anieyo", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Pas de problèmes", ko: "괜찮아요", phonetic: "gwaenchanayo", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Pardon", ko: "미안합니다", phonetic: "mianhamnida", difficulty: "easy", tags: ["soutenu", "présentation"] },
            { fr: "Pardon", ko: "괜찮습니다", phonetic: "gwaenchanseumnida", difficulty: "easy", tags: ["soutenu", "présentation"] },
            { fr: "D'accord (je comprends)", ko: "알겠습니다", phonetic: "algesseumnida", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "D'accord (j'accepte)", ko: "좋아요", phonetic: "joayo", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Ça va ?", ko: "괜찮아요?", phonetic: "gwaenchanayo?", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Ça va", ko: "네, 잘 지냈어요", phonetic: "ne, jal jinaesseoyo", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Soyez gentils avec moi", ko: "잘 부탁드립니다", phonetic: "jal butak deurimnida", difficulty: "medium", tags: ["soutenu", "présentation"] },
            { fr: "Ça fait un bail", ko: "오랜만이에요", phonetic: "oraenmanieyo", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "C'est un plaisir de vous rencontrer", ko: "만나서 반갑습니다", phonetic: "mannaseo bangapseumnida", difficulty: "easy", tags: ["soutenu", "présentation"] },
            { fr: "Au revoir (la personne reste)", ko: "안녕히 가세요", phonetic: "annyeonghi gaseyo", difficulty: "easy", tags: ["soutenu", "présentation"] },
            { fr: "Au revoir (la personne part)", ko: "안녕히 계세요", phonetic: "annyeonghi gyeseyo", difficulty: "easy", tags: ["soutenu", "présentation"] },
            { fr: "Oui", ko: "네", phonetic: "ne", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Non", ko: "아니요", phonetic: "aniyo", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Es-tu coréen ?", ko: "한국인이에요?", phonetic: "hangugin-ieyo?", difficulty: "easy", tags: ["courant", "présentation", "pays"] },
            { fr: "Un coréen", ko: "한국인", phonetic: "hangugin", difficulty: "easy", tags: ["courant", "pays"] },
            { fr: "Corée du sud", ko: "대한민국", phonetic: "daehanminguk", difficulty: "easy", tags: ["courant", "pays"] },
            { fr: "France", ko: "프랑스", phonetic: "peurangseu", difficulty: "easy", tags: ["courant", "pays"] },
            { fr: "Amérique", ko: "미국", phonetic: "miguk", difficulty: "easy", tags: ["courant", "pays"] },
            { fr: "Angleterre", ko: "영국", phonetic: "yeongguk", difficulty: "easy", tags: ["courant", "pays"] },
            { fr: "Chine", ko: "중국", phonetic: "jung-guk", difficulty: "easy", tags: ["courant", "pays"] },
            { fr: "Corée du nord", ko: "북한", phonetic: "bukhan", difficulty: "easy", tags: ["courant", "pays"] },
            { fr: "Australie", ko: "호주", phonetic: "hoju", difficulty: "easy", tags: ["courant", "pays"] },
            { fr: "Allemagne", ko: "독일", phonetic: "dogil", difficulty: "easy", tags: ["courant", "pays"] },
            { fr: "Lol", ko: "ㅋㅋㅋ", phonetic: "kkk", difficulty: "easy", tags: ["SMS", "langage SMS"] },
            { fr: "Merci (sms)", ko: "ㄳ", phonetic: "gs", difficulty: "easy", tags: ["SMS", "langage SMS"] },
            { fr: "Je ne suis pas coréen", ko: "한국인 아니에요", phonetic: "hangugin anieyo", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Merci pour le gâteau", ko: "케이크 감사합니다", phonetic: "keikeu gamsahamnida", difficulty: "easy", tags: ["cuisine", "courant"] },
            { fr: "Café et thé", ko: "커피랑 차", phonetic: "keopirang cha", difficulty: "easy", tags: ["cuisine"] },
            { fr: "Thé ou café", ko: "차 아니면 커피", phonetic: "cha animyeon keopi", difficulty: "easy", tags: ["cuisine"] },
            { fr: "Thé", ko: "차", phonetic: "cha", difficulty: "easy", tags: ["cuisine"] },
            { fr: "Café", ko: "커피", phonetic: "keopi", difficulty: "easy", tags: ["cuisine"] },
            { fr: "Gâteau", ko: "케이크", phonetic: "keikeu", difficulty: "easy", tags: ["cuisine"] },
            { fr: "Svp (donner)", ko: "주세요", phonetic: "juseyo", difficulty: "easy", tags: ["courant", "présentation"] },
            { fr: "Merci avant un repas", ko: "잘 먹겠습니다", phonetic: "jal meokgesseumnida", difficulty: "easy", tags: ["cuisine"] },
            { fr: "Merci après un repas", ko: "잘 먹었습니다", phonetic: "jal meogeosseumnida", difficulty: "easy", tags: ["cuisine"] }
        ];

    for (const entry of entries) {
        try {
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
            console.error(`Error insert "${entry.fr}"`, err);
        }
    }
}