import React from "react";
import { View, StyleSheet } from "react-native";
import MainLayout from "@/layouts/MainLayout";
import ListLessons from "@/components/lessons/ListLessons";

export default function LessonsScreen() {
    return (
        <MainLayout>
            <View style={styles.container}>
                <ListLessons />
            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});
