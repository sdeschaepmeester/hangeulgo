import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import MainLayout from "@/layouts/MainLayout";
import i18n from "@/i18n";
import { lessonsMap } from "@/i18n/lessons";
import type { Lesson } from "@/types/Lesson";

export default function LessonDetailsScreen() {
    const { params } = useRoute<RouteProp<RootStackParamList, "LessonDetail">>();
    const { lessonId } = params;

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [lesson, setLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        const locale = i18n.locale === "en" ? "en" : "fr";
        const getLesson = lessonsMap[lessonId];

        if (getLesson) {
            const lessonData = getLesson(locale);
            setLesson(lessonData);
        } else {
            console.error(`Lesson not found: ${lessonId}`);
        }
    }, [lessonId, i18n.locale]);

    if (!lesson) {
        return (
            <MainLayout>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            </MainLayout>
        );
    }

    const handleOpenChapter = (chapterId: string) => {
        navigation.navigate("ChapterDetail", {
            lessonId: lesson.id,
            chapterId,
        });
    };

    return (
        <MainLayout>
            <View style={styles.container}>
                <Text style={styles.title}>{lesson.title}</Text>
                {lesson.chapters.map((chapter) => (
                    <TouchableOpacity
                        key={chapter.id}
                        style={styles.chapterButton}
                        onPress={() => handleOpenChapter(chapter.id)}
                    >
                        <Text style={styles.chapterText}>• {chapter.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    chapterButton: {
        paddingVertical: 12,
    },
    chapterText: {
        fontSize: 18,
        color: "#333",
    },
});
