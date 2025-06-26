import React, { ReactNode } from "react";
import { View, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, ViewStyle, } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import NavBar from "@/components/NavBar";
import colors from "@/constants/colors";

type Props = {
    children: ReactNode;
    scrollable?: boolean;
    style?: ViewStyle;
};

export default function MainLayout({ children, scrollable = false, style }: Props) {
    const insets = useSafeAreaInsets();
    const navBarHeight = 60 + insets.bottom;

    const content = scrollable ? (
        <ScrollView
            contentContainerStyle={[
                styles.body,
                { paddingBottom: navBarHeight },
                style,
            ]}
            keyboardShouldPersistTaps="handled"
        >
            {children}
        </ScrollView>
    ) : (
        <View style={[styles.body, { paddingBottom: navBarHeight }, style]}>
            {children}
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
                {content}
                <NavBar />
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.secondary.lightest,
    },
    body: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingTop: 18,
    },
});
