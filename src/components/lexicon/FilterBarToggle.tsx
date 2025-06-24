import i18n from "@/i18n";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
    onToggleSort: () => void;
    onToggleFilter: () => void;
    isSortOpen: boolean;
    isFilterOpen: boolean;
};

export default function FilterBarToggle({
    onToggleSort,
    onToggleFilter,
    isSortOpen,
    isFilterOpen,
}: Props) {
    return (
        <View style={styles.row}>
            {/* ----------------- Main filter bar with two filters types  ----------------- */}
            <TouchableOpacity
                style={[styles.box, isSortOpen && styles.boxActive]}
                onPress={onToggleSort}
            >
                <Text style={[styles.text, isSortOpen && styles.textActive]}>{i18n.t("lexicon.order")}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
                style={[styles.box, isFilterOpen && styles.boxActive]}
                onPress={onToggleFilter}
            >
                <Text style={[styles.text, isFilterOpen && styles.textActive]}>{i18n.t("lexicon.filter")}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginBottom: 8,
    },
    box: {
        flex: 1,
        paddingVertical: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    boxActive: {
        backgroundColor: "#9da7ff",
    },
    text: {
        fontWeight: "500",
        color: "#333",
    },
    textActive: {
        color: "#fff",
    },
    divider: {
        width: 1,
        backgroundColor: "#ccc",
    },
});