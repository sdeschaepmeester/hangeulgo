import React from "react";
import { Text, StyleSheet } from "react-native";

interface SubTitleProps {
    label: string;
    color?: string;
}

export default function SubTitle({ label, color }: SubTitleProps) {
    return (
        <Text style={[styles.title, { color: color || "#000" }]}>
            {label}
        </Text>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: "bold",
        textDecorationLine: "underline",
        fontSize: 18,
        marginBottom: 8,
    },
});