import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

type Props = {
    prompt: string;
};

export default function ListenPrompt({ prompt }: Props) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = () => {
        setIsSpeaking(true);
        Speech.speak(prompt, {
            language: "ko-KR",
            rate: 0.9,
            pitch: 1.0,
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    };

    return (
        <TouchableOpacity onPress={handleSpeak} style={styles.promptWrapper}>
            <View style={styles.promptBox}>
                <MaterialCommunityIcons
                    name={isSpeaking ? "volume-off" : "volume-high"}
                    size={38}
                    color={isSpeaking ? "#aaa" : "#333"}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 20,
    },
    promptWrapper: {
        borderRadius: 12,
        marginTop: 60,
        marginBottom: 20,
    },
    promptBox: {
        backgroundColor: "rgba(255,255,255,0.5)",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
});