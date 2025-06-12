import React from "react";
import { View, StyleSheet } from "react-native";
import FilterBar from "@/components/FilterBar";
import TagSelector from "../tags/TagSelector";
import type { Difficulty } from "@/types/Difficulty";

type Props = {
    selectedDifficulties: Difficulty[];
    onToggleDifficulty: (diff: Difficulty) => void;
    sortOrder: "asc" | "desc";
    onToggleSortOrder: () => void;
    allTags: string[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
};

export default function LexiconFilters({ selectedDifficulties, onToggleDifficulty, sortOrder, onToggleSortOrder, allTags, selectedTags, onToggleTag, }: Props) {
    return (
        <View style={styles.container}>
            {/* ----------------- Filter by difficulty and sort ----------------- */}
            <FilterBar
                selectedDifficulties={selectedDifficulties}
                onToggleDifficulty={onToggleDifficulty}
                sortOrder={sortOrder}
                onToggleSortOrder={onToggleSortOrder}
            />

            {/* ----------------- Filter by tags ----------------- */}
            <TagSelector
                mode="select"
                allTags={allTags}
                selectedTags={selectedTags}
                onChange={(tags: string[]) => {
                    tags.forEach((tag) => {
                        if (!selectedTags.includes(tag)) onToggleTag(tag);
                    });

                    selectedTags.forEach((tag) => {
                        if (!tags.includes(tag)) onToggleTag(tag);
                    });
                }}
                label="Types de mots"
                placeholder="Rechercher ou sélectionner..."
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderBottomWidth: 1,
        borderColor: "#ddd",
        gap: 12,
    },
});
