import React from "react";
import { View, StyleSheet } from "react-native";
import MainLayout from "@/layouts/MainLayout";
import TesterDaysTestBigCard from "@/components/test/TesterDaysTestBigCard";
import colors from "@/constants/colors";

export default function ParametersScreen() {

    return (
        <MainLayout style={{ backgroundColor: colors.primary.light }}>
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
        color: colors.neutral.darker,
        marginBottom: 24
    }
});