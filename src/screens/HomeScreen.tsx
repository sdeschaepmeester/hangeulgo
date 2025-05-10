import React from "react";
import {
    View,
    Button,
    Text,
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import { dbPromise } from "@/db/database";
import SquareButton from "@/components/SquareButton";

const screenHeight = Dimensions.get("window").height;

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    async function resetLexicon() {
        const db = await dbPromise;
        await db.runAsync("DELETE FROM lexicon");
        Alert.alert("Lexique réinitialisé !");
    }
    async function testInsert() {
        const db = await dbPromise;

        const entries = [
            ["bonjour", "안녕하세요", "annyeonghaseyo", "easy", 1],
            ["merci", "감사합니다", "gamsahamnida", "easy", 1],
            ["oui", "네", "ne", "easy", 1],
            ["non", "아니요", "aniyo", "easy", 1],
            ["au revoir", "안녕히 가세요", "annyeonghi gaseyo", "easy", 1],
            ["je suis", "저는", "jeoneun", "medium", 1],
            ["femme", "여자", "yeoja", "medium", 1],
            ["homme", "남자", "namja", "medium", 1],
            ["eau", "물", "mul", "medium", 1],
            ["pain", "빵", "ppang", "medium", 1],
        ];

        for (const [fr, ko, phonetic, difficulty, active] of entries) {
            await db.runAsync(
                `INSERT INTO lexicon (fr, ko, phonetic, difficulty, active) VALUES (?, ?, ?, ?, ?)`,
                fr,
                ko,
                phonetic,
                difficulty,
                active
            );
        }

        Alert.alert("10 mots insérés !");
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageWrapper}>
                <Image
                    source={require("../../assets/background_home.png")}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.bottomOverlay}>
                    <TouchableOpacity style={styles.scoreButton}>
                        <Text style={styles.scoreText}>Scores</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* <Button title="Test DB insert" onPress={testInsert} /> */}

            <View style={{ padding: 20 }}>
                <Text style={styles.section}>Exercices</Text>
                <View style={styles.buttonRow}>
                    <SquareButton
                        icon={<MaterialCommunityIcons name="brain" style={styles.icon} color="#333" />}
                        label="Compréhension"
                        bgColor="#f6c6c6"
                        onClick={() => navigation.navigate("ChooseSettings", { type: "comprehension" })}
                    />
                    <SquareButton
                        icon={<MaterialCommunityIcons name="translate" style={styles.icon} color="#333" />}
                        label="Traduction"
                        bgColor="#f6c6c6"
                        onClick={() => navigation.navigate("ChooseSettings", { type: "translation" })}
                    />
                </View>
                <Text style={styles.section}>Lexique</Text>
                <View style={styles.buttonRow}>
                    <SquareButton
                        icon={<MaterialCommunityIcons name="book-open-variant" style={styles.icon} color="#333" />}
                        label="Réviser"
                        bgColor="#c6cbf6"
                        onClick={() => navigation.navigate("Lexicon")}
                    />
                    <SquareButton
                        icon={<MaterialCommunityIcons name="layers-plus" style={styles.icon} color="#333" />}
                        label="Ajouter un mot"
                        bgColor="#c6cbf6"
                        onClick={() => navigation.navigate("AddWord")}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
    },
    imageWrapper: {
        width: "100%",
        height: (504 / 770) * Dimensions.get("window").width,
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
        height: screenHeight * 0.05,
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
        width: "95%"
    },
    scoreText: {
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        fontSize: 18
    },
    section: {
        fontSize: 18,
        marginVertical: 10,
        fontWeight: "600",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    icon: {
        fontSize: Dimensions.get("window").width * 0.2,
        color: "#595959",
    },
});
