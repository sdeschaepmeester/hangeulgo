import React, { useState } from "react";
import { View, Text, Switch, Pressable, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, ScrollView, Platform, } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WordForm from "../form/WordForm";
import type { Difficulty } from "@/types/Difficulty";
import * as Speech from "expo-speech";
import i18n from "@/i18n";
import colors from "@/constants/colors";

type Props = {
    id: number;
    native: string;
    ko: string;
    phonetic?: string | null;
    tags?: string | null;
    difficulty: Difficulty;
    active: number;
    onToggle: () => void;
    onDelete: () => void;
    onUpdate: (id: number) => void;
};
export default React.memo(function LexiconCard({ id, native, ko, phonetic, tags, difficulty, active, onToggle, onDelete, onUpdate, }: Props) {
    const [showEdit, setShowEdit] = useState(false);
    const [isSpeaking, setIsSpeaking] = React.useState(false);

    // Phone plays the korean word
    const handleSpeak = () => {
        setIsSpeaking(true);
        Speech.speak(ko, {
            language: "ko-KR",
            rate: 0.9,
            pitch: 1.0,
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                {/* ----------------- Left content texts ----------------- */}
                <View style={styles.texts}>
                    <Text style={[styles.native, { color: difficultyColor(difficulty) }]}>
                        {i18n.t("flag")} {native}
                    </Text>
                    <Text style={styles.ko}>
                        🇰🇷 {ko}
                        {phonetic ? (
                            <Text style={styles.phoneticInline}> ({phonetic})</Text>
                        ) : null}
                    </Text>
                    {tags && (
                        <View style={styles.tagsContainer}>
                            <Text style={styles.tagsLabel}>{i18n.t("lexicon.themes")}{i18n.t("colon")}</Text>
                            <View style={styles.tagsRow}>
                                {tags.split(",").map((tag) => (
                                    <View key={tag.trim()} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag.trim()}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {/* ----------------- Actions section ----------------- */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[
                            styles.listenButton,
                            isSpeaking && styles.listenButtonSpeaking,
                        ]}
                        onPress={handleSpeak}
                    >
                        <View style={styles.listenContent}>
                            <MaterialCommunityIcons
                                name="volume-high"
                                size={20}
                                color={isSpeaking ? colors.neutral.white : colors.neutral.darker}
                            />
                            <Text style={[
                                styles.listenText,
                                isSpeaking && { color: colors.neutral.white }
                            ]}>
                                {isSpeaking ? i18n.t("lexicon.isListening") : i18n.t("lexicon.listen")} 
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.switchRow}>
                        <Text style={styles.switchLabel}>{i18n.t("lexicon.activated")}</Text>
                        <Switch value={active === 1} onValueChange={onToggle} />
                    </View>

                    <View style={styles.iconRow}>
                        <Pressable onPress={onDelete}>
                            <MaterialCommunityIcons
                                name="trash-can-outline"
                                size={24}
                                color={colors.danger.light}
                            />
                        </Pressable>
                        <Pressable onPress={() => setShowEdit(true)}>
                            <MaterialCommunityIcons
                                name="pencil-outline"
                                size={24}
                                color={colors.neutral.dark}
                            />
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* ----------------- Edit word modale  ----------------- */}
            <Modal visible={showEdit} animationType="slide" presentationStyle="formSheet">
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                        <Text style={styles.title}>{i18n.t("editWord.title")}</Text>
                        <WordForm
                            edit
                            initialData={{
                                id,
                                native,
                                ko,
                                phonetic: phonetic ?? "",
                                tags: tags ?? "",
                                difficulty,
                            }}
                            onSuccess={() => {
                                setShowEdit(false);
                                onUpdate(id);
                            }}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
})

function difficultyColor(difficulty: Difficulty) {
    switch (difficulty) {
        case "easy":
            return "green";
        case "medium":
            return "orange";
        case "hard":
            return "red";
        default:
            return "black";
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.neutral.white,
        padding: 16,
        marginBottom: 12,
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
        borderWidth: 1,
        borderColor: colors.neutral.light,
        borderRadius: 12,
        overflow: "hidden",
    },
    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    texts: {
        flex: 1,
        gap: 4,
    },
    native: {
        fontSize: 16,
        fontWeight: "bold",
    },
    ko: {
        fontSize: 16,
    },
    phoneticInline: {
        fontSize: 13,
        color: colors.neutral.main,
        fontStyle: "italic",
    },
    tagsContainer: {
        marginTop: 6,
    },
    tagsLabel: {
        fontSize: 13,
        fontWeight: "bold",
        color: colors.neutral.dark,
        marginBottom: 4,
    },
    tagsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    tag: {
        backgroundColor: colors.primary.lighter,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    tagText: {
        fontSize: 12,
        color: colors.neutral.darker,
    },
    actions: {
        alignItems: "center",
    },
    listenButton: {
        width: "100%",
        backgroundColor: colors.primary.lighter,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    listenButtonSpeaking: {
        backgroundColor: colors.primary.main,
    },
    listenContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    listenText: {
        fontSize: 14,
        color: colors.neutral.darker,
        fontWeight: "500",
    },
    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },
    switchLabel: {
        fontSize: 14,
        color: colors.neutral.dark,
        fontWeight: "500",
    },
    iconRow: {
        flexDirection: "row",
        gap: 16,
        marginTop: 8,
    },
    title: { fontSize: 22, fontWeight: "bold" },
});