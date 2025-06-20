import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

type Props = {
    prompt: string;
    tags?: string[];
};

export default function ListenPrompt({ prompt, tags = [] }: Props) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showTags, setShowTags] = useState(false);

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

    useEffect(() => {
        setShowTags(false);
    }, [prompt]);

    return (
        <View style={styles.promptWrapper}>
            <TouchableOpacity onPress={handleSpeak}>
                <View style={styles.promptBox}>
                    <MaterialCommunityIcons
                        name={isSpeaking ? "volume-off" : "volume-high"}
                        size={38}
                        color={isSpeaking ? "#aaa" : "#333"}
                    />
                    {tags.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setShowTags((prev) => !prev)}
                            style={styles.infoIcon}
                        >
                            <MaterialCommunityIcons
                                name="information-outline"
                                size={26}
                                color={showTags ? "#7f8bff" : "#333"}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>

            {showTags && tags.length > 0 && (
                <View style={styles.tagsContainer}>
                    {tags.map((tag) => (
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
    infoIcon: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: [{ translateY: -13 }],
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
