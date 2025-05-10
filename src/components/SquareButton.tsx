import React from "react";
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    GestureResponderEvent,
    Dimensions,
} from "react-native";
import type { ReactNode } from "react";

interface Props {
    icon: ReactNode;
    label: string;
    bgColor?: string;
    onClick: (event: GestureResponderEvent) => void;
}

export default function SquareButton({ icon, label, bgColor = "#eee", onClick }: Props) {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: bgColor }]} onPress={onClick}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>{icon}</View>
                <Text style={styles.label}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        aspectRatio: 1,
        marginHorizontal: 4,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        alignItems: "center",
        gap: 6,
        width: "100%",
    },
    iconContainer: {
        width: "50%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
});