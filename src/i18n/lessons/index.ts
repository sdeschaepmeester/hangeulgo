import type { Lesson } from "@/types/Lesson";
import { getAlphabetLesson } from "@/lessons/alphabet";

type LessonFactory = (locale: "fr" | "en") => Lesson;

export type LessonsMap = {
    [key: string]: LessonFactory;
};

export const lessonsMap: LessonsMap = {
    alphabet: getAlphabetLesson,
};
