import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard, ScrollView, } from "react-native";
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
    const [isTouchingList, setIsTouchingList] = useState(false);

    const filteredTags = useMemo(() => {
        const lower = input.toLowerCase();
        return allTags.filter((tag) => tag.toLowerCase().includes(lower));
    }, [input, allTags]);

    const handleToggle = (tag: string) => {
        const isSelected = selectedTags.includes(tag);
        const newTags = isSelected
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag];

        onChange(newTags);

        if (mode === "edit") {
            setInput("");
            setOpen(false);
            Keyboard.dismiss();
        } else {
            Keyboard.dismiss();
        }
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
        <View style={{ marginBottom: 16, width: "100%", position: "relative", zIndex: 10 }}>
            {label && <Text style={styles.label}>{label}</Text>}

            {/* --------------- Input zone --------------- */}
            <TouchableOpacity
                activeOpacity={1}
                disabled={mode === "edit"}
                onPress={() => setOpen((prev) => !prev)}
                style={styles.selectorInput}
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
                            if (input.trim() === "" && !isTouchingList) {
                                setOpen(false);
                            }
                        }}
                        onSubmitEditing={handleAdd}
                        placeholder={placeholder}
                        placeholderTextColor="#999"
                        style={{ flex: 1, color: "#000" }}
                    />
                ) : (
                    <Text style={{ color: "#333" }}>
                        {selectedTags.length > 0
                            ? selectedTags.join(", ")
                            : "Aucun mot clé sélectionné"}
                    </Text>
                )}

                {mode === "select" && (
                    <MaterialCommunityIcons
                        name={open ? "chevron-up" : "chevron-down"}
                        size={20}
                    />
                )}
            </TouchableOpacity>

            {/* --------------- Tag list --------------- */}
            {open && (
                <View
                    style={styles.dropdown}
                    onTouchStart={() => setIsTouchingList(true)}
                    onTouchEnd={() => setTimeout(() => setIsTouchingList(false), 100)}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        style={{ maxHeight: 200 }}
                        contentContainerStyle={{ paddingVertical: 4 }}
                    >
                        {filteredTags.map((tag) => (
                            <TouchableOpacity
                                key={tag}
                                style={[
                                    styles.tagItemFlat,
                                    selectedTags.includes(tag) && styles.tagItemSelected,
                                ]}
                                onPress={() => handleToggle(tag)}
                            >
                                <Text
                                    style={{
                                        color: selectedTags.includes(tag) ? "#fff" : "#333",
                                    }}
                                >
                                    {tag}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {mode === "edit" &&
                            input.trim() !== "" &&
                            !allTags.includes(input.trim()) && (
                                <TouchableOpacity onPress={handleAdd} style={styles.newTagButton}>
                                    <Text style={{ color: "#333" }}>➕ Ajouter "{input.trim()}"</Text>
                                </TouchableOpacity>
                            )}
                    </ScrollView>
                </View>
            )}

            {/* Selected tags */}
            {selectedTags.filter(Boolean).length > 0 && (
                <View style={styles.selectedTagsContainer}>
                    {selectedTags.filter(Boolean).map((tag) => (
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    tagItemFlat: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
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
        marginHorizontal: 8,
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
    dropdown: {
        position: "absolute",
        top: 48,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 6,
        zIndex: 10,
        elevation: 5,
    },
});