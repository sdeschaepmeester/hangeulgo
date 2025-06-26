import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@/constants/colors";

type Props = {
    label: string;
    onClick?: () => void;
};

export default function WarningLimit({ label, onClick }: Props) {
    const Wrapper = onClick ? TouchableOpacity : View;

    return (
        <Wrapper onPress={onClick} style={styles.container}>
            <MaterialCommunityIcons name="alert-circle" size={20} color={colors.neutral.white} style={styles.icon} />
            <Text style={styles.text}>{label}</Text>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.warning.lighter,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginBottom: 8,
        flexWrap: "wrap",
    },
    icon: {
        marginRight: 8,
    },
    text: {
        color: colors.neutral.white,
        fontSize: 14,
        flexShrink: 1,
        flex: 1,
    },
});