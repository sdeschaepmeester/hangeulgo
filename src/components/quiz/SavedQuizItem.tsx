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
        backgroundColor: "#f9f9f9",
        padding: 14,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
