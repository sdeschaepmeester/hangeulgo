import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard, FlatList, } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    mode: "edit" | "select";
    allTags: string[];
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    label?: string;
};

export default function TagSelector({
    mode,
    allTags,
    selectedTags,
    onChange,
    placeholder = "Ajouter ou rechercher un mot-clé...",
    label = "Mots-clés",
}: Props) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");

    const filteredTags = useMemo(() => {
        const lower = input.toLowerCase();
        return allTags.filter((tag) => tag.toLowerCase().includes(lower));
    }, [input, allTags]);

    const handleToggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onChange(selectedTags.filter((t) => t !== tag));
        } else {
            onChange([...selectedTags, tag]);
        }
        if (mode === "select") Keyboard.dismiss();
    };

    const handleAdd = () => {
        const tag = input.trim();
        if (!tag) return;

        if (!selectedTags.includes(tag)) {
            onChange([...selectedTags, tag]);
        }
        setInput("");
        setOpen(false);
        Keyboard.dismiss();
    };

    const handleRemove = (tag: string) => {
        onChange(selectedTags.filter((t) => t !== tag));
    };

    return (
        <View style={{ marginBottom: 16 }}>
            {label && <Text style={styles.label}>{label}</Text>}

            {/* -------------------- Input select tags -------------------- */}
            <TouchableOpacity
                activeOpacity={1}
                disabled={mode === "edit"}
                onPress={() => setOpen((prev) => !prev)}
                style={[styles.selectorInput, { flexDirection: "row", justifyContent: "space-between" }]}
            >
                {mode === "edit" ? (
                    <TextInput
                        value={input}
                        onChangeText={(text) => {
                            setInput(text);
                            setOpen(text.length > 0);
                        }}
                        onFocus={() => setOpen(true)}
                        onBlur={() => {
                            if (input.trim() === "") setOpen(false);
                        }}
                        onSubmitEditing={handleAdd}
                        placeholder={placeholder}
                        placeholderTextColor="#999"
                        style={{ flex: 1, color: "#000" }}
                    />
                ) : (
                    <Text style={{ color: "#333" }}>
                        {selectedTags.length > 0 ? selectedTags.join(", ") : "Aucun mot clé sélectionné"}
                    </Text>
                )}

                {mode === "select" && (
                    <MaterialCommunityIcons name={open ? "chevron-up" : "chevron-down"} size={20} />
                )}
            </TouchableOpacity>

            {/* -------------------- List of tags or create new tag -------------------- */}
            {open && (
                <FlatList
                    data={filteredTags}
                    keyExtractor={(tag) => tag}
                    style={{ marginTop: 8 }}
                    scrollEnabled={false}
                    renderItem={({ item: tag }) => (
                        <TouchableOpacity
                            style={[
                                styles.tagItem,
                                selectedTags.includes(tag) && styles.tagItemSelected,
                            ]}
                            onPress={() => handleToggle(tag)}
                        >
                            <Text style={{ color: selectedTags.includes(tag) ? "#fff" : "#333" }}>
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        mode === "edit" &&
                            input.trim() !== "" &&
                            !allTags.includes(input.trim()) ? (
                            <TouchableOpacity onPress={handleAdd} style={styles.newTagButton}>
                                <Text style={{ color: "#333" }}>➕ Ajouter "{input.trim()}"</Text>
                            </TouchableOpacity>
                        ) : null
                    }
                />
            )}

            {/* -------------------- Selected tags -------------------- */}
            {selectedTags.length > 0 && (
                <View style={styles.selectedTagsContainer}>
                    {selectedTags.map((tag) => (
                        <View key={tag} style={styles.selectedTag}>
                            <Text style={styles.selectedTagText}>{tag}</Text>
                            <TouchableOpacity onPress={() => handleRemove(tag)}>
                                <MaterialCommunityIcons name="close" size={16} color="#666" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontWeight: "bold",
        marginBottom: 6,
    },
    selectorInput: {
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
    },
    tagItem: {
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 6,
    },
    tagItemSelected: {
        backgroundColor: "#9da7ff",
        borderColor: "#9da7ff",
    },
    newTagButton: {
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#aaa",
        backgroundColor: "#f2f2f2",
        marginTop: 6,
    },
    selectedTagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 12,
    },
    selectedTag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e0e0ff",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 6,
        marginBottom: 6,
    },
    selectedTagText: {
        fontSize: 13,
        color: "#333",
        marginRight: 6,
    },
});