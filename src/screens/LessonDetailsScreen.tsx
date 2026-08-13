import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import i18n from "@/i18n";
import { lessonsMap } from "@/i18n/lessons";
import type { Lesson } from "@/types/Lesson";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LessonLayout from "@/layouts/LessonLayout";
import { ScrollView } from "react-native-gesture-handler";

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
            <LessonLayout>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            </LessonLayout>
        );
    }

    const handleOpenChapter = (chapterId: string) => {
        navigation.navigate("ChapterDetail", {
            lessonId: lesson.id,
            chapterId,
        });
    };

    return (
        // Lesson's chapter list
        <LessonLayout>
            <View style={styles.container}>
                <Text style={styles.title}>{lesson.title}</Text>
                <Text style={styles.description}>{lesson.description}</Text>

                <ScrollView>
                    {lesson.chapters.map((chapter, index) => (
                        <View key={chapter.id + index}>
                            <TouchableOpacity
                                style={styles.chapterRow}
                                onPress={() => handleOpenChapter(chapter.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.chapterTextContainer}>
                                    <Text style={styles.chapterIndex}>{i18n.t('chapter')} {index + 1}{i18n.t('colon')}</Text>
                                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                                </View>

                                <TouchableOpacity onPress={() => handleOpenChapter(chapter.id)}>
                                    <MaterialCommunityIcons name="chevron-right-circle-outline" size={28} color="#555" />
                                </TouchableOpacity>
                            </TouchableOpacity>

                            {index < lesson.chapters.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </LessonLayout>
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
        marginBottom: 24,
    },
    description: {
        fontSize: 16,
        marginBottom: 24
    },
    chapterRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    chapterTextContainer: {
        flex: 1,
        marginRight: 8,
    },
    chapterIndex: {
        fontSize: 16,
        fontWeight: "600",
        color: "#888",
    },
    chapterTitle: {
        fontSize: 18,
        color: "#333",
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 8,
    },
});
