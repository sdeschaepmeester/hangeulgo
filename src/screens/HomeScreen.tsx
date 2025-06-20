import React from "react";
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import HomeSections from "@/components/sections/HomeSection";
import MainLayout from "@/layouts/MainLayout";

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <MainLayout scrollable>
            {/* ----------- Image top full width ----------- */}
            <View style={styles.topSection}>
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

            {/* ----------- Contenu scrollable (avec padding via MainLayout) ----------- */}
            <HomeSections />
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    topSection: {
        width: "110%",
        height: 260,
        overflow: "hidden",
        marginHorizontal: -18,
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
});
