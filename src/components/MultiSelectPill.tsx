import React from "react";
import { View, StyleSheet } from "react-native";
import Pill from "./Pill";
import type { Difficulty } from "@/types/Difficulty";

interface MultiSelectPillOption {
    label: string;
    value: Difficulty;
    color: string;
}

interface MultiSelectPillProps {
    options: MultiSelectPillOption[];
    selectedValues: Difficulty[];
    onToggle: (value: Difficulty) => void;
}

export default function MultiSelectPill({
    options,
    selectedValues,
    onToggle,
}: MultiSelectPillProps) {
    return (
        <View style={styles.container}>
            {options.map((opt) => (
                <Pill
                    key={opt.value}
                    label={opt.label}
                    color={opt.color}
                    selected={selectedValues.includes(opt.value)}
                    onClick={() => onToggle(opt.value)}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 8,
        marginVertical: 8,
        flexWrap: "wrap",
    },
});
