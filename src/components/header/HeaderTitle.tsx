import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "@/constants/colors";

type Props = {
    label: string;
    iconRight?: React.ReactNode;
};

export default function HeaderTitle({ label, iconRight }: Props) {
    return (
        <View style={styles.headerRow}>
            <Text style={styles.title}>{label}</Text>
            {iconRight && (
                <>{iconRight}</>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        paddingHorizontal: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.text.primary,
    },
});