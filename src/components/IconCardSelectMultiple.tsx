import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { ReactNode } from "react";
import colors from "@/constants/colors";

interface Option<T> {
    label: string;
    value: T;
    icon: ReactNode;
}

interface Props<T> {
    options: Option<T>[];
    selectedValues: T[];
    onToggle: (value: T) => void;
    disabledValues?: T[];
}

export default function IconCardSelectMultiple<T>({ options, selectedValues, onToggle, disabledValues = [], }: Props<T>) {
    // Automatically select the only enabled option if there's only one available
    useEffect(() => {
        const enabledOptions = options.filter(
            (opt) => !disabledValues.includes(opt.value)
        );
        if (enabledOptions.length === 1 && !selectedValues.includes(enabledOptions[0].value)) {
            onToggle(enabledOptions[0].value);
        }
    }, [options, disabledValues]);

    return (
        <View style={styles.container}>
            {options.map((opt) => {
                const selected = selectedValues.includes(opt.value);
                const isDisabled = disabledValues.includes(opt.value);
                return (
                    <TouchableOpacity
                        key={String(opt.value)}
                        style={[
                            styles.card,
                            selected && styles.selectedCard,
                            isDisabled && styles.disabledCard,
                        ]}
                        onPress={!isDisabled ? () => onToggle(opt.value) : undefined}
                        activeOpacity={isDisabled ? 1 : 0.7}
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
        backgroundColor: colors.neutral.lightest,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        width: 100,
        height: 100,
        justifyContent: "center",
    },
    selectedCard: {
        backgroundColor: colors.primary.light,
    },
    disabledCard: {
        opacity: 0.4,
    },
    icon: {
        marginBottom: 8,
    },
    label: {
        textAlign: "center",
        fontWeight: "bold",
    },
});