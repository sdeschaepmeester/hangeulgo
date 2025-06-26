import React from "react";
import { View, StyleSheet } from "react-native";
import MainLayout from "@/layouts/MainLayout";
import TesterDaysTestBigCard from "@/components/test/TesterDaysTestBigCard";

export default function ParametersScreen() {

    return (
        <MainLayout style={{ backgroundColor: "#C6CBF5" }}>
            <View style={styles.container}>
                <TesterDaysTestBigCard />
            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 24
    }
});