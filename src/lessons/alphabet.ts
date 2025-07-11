import { ConsonnantsComponent } from "@/components/lessons/alphabet/ConsonnantsComponent";
import type { Lesson } from "@/types/Lesson";
import { getLessonTranslation } from "@/services/lessons";
import { VowelsComponent } from "@/components/lessons/alphabet/VowelsComponent";
import { DoubleConsonnantsComponent } from "@/components/lessons/alphabet/DoubleConsonnantsComponent";

export function getAlphabetLesson(): Lesson {
    const localLesson = getLessonTranslation("alphabet");
    if (!localLesson) {
        throw new Error("No translation found for alphabet lesson.");
    }

    return {
        id: "alphabet",
        icon: "alpha-a-box-outline",
        difficulty: "easy",
        description: localLesson.description,
        title: localLesson.title,
        chapters: [
            {
                id: "alphabet_consonnants",
                title: localLesson.chapters[0].title,
                component: ConsonnantsComponent,
            },
            {
                id: "alphabet_vowels",
                title: localLesson.chapters[1].title,
                component: VowelsComponent,
            },
            {
                id: "alphabet_doubleconsonnants",
                title: localLesson.chapters[2].title,
                component: DoubleConsonnantsComponent,
            },
        ],
    };
}
