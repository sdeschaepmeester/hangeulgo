import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    correctAnswer: string;
    onSubmit: (userAnswer: string) => void;
    disabled: boolean;
};

export default function OrderInput({ correctAnswer, onSubmit, disabled }: Props) {
    const pieces = useMemo(() => {
        const clean = correctAnswer.trim();
        return clean.length <= 4 ? clean.split("") : clean.split(" ");
    }, [correctAnswer]);

    const [shuffled, setShuffled] = useState<string[]>([]);
    const [userPieces, setUserPieces] = useState<string[]>([]);

    useEffect(() => {
        setShuffled(shuffle(pieces));
        setUserPieces([]);
    }, [pieces]);

    const remaining = shuffled.filter((p) => !userPieces.includes(p) || userPieces.filter(x => x === p).length < shuffled.filter(x => x === p).length);

    return (
        <View style={styles.wrapper}>
            {/* User answer */}
            <View style={styles.answerContainer}>
                {userPieces.map((piece, i) => (
                    <View key={`${piece}-${i}`} style={styles.answerPiece}>
                        <Text style={styles.answerText}>{piece}</Text>
                    </View>
                ))}
                {userPieces.length > 0 && (
                    <TouchableOpacity onPress={() => setUserPieces([])} style={styles.clearButton}>
                        <MaterialCommunityIcons name="close-circle" size={20} color="#666" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Choices */}
            <View style={styles.choicesContainer}>
                {remaining.map((piece, i) => (
                    <TouchableOpacity
                        key={`${piece}-${i}`}
                        style={styles.choice}
                        onPress={() => !disabled && setUserPieces((prev) => [...prev, piece])}
                        disabled={disabled}
                    >
                        <Text style={styles.choiceText}>{piece}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Validate */}
            <TouchableOpacity
                style={[styles.validateButton, disabled && { opacity: 0.5 }]}
                onPress={() => onSubmit(userPieces.join(correctAnswer.length <= 4 ? "" : " "))}
                disabled={disabled}
            >
                <Text style={styles.validateText}>Valider ma réponse</Text>
            </TouchableOpacity>
        </View>
    );
}

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

const styles = StyleSheet.create({
    wrapper: { alignItems: "center", gap: 20 },
    answerContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        justifyContent: "center",
    },
    answerPiece: {
        backgroundColor: "#e0e0ff",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    answerText: {
        fontSize: 18,
        color: "#333",
    },
    clearButton: {
        marginLeft: 8,
        marginTop: 4,
    },
    choicesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "center",
    },
    choice: {
        backgroundColor: "#f5f5f5",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    choiceText: {
        fontSize: 18,
        color: "#333",
    },
    validateButton: {
        backgroundColor: "#7f8bff",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 10,
    },
    validateText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});