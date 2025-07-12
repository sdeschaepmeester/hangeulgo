import type { Lesson } from "@/types/Lesson";
import { VowelsComponent } from "@/components/lessons/alphabet/VowelsComponent";
import { syllableLesson } from "@/services/lessons";
import { SyllableIntroductionComponent } from "@/components/lessons/syllable/Introduction";
import { BatchimComponent } from "@/components/lessons/syllable/Batchim";

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
                component: SyllableIntroductionComponent,
            },
            {
                id: "syllable_batchim",
                title: syllableLesson.chapters[1].title,
                component: BatchimComponent,
            }
        ],
    };
}
