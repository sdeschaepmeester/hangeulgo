import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, GestureResponderEvent, Dimensions, } from "react-native";
import type { ReactNode } from "react";
import colors from "@/constants/colors";

interface Props {
    icon: ReactNode;
    label: string;
    bgColor?: string;
    onClick: (event: GestureResponderEvent) => void;
}

const screenWidth = Dimensions.get("window").width;
const isTablet = screenWidth >= 600;

export default function SquareButton({ icon, label, bgColor = colors.neutral.lightest, onClick }: Props) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                isTablet ? styles.buttonTablet : styles.buttonMobile,
                { backgroundColor: bgColor },
            ]}
            onPress={onClick}
        >
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
        marginHorizontal: 4,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonMobile: {
        aspectRatio: 1,
    },
    buttonTablet: { // Avoid square because it's too big on tablets
        paddingVertical: 16, 
    },
    content: {
        alignItems: "center",
        gap: 6,
        width: "100%",
        paddingVertical: 8,
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
