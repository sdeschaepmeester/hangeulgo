import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, UIManager } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NavBar from "@/components/NavBar";
import AlertCustom from "@/components/AlertCustom";
import { getAllSavedQuizzes, deleteSavedQuiz } from "@/services/quiz";
import SavedQuizList from "@/components/quiz/SavedQuizList";
import type { SavedQuizEntry } from "@/types/SavedQuizEntry";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function SavedQuizScreen() {
    const [quizzes, setQuizzes] = useState<SavedQuizEntry[]>([]);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const fetchQuizzes = async () => {
        const all = await getAllSavedQuizzes();
        setQuizzes(all);
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

    const handleSelect = (quiz: SavedQuizEntry) => {
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
            <View style={styles.listSection}>
                <SavedQuizList
                    data={quizzes}
                    onDelete={(id) => setConfirmDeleteId(id)}
                    onSelect={handleSelect}
                />
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
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    listSection: {
        flex: 1,
        padding: 12,
        marginBottom: 24,
    },
});
