import React, { ReactNode } from "react";
import { View, StyleSheet, ScrollView, Text, useWindowDimensions } from "react-native";

type Props = {
    children: ReactNode;
    step: number;
    title: string;
};

export default function StepStructure({ children, title }: Props) {
    const { width } = useWindowDimensions();
    const fontSize = width < 360 ? 20 : 24;

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <Text style={[styles.title, { fontSize }]}>{title}</Text>
            <View style={styles.innerContainer}>{children}</View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: "10%"
    },
    innerContainer: {
        alignItems: "center",
        gap: 20,
    },
    title: {
        fontWeight: "bold",
        color: "grey",
        marginBottom: 20,
        marginTop: "35%"
    },
});