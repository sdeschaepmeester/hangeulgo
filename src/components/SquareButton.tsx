import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, GestureResponderEvent, Dimensions, } from "react-native";
import type { ReactNode } from "react";
import colors from "@/constants/colors";

interface Props {
    icon: ReactNode;
    label: string;
    bgColor?: string;
    onClick: (event: GestureResponderEvent) => void;
    fullWidth?: boolean;
}

const screenWidth = Dimensions.get("window").width;
const isTablet = screenWidth >= 600;

export default function SquareButton({ icon, label, bgColor = colors.neutral.lightest, onClick, fullWidth = false, }: Props) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                fullWidth ? styles.fullWidthButton : isTablet ? styles.buttonTablet : styles.buttonMobile,
                { backgroundColor: bgColor },
            ]}
            onPress={onClick}
        >
            <View style={styles.content}>
                <View
                    style={[
                        styles.iconContainer,
                        fullWidth && styles.iconContainerFullWidth,
                    ]}
                >
                    {icon}
                </View>
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
    buttonTablet: {
        paddingVertical: 16,
    },
    fullWidthButton: {
        width: "100%",
        paddingVertical: 12,
    },
    content: {
        alignItems: "center",
        gap: 6,
        width: "100%",
        paddingVertical: 8,
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "50%",
        aspectRatio: 1,
    },
    iconContainerFullWidth: {
        width: "auto",
        aspectRatio: undefined,
        marginBottom: 8,
    },
    label: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: screenWidth > 600 ? 18 : 16,
    },
});