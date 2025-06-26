import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@/constants/colors";

type Props = {
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    onPress: () => void;
    backgroundColor?: string;
    color?: string;
};

export default function IconButton({ label, icon, onPress, backgroundColor = colors.neutral.lightest, color = colors.neutral.darker, }: Props) {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }]}
            onPress={onPress}
        >
            <MaterialCommunityIcons name={icon} size={18} color={color} />
            <Text style={[styles.text, { color }]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    text: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: "500",
    },
});