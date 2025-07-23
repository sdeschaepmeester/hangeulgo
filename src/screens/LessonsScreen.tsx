import React from "react";
import { StyleSheet } from "react-native";
import ListLessons from "@/components/lessons/ListLessons";
import LessonLayout from "@/layouts/LessonLayout";
import { ScrollView } from "react-native-gesture-handler";

export default function LessonsScreen() {
    return (
        <LessonLayout>
            <ScrollView style={styles.container}>
                <ListLessons />
            </ScrollView>
        </LessonLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});
