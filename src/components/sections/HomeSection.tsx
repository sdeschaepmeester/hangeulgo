import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SectionCardGame from "@/components/sections/SectionCardGame";
import SquareButton from "@/components/SquareButton";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";
import i18n from "@/i18n";
import colors from "@/constants/colors";

const screenWidth = Dimensions.get("window").width;

export default function HomeSections() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            {/* Play Section */}
            <SectionCardGame title={i18n.t("actions.play")}>
                <SquareButton
                    icon={<MaterialCommunityIcons name="gamepad-variant" style={styles.icon} />}
                    label={i18n.t("home.play")}
                    bgColor={colors.secondary.light}
                    onClick={() => navigation.navigate("QuizList")}
                />
                <SquareButton
                    icon={<MaterialCommunityIcons name="content-save-outline" style={styles.icon} />}
                    label={i18n.t("home.myquiz")}
                    bgColor={colors.secondary.light}
                    onClick={() => navigation.navigate("SavedQuiz")}
                />
            </SectionCardGame>

            {/* Lexicon section */}
            <View style={styles.sectionSpacing}>
                <SectionCardGame title={i18n.t("lexicon.title")}>
                    <SquareButton
                        icon={<MaterialCommunityIcons name="pen" style={styles.icon} />}
                        label={i18n.t("home.lexicon")}
                        bgColor={colors.primary.light}
                        onClick={() => navigation.navigate("Lexicon")}
                    />
                    <SquareButton
                        icon={<MaterialCommunityIcons name="book-open-page-variant" style={styles.icon} />}
                        label={i18n.t("home.lessons")}
                        bgColor={colors.primary.light}
                        onClick={() => navigation.navigate("Lessons")}
                    />
                </SectionCardGame>
                {/* Add a word */}
                <View style={styles.fullWidthButtonContainer}>
                    <SquareButton
                        icon={<MaterialCommunityIcons name="plus-circle" style={styles.icon} />}
                        label={i18n.t("home.addWord")}
                        bgColor={colors.primary.main}
                        onClick={() => navigation.navigate("AddWord")}
                        fullWidth
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-evenly",
        padding: 20,
    },
    sectionSpacing: {
        marginTop: 32,
    },
    icon: {
        fontSize: screenWidth * 0.18,
        color: colors.neutral.dark,
    },
    fullWidthButtonContainer: {
        marginTop: 32,
        width: "100%",
    },
});