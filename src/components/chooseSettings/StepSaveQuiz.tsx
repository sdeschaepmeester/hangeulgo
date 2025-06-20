import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

type Props = {
    saveEnabled: boolean;
    saveName: string;
    onToggleSave: () => void;
    onChangeName: (name: string) => void;
};

export default function StepSaveQuiz({ saveEnabled, saveName, onToggleSave, onChangeName }: Props) {
    return (
        <View style={styles.container}>
            {/* Checkbox */}
            <TouchableOpacity style={styles.checkboxContainer} onPress={onToggleSave}>
                <View style={[styles.box, saveEnabled && styles.boxChecked]} />
                <Text style={styles.label}>Sauvegarder ce quiz</Text>
            </TouchableOpacity>

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
        gap: 16,
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