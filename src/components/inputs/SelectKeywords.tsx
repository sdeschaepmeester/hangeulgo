import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    allTags: string[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
    show: boolean;
    onToggleShow: () => void;
};

export default function SelectKeywords({
    allTags,
    selectedTags,
    onToggleTag,
    show,
    onToggleShow,
}: Props) {
    return (
        <>
            <Text style={styles.label}>Types de mots</Text>
            <TouchableOpacity
                onPress={onToggleShow}
                style={[styles.tagItem, { flexDirection: "row", justifyContent: "space-between" }]}
            >
                <Text style={{ color: "#333" }}>
                    {selectedTags.length > 0 ? selectedTags.join(", ") : "Aucun mot clé sélectionné"}
                </Text>
                <MaterialCommunityIcons name={show ? "chevron-up" : "chevron-down"} size={20} />
            </TouchableOpacity>

            {show && (
                <View style={{ gap: 6, marginTop: 8 }}>
                    {allTags.map((tag) => (
                        <TouchableOpacity
                            key={tag}
                            style={[
                                styles.tagItem,
                                selectedTags.includes(tag) && styles.tagItemSelected,
                            ]}
                            onPress={() => onToggleTag(tag)}
                        >
                            <Text style={{ color: selectedTags.includes(tag) ? "white" : "#333" }}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        fontWeight: "bold",
    },
    tagItem: {
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    tagItemSelected: {
        backgroundColor: "#9da7ff",
        borderColor: "#9da7ff",
    },
});