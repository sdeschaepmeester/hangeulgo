import React, { ReactNode } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

type Props = {
    children: ReactNode;
    step: number;
};

export default function StepStructure({ children }: Props) {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.innerContainer}>{children}</View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 32,
    },
    innerContainer: {
        alignItems: "center",
        gap: 20,
    },
});