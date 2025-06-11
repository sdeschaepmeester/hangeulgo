import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    tags: string[];
    selectedTags: string[];
    onToggle: (tag: string) => void;
};

export default function TagSelector({ tags, selectedTags, onToggle }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Text style={styles.label}>Types de mots</Text>
            <TouchableOpacity
                onPress={() => setOpen((p) => !p)}
                style={[styles.tagItem, { flexDirection: "row", justifyContent: "space-between" }]}
            >
                <Text style={{ color: "#333" }}>
                    {selectedTags.length > 0 ? selectedTags.join(", ") : "Aucun mot clé sélectionné"}
                </Text>
                <MaterialCommunityIcons name={open ? "chevron-up" : "chevron-down"} size={20} />
            </TouchableOpacity>

            {open && (
                <View style={{ gap: 6, marginTop: 8 }}>
                    {tags.map((tag) => (
                        <TouchableOpacity
                            key={tag}
                            style={[
                                styles.tagItem,
                                selectedTags.includes(tag) && styles.tagItemSelected,
                            ]}
                            onPress={() => onToggle(tag)}
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
    }
});