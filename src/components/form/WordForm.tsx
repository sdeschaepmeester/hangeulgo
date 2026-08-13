import React, { useState, useEffect, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, TextInput, TouchableOpacity, Keyboard, StyleSheet } from "react-native";
import SelectPill from "@/components/SelectPill";
import type { Difficulty } from "@/types/Difficulty";
import TagSelector from "../tags/TagSelector";
import { getAllUniqueTags, isTagsLimitReached } from "@/services/tags";
import { saveWord, checkIfKoreanWordExists } from "@/services/lexicon";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import i18n from "@/i18n";
import colors from "@/constants/colors";

const difficulties = [
    { label: i18n.t("difficulties.easy"), value: "easy", color: "green" },
    { label: i18n.t("difficulties.medium"), value: "medium", color: "orange" },
    { label: i18n.t("difficulties.hard"), value: "hard", color: "red" },
];

type Props = {
    edit: boolean;
    initialData?: {
        id: number;
        native: string;
        ko: string;
        phonetic?: string | null;
        tags?: string | null;
        difficulty: Difficulty;
    };
    onSuccess: () => void;
};

export default function WordForm({ edit, initialData, onSuccess }: Props) {
    const [native, setFr] = useState(initialData?.native || "");
    const [ko, setKo] = useState(initialData?.ko || "");
    const [phonetic, setPhonetic] = useState(initialData?.phonetic || "");
    const [difficulty, setDifficulty] = useState<Difficulty>(initialData?.difficulty || "easy");
    const [tags, setTags] = useState(initialData?.tags || "");
    const [allTags, setAllTags] = useState<string[]>([]);
    const [koreanExists, setKoreanExists] = useState(false);
    const [showOnlyTags, setShowOnlyTags] = useState(false);
    const [tagLimitReached, setTagLimitReached] = useState(false);
    const [showWarningWrongKorean, setShowWarningWrongKorean] = useState(false);

    const frRef = useRef<TextInput>(null);
    const koRef = useRef<TextInput>(null);
    const phoneticRef = useRef<TextInput>(null);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isValid = native.trim() && ko.trim();

    useEffect(() => {
        getAllUniqueTags().then(setAllTags);
        isTagsLimitReached().then(setTagLimitReached);
    }, []);

    useEffect(() => {
        if (edit && initialData?.native.includes("(") && phonetic.trim()) {
            const baseFr = initialData.native.split("(")[0].trim();
            setFr(`${baseFr} (${phonetic.trim()})`);
        }
    }, [phonetic]);

    // Check if Korean word exists in the lexicon. A korean word cannot be duplicated.
    const handleKoBlur = async () => {
        const trimmed = ko.trim();
        if (!trimmed) {
            setKoreanExists(false);
            return;
        }

        // If editing and the initial data is the same, skip the check
        if (edit && initialData?.ko.trim() === trimmed) {
            setKoreanExists(false);
            return;
        }

        const exists = await checkIfKoreanWordExists(trimmed);
        setKoreanExists(exists);

        // Check if korean input contains at least one korean character. Else, show warning
        const hasHangul = /[가-힣]/.test(trimmed);
        setShowWarningWrongKorean(!hasHangul);
    };


    const handleSubmit = async () => {
        if (!isValid || koreanExists) return;
        const cleanTags = tags.split(",").map((t) => t.trim()).filter(Boolean);

        await saveWord({
            native: native.trim(),
            ko: ko.trim(),
            phonetic: phonetic.trim(),
            difficulty,
            tags: cleanTags,
            edit,
            id: initialData?.id,
        });

        clearForm();
        getAllUniqueTags().then(setAllTags);
        onSuccess();
    };

    const clearForm = () => {
        setFr("");
        setKo("");
        setPhonetic("");
        setDifficulty("easy");
        setTags("");
        setKoreanExists(false);
    };

    return (
        <View style={styles.form}>
            {!showOnlyTags && (
                <>
                    {/* ----------------- French input ----------------- */}
                    <View style={styles.field}>
                        <Text style={styles.label}>{i18n.t("flag")} {i18n.t("nativeLang")}</Text>
                        <TextInput
                            ref={frRef}
                            value={native}
                            onChangeText={(text) => {
                                if (text.length <= 50) {
                                    setFr(text);
                                }
                            }}
                            style={[styles.input, { backgroundColor: colors.neutral.white }]}
                            placeholder={i18n.t("addWord.egfrinput")}
                            placeholderTextColor={colors.neutral.main}
                            returnKeyType="next"
                            onSubmitEditing={() => koRef.current?.focus()}
                        />
                    </View>
                    {/* ----------------- Korean input ----------------- */}
                    <View style={styles.field}>
                        <Text style={styles.label}>🇰🇷 {i18n.t("addWord.koinput")}</Text>
                        <TextInput
                            ref={koRef}
                            value={ko}
                            onChangeText={(text) => {
                                if (text.length <= 50) {
                                    setKo(text);
                                    setKoreanExists(false);
                                }
                            }}
                            onBlur={handleKoBlur}
                            style={[styles.input, { backgroundColor: colors.neutral.white }]}
                            placeholder={i18n.t("addWord.egkorean")}
                            placeholderTextColor={colors.neutral.main}
                            returnKeyType="next"
                            onSubmitEditing={() => phoneticRef.current?.focus()}
                        />
                        {koreanExists && (
                            <Text style={styles.warningText}>
                                {i18n.t("addWord.wordExists")}
                            </Text>
                        )}
                    </View>
                    {/* ----------------- Phonetic input ----------------- */}
                    <View style={styles.field}>
                        <Text style={styles.label}>{i18n.t("addWord.phonetic")}</Text>
                        <TextInput
                            ref={phoneticRef}
                            value={phonetic}
                            onChangeText={(text) => {
                                if (text.length <= 50) setPhonetic(text);
                            }}
                            style={[styles.input, { backgroundColor: colors.neutral.white }]}
                            placeholder={i18n.t("addWord.phoneticPlaceholder")}
                            placeholderTextColor={colors.neutral.main}
                            returnKeyType="done"
                            onSubmitEditing={Keyboard.dismiss}
                        />
                    </View>
                </>
            )}
            {showOnlyTags && (
                <TouchableOpacity
                    onPress={() => setShowOnlyTags(false)}
                    style={styles.toggleFullForm}
                >
                    <MaterialCommunityIcons
                        name="chevron-down"
                        size={24}
                        color={colors.primary.main}
                    />
                </TouchableOpacity>
            )}
            {/* ----------------- Tags -----------------*/}
            {tagLimitReached && (
                <Text style={{ color: colors.warning.lighter, fontSize: 13, marginBottom: 6 }}>
                    {i18n.t("addWord.cannotCreateTheme")}
                </Text>
            )}
            <TagSelector
                mode={tagLimitReached ? "select" : "edit"}
                allTags={allTags}
                selectedTags={tags.split(",").map((t) => t.trim()).filter(Boolean)}
                onChange={(newTags) => setTags(newTags.join(", "))}
                focusOnTagsOnly={(value) => setShowOnlyTags(value)}
            />

            {/* ----------------- Difficulty of word ----------------- */}
            <Text style={[styles.label, { marginTop: 16 }]}>{i18n.t("addWord.difficulty")}</Text>
            <SelectPill
                options={difficulties}
                selectedValue={difficulty}
                onSelect={(val) => setDifficulty(val as Difficulty)}
            />
            {/* ----------------- Warning input korean with no korean character ----------------- */}
            {showWarningWrongKorean && (
                <Text style={styles.warningText}>
                    {i18n.t("addWord.mustContainKorean")}
                </Text>
            )}
            {/* ----------------- Actions buttons ----------------- */}
            <View style={styles.buttonsRow}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.cancelButton}
                >
                    <Text style={styles.cancelButtonText}>{i18n.t("actions.cancel")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.confirmButton, (!isValid || koreanExists || showWarningWrongKorean) && styles.disabled]}
                    onPress={handleSubmit}
                    disabled={!isValid || koreanExists || showWarningWrongKorean}
                >
                    <Text style={styles.confirmButtonText}>
                        {edit ? i18n.t("actions.confirm") : i18n.t("actions.add")}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: { padding: 20, gap: 16 },
    field: { gap: 6 },
    label: { fontWeight: "bold", fontSize: 14 },
    input: {
        borderWidth: 1,
        borderColor: colors.neutral.light,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
    },
    warningText: {
        color: colors.danger.main,
        marginTop: 4,
        fontSize: 13,
        fontStyle: "italic",
    },
    buttonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 28,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: colors.neutral.lightest,
        borderRadius: 8,
    },
    cancelButtonText: {
        textAlign: "center",
        fontSize: 16,
        color: colors.neutral.dark,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: colors.primary.main,
        borderRadius: 8,
    },
    confirmButtonText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    disabled: {
        opacity: 0.4,
    },
    toggleFullForm: {
        marginTop: 8,
        alignSelf: "flex-start",
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: colors.neutral.lightest,
        borderRadius: 6,
        width: '100%'
    },
    toggleFullFormText: {
        color: colors.primary.main,
        fontSize: 14,
        fontWeight: "bold",
    },
});
