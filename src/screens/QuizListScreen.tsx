import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MainLayout from "@/layouts/MainLayout";
import SquareButton from "@/components/SquareButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import { useNavigation } from "@react-navigation/native";
import type { GameType } from "@/types/GameSettings";
import type { ComponentProps } from "react";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const BUTTON_WIDTH = (screenWidth - 60) / 2;

type QuizItem = {
    label: string;
    icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
    color: string;
    type: GameType;
};

const quizList: QuizItem[] = [
    { label: "Compréhension", icon: "eye", color: "#f6c6c6", type: "comprehension" },
    { label: "Écoute", icon: "ear-hearing", color: "#f6c6c6", type: "ecoute" },
    { label: "Quiz puzzle", icon: "puzzle", color: "#c6cbf6", type: "arrangement" },
    { label: "Écriture", icon: "pencil", color: "#c6cbf6", type: "ecriture" },
];

export default function QuizListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <ScrollView
            style={styles.body}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.title}>Choisis ton jeu</Text>

            <View style={styles.grid}>
                {quizList.map((item, index) => (
                    <View
                        key={item.label}
                        style={[
                            styles.buttonContainer,
                            index % 2 === 0 ? { marginRight: 20 } : {},
                        ]}
                    >
                        <SquareButton
                            icon={<MaterialCommunityIcons name={item.icon} style={styles.icon} />}
                            label={item.label}
                            bgColor={item.color}
                            onClick={() => navigation.navigate("ChooseSettings", { type: item.type })}
                        />
                    </View>
                ))}
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate("SavedQuiz")}
                style={styles.savedButton}
            >
                <Text style={styles.savedButtonText}>Voir mes quiz sauvegardés</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 20,
    },
    buttonContainer: {
        width: BUTTON_WIDTH,
        marginBottom: 20,
    },
    icon: {
        fontSize: 64,
        color: "#595959",
    },
    savedButton: {
        backgroundColor: "#003478",
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
    body: {
        width: "100%",
        height: screenHeight * 0.65,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
});
