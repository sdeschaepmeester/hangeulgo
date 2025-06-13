import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

type Props = {
    children: ReactNode;
    step: number;
};

export default function StepStructure({ children }: Props) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: 20,
    },
});