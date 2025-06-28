import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { playFeedbackIfEnabled } from "@/services/sound";
import i18n from "@/i18n";

interface FeedbackProps {
    feedback: "correct" | "wrong" | null;
    correctAnswer?: string;
}

export default function Feedback({ feedback, correctAnswer }: FeedbackProps) {
    const screenHeight = Dimensions.get("window").height;
    const iconSize = screenHeight > 700 ? 100 : 70;

    const iconName = feedback === "correct" ? "emoji-events" : "block";
    const iconColor = feedback === "correct" ? "gold" : "#ff5e5e";

    // Vibrate depending on correct or wrong
    useEffect(() => {
        if (feedback === "correct") {
            playFeedbackIfEnabled("correct");
        } else if (feedback === "wrong") {
            playFeedbackIfEnabled("wrong");
        }
    }, [feedback]);

    return (
        <View style={styles.container}>
            <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
            {feedback === "wrong" && correctAnswer && (
                <Text style={styles.text}>{i18n.t('quiz.correctAnswer')} {correctAnswer}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 100,
        left: 20,
        right: 20,
        alignItems: "center",
        zIndex: 10,
    },
    text: {
        marginTop: 12,
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});
