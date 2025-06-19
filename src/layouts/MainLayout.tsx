import React from "react";
import { View, StyleSheet, Dimensions, ViewStyle } from "react-native";

const screenWidth = Dimensions.get("window").width;

type Props = {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
};

export default function MainLayout({ children, style, noPadding = false }: Props) {
    return (
        <View style={[styles.container, !noPadding && styles.padded, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    padded: {
        paddingHorizontal: 20,
    },
});