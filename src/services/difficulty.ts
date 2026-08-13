import i18n from "@/i18n";
import { Difficulty } from "@/types/Difficulty";


export const difficultyOptions = [
    {
        label: i18n.t("difficulties.easy"),
        value: "easy" as Difficulty,
        color: "#4CAF50", 
    },
    {
        label: i18n.t("difficulties.medium"),
        value: "medium" as Difficulty,
        color: "#FF9800",
    },
    {
        label: i18n.t("difficulties.hard"),
        value: "hard" as Difficulty,
        color: "#F44336",
    },
];

export function getDifficultyLabel(value: Difficulty): string {
    const found = difficultyOptions.find((option) => option.value === value);
    return found ? found.label : value;
}

export function getDifficultyColor(value: Difficulty): string {
    const found = difficultyOptions.find((option) => option.value === value);
    return found ? found.color : "#000";
}