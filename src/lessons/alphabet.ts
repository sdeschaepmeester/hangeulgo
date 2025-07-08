import { ConsonnesComponent } from "@/components/lessons/ConsonnantsComponent";
import fr from "@/i18n/lessons/alphabet/fr.json";
import en from "@/i18n/lessons/alphabet/en.json";
import type { Lesson } from "@/types/Lesson";
import i18n from "@/i18n";

const translations = {
    fr: fr.lessons.alphabet,
    en: en.lessons.alphabet,
};

export function getAlphabetLesson(): Lesson {
    const locale = i18n.locale;
    const localLesson = locale === "fr" ? translations.fr : translations.en;

    return {
        id: "alphabet",
        icon: "🅰️",
        difficulty: "easy",
        title: localLesson.title,
        chapters: [
            {
                id: "alphabet_consonnants",
                title: localLesson.chapters[0].title,
                component: ConsonnesComponent,
            },
            {
                id: "alphabet_vowels",
                title: localLesson.chapters[1].title,
                content: localLesson.chapters[1].content,
            },
            {
                id: "alphabet_doubleconsonnants",
                title: localLesson.chapters[2].title,
                content: localLesson.chapters[2].content,
            },
        ],
    };
}
