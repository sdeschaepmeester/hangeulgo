


import { Question } from "@/services/quizGenerator";
import { GameSettings } from "@/types/GameSettings";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PromptBoxProps {
    settings: GameSettings;
    currentQuestion: Question;
}

export default function PromptBox({ settings, currentQuestion }: PromptBoxProps) {
    return (
        <View style={styles.promptWrapper}>
            <View style={styles.promptBox}>
                <Text style={styles.prompt}>
                    {settings.type === "translation" ? currentQuestion.fr : currentQuestion.ko}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    promptWrapper: {
        borderRadius: 12,
        marginTop: 60,
        marginBottom: 20,
    },
    promptBox: {
        backgroundColor: "rgba(255,255,255,0.5)",
        padding: 16,
        borderRadius: 12,
    },
    prompt: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
});