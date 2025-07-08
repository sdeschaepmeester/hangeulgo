import { Difficulty } from "./Difficulty";

export interface Chapter {
    id: string;
    title: string;
    content?: string;
    component?: React.FC<any>;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    icon: string;
    difficulty: Difficulty;
    chapters: Chapter[];
}
