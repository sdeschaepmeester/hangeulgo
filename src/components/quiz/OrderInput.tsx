import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
    correctAnswer: string;
    onChange: (userAnswer: string) => void;
    questionKey: string | number;
    disabled: boolean;
};

export default function OrderInput({ correctAnswer, onChange, questionKey, disabled }: Props) {
    const pieces = useMemo(() => {
        const clean = correctAnswer.trim();
        const split = clean.split("");
        return split.length >= 2 ? split : [];
    }, [correctAnswer]);

    const [shuffled, setShuffled] = useState<string[]>([]);
    const [userPieces, setUserPieces] = useState<string[]>([]);

    useEffect(() => {
        const shuffledArray = shuffle(pieces);
        setShuffled(shuffledArray);
        setUserPieces([]);
        onChange("");
    }, [correctAnswer, pieces, questionKey]);

    const remaining = shuffled.filter((p, idx, arr) => {
        const usedCount = userPieces.filter((x) => x === p).length;
        const totalCountBefore = arr.slice(0, idx + 1).filter((x) => x === p).length;
        return usedCount < totalCountBefore;
    });

    const assembledAnswer = userPieces.join(correctAnswer.length <= 4 ? "" : " ");

    useEffect(() => {
        onChange(assembledAnswer);
    }, [assembledAnswer]);

    return (
        <View style={styles.wrapper}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={assembledAnswer}
                    placeholder="Remettez la réponse dans l'ordre"
                    editable={false}
                />
                {userPieces.length > 0 && (
                    <TouchableOpacity style={styles.clearIcon} onPress={() => setUserPieces([])}>
                        <MaterialCommunityIcons name="close-circle" size={22} color="#666" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Choices */}
            <View style={styles.choicesContainer}>
                {remaining.map((piece, i) => (
                    <TouchableOpacity
                        key={`${piece}-${i}`}
                        style={styles.choice}
                        onPress={() => {
                            if (!disabled) setUserPieces((prev) => [...prev, piece]);
                        }}
                        disabled={disabled}
                    >
                        <Text style={styles.choiceText}>{piece}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

const styles = StyleSheet.create({
    wrapper: { alignItems: "center", gap: 20 },
    inputContainer: {
        position: "relative",
        width: "100%",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#7f8bff",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    clearIcon: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: [{ translateY: -11 }],
    },
    choicesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "center",
    },
    choice: {
        borderWidth: 1,
        borderColor: "#7f8bff",
        backgroundColor: "#f5f5f5",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    choiceText: {
        fontSize: 18,
        color: "#333",
    },
});
