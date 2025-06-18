import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Keyboard, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import SelectPill from "@/components/SelectPill";
import type { Difficulty } from "@/types/Difficulty";
import TagSelector from "../tags/TagSelector";
import { getAllUniqueTags } from "@/services/tags";
import { suggestKoreanTranslation } from "@/services/translator";
import { saveWord, checkIfKoreanWordExists } from "@/services/lexicon";

const difficulties = [
    { label: "Facile", value: "easy", color: "green" },
    { label: "Moyen", value: "medium", color: "orange" },
    { label: "Difficile", value: "hard", color: "red" },
];

type Props = {
    edit: boolean;
    initialData?: {
        id: number;
        fr: string;
        ko: string;
        phonetic?: string | null;
        tags?: string | null;
        difficulty: Difficulty;
    };
    onSuccess: () => void;
};

export default function WordForm({ edit, initialData, onSuccess }: Props) {
    const [fr, setFr] = useState(initialData?.fr || "");
    const [ko, setKo] = useState(initialData?.ko || "");
    const [koSuggested, setKoSuggested] = useState<string | null>(null);
    const [phonetic, setPhonetic] = useState(initialData?.phonetic || "");
    const [difficulty, setDifficulty] = useState<Difficulty>(initialData?.difficulty || "easy");
    const [tags, setTags] = useState(initialData?.tags || "");
    const [allTags, setAllTags] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [koreanExists, setKoreanExists] = useState(false);

    const frRef = useRef<TextInput>(null);
    const koRef = useRef<TextInput>(null);
    const phoneticRef = useRef<TextInput>(null);

    const isValid = fr.trim() && ko.trim();

    useEffect(() => {
        getAllUniqueTags().then(setAllTags);
        NetInfo.fetch().then((state) => {
            setIsConnected(state.isConnected === true);
        });
    }, []);

    const applySuggestion = async (tag: string) => {
        const parts = tags.split(",").map((t) => t.trim());
        parts[parts.length - 1] = tag;
        setTags(parts.join(", ") + ", ");
        setSuggestions([]);
    };

    const handleKoBlur = async () => {
        if (!ko.trim()) {
            setKoreanExists(false);
            return;
        }
        const exists = await checkIfKoreanWordExists(ko.trim());
        setKoreanExists(exists);
    };

    const handleSubmit = async () => {
        if (!isValid || koreanExists) return;
        const cleanTags = tags.split(",").map((t) => t.trim()).filter(Boolean);

        await saveWord({
            fr: fr.trim(),
            ko: ko.trim(),
            phonetic: phonetic.trim(),
            difficulty,
            tags: cleanTags,
            edit,
            id: initialData?.id,
        });

        clearForm();
        onSuccess();
    };

    const handleKoreanSuggestion = async () => {
        if (!fr.trim() || !isConnected) return;
        const suggestion = await suggestKoreanTranslation(fr.trim());
        if (suggestion) setKoSuggested(suggestion);
    };

    const clearForm = () => {
        setFr("");
        setKo("");
        setKoSuggested(null);
        setPhonetic("");
        setDifficulty("easy");
        setTags("");
        setSuggestions([]);
        setKoreanExists(false);
    };

    return (
        <View style={styles.form}>
            {/* ----------------- French input ----------------- */}
            <View style={styles.field}>
                <Text style={styles.label}>🇫🇷 Français</Text>
                <TextInput
                    ref={frRef}
                    value={fr}
                    onChangeText={(text) => {
                        setFr(text);
                        setKoSuggested(null);
                    }}
                    style={styles.input}
                    placeholder="Ex : Bonjour"
                    placeholderTextColor={"#696969"}
                    returnKeyType="next"
                    onSubmitEditing={() => koRef.current?.focus()}
                />
            </View>

            {/* ----------------- Azure korean suggestion if online ----------------- */}
            {isConnected && fr.trim().length > 0 && !koSuggested && (
                <TouchableOpacity style={styles.suggestionButton} onPress={handleKoreanSuggestion}>
                    <Text style={styles.suggestionText}>💡 Suggérer une traduction coréenne</Text>
                </TouchableOpacity>
            )}

            {koSuggested && !ko && (
                <TouchableOpacity
                    onPress={async () => {
                        setKo(koSuggested);
                        const exists = await checkIfKoreanWordExists(koSuggested);
                        setKoreanExists(exists);
                    }}
                >
                    <Text style={styles.suggestionBox}>
                        👉 Appuyer pour remplir avec : {koSuggested}
                    </Text>
                </TouchableOpacity>
            )}

            {/* ----------------- Korean input ----------------- */}
            <View style={styles.field}>
                <Text style={styles.label}>🇰🇷 Coréen</Text>
                <TextInput
                    ref={koRef}
                    value={ko}
                    onChangeText={(text) => {
                        setKo(text);
                        setKoreanExists(false);
                    }}
                    onBlur={handleKoBlur}
                    style={styles.input}
                    placeholder="Ex : 안녕하세요"
                    placeholderTextColor={"#696969"}
                    keyboardType="default"
                    textContentType="none"
                    returnKeyType="next"
                    onSubmitEditing={() => phoneticRef.current?.focus()}
                />
                {koreanExists && (
                    <Text style={styles.warningText}>
                        ⚠️ Ce mot existe déjà dans votre lexique. Modifiez-le si besoin.
                    </Text>
                )}
            </View>

            {/* ----------------- Phonetic input ----------------- */}
            <View style={styles.field}>
                <Text style={styles.label}>Phonétique</Text>
                <TextInput
                    ref={phoneticRef}
                    value={phonetic}
                    onChangeText={setPhonetic}
                    style={styles.input}
                    placeholder="Ex : annyeonghaseyo"
                    placeholderTextColor={"#696969"}
                    returnKeyType="done"
                    keyboardType="default"
                    onSubmitEditing={Keyboard.dismiss}
                />
            </View>

            {/* ----------------- Tags input ----------------- */}
            <TagSelector
                mode="edit"
                allTags={allTags}
                selectedTags={tags.split(",").map(t => t.trim())}
                onChange={(newTags) => setTags(newTags.join(", "))}
            />

            {suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    {suggestions.map((tag) => (
                        <TouchableOpacity key={tag} onPress={() => applySuggestion(tag)}>
                            <Text style={styles.suggestion}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* ----------------- Select word difficulty input ----------------- */}
            <Text style={[styles.label, { marginTop: 16 }]}>Difficulté</Text>
            <SelectPill
                options={difficulties}
                selectedValue={difficulty}
                onSelect={(val) => setDifficulty(val as Difficulty)}
            />

            {/* ----------------- Submit button ----------------- */}
            <TouchableOpacity
                style={[styles.fullButton, (!isValid || koreanExists) && styles.disabled]}
                onPress={handleSubmit}
                disabled={!isValid || koreanExists}
            >
                <Text style={styles.fullButtonText}>
                    {edit ? "Confirmer la modification" : "Ajouter au lexique"}
                </Text>
            </TouchableOpacity>
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
    fullButton: {
        marginTop: 28,
        backgroundColor: "#9da7ff",
        paddingVertical: 16,
        borderRadius: 8,
    },
    fullButtonText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    disabled: {
        opacity: 0.4,
    },
    suggestionsContainer: {
        backgroundColor: "#f1f1ff",
        borderRadius: 8,
        padding: 8,
        marginTop: -8,
    },
    suggestion: {
        padding: 6,
        fontSize: 14,
        color: "#333",
    },
    suggestionBox: {
        backgroundColor: "#e6f7ff",
        padding: 8,
        borderRadius: 6,
        marginBottom: 8,
        fontStyle: "italic",
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
    warningText: {
        color: "#cc0000",
        marginTop: 4,
        fontSize: 13,
        fontStyle: "italic",
    },
});