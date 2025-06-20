import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, UIManager, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NavBar from "@/components/NavBar";
import AlertCustom from "@/components/AlertCustom";
import { getAllSavedQuizzes, deleteSavedQuiz, isQuizValid } from "@/services/quiz";
import SavedQuizList from "@/components/quiz/SavedQuizList";
import type { SavedQuizEntry } from "@/types/SavedQuizEntry";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import IconButton from "@/components/IconButton";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function SavedQuizScreen() {
    const [quizzes, setQuizzes] = useState<(SavedQuizEntry & { disabled?: boolean })[]>([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const fetchQuizzes = async () => {
        const all = await getAllSavedQuizzes();

        const withValidity = await Promise.all(
            all.map(async (quiz) => {
                const valid = await isQuizValid(quiz);
                console.log(`Quiz ${quiz.id} validity: ${valid}`);
                console.log(quiz);
                return { ...quiz, disabled: !valid };
            })
        );

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
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <View style={styles.header}>
                <Text style={styles.title}>Mes quiz</Text>
                {quizzes.length > 0 && (
                    <IconButton
                        label="Supprimer tout"
                        icon="delete-empty"
                        onPress={() => setConfirmDeleteAll(true)}
                        backgroundColor="#fcebea"
                        color="#e53935"
                    />
                )}
            </View>

            <View style={styles.listSection}>
                {quizzes.length === 0 ? (
                    <Text style={styles.empty}>Aucun quiz sauvegardé.</Text>
                ) : (
                    <SavedQuizList
                        data={quizzes}
                        onDelete={(id) => setConfirmDeleteId(id)}
                        onSelect={handleSelect}
                    />
                )}
            </View>

            <NavBar />

            {confirmDeleteId !== null && (
                <AlertCustom
                    visible={true}
                    icon={<MaterialCommunityIcons name="delete" size={30} color="#e53935" />}
                    iconColor="#e53935"
                    title="Supprimer"
                    description="Confirmer la suppression de ce quiz sauvegardé ?"
                    onClose={() => setConfirmDeleteId(null)}
                    onConfirm={handleConfirmDelete}
                    confirmText="Supprimer"
                    cancelText="Annuler"
                />
            )}

            {confirmDeleteAll && (
                <AlertCustom
                    visible={true}
                    icon={<MaterialCommunityIcons name="delete-alert" size={30} color="#e53935" />}
                    iconColor="#e53935"
                    title="Tout supprimer"
                    description={`Cela va supprimer ${quizzes.length} quiz sauvegardé${quizzes.length > 1 ? "s" : ""}. Continuer ?`}
                    onClose={() => setConfirmDeleteAll(false)}
                    onConfirm={handleConfirmDeleteAll}
                    confirmText="Supprimer tout"
                    cancelText="Annuler"
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    listSection: {
        flex: 1,
        paddingHorizontal: 12,
        marginBottom: 24,
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#666",
    },
});
