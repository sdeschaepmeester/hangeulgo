import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { playSound } from "@/services/soundPlayer";
import { playSoundIfEnabled } from "@/services/sound";

interface FeedbackProps {
    feedback: "correct" | "wrong" | null;
    correctAnswer?: string;
}

export default function Feedback({ feedback, correctAnswer }: FeedbackProps) {
    const screenHeight = Dimensions.get("window").height;
    const iconSize = screenHeight > 700 ? 100 : 70;

    const iconName = feedback === "correct" ? "emoji-events" : "block";
    const iconColor = feedback === "correct" ? "gold" : "#ff5e5e";

    // Play correct or wrong sound effect
    useEffect(() => {
        if (feedback === "correct") {
            playSoundIfEnabled(require("../../../assets/sounds/correct.mp3"));
        } else if (feedback === "wrong") {
            playSoundIfEnabled(require("../../../assets/sounds/wrong.mp3"));
        }
    }, [feedback]);

    return (
        <View style={styles.container}>
            <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
            {feedback === "wrong" && correctAnswer && (
                <Text style={styles.text}>Bonne réponse : {correctAnswer}</Text>
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