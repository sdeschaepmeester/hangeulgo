import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import i18n from "@/i18n";
import colors from "@/constants/colors";

export default function QuizFooter({
    showResult,
    isDisabled,
    onValidate,
    onNext,
    isLast,
    inputMode,
    correctAnswer,
    feedback
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
    return (
        <View style={styles.footer}>
            {/* -------------- Background color with opacity -------------- */}
            {((inputMode === "multiple" && feedback) || inputMode !== "multiple") && <View style={styles.backgroundLayer} />}
            <View style={styles.buttonContainer}>
                {/* -------------- Block with correct answer -------------- */}
                {showResult && feedback === "wrong" && (
                    <View style={styles.answerCard}>
                        <Text style={styles.answerLabel}>{i18n.t("quiz.correctAnswer")}</Text>
                        <Text style={styles.answerText}>{correctAnswer}</Text>
                    </View>
                )}
                {/* -------------- Button action: Next, see results or validate answer -------------- */}

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
        justifyContent: "space-between",
        paddingHorizontal: 20,
        position: "relative",
        overflow: "hidden",
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.primary.main,
        opacity: 0.8,
    },
    buttonContainer: {
        width: "100%",
        marginBottom: 20,
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
        marginTop: 12,
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 16,
        borderRadius: 10,
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
