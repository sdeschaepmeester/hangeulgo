import React from "react";
import { View, StyleSheet } from "react-native";
import Pill from "./Pill";
import { Difficulty } from "@/types/Difficulty";

interface Option {
    label: string;
    value: Difficulty;
    color: string;
}

interface Props {
    options: Option[];
    selectedValues: Difficulty[];
    onToggle: (value: Difficulty) => void;
}

export default function SelectPillMultiple({
    options,
    selectedValues,
    onToggle,
}: Props) {
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
        flexWrap: "wrap",
        gap: 8,
        marginVertical: 8,
    },
});