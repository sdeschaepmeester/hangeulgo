import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { SavedQuizEntry } from "@/types/SavedQuizEntry";

type Props = {
    quiz: SavedQuizEntry;
    onDelete: (id: number) => void;
    onSelect: (quiz: SavedQuizEntry) => void;
};

const getQuizTypeLabel = (type: SavedQuizEntry["type"]) => {
    switch (type) {
        case "comprehension": return "Quiz de compréhension";
        case "ecoute": return "Quiz d'écoute";
        case "arrangement": return "Quiz puzzle";
        case "ecriture": return "Quiz d'écriture";
        default: return "Quiz";
    }
};

const getLengthLabel = (length: number | "unlimited") => {
    if (length === "unlimited") return "Illimité";
    if (length <= 10) return "court";
    if (length <= 20) return "moyen";
    return "long";
};

export default function SavedQuizItem({ quiz, onDelete, onSelect }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.name}>{quiz.name}</Text>
                <Text style={styles.type}>
                    {getQuizTypeLabel(quiz.type)} ({getLengthLabel(quiz.length)})
                </Text>

                <View style={styles.difficultyRow}>
                    {quiz.difficulties.includes("easy") && (
                        <MaterialCommunityIcons name="circle" size={14} color="green" />
                    )}
                    {quiz.difficulties.includes("medium") && (
                        <MaterialCommunityIcons name="circle" size={14} color="orange" />
                    )}
                    {quiz.difficulties.includes("hard") && (
                        <MaterialCommunityIcons name="circle" size={14} color="red" />
                    )}
                </View>

                {Array.isArray(quiz.tags) && quiz.tags.length > 0 && (
                    <View style={styles.tagRow}>
                        {quiz.tags.map((tag) => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => onSelect(quiz)} style={styles.playButton}>
                    <Text style={styles.playButtonText}>Jouer</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onDelete(quiz.id)} style={styles.icon}>
                    <MaterialCommunityIcons name="delete" size={24} color="#e53935" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 1,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        overflow: "hidden",
    },
    info: {
        flex: 1,
        paddingRight: 10,
    },
    name: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 2,
    },
    type: {
        fontSize: 14,
        color: "#555",
        marginBottom: 6,
    },
    difficultyRow: {
        flexDirection: "row",
        gap: 6,
        marginBottom: 6,
    },
    tagRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    tag: {
        backgroundColor: "#e0e0e0",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 12,
        color: "#444",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    playButton: {
        backgroundColor: "#003478",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    playButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
    icon: {
        padding: 4,
    },
});