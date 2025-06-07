import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import FilterBar from "@/components/FilterBar";
import SelectKeywords from "@/components/inputs/SelectKeywords";
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

export default function LexiconFilters({
    selectedDifficulties,
    onToggleDifficulty,
    sortOrder,
    onToggleSortOrder,
    allTags,
    selectedTags,
    onToggleTag,
}: Props) {
    const [showTags, setShowTags] = useState(false);

    return (
        <View style={styles.container}>
            {/* ----------------- Filter by name (asc desc)  ----------------- */}
            <FilterBar
                selectedDifficulties={selectedDifficulties}
                onToggleDifficulty={onToggleDifficulty}
                sortOrder={sortOrder}
                onToggleSortOrder={onToggleSortOrder}
            />
            {/* ----------------- Filter by difficulty and tags  ----------------- */}
            <SelectKeywords
                allTags={allTags}
                selectedTags={selectedTags}
                onToggleTag={onToggleTag}
                show={showTags}
                onToggleShow={() => setShowTags((prev) => !prev)}
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