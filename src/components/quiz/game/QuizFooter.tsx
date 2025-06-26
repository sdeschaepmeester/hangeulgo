import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feedback from "@/components/quiz/Feedback";
import i18n from "@/i18n";
import colors from "@/constants/colors";

export default function QuizFooter({
    showResult,
    isDisabled,
    onValidate,
    onNext,
    isLast,
    inputMode,
    feedback,
    correctAnswer,
}: {
    showResult: boolean;
    isDisabled: boolean;
    onValidate: () => void;
    onNext: () => void;
    isLast: boolean;
    inputMode: string;
    feedback: "correct" | "wrong" | null;
    correctAnswer: string;
}) {
    return (
        <View style={styles.footer}>
            {showResult && <Feedback feedback={feedback} correctAnswer={correctAnswer} />}
            {(inputMode === "input" || inputMode === "order") ? (
                <TouchableOpacity
                    style={[styles.nextButton, isDisabled && { opacity: 0.4 }]}
                    onPress={showResult ? onNext : onValidate}
                    disabled={isDisabled}
                >
                    <Text style={styles.nextButtonText}>
                        {showResult ? (isLast ? i18n.t("quiz.seeResults") : i18n.t("quiz.nextQuestion")) : i18n.t("quiz.validateAnswer")}
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
    );
}

const styles = StyleSheet.create({
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "transparent",
    },
    nextButton: {
        marginBottom: 32,
        backgroundColor: colors.primary.main,
        paddingVertical: 14,
        borderRadius: 8,
    },
    nextButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
});