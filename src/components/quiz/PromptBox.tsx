import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Speech from "expo-speech";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Question } from "@/types/Question";
import { GameSettings } from "@/types/GameSettings";

interface PromptBoxProps {
    settings: GameSettings;
    currentQuestion: Question;
}

export default function PromptBox({ settings, currentQuestion }: PromptBoxProps) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showTags, setShowTags] = useState(false);

    const shouldShowSpeaker = settings.subType === "koToFr";

    const handleSpeak = () => {
        setIsSpeaking(true);
        Speech.speak(currentQuestion.prompt, {
            language: "ko-KR",
            rate: 0.9,
            pitch: 1.0,
            onDone: () => setIsSpeaking(false),
            onStopped: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    };

    useEffect(() => {
        setShowTags(false);
    }, [currentQuestion]);

    return (
        <View style={styles.promptWrapper}>
            <View style={styles.promptBox}>
                <Text style={styles.prompt}>{currentQuestion.prompt}</Text>

                <View style={styles.iconGroup}>
                    {currentQuestion.tags?.length > 0 && (
                        <TouchableOpacity onPress={() => setShowTags((prev) => !prev)}>
                            <MaterialCommunityIcons
                                name="information-outline"
                                size={26}
                                color={showTags ? "#7f8bff" : "#333"}
                            />
                        </TouchableOpacity>
                    )}
                    {shouldShowSpeaker && (
                        <TouchableOpacity onPress={handleSpeak} style={{ marginLeft: 12 }}>
                            <MaterialCommunityIcons
                                name="volume-high"
                                size={28}
                                color={isSpeaking ? "#7f8bff" : "#333"}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {showTags && currentQuestion.tags?.length > 0 && (
                <View style={styles.tagsContainer}>
                    {currentQuestion.tags.map((tag: string) => (
                        <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            )}
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
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    prompt: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        flexShrink: 1,
    },
    iconGroup: {
        flexDirection: "row",
        position: "absolute",
        right: 12,
        top: "50%",
        transform: [{ translateY: -14 }],
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        justifyContent: "center",
        marginTop: 8,
    },
    tag: {
        backgroundColor: "#e0e0ff",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        color: "#333",
    },
});