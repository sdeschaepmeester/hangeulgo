import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function QuizHeader({ current, total, onClose }: { current: number; total: number; onClose: () => void }) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={28} color="black" />
            </TouchableOpacity>
            <Text style={styles.counterText}>Question {current} / {total}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255,255,255,0.4)",
    },
    closeButton: { padding: 8 },
    counterText: { fontSize: 16, fontWeight: "600" },
});