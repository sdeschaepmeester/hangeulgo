import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import i18n from "@/i18n";
import colors from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function QuizFooter({ showResult, isDisabled, onValidate, onNext, isLast, inputMode, correctAnswer, feedback, }: { showResult: boolean; isDisabled: boolean; onValidate: () => void; onNext: () => void; isLast: boolean; inputMode: string; correctAnswer: string; feedback: "correct" | "wrong" | null; }) {
    const insets = useSafeAreaInsets();
    const backgroundColor = (inputMode === "multiple" && feedback) || inputMode !== "multiple" ? colors.primary.main : "transparent";

    return (
        <View style={styles.footer}>
            {/* --------- Dynamic background color --------- */}
            <View style={[styles.backgroundLayer, { backgroundColor }]} />

            {/* --------- Show correct answer --------- */}
            {showResult && feedback === "wrong" && (
                <View style={styles.answerCard}>
                    <Text style={styles.answerLabel}>{i18n.t("quiz.correctAnswer")}</Text>
                    <Text style={styles.answerText}>{correctAnswer}</Text>
                </View>
            )}

            {/* --------- Actions buttons --------- */}
            <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
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
        paddingHorizontal: 20,
        position: "relative",
        overflow: "hidden",
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.8,
    },
    buttonContainer: {
        width: "100%",
    },
    nextButton: {
        backgroundColor: colors.primary.dark,
        paddingVertical: 16,
        borderRadius: 8,
        marginTop: 10,
    },
    nextButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
    answerCard: {
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
    },
    answerLabel: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },
    answerText: {
        color: "gold",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
});