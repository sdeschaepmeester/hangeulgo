import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, GestureResponderEvent, Dimensions } from "react-native";
import type { ReactNode } from "react";
import colors from "@/constants/colors";
import { getDifficultyLabel } from "@/services/difficulty";
import i18n from "@/i18n";

interface Props {
    icon: ReactNode;
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    totalItems: number;
    onPress: (event: GestureResponderEvent) => void;
}

const screenWidth = Dimensions.get("window").width;
const isTablet = screenWidth >= 600;

function getDifficultyColor(difficulty: Props["difficulty"]) {
    switch (difficulty) {
        case "easy":
            return "#4CAF50"; // green
        case "medium":
            return "#FF9800"; // orange
        case "hard":
            return "#F44336"; // red
        default:
            return colors.primary.main;
    }
}

export default function LessonElement({ icon, title, description, difficulty, totalItems, onPress }: Props) {
    return (
        <TouchableOpacity
            style={[
                styles.card,
                isTablet ? styles.tabletCard : styles.mobileCard,
                totalItems === 1 && styles.noAspect,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>{icon}</View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
                <Text
                    style={[
                        styles.difficulty,
                        { color: getDifficultyColor(difficulty) },
                    ]}
                >
                    {i18n.t("difficulties.difficulty")}
                    {i18n.t("colon")} {getDifficultyLabel(difficulty)}
                </Text>
            </View>

            <TouchableOpacity style={styles.learnButton} onPress={onPress}>
                <Text style={styles.learnButtonText}>{i18n.t("learn")}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        backgroundColor: colors.neutral.lightest,
        flexGrow: 1,
        flexShrink: 0,
        flexDirection: "column",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    content: {
        alignItems: "center",
    },
    noAspect: {
        aspectRatio: undefined,
        width: "100%",
        flexBasis: "100%",
    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 2,
    },
    description: {
        fontSize: 13,
        textAlign: "center",
        color: colors.neutral.dark,
        marginBottom: 6,
    },
    difficulty: {
        fontSize: 13,
        textAlign: "center",
        fontWeight: "600",
        marginBottom: 0,
    },
    learnButton: {
        backgroundColor: colors.primary.main,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        width: "100%",
        marginTop: 8,
    },
    learnButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },
    mobileCard: {
        flexBasis: "48%",
        maxWidth: "100%",
        margin: "1%",
    },
    tabletCard: {
        flexBasis: "30%",
        maxWidth: "100%",
        margin: "1.5%",
    },

});