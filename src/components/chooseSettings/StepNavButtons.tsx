import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "@/i18n";
import colors from "@/constants/colors";

type Props = {
    isLastStep: boolean;
    isDisabled: boolean;
    onNext: () => void;
    onBack: () => void;
    onQuit: () => void;
    onStart: () => void;
    isFirstStep: boolean;
};

export default function StepNavButtons({ isLastStep, isDisabled, onNext, onBack, onQuit, onStart, isFirstStep, }: Props) {
    return (
        <View style={styles.stepButtonsRow}>
            {/* ------------ Action button previous or quit ------------ */}
            <TouchableOpacity
                onPress={isFirstStep ? onQuit : onBack}
                style={[styles.button, styles.leftButton]}
            >
                <MaterialCommunityIcons
                    name="chevron-left"
                    size={18}
                    color="white"
                    style={{ marginRight: 4 }}
                />
                <Text style={styles.text}>
                    {isFirstStep ? i18n.t("actions.quit") : i18n.t("actions.previous")}
                </Text>
            </TouchableOpacity>
            {/* ------------ Action button next or start ------------ */}
            <TouchableOpacity
                onPress={isLastStep ? onStart : onNext}
                disabled={isDisabled}
                style={[
                    styles.button,
                    styles.rightButton,
                    isDisabled && styles.disabled,
                ]}
            >
                <MaterialCommunityIcons
                    name={isLastStep ? "gamepad-variant" : "chevron-right"}
                    size={18}
                    color="white"
                    style={{ marginRight: 4 }}
                />
                <Text style={styles.text}>
                    {isLastStep ? i18n.t("actions.start") : i18n.t("actions.next")}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    stepButtonsRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end", 
        paddingHorizontal: 20,
        position: "relative",
        overflow: "hidden",
    },
    button: {
        width: "50%",
        height: "35%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        flexDirection: "row",
    },
    leftButton: {
        backgroundColor: colors.primary.dark,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    rightButton: {
        backgroundColor: colors.secondary.dark,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    disabled: {
        backgroundColor: colors.secondary.disabled
    },
});
