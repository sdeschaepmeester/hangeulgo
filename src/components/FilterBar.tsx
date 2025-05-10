import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MultiSelectPill from "./MultiSelectPill";
import type { Difficulty } from "@/types/Difficulty";

interface FilterBarProps {
    selectedDifficulties: Difficulty[];
    onToggleDifficulty: (diff: Difficulty) => void;
    sortOrder: "asc" | "desc";
    onToggleSortOrder: () => void;
}

const difficultyOptions: { label: string; value: Difficulty; color: string }[] = [
    { label: "Facile", value: "easy", color: "green" },
    { label: "Moyen", value: "medium", color: "orange" },
    { label: "Difficile", value: "hard", color: "red" },
];

export default function FilterBar({
    selectedDifficulties,
    onToggleDifficulty,
    sortOrder,
    onToggleSortOrder,
}: FilterBarProps) {
    return (
        <View style={styles.container}>
            <MultiSelectPill
                options={difficultyOptions}
                selectedValues={selectedDifficulties}
                onToggle={onToggleDifficulty}
            />

            <Pressable style={styles.sortButton} onPress={onToggleSortOrder}>
                <Text>Tri : {sortOrder === "asc" ? "A → Z" : "Z → A"}</Text>
            </Pressable>
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