import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GameSettings } from "@/types/GameSettings";
import i18n from "@/i18n";

interface QuestionTextProps {
    settings: GameSettings;
}

export default function QuestionText({ settings }: QuestionTextProps) {
    let questionKey = "";

    switch (settings.type) {
        case "comprehension":
            questionKey = "prompt.comprehension";
            break;
        case "ecriture":
            questionKey = "prompt.writing";
            break;
        case "ecoute":
            questionKey = "prompt.listening";
            break;
        case "arrangement":
            questionKey = "prompt.puzzle";
            break;
        default:
            questionKey = "prompt.comprehension";
    }

    return (
        <View style={styles.promptWrapper}>
            <View style={styles.promptBox}>
                <Text style={styles.prompt}>{i18n.t(questionKey)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    promptWrapper: {
        borderRadius: 12,
    },
    promptBox: {
        padding: 4,
        flexDirection: "row",
        position: "relative",
    },
    prompt: {
        fontSize: 16,
        textAlign: "left",
        flexShrink: 1,
        marginLeft: 12,
    },
});