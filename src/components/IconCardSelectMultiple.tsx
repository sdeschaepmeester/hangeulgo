import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { ReactNode } from "react";

interface Option<T> {
    label: string;
    value: T;
    icon: ReactNode;
}

interface Props<T> {
    options: Option<T>[];
    selectedValues: T[];
    onToggle: (value: T) => void;
}

export default function IconCardSelectMultiple<T>({ options, selectedValues, onToggle }: Props<T>) {
    return (
        <View style={styles.container}>
            {options.map((opt) => {
                const selected = selectedValues.includes(opt.value);
                return (
                    <TouchableOpacity
                        key={String(opt.value)}
                        style={[styles.card, selected && styles.selectedCard]}
                        onPress={() => onToggle(opt.value)}
                    >
                        <View style={styles.icon}>{opt.icon}</View>
                        <Text style={styles.label}>{opt.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 12,
        marginVertical: 12,
    },
    card: {
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        width: 100,
        height: 100,
        justifyContent: "center",
    },
    selectedCard: {
        backgroundColor: "#d4dbff",
    },
    icon: {
        marginBottom: 8,
    },
    label: {
        textAlign: "center",
        fontWeight: "bold",
    },
});