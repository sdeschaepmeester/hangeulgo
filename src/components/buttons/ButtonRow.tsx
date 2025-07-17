import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native";
import i18n from "@/i18n";
import colors from "@/constants/colors";

type Props = {
    onLeftPress: (event: GestureResponderEvent) => void;
    onRightPress: (event: GestureResponderEvent) => void;
    leftLabel?: string;
    rightLabel?: string;
    rightDisabled?: boolean;
    leftDisabled?: boolean;
};

export default function ButtonRow({ onLeftPress, onRightPress, leftLabel = i18n.t("actions.cancel"), rightLabel = i18n.t("actions.confirm"), rightDisabled = false, leftDisabled = false, }: Props) {
    return (
        <View style={styles.buttonsRow}>
            <TouchableOpacity onPress={onLeftPress} style={styles.cancelButton} disabled={leftDisabled}>
                <Text style={styles.cancelButtonText}>{leftLabel}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onRightPress} disabled={rightDisabled} style={[styles.confirmButton, rightDisabled && styles.disabled]} >
                <Text style={styles.confirmButtonText}>{rightLabel}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: colors.neutral.lightest,
        borderRadius: 8,
    },
    cancelButtonText: {
        textAlign: "center",
        fontSize: 16,
        color: colors.neutral.dark,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: colors.primary.main,
        borderRadius: 8,
    },
    confirmButtonText: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    disabled: {
        opacity: 0.4,
    },
});