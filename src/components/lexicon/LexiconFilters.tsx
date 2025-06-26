import React from "react";
import { View, StyleSheet } from "react-native";
import FilterBar from "@/components/FilterBar";
import TagSelector from "../tags/TagSelector";
import type { Difficulty } from "@/types/Difficulty";
import colors from "@/constants/colors";

type Props = {
    selectedDifficulties: Difficulty[];
    onToggleDifficulty: (diff: Difficulty) => void;
    allTags: string[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
};

export default function LexiconFilters({ selectedDifficulties, onToggleDifficulty, allTags, selectedTags, onToggleTag, }: Props) {
    return (
        <View style={styles.container}>
            {/* ----------------- Filter by difficulty and sort ----------------- */}
            <FilterBar
                selectedDifficulties={selectedDifficulties}
                onToggleDifficulty={onToggleDifficulty}
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
                withLimits={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: colors.secondary.lightest,
        borderBottomWidth: 1,
        borderColor: colors.neutral.lighter,
        gap: 12,
    },
});
