import React from "react";
import { ScrollView, StyleSheet, Dimensions, ViewStyle } from "react-native";

const { width, height } = Dimensions.get("window");

type Props = {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
};

export default function MainLayout({ children, style, noPadding = false }: Props) {
    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                !noPadding && styles.padded,
                style,
            ]}
            showsVerticalScrollIndicator={false}
        >
            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        minHeight: height,
        backgroundColor: "white",
    },
    padded: {
        paddingHorizontal: 5,
    },
});
