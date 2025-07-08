import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MainLayout from "@/layouts/MainLayout";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";

export default function LessonsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const goToLesson = () => {
        navigation.navigate("LessonDetail", { lessonId: "alphabet" });
    };

    return (
        <MainLayout>
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={goToLesson}>
                    <Text style={styles.buttonText}>Open Alphabet Lesson</Text>
                </TouchableOpacity>
            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
});