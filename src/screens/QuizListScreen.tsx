import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import MainLayout from "@/layouts/MainLayout";
import SquareButton from "@/components/SquareButton";
import SectionCardGame from "@/components/sections/SectionCardGame";
import i18n from "@/i18n";
import colors from "@/constants/colors";

export default function QuizListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <MainLayout scrollable>
            {/* --- Section Quizzes --- */}
            <SectionCardGame title={i18n.t("quizTypes.classic")}>
                <SquareButton
                    icon={<MaterialCommunityIcons name="eye" style={styles.icon} />}
                    label={i18n.t("quizTypes.comprehension")}
                    bgColor="#f6c6c6"
                    onClick={() => navigation.navigate("ChooseSettings", { type: "comprehension" })}
                />
                <SquareButton
                    icon={<MaterialCommunityIcons name="ear-hearing" style={styles.icon} />}
                    label={i18n.t("quizTypes.listening")}
                    bgColor="#f6c6c6"
                    onClick={() => navigation.navigate("ChooseSettings", { type: "ecoute" })}
                />
            </SectionCardGame>

            {/* --- Section Other --- */}
            <SectionCardGame title={i18n.t("quizTypes.other")}>
                <SquareButton
                    icon={<MaterialCommunityIcons name="puzzle" style={styles.icon} />}
                    label={i18n.t("quizTypes.puzzle")}
                    bgColor="#c6cbf6"
                    onClick={() => navigation.navigate("ChooseSettings", { type: "arrangement" })}
                />
                <SquareButton
                    icon={<MaterialCommunityIcons name="pencil" style={styles.icon} />}
                    label={i18n.t("quizTypes.writing")}
                    bgColor="#c6cbf6"
                    onClick={() => navigation.navigate("ChooseSettings", { type: "ecriture" })}
                />
            </SectionCardGame>
            <TouchableOpacity
                onPress={() => navigation.navigate("SavedQuiz")}
                style={styles.savedButton}
            >
                <Text style={styles.savedButtonText}>{i18n.t("actions.seeSavedQuiz")}</Text>
            </TouchableOpacity>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    icon: {
        fontSize: 64,
        color: colors.neutral.dark,
    },
    savedButton: {
        backgroundColor: colors.primary.dark,
        marginTop: 10,
        paddingVertical: 16,
        borderRadius: 8,
        width: "100%",
    },
    savedButtonText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
});