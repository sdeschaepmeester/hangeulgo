import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "@/i18n";
import colors from "@/constants/colors";

type Props = {
    mode: "edit" | "select";
    allTags: string[];
    selectedTags: string[];
    onChange: (tags: string[]) => void;
    label?: string;
    withLimits?: boolean;
    focusOnTagsOnly?: (value: boolean) => void;
};

const MAX_TAGS_PER_WORD = 4;

export default function TagSelector({ mode, allTags, selectedTags, onChange, focusOnTagsOnly, label = i18n.t("lexicon.themes"), withLimits = true, }: Props) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isTouchingList, setIsTouchingList] = useState(false);

    useEffect(() => {
        open && focusOnTagsOnly?.(open);
    }, [open]);

    const filteredTags = useMemo(() => {
        const lower = input.toLowerCase();
        return allTags.filter((tag) => tag.toLowerCase().includes(lower));
    }, [input, allTags]);

    const canAddTag = !withLimits || selectedTags.length < MAX_TAGS_PER_WORD;

    const handleToggle = (tag: string) => {
        const isSelected = selectedTags.includes(tag);
        if (!isSelected && !canAddTag) return;

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
        if (!tag || selectedTags.includes(tag) || !canAddTag) return;

        onChange([...selectedTags, tag]);
        setInput("");
        setOpen(false);
        Keyboard.dismiss();
    };

    const handleRemove = (tag: string) => {
        onChange(selectedTags.filter((t) => t !== tag));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ width: "100%" }}
            >
                <View style={{ marginBottom: 16, width: "100%", flexShrink: 1 }}>
                    {label && <Text style={styles.label}>{label}</Text>}

                    {/* ------------ Input ------------ */}
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
                                    if (text.length <= 50) {
                                        setInput(text);
                                        setOpen(text.length > 0);
                                    }
                                }}
                                onFocus={() => setOpen(true)}
                                onBlur={() => {
                                    if (input.trim() === "" && !isTouchingList) {
                                        setOpen(false);
                                    }
                                }}
                                onSubmitEditing={handleAdd}
                                placeholder={i18n.t("addWord.addorsearch")}
                                placeholderTextColor={colors.neutral.main}
                                style={{ flex: 1, color: colors.neutral.black, backgroundColor: colors.neutral.white }}
                                maxLength={25}
                                editable={canAddTag}
                            />
                        ) : (
                            <Text style={{ color: colors.neutral.darker }}>
                                {selectedTags.length > 0
                                    ? selectedTags.join(", ")
                                    : i18n.t("noSelectedTheme")}
                            </Text>
                        )}

                        {mode === "select" && (
                            <MaterialCommunityIcons
                                name={open ? "chevron-up" : "chevron-down"}
                                size={20}
                            />
                        )}
                    </TouchableOpacity>

                    {/* ------------ Dropdown ------------ */}
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
                                nestedScrollEnabled={true}
                            >
                                {filteredTags.map((tag) => {
                                    const isSelected = selectedTags.includes(tag);
                                    const isDisabled = !isSelected && !canAddTag;
                                    return (
                                        <TouchableOpacity
                                            key={tag}
                                            style={[
                                                styles.tagItemFlat,
                                                isSelected && styles.tagItemSelected,
                                                isDisabled && { opacity: 0.3 },
                                            ]}
                                            onPress={() => handleToggle(tag)}
                                            disabled={isDisabled}
                                        >
                                            <Text style={{
                                                color: isSelected ? colors.neutral.white : colors.neutral.darker
                                            }}>
                                                {tag}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}

                                {mode === "edit" &&
                                    input.trim() !== "" &&
                                    !allTags.includes(input.trim()) &&
                                    canAddTag && (
                                        <TouchableOpacity
                                            onPress={handleAdd}
                                            style={styles.newTagButton}
                                        >
                                            <Text style={{ color: colors.neutral.darker }}>
                                                ➕ {i18n.t("actions.add")} {input.trim()}"
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                            </ScrollView>
                        </View>
                    )}

                    {/* ------------ Selected tags ------------ */}
                    {withLimits && selectedTags.length >= MAX_TAGS_PER_WORD && (
                        <Text style={{ color: colors.warning.lighter, fontSize: 13, marginTop: 6 }}>
                            {i18n.t("limits.limitOf")} {MAX_TAGS_PER_WORD} {i18n.t("limits.themeIsReached")}
                        </Text>
                    )}

                    {selectedTags.filter(Boolean).length > 0 && (
                        <View style={styles.selectedTagsContainer}>
                            {selectedTags.filter(Boolean).map((tag) => (
                                <View key={tag} style={styles.selectedTag}>
                                    <Text style={styles.selectedTagText}>{tag}</Text>
                                    <TouchableOpacity onPress={() => handleRemove(tag)}>
                                        <MaterialCommunityIcons
                                            name="close"
                                            size={16}
                                            color={colors.neutral.dark}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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
        borderColor: colors.neutral.light,
        backgroundColor: colors.neutral.white,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    tagItemFlat: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        backgroundColor: colors.neutral.white,
    },
    tagItemSelected: {
        backgroundColor: colors.primary.main,
        borderColor: colors.primary.main,
    },
    newTagButton: {
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.neutral.light,
        backgroundColor: colors.neutral.lightest,
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
        backgroundColor: colors.primary.lighter,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 6,
        marginBottom: 6,
    },
    selectedTagText: {
        fontSize: 13,
        color: colors.neutral.darker,
        marginRight: 6,
    },
    dropdown: {
        marginTop: 6,
        backgroundColor: colors.neutral.white,
        borderWidth: 1,
        borderColor: colors.neutral.lightest,
        borderRadius: 6,
        zIndex: 1,
        elevation: 3,
    },
});