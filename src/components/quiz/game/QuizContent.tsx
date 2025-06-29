import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import OrderInput from "@/components/quiz/OrderInput";
import QuestionText from "@/components/quiz/QuestionText";
import type { Question } from "@/types/Question";
import type { GameSettings } from "@/types/GameSettings";
import colors from "@/constants/colors";
import i18n from "@/i18n";

export default function QuizContent({
    question,
    settings,
    userInput,
    onChange,
    onSelectChoice,
    selected,
    disabled = false,
    currentIndex,
}: {
    question: Question;
    settings: GameSettings;
    userInput: string;
    onChange: (text: string) => void;
    onSelectChoice?: (choice: string) => void;
    selected?: string | null;
    disabled?: boolean;
    currentIndex: number;
}) {
    return (
        <View style={styles.container}>
            {/* Question label */}
            <QuestionText settings={settings} />
            {/* Content */}
            {settings.inputMode === "input" && (
                <TextInput
                    style={[styles.input]}
                    placeholder={i18n.t("quiz.answerKorean")}
                    value={userInput}
                    onChangeText={onChange}
                    editable={!disabled}
                />
            )}
            {settings.inputMode === "multiple" && (
                <View style={styles.choices}>
                    {question.choices?.map((choice, index) => (
                        <TouchableOpacity
                            key={`${choice}-${index}`}
                            style={[
                                styles.choice,
                                selected === choice && {
                                    backgroundColor:
                                        choice === question.correctAnswer
                                            ? colors.success.lighter
                                            : colors.danger.lighter,
                                },
                            ]}
                            onPress={() => onSelectChoice && !selected && onSelectChoice(choice)}
                            disabled={!!selected}
                        >
                            <Text>{choice}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {settings.inputMode === "order" && (
                <OrderInput
                    correctAnswer={question.correctAnswer}
                    onChange={onChange}
                    disabled={disabled}
                    questionKey={currentIndex}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(255,255,255,0.5)",
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.neutral.light,
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
        backgroundColor: colors.secondary.lightest
    },
    choices: {
        gap: 12,
        marginTop: 20,
    },
    choice: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: colors.secondary.lightest,
    },
});
