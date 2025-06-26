import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { getDaysSinceInstall } from "@/services/tester";
import { getLocales } from "expo-localization";
import colors from "@/constants/colors";

export default function TesterDaysNumberCard() {
    const [days, setDays] = useState<number | null>(null);
    const [language, setLanguage] = useState<string>("en");

    useEffect(() => {
        const fetch = async () => {
            const d = await getDaysSinceInstall();
            setDays(d);
            const storedLang = await SecureStore.getItemAsync("userLang");
            const fallbackLang = getLocales()[0]?.languageCode === "fr" ? "fr" : "en";
            const lang = storedLang === "fr" || storedLang === "en" ? storedLang : fallbackLang;
            setLanguage(lang);
        };
        fetch();
    }, []);

    if (days === null) return null;

    return (
        <View style={styles.badge}>
            <Text style={styles.text}>{language === "fr" ? "Jour de test : " : "Days testing: "} {days}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        backgroundColor: colors.primary.dark,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        maxWidth: 150,
    },
    text: {
        color: colors.neutral.white,
        fontSize: 11,
        fontWeight: "600",
        flexShrink: 1,
        flexWrap: "wrap"
    },
});
