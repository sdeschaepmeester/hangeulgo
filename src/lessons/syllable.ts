import type { Lesson } from "@/types/Lesson";
import { SyllableIntroductionComponent } from "@/components/lessons/syllable/Introduction";
import { BatchimComponent } from "@/components/lessons/syllable/Batchim";

import fr from "@/i18n/lessons/syllable/fr.json";
import en from "@/i18n/lessons/syllable/en.json";

export function getSyllableLesson(locale: "fr" | "en"): Lesson {
    const content = locale === "fr" ? fr : en;

    return {
        id: "syllable",
        icon: "puzzle-outline",
        difficulty: "easy",
        description: content.lessons.syllable.description,
        title: content.lessons.syllable.title,
        chapters: [
            {
                id: "syllable_introduction",
                title: content.lessons.syllable.chapters[0].title,
                component: SyllableIntroductionComponent,
            },
            {
                id: "syllable_batchim",
                title: content.lessons.syllable.chapters[1].title,
                component: BatchimComponent,
            }
        ],
    };
}
