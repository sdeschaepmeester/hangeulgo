import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import { lessonsMap } from "@/i18n/lessons";
import i18n from "@/i18n";
import LessonElement from "./LessonElement";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ListLessons() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const locale = i18n.locale === "en" ? "en" : "fr";
    const screenWidth = Dimensions.get("window").width;
    const baseSize = screenWidth >= 600 ? screenWidth / 4 : screenWidth / 2.2;
    const iconSize = baseSize * 0.2; // 20% of card

    return (
        <View style={styles.list}>
            {Object.keys(lessonsMap).map((lessonId, _, arr) => {
                const lesson = lessonsMap[lessonId](locale);
                return (
                    <LessonElement
                        key={lessonId}
                        icon={
                            <MaterialCommunityIcons
                                name={lesson.icon as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
                                size={iconSize}
                                color="#333"
                            />
                        }
                        title={lesson.title}
                        description={lesson.description}
                        difficulty={lesson.difficulty as "easy" | "medium" | "hard"}
                        totalItems={arr.length}
                        onPress={() => navigation.navigate("LessonDetail", { lessonId })}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
    },
});