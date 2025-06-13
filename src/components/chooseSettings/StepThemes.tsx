import React from "react";
import { Text, StyleSheet } from "react-native";
import TagSelector from "@/components/tags/TagSelector";

type Props = {
    allTags: string[];
    selectedTags: string[];
    onChange: (tags: string[]) => void;
};

export default function StepThemes({ allTags, selectedTags, onChange }: Props) {
    return (
        <>
            <Text style={styles.label}>Thèmes</Text>
            <TagSelector mode="select" allTags={allTags} selectedTags={selectedTags} onChange={onChange} />
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        fontWeight: "bold",
        color: "grey",
        fontSize: 24
    },
});