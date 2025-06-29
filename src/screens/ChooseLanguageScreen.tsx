import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/App";
import i18n from "@/i18n";
import * as Localization from "expo-localization";
import { injectPreviewLexicon } from "@/data/injectPreviewLexicon";
import colors from "@/constants/colors";

const screenWidth = Dimensions.get("window").width;

export default function ChooseLanguageScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [selectedLanguage, setSelectedLanguage] = useState<"fr" | "en" | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const preloadLanguage = async () => {
            const stored = await SecureStore.getItemAsync("userLang");
            if (stored === "fr" || stored === "en") {
                setSelectedLanguage(stored);
                return;
            }
            const deviceLang = Localization.getLocales()[0]?.languageCode;
            if (deviceLang === "fr" || deviceLang === "en") {
                setSelectedLanguage(deviceLang);
                return;
            }
            setSelectedLanguage("en");
        };
        preloadLanguage();
    }, []);

    const handleConfirm = async () => {
        if (!selectedLanguage) return;
        setIsLoading(true);
        await SecureStore.setItemAsync("userLang", selectedLanguage);
        i18n.locale = selectedLanguage;
        await injectPreviewLexicon();
        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
        });
    };

    const LangOption = ({ lang, label, flag }: { lang: "fr" | "en"; label: string; flag: string }) => {
        const isSelected = selectedLanguage === lang;
        return (
            <TouchableOpacity
                onPress={() => setSelectedLanguage(lang)}
                style={[styles.langBox, isSelected && styles.selectedBox]}
            >
                <Text style={styles.flag}>{flag}</Text>
                <Text style={styles.langLabel}>{label}</Text>
            </TouchableOpacity>
        );
    };

    const title =
        selectedLanguage === "fr"
            ? "Choisissez votre langue"
            : selectedLanguage === "en"
                ? "Choose your language"
                : "Language selection";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.langRow}>
                <LangOption lang="en" label="English" flag="🇺🇸" />
                <LangOption lang="fr" label="Français" flag="🇫🇷" />
            </View>

            <Text style={styles.warning}>
                {selectedLanguage === "fr"
                    ? "⚠️ Cette langue ne pourra pas être modifiée plus tard"
                    : "⚠️ This language cannot be changed later"}
            </Text>

            <TouchableOpacity
                style={[styles.confirmButton, (!selectedLanguage || isLoading) && { opacity: 0.4 }]}
                onPress={handleConfirm}
                disabled={!selectedLanguage || isLoading}
            >
                <Text style={styles.confirmText}>
                    {selectedLanguage === "fr" ? "Confirmer" : selectedLanguage === "en" ? "Confirm" : "OK"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary.light,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.neutral.darker,
        marginBottom: 24
    },
    langRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
        marginBottom: 20,
    },
    langBox: {
        backgroundColor: colors.neutral.white,
        paddingVertical: 30,
        borderRadius: 16,
        alignItems: "center",
        width: screenWidth * 0.4,
        elevation: 2,
    },
    selectedBox: {
        backgroundColor: colors.primary.main,
    },
    flag: {
        fontSize: 40,
        marginBottom: 10,
    },
    langLabel: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.neutral.darker,
    },
    warning: {
        fontSize: 14,
        fontStyle: "italic",
        color: colors.neutral.darker,
        textAlign: "center",
        marginBottom: 20,
    },
    confirmButton: {
        backgroundColor: colors.primary.main,
        paddingVertical: 14,
        borderRadius: 10,
        width: "100%",
    },
    confirmText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});