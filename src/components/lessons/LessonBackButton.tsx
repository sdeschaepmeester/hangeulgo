import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import i18n from "@/i18n";
import colors from "@/constants/colors";

export default function LessonBackButton() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();

    let label = "";
    let targetScreen: keyof RootStackParamList | null = null;

    if (route.name === "LessonDetail") {
        label = `← ${i18n.t('returnToLessons')}`;
        targetScreen = "Lessons";
    } else if (route.name === "ChapterDetail") {
        label = `← ${i18n.t('returnToChapters')}`;
        targetScreen = "LessonDetail";
    } else {
        return null;
    }

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                onPress={() => {
                    if (targetScreen === "Lessons") {
                        navigation.navigate("Lessons");
                    } else if (targetScreen === "LessonDetail") {
                        const params = route.params as { lessonId?: string } | undefined;
                        const lessonId = params?.lessonId;
                        if (lessonId) {
                            navigation.navigate("LessonDetail", { lessonId });
                        } else {
                            navigation.navigate("Lessons");
                        }
                    }
                }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>{label}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 10,
        paddingTop: 8,
    },
    button: {
        paddingVertical: 8,
    },
    buttonText: {
        fontSize: 16,
        color: colors.primary.dark,
        fontWeight: "bold",
    },
});
