import React from "react";
import { View, StyleSheet } from "react-native";
import ListLessons from "@/components/lessons/ListLessons";
import LessonLayout from "@/layouts/LessonLayout";

export default function LessonsScreen() {
    return (
        <LessonLayout>
            <View style={styles.container}>
                <ListLessons />
            </View>
        </LessonLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});
