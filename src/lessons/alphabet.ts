import { ConsonnantsComponent } from "@/components/lessons/alphabet/ConsonnantsComponent";
import { VowelsComponent } from "@/components/lessons/alphabet/VowelsComponent";
import { DoubleConsonnantsComponent } from "@/components/lessons/alphabet/DoubleConsonnantsComponent";
import { IeungComponent } from "@/components/lessons/alphabet/IeungComponent";
import type { Lesson } from "@/types/Lesson";

import fr from "@/i18n/lessons/alphabet/fr.json";
import en from "@/i18n/lessons/alphabet/en.json";

export function getAlphabetLesson(locale: "fr" | "en"): Lesson {
    const content = locale === "fr" ? fr : en;

    return {
        id: "alphabet",
        icon: "alpha-a-box-outline",
        difficulty: "easy",
        description: content.lessons.alphabet.description,
        title: content.lessons.alphabet.title,
        chapters: [
            {
                id: "alphabet_consonnants",
                title: content.lessons.alphabet.chapters[0].title,
                component: ConsonnantsComponent,
            },
            {
                id: "alphabet_vowels",
                title: content.lessons.alphabet.chapters[1].title,
                component: VowelsComponent,
            },
            {
                id: "alphabet_doubleconsonnants",
                title: content.lessons.alphabet.chapters[2].title,
                component: DoubleConsonnantsComponent,
            },
            {
                id: "ieung",
                title: content.lessons.alphabet.chapters[3].title,
                component: IeungComponent,
            },
        ],
    };
}
