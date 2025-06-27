import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Platform, UIManager } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AlertCustom from "@/components/AlertCustom";
import IconButton from "@/components/IconButton";
import SavedQuizList from "@/components/quiz/SavedQuizList";
import MainLayout from "@/layouts/MainLayout";

import { getAllSavedQuizzes, deleteSavedQuiz, isQuizValid } from "@/services/quiz";
import type { SavedQuizEntry } from "@/types/SavedQuizEntry";
import { RootStackParamList } from "@/App";
import i18n from "@/i18n";
import colors from "@/constants/colors";

export default function SavedQuizScreen() {
    const [quizzes, setQuizzes] = useState<(SavedQuizEntry & { disabled?: boolean })[]>([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const fetchQuizzes = async () => {
        const all = await getAllSavedQuizzes();

        const withValidity: typeof quizzes = [];
        for (let i = 0; i < all.length; i++) {
            const quiz = all[i];
            const gameSettings = {
                type: quiz.type,
                subType: quiz.subType,
                inputMode: quiz.inputMode,
                difficulties: quiz.difficulties,
                length: quiz.length,
                tags: quiz.tags,
            };
            try {
                const valid = await isQuizValid(gameSettings);
                valid && withValidity.push({ ...quiz, disabled: !valid });
            } catch (e) {
                withValidity.push({ ...quiz, disabled: true });
            }
        }
        setQuizzes(withValidity);
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleConfirmDelete = async () => {
        if (confirmDeleteId !== null) {
            await deleteSavedQuiz(confirmDeleteId);
            setConfirmDeleteId(null);
            fetchQuizzes();
        }
    };

    const handleConfirmDeleteAll = async () => {
        for (const quiz of quizzes) {
            await deleteSavedQuiz(quiz.id);
        }
        setConfirmDeleteAll(false);
        fetchQuizzes();
    };

    // Replay a quiz
    const handleSelect = (quiz: SavedQuizEntry & { disabled?: boolean }) => {
        if (quiz.disabled) return;
        navigation.navigate("Quiz", {
            settings: {
                type: quiz.type,
                subType: quiz.subType,
                inputMode: quiz.inputMode,
                difficulties: quiz.difficulties,
                length: quiz.length,
                tags: quiz.tags,
            },
        });
    };

    return (
        <MainLayout scrollable={false}>
            {/* --------- Header --------- */}
            <View style={styles.header}>
                <Text style={styles.title}>{i18n.t("myQuizzes.title")}</Text>
                {quizzes.length > 0 && (
                    <IconButton
                        label={i18n.t("actions.deleteAll")}
                        icon="delete-empty"
                        onPress={() => setConfirmDeleteAll(true)}
                        backgroundColor={colors.danger.lightest}
                        color={colors.danger.light}
                    />
                )}
            </View>

            {/* --------- Scrollable saved quiz --------- */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.listSection}
                showsVerticalScrollIndicator={false}
            >
                {quizzes.length === 0 ? (
                    <Text style={styles.empty}>{i18n.t("myQuizzes.noSavedQuiz")}</Text>
                ) : (
                    <SavedQuizList
                        data={quizzes}
                        onDelete={(id) => setConfirmDeleteId(id)}
                        onSelect={handleSelect}
                    />
                )}
            </ScrollView>

            {/* --------- Alerts --------- */}
            {confirmDeleteId !== null && (
                <AlertCustom
                    visible={true}
                    icon={<MaterialCommunityIcons name="delete" size={30} color={colors.danger.main} />}
                    iconColor={colors.danger.main}
                    title={i18n.t("actions.delete")}
                    description={i18n.t("modaleDelete.confirmDeletionQuizText")}
                    onClose={() => setConfirmDeleteId(null)}
                    onConfirm={handleConfirmDelete}
                    confirmText={i18n.t("actions.delete")}
                    cancelText={i18n.t("actions.cancel")}
                />
            )}

            {confirmDeleteAll && (
                <AlertCustom
                    visible={true}
                    icon={<MaterialCommunityIcons name="delete-alert" size={30} color={colors.danger.main} />}
                    iconColor={colors.danger.main}
                    title={i18n.t("actions.deleteAll")}
                    description={i18n.t("modaleDelete.confirmDeletionAllQuizText", {
                        count: quizzes?.length ?? 0,
                        managePlural:
                            (quizzes?.length ?? 0) <= 1
                                ? i18n.t("modaleDelete.singleSavedQuiz")
                                : i18n.t("modaleDelete.pluralSavedQuizzes"),
                    })}
                    onClose={() => setConfirmDeleteAll(false)}
                    onConfirm={handleConfirmDeleteAll}
                    confirmText={i18n.t("actions.deleteAll")}
                    cancelText={i18n.t("actions.cancel")}
                />
            )}
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 18,
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.neutral.darker,
    },
    scroll: {
        flex: 1,
        width: "100%",
    },
    listSection: {
        paddingBottom: 24,
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: colors.neutral.dark,
    },
});