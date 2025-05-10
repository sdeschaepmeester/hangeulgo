import React from "react";
import { View, StyleSheet } from "react-native";
import Pill from "./Pill";

interface SelectPillOption {
    label: string;
    value: string;
    color: string;
}

interface SelectPillProps {
    options: SelectPillOption[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

export default function SelectPill({ options, selectedValue, onSelect }: SelectPillProps) {
    return (
        <View style={styles.container}>
            {options.map((opt) => (
                <Pill
                    key={opt.value}
                    label={opt.label}
                    color={opt.color}
                    selected={opt.value === selectedValue}
                    onClick={() => onSelect(opt.value)}
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
    },
});