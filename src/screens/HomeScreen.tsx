import React from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Text, ScrollView, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import HomeSections from "@/components/sections/HomeSection";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            {/* ---------- Header image + scores ---------- */}
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

            {/* ---------- Main content ---------- */}
            <ScrollView
                style={styles.body}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <HomeSections />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: screenHeight,
        width: screenWidth,
    },
    topSection: {
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
