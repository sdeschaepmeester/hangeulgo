import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { playFeedbackIfEnabled } from "@/services/sound";

interface FeedbackProps {
    feedback: "correct" | "wrong" | null;
}

export default function Feedback({ feedback }: FeedbackProps) {
    const screenHeight = Dimensions.get("window").height;
    const iconSize = screenHeight > 700 ? 100 : 80;

    const iconName = feedback === "correct" ? "emoji-events" : "block";
    const iconColor = feedback === "correct" ? "gold" : "#ff5e5e";

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 20,
    }
});
