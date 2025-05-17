import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NavBar() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("Home")}>
                <MaterialCommunityIcons name="home" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
    },
    fab: {
        position: "absolute",
        top: -28,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#9da7ff",
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
});
