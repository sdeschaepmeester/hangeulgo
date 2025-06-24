import React from "react";
import { View, StyleSheet } from "react-native";
import MultiSelectPill from "./MultiSelectPill";
import type { Difficulty } from "@/types/Difficulty";
import i18n from "@/i18n";

interface FilterBarProps {
    selectedDifficulties: Difficulty[];
    onToggleDifficulty: (diff: Difficulty) => void;
}

const difficultyOptions: { label: string; value: Difficulty; color: string }[] = [
    { label: i18n.t("difficulties.easy"), value: "easy", color: "green" },
    { label: i18n.t("difficulties.medium"), value: "medium", color: "orange" },
    { label: i18n.t("difficulties.hard"), value: "hard", color: "red" },
];

export default function FilterBar({
    selectedDifficulties,
    onToggleDifficulty
}: FilterBarProps) {
    return (
        <View style={styles.container}>
            {/* Filter by difficulty */}
            <MultiSelectPill
                options={difficultyOptions}
                selectedValues={selectedDifficulties}
                onToggle={onToggleDifficulty}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        gap: 8,
    },
    sortButton: {
        alignSelf: "flex-start",
        marginTop: 4,
    },
});