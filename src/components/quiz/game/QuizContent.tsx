import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import OrderInput from "@/components/quiz/OrderInput";
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
    currentIndex
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
    if (settings.inputMode === "input") {
        return (
            <TextInput
                style={[styles.input, { backgroundColor: colors.neutral.light }]}
                placeholder={i18n.t('quiz.answerKorean')}
                value={userInput}
                onChangeText={onChange}
                editable={!disabled}
            />
        );
    }

    // QCM, comprehension or listening quizzes
    if (settings.inputMode === "multiple") {
        return (
            <View style={styles.choices}>
                {question.choices?.map((choice, index) => (
                    <TouchableOpacity
                        key={`${choice}-${index}`}
                        style={[
                            styles.choice,
                            selected === choice && {
                                backgroundColor:
                                    choice === question.correctAnswer ? colors.success.lighter : colors.danger.lighter,
                            },
                        ]}
                        onPress={() => onSelectChoice && !selected && onSelectChoice(choice)}
                        disabled={!!selected}
                    >
                        <Text>{choice}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    // Puzzle quizzes
    if (settings.inputMode === "order") {
        return (
            <OrderInput
                correctAnswer={question.correctAnswer}
                onChange={onChange}
                disabled={disabled}
                questionKey={currentIndex}
            />
        );
    }

    return null;
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: colors.neutral.light,
        borderRadius: 8,
        padding: 12,
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
    },
    choices: {
        gap: 12,
        marginTop: 20,
    },
    choice: {
        padding: 16,
        borderWidth: 1,
        borderColor: "transparent",
        borderRadius: 8,
        backgroundColor: colors.secondary.lightest,
    },
});