import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import SelectPill from "@/components/SelectPill";
import type { Difficulty } from "@/types/Difficulty";
import TagSelector from "../tags/TagSelector";
import { getAllUniqueTags, isTagsLimitReached } from "@/services/tags";
import { suggestKoreanTranslation } from "@/services/translator";
import { saveWord, checkIfKoreanWordExists } from "@/services/lexicon";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import i18n from "@/i18n";

const difficulties = [
    { label: i18n.t("difficulties.easy"), value: "easy", color: "green" },
    { label: i18n.t("difficulties.medium"), value: "medium", color: "orange" },
    { label: i18n.t("difficulties.hard"), value: "hard", color: "red" },
];

const MIN_DELAY = 10000; // 10s cooldown

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
    const [koSuggested, setKoSuggested] = useState<string | null>(null);
    const [phonetic, setPhonetic] = useState(initialData?.phonetic || "");
    const [difficulty, setDifficulty] = useState<Difficulty>(initialData?.difficulty || "easy");
    const [tags, setTags] = useState(initialData?.tags || "");
    const [allTags, setAllTags] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [koreanExists, setKoreanExists] = useState(false);
    const [loadingSuggestion, setLoadingSuggestion] = useState(false);
    const [noSuggestionFound, setNoSuggestionFound] = useState(false);
    const [tagLimitReached, setTagLimitReached] = useState(false);
    const [lastSuggestionTime, setLastSuggestionTime] = useState<number | null>(null);

    const frRef = useRef<TextInput>(null);
    const koRef = useRef<TextInput>(null);
    const phoneticRef = useRef<TextInput>(null);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isValid = native.trim() && ko.trim();

    const cooldownActive =
        lastSuggestionTime !== null && Date.now() - lastSuggestionTime < MIN_DELAY;

    useEffect(() => {
        getAllUniqueTags().then(setAllTags);
        NetInfo.fetch().then((state) => {
            setIsConnected(state.isConnected === true);
        });
        isTagsLimitReached().then(setTagLimitReached);
    }, []);

    useEffect(() => {
        if (cooldownActive) {
            const timeout = setTimeout(() => {
                setLastSuggestionTime(null);
            }, MIN_DELAY - (Date.now() - (lastSuggestionTime ?? 0)));
            return () => clearTimeout(timeout);
        }
    }, [cooldownActive, lastSuggestionTime]);

    useEffect(() => {
        if (edit && initialData?.native.includes("(") && phonetic.trim()) {
            const baseFr = initialData.native.split("(")[0].trim();
            setFr(`${baseFr} (${phonetic.trim()})`);
        }
    }, [phonetic]);

    const handleKoreanSuggestion = async () => {
        if (!native.trim() || !isConnected || cooldownActive) return;

        setLastSuggestionTime(Date.now());
        setLoadingSuggestion(true);
        setNoSuggestionFound(false);

        const suggestion = await suggestKoreanTranslation(native.trim());
        setLoadingSuggestion(false);

        if (suggestion) {
            setKoSuggested(suggestion);
        } else {
            setNoSuggestionFound(true);
        }
    };

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
        setKoSuggested(null);
        setPhonetic("");
        setDifficulty("easy");
        setTags("");
        setKoreanExists(false);
    };

    return (
        <View style={styles.form}>
            {/* ----------------- French input ----------------- */}
            <View style={styles.field}>
                <Text style={styles.label}>{i18n.t("flag")} {i18n.t("nativeLang")}</Text>
                <TextInput
                    ref={frRef}
                    value={native}
                    onChangeText={(text) => {
                        if (text.length <= 50) {
                            setFr(text);
                            setKoSuggested(null);
                        }
                    }}
                    style={[styles.input, { backgroundColor: "#fff" }]}
                    placeholder={i18n.t("addWord.egfrinput")}
                    placeholderTextColor={"#696969"}
                    returnKeyType="next"
                    onSubmitEditing={() => koRef.current?.focus()}
                />
            </View>

            {/* ----------------- Azure korean translation suggestion ----------------- */}
            {isConnected && native.trim().length > 0 && !edit && (
                <>
                    {!koSuggested && !noSuggestionFound && (
                        <TouchableOpacity
                            style={[
                                styles.suggestionButton,
                                (loadingSuggestion || cooldownActive) && { opacity: 0.5 },
                            ]}
                            onPress={handleKoreanSuggestion}
                            disabled={loadingSuggestion || cooldownActive}
                        >
                            <Text style={styles.suggestionText}>
                                {loadingSuggestion
                                    ? i18n.t("addWord.searching")
                                    : cooldownActive
                                        ? i18n.t("addWord.waitBeforeAction")
                                        : i18n.t("addWord.suggestion")}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {noSuggestionFound && !loadingSuggestion && (
                        <Text style={styles.warningText}>❌ {i18n.t("addWord.noSuggestionFound")}</Text>
                    )}
                    {koSuggested && !loadingSuggestion && (
                        <TouchableOpacity
                            onPress={async () => {
                                setKo(koSuggested);
                                setKoSuggested(null);
                                const exists = await checkIfKoreanWordExists(koSuggested);
                                setKoreanExists(exists);
                            }}
                        >
                            <Text style={styles.suggestionBox}>
                                👉 {i18n.t("addWord.tapToFill")} {koSuggested}
                            </Text>
                        </TouchableOpacity>
                    )}
                </>
            )}

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
                    style={[styles.input, { backgroundColor: "#fff" }]}
                    placeholder={i18n.t("addWord.egkorean")}
                    placeholderTextColor={"#696969"}
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
                    style={[styles.input, { backgroundColor: "#fff" }]}
                    placeholder={i18n.t("addWord.phoneticPlaceholder")}
                    placeholderTextColor={"#696969"}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                />
            </View>

            {/* ----------------- Tags -----------------*/}
            {tagLimitReached && (
                <Text style={{ color: "#f57c00", fontSize: 13, marginBottom: 6 }}>
                    {i18n.t("addWord.cannotCreateTheme")}
                </Text>
            )}
            <TagSelector
                mode={tagLimitReached ? "select" : "edit"}
                allTags={allTags}
                selectedTags={tags.split(",").map((t) => t.trim()).filter(Boolean)}
                onChange={(newTags) => setTags(newTags.join(", "))}
            />

            {/* ----------------- Difficulty of word ----------------- */}
            <Text style={[styles.label, { marginTop: 16 }]}>{i18n.t("addWord.difficulty")}</Text>
            <SelectPill
                options={difficulties}
                selectedValue={difficulty}
                onSelect={(val) => setDifficulty(val as Difficulty)}
            />

            {/* ----------------- Actions buttons ----------------- */}
            <View style={styles.buttonsRow}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.cancelButton}
                >
                    <Text style={styles.cancelButtonText}>{i18n.t("actions.cancel")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.confirmButton, (!isValid || koreanExists) && styles.disabled]}
                    onPress={handleSubmit}
                    disabled={!isValid || koreanExists}
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
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
    },
    suggestionButton: {
        alignSelf: "flex-start",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginTop: -10,
        marginBottom: 6,
    },
    suggestionText: {
        color: "#333",
        fontSize: 14,
    },
    suggestionBox: {
        backgroundColor: "#e6f7ff",
        padding: 8,
        borderRadius: 6,
        marginBottom: 8,
        fontStyle: "italic",
    },
    warningText: {
        color: "#cc0000",
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
        backgroundColor: "#eee",
        borderRadius: 8,
    },
    cancelButtonText: {
        textAlign: "center",
        fontSize: 16,
        color: "#555",
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: "#9da7ff",
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
});
