import { ConsonnantsComponent } from "@/components/lessons/alphabet/ConsonnantsComponent";
import type { Lesson } from "@/types/Lesson";
import { VowelsComponent } from "@/components/lessons/alphabet/VowelsComponent";
import { syllableLesson } from "@/services/lessons";

export function getSyllableLesson(): Lesson {
    return {
        id: "syllable",
        icon: "puzzle-outline",
        difficulty: "easy",
        description: syllableLesson.description,
        title: syllableLesson.title,
        chapters: [
            {
                id: "syllable_introduction",
                title: syllableLesson.chapters[0].title,
                component: ConsonnantsComponent,
            },
            {
                id: "syllable_batchim",
                title: syllableLesson.chapters[1].title,
                component: VowelsComponent,
            }
        ],
    };
}
