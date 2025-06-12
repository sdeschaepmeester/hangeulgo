import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Keyboard,
    StyleSheet,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { dbPromise } from "@/db/database";
import SelectPill from "@/components/SelectPill";
import type { Difficulty } from "@/types/Difficulty";
import { AZURE_TRANSLATOR_KEY, AZURE_TRANSLATOR_REGION, AZURE_TRANSLATOR_ENDPOINT } from "@env";
import TagSelector from "../tags/TagSelector";

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
    const [difficulty, setDifficulty] = useState<Difficulty>(
        initialData?.difficulty || "easy"
    );
    const [tags, setTags] = useState(initialData?.tags || "");
    const [allTags, setAllTags] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const phoneticRef = useRef<TextInput>(null);
    const koRef = useRef<TextInput>(null);

    const isValid = fr.trim() && ko.trim();

    useEffect(() => {
        const fetchTags = async () => {
            const db = await dbPromise;
            const rows = await db.getAllAsync<{ tag: string }>(
                `SELECT DISTINCT tag FROM lexicon_tags`
            );
            setAllTags(rows.map((r) => r.tag));
        };
        fetchTags();

        NetInfo.fetch().then((state) => {
            setIsConnected(state.isConnected === true);
        });
    }, []);

    const handleTagChange = (text: string) => {
        setTags(text);
        const lastPart = text.split(",").pop()?.trim().toLowerCase() ?? "";
        if (lastPart.length >= 2) {
            const matching = allTags.filter((tag) =>
                tag.toLowerCase().startsWith(lastPart)
            );
            setSuggestions(matching);
        } else {
            setSuggestions([]);
        }
    };

    const applySuggestion = (tag: string) => {
        const parts = tags.split(",").map((t) => t.trim());
        parts[parts.length - 1] = tag;
        setTags(parts.join(", ") + ", ");
        setSuggestions([]);
    };

    const onSubmit = async () => {
        if (!isValid) return;
        const db = await dbPromise;
        const cleanTags = tags.split(",").map((t) => t.trim()).filter(Boolean);

        if (edit && initialData) {
            await db.runAsync(
                `UPDATE lexicon SET fr = ?, ko = ?, phonetic = ?, difficulty = ? WHERE id = ?`,
                fr.trim(),
                ko.trim(),
                phonetic.trim(),
                difficulty,
                initialData.id
            );
            await db.runAsync(`DELETE FROM lexicon_tags WHERE lexicon_id = ?`, [initialData.id]);
            for (const tag of cleanTags) {
                await db.runAsync(
                    `INSERT INTO lexicon_tags (lexicon_id, tag) VALUES (?, ?)`,
                    [initialData.id, tag]
                );
            }
        } else {
            await db.runAsync(
                `INSERT INTO lexicon (fr, ko, phonetic, difficulty, active) VALUES (?, ?, ?, ?, 1)`,
                fr.trim(),
                ko.trim(),
                phonetic.trim(),
                difficulty
            );
            const lastInsert = await db.getFirstAsync<{ id: number }>(
                `SELECT last_insert_rowid() as id`
            );
            if (lastInsert?.id) {
                for (const tag of cleanTags) {
                    await db.runAsync(
                        `INSERT INTO lexicon_tags (lexicon_id, tag) VALUES (?, ?)`,
                        [lastInsert.id, tag]
                    );
                }
            }
        }

        onSuccess();
    };

    const fetchKoreanSuggestion = async () => {
        if (!fr.trim() || !isConnected) return;

        try {
            const res = await fetch(
                `${AZURE_TRANSLATOR_ENDPOINT}?api-version=3.0&from=fr&to=ko`,
                {
                    method: "POST",
                    headers: {
                        "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY,
                        "Ocp-Apim-Subscription-Region": AZURE_TRANSLATOR_REGION,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify([{ Text: fr }]),
                }
            );

            const json = await res.json();
            const korean = json[0]?.translations?.[0]?.text;
            setKoSuggested(korean);
        } catch (err) {
            console.warn(err);
        }
    };

    return (
        <View style={styles.form}>
            <View style={styles.field}>
                <Text style={styles.label}>🇫🇷 Français</Text>
                <TextInput
                    value={fr}
                    onChangeText={(text) => {
                        setFr(text);
                        setKoSuggested(null);
                    }}
                    style={styles.input}
                    placeholder="Ex : Bonjour"
                    returnKeyType="done"
                    keyboardType="default"
                    textContentType="givenName"
                />
            </View>

            {isConnected && fr.trim().length > 0 && !koSuggested && (
                <TouchableOpacity style={styles.suggestionButton} onPress={fetchKoreanSuggestion}>
                    <Text style={styles.suggestionText}>💡 Suggérer une traduction coréenne</Text>
                </TouchableOpacity>
            )}

            {koSuggested && !ko && (
                <TouchableOpacity onPress={() => setKo(koSuggested)}>
                    <Text style={styles.suggestionBox}>
                        👉 Appuyer pour remplir avec : {koSuggested}
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.field}>
                <Text style={styles.label}>🇰🇷 Coréen</Text>
                <TextInput
                    ref={koRef}
                    value={ko}
                    onChangeText={setKo}
                    style={styles.input}
                    placeholderTextColor="#000"
                    placeholder="Ex : 안녕하세요"
                    keyboardType="default"
                    textContentType="none"
                    returnKeyType="next"
                    onSubmitEditing={() => phoneticRef.current?.focus()}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Phonétique</Text>
                <TextInput
                    ref={phoneticRef}
                    value={phonetic}
                    onChangeText={setPhonetic}
                    style={styles.input}
                    placeholderTextColor="#000"
                    placeholder="Ex : annyeonghaseyo"
                    returnKeyType="done"
                    keyboardType="default"
                    onSubmitEditing={Keyboard.dismiss}
                />
            </View>

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

            <Text style={[styles.label, { marginTop: 16 }]}>Difficulté</Text>
            <SelectPill
                options={difficulties}
                selectedValue={difficulty}
                onSelect={(val) => setDifficulty(val as Difficulty)}
            />

            <TouchableOpacity
                style={[styles.fullButton, !isValid && styles.disabled]}
                onPress={onSubmit}
                disabled={!isValid}
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
});
