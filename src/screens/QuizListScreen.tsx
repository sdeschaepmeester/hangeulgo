import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import MainLayout from "@/layouts/MainLayout";
import SquareButton from "@/components/SquareButton";
import SectionCardGame from "@/components/sections/SectionCardGame";

export default function QuizListScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <MainLayout scrollable>
            {/* --- Section 1 : Quiz classiques --- */}
            <SectionCardGame title="Quiz classiques">
                <SquareButton
                    icon={<MaterialCommunityIcons name="eye" style={styles.icon} />}
                    label="Compréhension"
                    bgColor="#f6c6c6"
                    onClick={() => navigation.navigate("ChooseSettings", { type: "comprehension" })}
                />
                <SquareButton
                    icon={<MaterialCommunityIcons name="ear-hearing" style={styles.icon} />}
                    label="Écoute"
                    bgColor="#f6c6c6"
                    onClick={() => navigation.navigate("ChooseSettings", { type: "ecoute" })}
                />
            </SectionCardGame>

            {/* --- Section 2 : Autres jeux --- */}
            <SectionCardGame title="Autres jeux">
                <SquareButton
                    icon={<MaterialCommunityIcons name="puzzle" style={styles.icon} />}
                    label="Quiz puzzle"
                    bgColor="#c6cbf6"
                    onClick={() => navigation.navigate("ChooseSettings", { type: "arrangement" })}
                />
                <SquareButton
                    icon={<MaterialCommunityIcons name="pencil" style={styles.icon} />}
                    label="Écriture"
                    bgColor="#c6cbf6"
                    onClick={() => navigation.navigate("ChooseSettings", { type: "ecriture" })}
                />
            </SectionCardGame>
            <TouchableOpacity
                onPress={() => navigation.navigate("SavedQuiz")}
                style={styles.savedButton}
            >
                <Text style={styles.savedButtonText}>Voir mes quiz sauvegardés</Text>
            </TouchableOpacity>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
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
});