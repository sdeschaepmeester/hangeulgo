import colors from "@/constants/colors";
import i18n from "@/i18n";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from "react-native";

type Props = {
    currentOrder: "asc" | "desc";
    onChange: (order: "asc" | "desc") => void;
};

export default function SortOptions({ currentOrder, onChange }: Props) {
    const [open, setOpen] = useState(false);

    const labelFromValue = (value: "asc" | "desc") =>
        value === "asc" ? "A → Z" : "Z → A";

    return (
        <View style={styles.container}>
            {/* ----------------- Sort by label  ----------------- */}
            <Text style={styles.label}>{i18n.t("lexicon.alphabeticalOrder")}{i18n.t("colon")}</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setOpen(true)}>
                <Text style={styles.dropdownText}>
                    {labelFromValue(currentOrder)}
                </Text>
            </TouchableOpacity>

            {/* ----------------- Sort by options  ----------------- */}
            {open && (
                < Modal transparent animationType="fade">
                    <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
                        <View style={styles.dropdownMenu}>
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    onChange("asc");
                                    setOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>A → Z</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    onChange("desc");
                                    setOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownItemText}>Z → A</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>
            )
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: colors.secondary.lightest,
        borderBottomWidth: 1,
        borderColor: colors.neutral.lighter,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        color: colors.neutral.darker,
    },
    dropdown: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.neutral.light,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: colors.neutral.white,
    },
    dropdownText: {
        fontSize: 16,
        color: colors.neutral.darker,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 40,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    dropdownMenu: {
        backgroundColor: colors.neutral.white,
        borderRadius: 6,
        overflow: "hidden",
        elevation: 4,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: colors.neutral.lightest,
    },
    dropdownItemText: {
        fontSize: 16,
        color: colors.neutral.darker,
    },
});