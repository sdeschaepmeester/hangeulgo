import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import i18n from "@/i18n";
import colors from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale } from "@/services/scaling";

export default function QuizFooter({
    showResult,
    isDisabled,
    onValidate,
    onNext,
    isLast,
    inputMode,
    correctAnswer,
    feedback,
}: {
    showResult: boolean;
    isDisabled: boolean;
    onValidate: () => void;
    onNext: () => void;
    isLast: boolean;
    inputMode: string;
    correctAnswer: string;
    feedback: "correct" | "wrong" | null;
}) {
    const insets = useSafeAreaInsets();
    const backgroundColor =
        (inputMode === "multiple" && feedback) || inputMode !== "multiple"
            ? colors.primary.main
            : "transparent";

    return (
        <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
            {/* --------- Dynamic background color --------- */}
            <View style={[styles.backgroundLayer, { backgroundColor }]} />

            <View style={styles.buttonContainer}>
                {/* --------- Show correct answer --------- */}
                {showResult && feedback === "wrong" && (
                    <View style={styles.answerCard}>
                        <Text style={styles.answerLabel}>{i18n.t("quiz.correctAnswer")}</Text>
                        <Text style={styles.answerText}>{correctAnswer}</Text>
                    </View>
                )}

                {/* --------- Actions buttons --------- */}
                {(inputMode === "input" || inputMode === "order") ? (
                    <TouchableOpacity
                        style={[styles.nextButton, isDisabled && { opacity: 0.4 }]}
                        onPress={showResult ? onNext : onValidate}
                        disabled={isDisabled}
                    >
                        <Text style={styles.nextButtonText}>
                            {showResult
                                ? isLast
                                    ? i18n.t("quiz.seeResults")
                                    : i18n.t("quiz.nextQuestion")
                                : i18n.t("quiz.validateAnswer")}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    showResult && (
                        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                            <Text style={styles.nextButtonText}>
                                {isLast ? i18n.t("quiz.seeResults") : i18n.t("quiz.nextQuestion")}
                            </Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingHorizontal: moderateScale(20), // ✅ commun pour card + bouton
        position: "relative",
        overflow: "hidden",
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "stretch",
    },
    answerCard: {
        backgroundColor: "rgba(0,0,0,0.7)",
        marginBottom: moderateScale(12),
        paddingVertical: moderateScale(14),
        borderRadius: moderateScale(8),
        width: "100%", // ✅ prend toute la largeur dispo
    },
    answerLabel: {
        color: "white",
        fontSize: moderateScale(16),
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },
    answerText: {
        color: "gold",
        fontSize: moderateScale(24),
        fontWeight: "bold",
        textAlign: "center",
    },
    nextButton: {
        width: "100%",
        backgroundColor: colors.primary.dark,
        paddingVertical: moderateScale(14),
        borderRadius: moderateScale(8),
        marginTop: moderateScale(10),
    },
    nextButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: moderateScale(16),
    },
});
