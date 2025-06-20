import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SectionCardGame from "@/components/sections/SectionCardGame";
import SquareButton from "@/components/SquareButton";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/App";

const screenWidth = Dimensions.get("window").width;

export default function HomeSections() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            {/* Play Section */}
            <SectionCardGame title="Jouer">
                <SquareButton
                    icon={<MaterialCommunityIcons name="gamepad-variant" style={styles.icon} />}
                    label="Jouer"
                    bgColor="#f6c6c6"
                    onClick={() => navigation.navigate("QuizList")}
                />
                <SquareButton
                    icon={<MaterialCommunityIcons name="content-save-outline" style={styles.icon} />}
                    label="Mes quiz"
                    bgColor="#f6c6c6"
                    onClick={() => navigation.navigate("SavedQuiz")}
                />
            </SectionCardGame>

            {/* Lexique section */}
            <View style={styles.sectionSpacing}>
                <SectionCardGame title="Lexique">
                    <SquareButton
                        icon={<MaterialCommunityIcons name="book-open-variant" style={styles.icon} />}
                        label="Réviser"
                        bgColor="#c6cbf6"
                        onClick={() => navigation.navigate("Lexicon")}
                    />
                    <SquareButton
                        icon={<MaterialCommunityIcons name="layers-plus" style={styles.icon} />}
                        label="Ajouter un mot"
                        bgColor="#c6cbf6"
                        onClick={() => navigation.navigate("AddWord")}
                    />
                </SectionCardGame>
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
        color: "#595959",
    },
});