import React from "react";
import { View, StyleSheet } from "react-native";
import MultiSelectPill from "./MultiSelectPill";
import type { Difficulty } from "@/types/Difficulty";

interface FilterBarProps {
    selectedDifficulties: Difficulty[];
    onToggleDifficulty: (diff: Difficulty) => void;
}

const difficultyOptions: { label: string; value: Difficulty; color: string }[] = [
    { label: "Facile", value: "easy", color: "green" },
    { label: "Moyen", value: "medium", color: "orange" },
    { label: "Difficile", value: "hard", color: "red" },
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