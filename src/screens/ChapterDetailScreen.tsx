import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/App";
import LessonLayout from "@/layouts/LessonLayout";
import i18n from "@/i18n";
import { lessonsMap } from "@/i18n/lessons";

export default function ChapterDetailScreen() {
    const { params } = useRoute<RouteProp<RootStackParamList, "ChapterDetail">>();
    const { lessonId, chapterId } = params;

    const locale = i18n.locale === "en" ? "en" : "fr";
    const getLesson = lessonsMap[lessonId];
    const lesson = getLesson(locale);
    const chapter = lesson.chapters.find((c) => c.id === chapterId);

    if (!chapter) {
        return (
            <LessonLayout>
                <View style={styles.container}>
                    <Text>{i18n.t('noChapter')}</Text>
                </View>
            </LessonLayout>
        );
    }

    return (
        // Details of a lesson's chapter
        <LessonLayout>
            <View style={styles.container}>
                <Text style={styles.title}>{chapter.title}</Text>
                {chapter.content && (
                    <Text style={styles.content}>{chapter.content}</Text>
                )}
                {chapter.component && (
                    <chapter.component />
                )}
            </View>
        </LessonLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
    },
});
