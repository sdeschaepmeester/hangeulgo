import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

interface PillProps {
    label: string;
    color: string;
    selected?: boolean;
    onClick: () => void;
}

export default function Pill({ label, color, selected = false, onClick }: PillProps) {
    return (
        <Pressable
            onPress={onClick}
            style={[
                styles.pill,
                {
                    borderColor: color,
                    backgroundColor: selected ? color : "transparent",
                },
            ]}
        >
            <Text style={[styles.label, { color: selected ? "white" : color }]}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pill: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 4,
    },
    label: {
        fontWeight: "bold",
    },
});