import React, { ReactNode } from "react";
import { View, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, TouchableOpacity, Text, ViewStyle, } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import NavBar from "@/components/NavBar";
import colors from "@/constants/colors";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import i18n from "@/i18n";
import LessonBackButton from "@/components/lessons/LessonBackButton";

type Props = {
    children: ReactNode;
    scrollable?: boolean;
    style?: ViewStyle;
};

export default function LessonLayout({ children, scrollable = false, style }: Props) {
    const insets = useSafeAreaInsets();
    const navBarHeight = 60 + insets.bottom;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
                {/* Wrapper pour aligner le bouton */}
                <View style={styles.header}>
                    <LessonBackButton />
                </View>
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
    header: {
        paddingHorizontal: 10,
        paddingTop: 8,
    },
    body: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingTop: 18,
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: colors.primary.dark,
        fontWeight: "bold"
    },
});