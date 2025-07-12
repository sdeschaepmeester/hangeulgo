import { ConsonnantsComponent } from "@/components/lessons/alphabet/ConsonnantsComponent";
import type { Lesson } from "@/types/Lesson";
import { VowelsComponent } from "@/components/lessons/alphabet/VowelsComponent";
import { DoubleConsonnantsComponent } from "@/components/lessons/alphabet/DoubleConsonnantsComponent";
import { alphabetLesson } from "@/services/lessons";
import { IeungComponent } from "@/components/lessons/alphabet/IeungComponent";

export function getAlphabetLesson(): Lesson {

    return {
        id: "alphabet",
        icon: "alpha-a-box-outline",
        difficulty: "easy",
        description: alphabetLesson.description,
        title: alphabetLesson.title,
        chapters: [
            {
                id: "alphabet_consonnants",
                title: alphabetLesson.chapters[0].title,
                component: ConsonnantsComponent,
            },
            {
                id: "alphabet_vowels",
                title: alphabetLesson.chapters[1].title,
                component: VowelsComponent,
            },
            {
                id: "alphabet_doubleconsonnants",
                title: alphabetLesson.chapters[2].title,
                component: DoubleConsonnantsComponent,
            },
            {
                id: "ieung",
                title: alphabetLesson.chapters[3].title,
                component: IeungComponent,
            },
        ],
    };
}
