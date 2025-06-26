import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import HomeSections from "@/components/sections/HomeSection";
import MainLayout from "@/layouts/MainLayout";
import i18n from "@/i18n";
import colors from "@/constants/colors";

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <MainLayout scrollable>
            {/* ----------- Image ----------- */}
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
                        <Text style={styles.scoreText}>{i18n.t("home.scores")}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ----------- Content ----------- */}
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
        bottom: -1,
        width: "100%",
        height: 50,
        backgroundColor: colors.primary.lighter,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    scoreButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: colors.primary.light,
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
