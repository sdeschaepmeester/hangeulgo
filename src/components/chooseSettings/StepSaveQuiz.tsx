import { MAX_SAVED_QUIZZES } from "@/data/constants";
import { getSavedQuizCount } from "@/services/quiz";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, } from "react-native";

const windowWidth = Dimensions.get("window").width;

type Props = {
    saveEnabled: boolean;
    saveName: string;
    onToggleSave: () => void;
    onChangeName: (name: string) => void;
};

export default function StepSaveQuiz({ saveEnabled, saveName, onToggleSave, onChangeName }: Props) {
    const [isLimitReached, setIsLimitReached] = useState(false);

    useEffect(() => {
        getSavedQuizCount().then((count) => {
            if (count >= MAX_SAVED_QUIZZES) {
                setIsLimitReached(true);
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            {/* Checkbox */}
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={onToggleSave}
                disabled={isLimitReached}
            >
                <View
                    style={[
                        styles.box,
                        saveEnabled && styles.boxChecked,
                        isLimitReached && { opacity: 0.3 },
                    ]}
                />
                <Text
                    style={[
                        styles.label,
                        isLimitReached && styles.labelDisabled,
                    ]}
                >
                    Sauvegarder ce quiz
                </Text>
            </TouchableOpacity>

            {/* Warning */}
            {isLimitReached && (
                <Text style={styles.warning}>
                    La limite de quiz sauvegardés est atteinte, supprimez-en pour en ajouter d'autres.
                </Text>
            )}

            {/* Input name */}
            {saveEnabled && (
                <TextInput
                    style={styles.input}
                    placeholder="Nom de la sauvegarde"
                    value={saveName}
                    onChangeText={onChangeName}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        gap: 12,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    box: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#555",
        marginRight: 10,
    },
    boxChecked: {
        backgroundColor: "#C60C30",
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    labelDisabled: {
        color: "#999",
        fontStyle: "italic",
    },
    warning: {
        fontSize: 14,
        color: "#ff9800",
        textAlign: "center",
    },
    input: {
        width: windowWidth * 0.8,
        padding: 12,
        borderRadius: 8,
        borderColor: "#ccc",
        borderWidth: 1,
        fontSize: 16,
        backgroundColor: "#fff",
        textAlign: "center",
    },
});
