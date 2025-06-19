import React from "react";
import { ScrollView, StyleSheet, Dimensions, ViewStyle } from "react-native";

const { height } = Dimensions.get("window");

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
    },
    padded: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
});