import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import SquareButton from "@/components/SquareButton";
import SectionCardGame from "@/components/sections/SectionCardGame";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            {/* ----------------- Header image and scores ----------------- */}
            <View style={styles.imageWrapper}>
                <Image
                    source={require("../../assets/background_home.png")}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.bottomOverlay}>
                    <TouchableOpacity
                        style={styles.scoreButton}
                        onPress={() => navigation.navigate("Score")}
                    >
                        <Text style={styles.scoreText}>Scores</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ----------------- Main content ----------------- */}
            <View style={styles.content}>
                {/* Exercices section */}
                <View>
                    <SectionCardGame title="Exercices">
                        <SquareButton
                            icon={<MaterialCommunityIcons name="brain" style={styles.icon} />}
                            label="Compréhension"
                            bgColor="#f6c6c6"
                            onClick={() => navigation.navigate("ChooseSettings", { type: "comprehension" })}
                        />
                        <SquareButton
                            icon={<MaterialCommunityIcons name="translate" style={styles.icon} />}
                            label="Traduction"
                            bgColor="#f6c6c6"
                            onClick={() => navigation.navigate("ChooseSettings", { type: "translation" })}
                        />
                    </SectionCardGame>
                </View>

                {/* Lexique section */}
                <View style={styles.lexiconSection}>
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
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageWrapper: {
        height: screenHeight * 0.35,
        width: "100%",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    bottomOverlay: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 50,
        backgroundColor: "#e5e8ff",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    scoreButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: "#d0d3ff",
        borderRadius: 12,
        width: "90%",
    },
    scoreText: {
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        fontSize: 18,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    icon: {
        fontSize: screenWidth * 0.18,
        color: "#595959",
    },
    lexiconSection: {
        marginTop: 32,
    },
});
