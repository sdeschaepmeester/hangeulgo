import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface FeedbackProps {
    feedback: "correct" | "wrong" | null;
    correctAnswer?: string;
    phonetic?: string;
}

export default function Feedback({ feedback, correctAnswer, phonetic }: FeedbackProps) {
    const iconName = feedback === "correct" ? "emoji-events" : "cancel";
    const iconColor = feedback === "correct" ? "gold" : "#ff5e5e";

    return (
        <View style={styles.container}>
            <MaterialIcons name={iconName} size={100} color={iconColor} />
            {feedback === "wrong" && correctAnswer && (
                <Text style={styles.text}>
                    Bonne réponse : {correctAnswer}
                    {phonetic ? ` (${phonetic})` : ""}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        alignItems: "center",
        zIndex: 10,
        width: "100%"
    },
    text: {
        marginTop: 12,
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});