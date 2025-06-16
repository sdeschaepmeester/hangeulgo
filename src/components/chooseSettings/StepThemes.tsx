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
        <TextWrapper>
            <Text style={styles.label}>Thèmes</Text>
            <TagSelector
                mode="select"
                allTags={allTags}
                selectedTags={selectedTags}
                onChange={onChange}
            />
        </TextWrapper>
    );
}

const TextWrapper = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
);

const styles = StyleSheet.create({
    label: {
        fontWeight: "bold",
        color: "grey",
        fontSize: 24
    },
    wrapper: {
        position: "absolute",
        top: "25%",
        left: 20,
        right: 20,
        alignItems: "center",
    },
});